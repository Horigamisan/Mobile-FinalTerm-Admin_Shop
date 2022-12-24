const { catchAsync, queryFeatures, CustomError } = require('../utils');
const { productModel } = require('../models');
const { PRODUCT_DISPLAY_FIELDS, LIMIT_PER_PAGE } = require('../constants');

const productController = {
	addShopProduct: catchAsync(async (req, res) => {
		const payload = req.body;
		const shop = req.shopId;
		const product = await productModel.create({ shop, ...payload });

		Object.keys(product._doc).forEach((key) => {
			if (!PRODUCT_DISPLAY_FIELDS.includes(key)) {
				delete product._doc[key];
			}
		});

		res.json(product);
	}),

	addToMenu: catchAsync(async (req, res, next) => {
		const productId = req.params.id;

		await productModel.findOneAndUpdate(
			{ _id: productId },
			{ isAvailable: true }
		);
		res.json({ status: 'success' });
	}),

	editProduct: catchAsync(async (req, res) => {
		const id = req.params.id;
		const payload = req.body;

		const product = await productModel
			.findByIdAndUpdate({ _id: id }, payload, {
				new: true,
			})
			.lean();

		Object.keys(product).forEach((key) => {
			if (!PRODUCT_DISPLAY_FIELDS.includes(key)) {
				delete product[key];
			}
		});

		res.json(product);
	}),

	deleteProduct: catchAsync(async (req, res) => {
		const id = req.params.id;
		await productModel.findByIdAndDelete(id);

		res.json({ status: 'success' });
	}),

	getProductDetail: catchAsync(async (req, res) => {
		const productId = req.params.id;

		const product = await productModel.findById(
			productId,
			PRODUCT_DISPLAY_FIELDS.join(' ')
		);

		res.json(product);
	}),
	// someone get all products of their shop
	getProducts: catchAsync(async (req, res) => {
		const shop = req.shopId;

		const query = new queryFeatures(
			productModel.find({ shop }, PRODUCT_DISPLAY_FIELDS.join(' ')),
			req.query
		);
		const products = await query.pagination().query;

		res.json({
			quantity: products.length,
			products,
		});
	}),

	getTodayMenus: catchAsync(async (req, res, next) => {
		// if shop, get menus if this shop (shop and isAvailable = true)
		// if not shop, get all menus of the shops in system (shop.status = open and isAvailable = true)

		const shop = req.shopId;
		let products;

		if (shop) {
			const query = new queryFeatures(
				productModel.find(
					{ shop, isAvailable: true },
					PRODUCT_DISPLAY_FIELDS.join(' ')
				),
				req.query
			);

			products = await query.pagination().query;
			if (products.length === 0) {
				return next(
					new CustomError(
						'Today menu is not available! Please create a new one at localhost:3001/products/today',
						200
					)
				);
			}
		} else {
			const page = req.query.page || 1;
			const skip = (page - 1) * LIMIT_PER_PAGE; // quantityPerPage
			const project = PRODUCT_DISPLAY_FIELDS.reduce(
				(acc, item) => ({
					...acc,
					[item]: 1,
					// 'shop.avatar': -1,
				}),
				{}
			);

			products = await productModel.aggregate([
				{ $match: { isAvailable: true } },
				{
					$lookup: {
						from: 'shops',
						localField: 'shop',
						foreignField: '_id',
						as: 'shop',
					},
				},
				{ $match: { 'shop.status': 'opened' } },
				{ $project: project },
				{ $limit: LIMIT_PER_PAGE },
				{ $skip: skip },
			]);
		}

		res.json({
			quantity: products.length,
			products,
		});
	}),

	createTodayMenu: catchAsync(async (req, res) => {
		const { productIds } = req.body;

		await productModel.updateMany(
			{ _id: { $in: productIds } },
			{ isAvailable: true },
			{ new: true }
		);

		res.json({ status: 'success' });
	}),

	markAsSoldOut: catchAsync(async (req, res) => {
		const productId = req.params.id;

		await productModel.findByIdAndUpdate(productId, {
			isAvailable: false,
		});

		res.json({ status: 'success' });
	}),

	unmarkSoldOut: catchAsync(async (req, res) => {
		const productId = req.params.id;

		await productModel.findByIdAndUpdate(productId, {
			isAvailable: true,
		});

		res.json({ status: 'success' });
	}),
};

module.exports = productController;
