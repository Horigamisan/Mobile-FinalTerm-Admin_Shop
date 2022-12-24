const { Schema, model } = require('mongoose');

const Shop = new Schema({
	name: {
		type: String,
		required: true,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	avatar: String,
	address: {
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
	noOfReviews: {
		type: Number,
		default: 0,
	},
	shopOpenTime: {
		type: Number,
		required: true,
	},
	shopCloseTime: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		enum: ['unverified', 'opened', 'closed', 'rejected'],
		default: 'unverified',
	},
});

module.exports = model('Shop', Shop);
