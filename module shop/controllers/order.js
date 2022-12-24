const { catchAsync, queryFeatures, CustomError } = require('../utils');
const {
	productModel,
	orderModel,
	cartItemModel,
	orderItemModel,
	shopModel,
} = require('../models');
const { PRODUCT_DISPLAY_FIELDS, LIMIT_PER_PAGE } = require('../constants');

const normalizeCartItems = (cart) => {
	return cart.reduce((acc, item) => {
		const shop = acc[item.product.shop] || {
			products: [],
			shippingFees: 0,
		};
		shop.products.push(item);
		shop.shippingFees += 2;

		acc[item.product.shop] = shop;

		return acc;
	}, {});
};

const getCartItems = async (userId) => {
	const cartItems = await cartItemModel
		.find({ owner: userId })
		.populate({ path: 'product', select: PRODUCT_DISPLAY_FIELDS.join(' ') });

	return normalizeCartItems(cartItems);
};

const orderController = {
	getSellingHistory: catchAsync(async (req, res, next) => {
		const shopId = req.shopId;
		const orders = await orderModel
			.find({ shop: shopId })
			.populate({ path: 'customer', select: 'name' });

		res.json(orders);
	}),

	getUnverifiedOrders: catchAsync(async (req, res, next) => {
		const shopId = req.shopId;
		console.log(shopId);
		const orders = await orderModel
			.find({
				shop: shopId,
				status: 'unverified',
			})
			.populate({ path: 'customer', select: 'name' });

		res.json(orders);
	}),

	confirmOrder: catchAsync(async (req, res, next) => {
		const orderId = req.params.id;
		const order = await orderModel.updateOne(
			{ _id: orderId },
			{ status: 'in progress' }
		);

		res.json({ status: 'success' });
	}),

	rejectOrder: catchAsync(async (req, res, next) => {
		const orderId = req.params.id;
		const order = await orderModel.updateOne(
			{ _id: orderId },
			{ status: 'failed' }
		);

		res.json({ status: 'success' });
	}),

	markAsSent: catchAsync(async (req, res, next) => {
		const orderId = req.params.id;
		await orderModel.updateOne({ _id: orderId }, { status: 'sent' });

		res.json({ status: 'success' });
	}),

	markAsDone: catchAsync(async (req, res, next) => {
		const orderId = req.params.id;
		await orderModel.updateOne({ _id: orderId }, { status: 'done' });

		res.json({ status: 'success' });
	}),

	getHistoryOrder: catchAsync(async (req, res, next) => {
		const userId = req.user._id;
		const orders = await new queryFeatures(
			orderModel.find({ customer: userId }),
			req.query
		).pagination().query;

		res.json(orders);
	}),

	getOrderDetail: catchAsync(async (req, res, next) => {
		const orderId = req.params.id;
		const order = await orderModel
			.findOne({ _id: orderId })
			.populate({ path: 'customer', select: 'name' })
			.populate({ path: 'shop', select: 'name' });

		const orderItems = await orderItemModel
			.find({ orderId })
			.populate('product', PRODUCT_DISPLAY_FIELDS.join(' '));

		res.json({
			order,
			quantity: orderItems.length,
			items: orderItems,
		});
	}),

	getInProgressOrders: catchAsync(async (req, res, next) => {
		const shop = req.shopId;
		let query;

		if (shop) {
			query = orderModel.find({
				shop,
				status: { $nin: ['done', 'unverified'] },
			});
		} else {
			const userId = req.user._id;
			query = orderModel.find({
				customer: userId,
				status: { $ne: 'done' },
			});
		}

		const orders = await new queryFeatures(
			query.populate({ path: 'customer', select: 'name' }),
			req.query
		).pagination().query;

		res.json(orders);
	}),

	updateOrder: catchAsync(async (req, res, next) => {
		const orderId = req.params.id;
		const payload = req.body;

		const order = await orderModel.findById(orderId);

		if (order.status !== 'unverified') {
			return next(
				new CustomError(
					'You are not allowed to modify this order due to has already been verified',
					400
				)
			);
		}

		const result = await order.updateOne(payload);
		res.json(result);
	}),

	checkOut: catchAsync(async (req, res, next) => {
		const cartItems = await getCartItems(req.user._id);

		res.json(cartItems);
	}),

	createOrder: catchAsync(async (req, res, next) => {
		const userId = req.user._id;
		const cartItems = await getCartItems(userId);
		const { receiveDestination } = req.body;

		const result = [];

		for (const [shop, cartData] of Object.entries(cartItems)) {
			const order = await orderModel.create({
				customer: userId,
				shop,
				receiveDestination,
				shippingFee: cartData.shippingFees,
			});

			const orderDetail = {
				order,
				products: cartData.products,
			};

			cartData.products.forEach((cartItem) => {
				orderItemModel.create({
					orderId: order._id,
					product: cartItem.product,
					quantity: cartItem.quantity,
				});
			});

			result.push(orderDetail);
		}

		// await cartItemModel.deleteMany({ onwer: userId });
		res.json(result);
	}),

	voting: catchAsync(async (req, res) => {
		const orderId = req.params.id;
		const rating = req.body.rating;

		const order = await orderModel.findById(orderId);
		const orderItems = await orderItemModel.find({ orderId });

		await shopModel.findOneAndUpdate(
			{ _id: order.shop },
			{ $inc: { sumOfRating: rating, noOfRatings: 1 } }
		);

		orderItems.forEach(async (item) => {
			await productModel.findOneAndUpdate(
				{ _id: item.product },
				{ $inc: { sumOfRating: rating, noOfRatings: 1 } },
				{ new: true }
			);
		});

		res.json({ message: 'success' });
	}),
};

module.exports = orderController;
