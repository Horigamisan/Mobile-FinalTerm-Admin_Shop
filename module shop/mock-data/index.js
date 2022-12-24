const mongoose = require('mongoose');
const {
	userModel,
	shopModel,
	productModel,
	cartItemModel,
	orderItemModel,
	orderModel,
} = require('../models');
const users = require('./users-data');
const products = require('./products-data');
const shops = require('./shops-data');
const cartItems = require('./cart-items-data');
const orders = require('./orders-data');
const orderItems = require('./order-items-data');

const importData = async () => {
	await userModel.create(users);
	await productModel.create(products);
	await shopModel.create(shops);
	await cartItemModel.create(cartItems);
	await orderItemModel.create(orderItems);
	await orderModel.create(orders);
};

const deleteData = async () => {
	await userModel.deleteMany();
	await productModel.deleteMany();
	await shopModel.deleteMany();
	await cartItemModel.deleteMany();
	await orderItemModel.deleteMany();
	await orderModel.deleteMany();
};

const resetData = async () => {
	await deleteData();
	await importData();
};

(async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://esdc-final:123@cluster0.cxt1omk.mongodb.net/demo-db?retryWrites=true&w=majority',
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);

		if (process.argv[2] === 'import') {
			await importData();
			console.log('Created successfully');
		} else if (process.argv[2] === 'delete') {
			await deleteData();
			console.log('Deleted successfully');
		} else {
			await resetData();
			console.log('Reset successfully');
		}
	} catch (err) {
		console.error(err);
	} finally {
		mongoose.disconnect();
	}
})();
