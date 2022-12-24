const { SHOP_DISPLAY_FIELDS, USER_DISPLAY_FIELDS } = require('../constants');
const { shopModel, userModel } = require('../models');
const { catchAsync, queryFeatures } = require('../utils');

const adminController = {
	loginForm: catchAsync(async (req, res, next) => {}),

	getAllUsers: catchAsync(async (req, res, next) => {
		const query = new queryFeatures(
			userModel.find({ role: { $ne: 'admin' } }, USER_DISPLAY_FIELDS.join(' ')),
			req.query
		);
		const users = await query.pagination().query;

		res.json(users);
	}),

	getAllShops: catchAsync(async (req, res, next) => {
		const unverified = req.query.unverified;
		let filter = { status: { $ne: 'rejected' } };

		if (unverified) {
			filter = { status: 'unverified' };
		}

		const query = new queryFeatures(
			shopModel
				.find(filter, SHOP_DISPLAY_FIELDS.join(' '))
				.populate('owner', 'name'),
			req.query
		);
		const shops = await query.pagination().query;

		res.json(shops);
	}),

	allowShop: catchAsync(async (req, res, next) => {
		const shopId = req.params.id;
		const shop = await shopModel.findOneAndUpdate(
			{ _id: shopId },
			{ status: 'opened' },
			{ new: true }
		);

		await userModel.updateOne(
			{ _id: shop.owner },
			{ $push: { role: 'seller' } },
			{ new: true }
		);

		res.json({ status: 'success' });
	}),

	rejectShop: catchAsync(async (req, res, next) => {
		const shopId = req.params.id;
		await shopModel.findOneAndUpdate(
			{ _id: shopId },
			{ status: 'rejected' },
			{ new: true }
		);

		res.json({ status: 'success' });
	}),
};

module.exports = adminController;
