const { Schema, model } = require('mongoose');

const Product = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		shop: {
			type: Schema.Types.ObjectId,
			ref: 'Shop',
		},
		price: {
			type: Number,
			required: true,
		},
		images: {
			type: String,
			required: true,
		},
		sumOfRating: {
			type: Number,
			default: 4,
		},
		noOfRatings: {
			type: Number,
			default: 1,
		},
		isAvailable: {
			type: Boolean,
			default: true,
		},
		soldQuantity: {
			type: Number,
			default: 0,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: [String],
			enum: ['food', 'drink'],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model('Product', Product);
