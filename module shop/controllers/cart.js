const { catchAsync } = require('../utils');
const { cartItemModel } = require('../models');
const { PRODUCT_DISPLAY_FIELDS } = require('../constants');

const cartController = {
	getCart: catchAsync(async (req, res) => {
		const userId = req.user._id;
		const cart = await cartItemModel
			.find({ onwer: userId })
			.populate('product', PRODUCT_DISPLAY_FIELDS.join(' '));

		res.json({ quantity: cart.length, cart });
	}),

	addToCart: catchAsync(async (req, res) => {
		const userId = req.user._id;
		const productId = req.body.productId;

		await cartItemModel.updateOne(
			{
				onwer: userId,
				product: productId,
			},

			{ $inc: { quantity: 1 }, onwer: userId, product: productId },
			{
				upsert: true,
				new: true,
			}
		);

		res.json({ message: 'success' });
	}),

	removeFromCart: catchAsync(async (req, res) => {
		const productId = req.body.productId;
		const userId = req.user._id;

		const cartItem = await cartItemModel.findOne(
			{
				onwer: userId,
				product: productId,
			},
			'_id quantity'
		);

		let item;

		if (cartItem.quantity === 1) {
			item = await cartItemModel.deleteOne(cartItem._id);
		} else {
			cartItem.quantity -= 1;
			item = await cartItem.save();
		}

		res.json({ message: 'success' });
	}),

	getRecentlyBought: catchAsync((req, res) => {}),
};

module.exports = cartController;
