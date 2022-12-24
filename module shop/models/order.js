const { Schema, model } = require('mongoose');

const Order = new Schema(
	{
		customer: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		shop: {
			type: Schema.Types.ObjectId,
			ref: 'Shop',
		},
		receiveDestination: {
			type: String,
			required: true,
		},
		shippingFee: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ['unverified', 'in progress', 'shipping', 'sent', 'done', 'failed'],
			default: 'unverified',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model('Order', Order);
