const { Schema, model } = require('mongoose');

const Review = new Schema(
	{
		onwer: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		content: {
			type: String,
			required: true,
		},
		targetType: {
			type: String,
			enum: ['Product', 'Shop'],
		},
		target: {
			type: Schema.Types.ObjectId,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model('Review', Review);
