const { Schema, model } = require('mongoose');

const OrderItem = new Schema(
	{
		orderId: {
			type: Schema.Types.ObjectId,
			ref: 'Order',
		},
		product: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
		},
		note: {
			type: String,
			default: undefined,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = model('order_item', OrderItem);
