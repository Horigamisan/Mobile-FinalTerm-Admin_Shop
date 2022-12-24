const { catchAsync } = require('../utils');
const { userModel } = require('../models');
const { USER_DISPLAY_FIELDS } = require('../constants');

const userController = {
	profile: catchAsync(async (req, res) => {
		const id = req.user._id;
		const user = await userModel
			.findById(id, USER_DISPLAY_FIELDS.join(' '))
			.lean();

		res.json(user);
	}),

	editProfile: catchAsync(async (req, res) => {
		const id = req.user._id;
		const payload = req.body;
		const user = await userModel
			.findOneAndUpdate({ _id: id }, payload, {
				new: true,
			})
			.lean();

		Object.keys(user).forEach((key) => {
			if (!USER_DISPLAY_FIELDS.includes(key)) {
				delete user[key];
			}
		});

		res.json(user);
	}),
};

module.exports = userController;
