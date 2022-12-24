const { Schema, model } = require('mongoose');

const CartItem = new Schema({
	onwer: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
	},
	quantity: {
		type: Number,
		required: true,
		default: 1,
	},
});

module.exports = model('cart_item', CartItem);
