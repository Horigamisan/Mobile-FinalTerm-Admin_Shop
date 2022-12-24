const { Schema, model } = require('mongoose');

const Notification = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model('Notification', Notification);
