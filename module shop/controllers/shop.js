const { catchAsync } = require('../utils');
const { shopModel, productModel } = require('../models');
const {
	SHOP_DISPLAY_FIELDS,
	PRODUCT_DISPLAY_FIELDS,
	LIMIT_PER_PAGE,
} = require('../constants');

const shopController = {
	profile: catchAsync(async (req, res) => {
		const shopId = req.shopId;
		const shop = await shopModel
			.findById(shopId, SHOP_DISPLAY_FIELDS.join(' '))
			.lean();

		res.json(shop);
	}),

	editProfile: catchAsync(async (req, res) => {
		const shopId = req.shopId;
		const payload = req.body;

		const shop = await shopModel
			.findOneAndUpdate({ _id: shopId }, payload, {
				new: true,
			})
			.lean();

		Object.keys(shop).forEach((key) => {
			if (!SHOP_DISPLAY_FIELDS.includes(key)) {
				delete shop[key];
			}
		});

		res.json(shop);
	}),

	deleteShop: catchAsync(async (req, res) => {
		const id = req.params.id;
		await shopModel.findOneAndDelete({ _id: id });

		res.json({ status: 'success' });
	}),

	closeShop: catchAsync(async (req, res) => {
		const shopId = req.shopId;

		await shopModel.findOneAndUpdate(
			{ _id: shopId },
			{ status: 'closed' },
			{ new: true }
		);

		res.json({ status: 'success' });
	}),

	reopenShop: catchAsync(async (req, res) => {
		const shopId = req.shopId;

		await shopModel.findOneAndUpdate(
			{ _id: shopId },
			{ status: 'opened' },
			{ new: true }
		);

		res.json({ status: 'success' });
	}),

	getShopStatistics: catchAsync(async (req, res) => {
		const shopId = req.shopId;
		const shop = await shopModel.findById(shopId);
		// order, product, income
		res.json({ shop });
	}),
	// for customer
	getShopDetail: catchAsync(async (req, res) => {
		const shopId = req.params.id;
		const shop = await shopModel
			.findById(
				shopId,
				'name address sumOfRating noOfRatings shopOpenTime shopCloseTime owner status'
			)
			.populate('owner', 'name');
		const products = await productModel
			.find(
				{ shop: shopId, isAvailable: true },
				PRODUCT_DISPLAY_FIELDS.join(' ')
			)
			.limit(4);

		res.json({ shop, products });
	}),

	createShop: catchAsync(async (req, res) => {
		const userId = req.user._id;
		const payload = req.body;

		const shop = await shopModel.create({
			owner: userId,
			...payload,
		});

		Object.keys(shop._doc).forEach((key) => {
			if (!SHOP_DISPLAY_FIELDS.includes(key)) {
				delete shop._doc[key];
			}
		});

		res.json(shop);
	}),

	getShops: catchAsync(async (req, res) => {
		SHOP_DISPLAY_FIELDS.push('rating');

		const page = req.query.page || 1;
		const skip = (page - 1) * LIMIT_PER_PAGE; // quantityPerPage
		const project = SHOP_DISPLAY_FIELDS.reduce(
			(acc, item) => ({
				...acc,
				[item]: 1,
			}),
			{}
		);
		let aggregate;

		if ('unverified' in req.query) {
			aggregate = shopModel.aggregate([{ $match: { status: 'unverified' } }]);
		} else {
			aggregate = shopModel.aggregate([
				{
					$addFields: {
						rating: { $divide: ['$sumOfRating', '$noOfRatings'] },
					},
				},
				{
					$sort: { rating: -1 },
				},
			]);
		}

		const shops = await aggregate
			.project(project)
			.limit(LIMIT_PER_PAGE)
			.skip(skip);

		res.json(shops);
	}),
};

module.exports = shopController;
