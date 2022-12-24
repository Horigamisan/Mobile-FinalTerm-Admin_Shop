const cart = [
	{ shop: 1, product: 2 },
	{ shop: 2, product: 3 },
	{ shop: 1, product: 4 },
	{ shop: 2, product: 5 },
	{ shop: 3, product: 6 },
];

const receiveDestination = 'Here';
const customer = 23;

const result = [];

const cartItems = cart.reduce((acc, item) => {
	const shop = acc[item.shop] || {
		products: [],
		shippingFees: 0,
		address: '',
	};
	shop.products.push(item);
	shop.shippingFees += 2;

	acc[item.shop] = shop;

	return acc;
}, {});

for (const [shop, cartData] of Object.entries(cartItems)) {
	const order = {
		id: 1,
		customer,
		shop,
		receiveDestination,
		shippingFee: cartData.shippingFees,
	};

	const orderDetail = {
		...order,
		products: cartData.products,
		receiveDestination,
	};
	result.push(orderDetail);
}

console.log(result);
