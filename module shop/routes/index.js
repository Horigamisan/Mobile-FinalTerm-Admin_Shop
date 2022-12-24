const express = require('express');

const { authController, errorController } = require('../controllers');
const { CustomError } = require('../utils');

const authRouter = require('./auth');
const userRouter = require('./user');
const shopRouter = require('./shop');
const productRouter = require('./product');
const cartRouter = require('./cart');
const orderRouter = require('./order');
const adminRouter = require('./admin');

const router = express.Router();

router.use(authController.classifyUser);

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/shops', shopRouter);
router.use('/products', productRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);
router.use('/admin', adminRouter);

router.all('*', (req, res, next) => {
	next(new CustomError(`Not found`, 404));
});

router.use(errorController);

module.exports = router;

// router.get('/shops'); // most rating, nearby, all verified shop
// router.get('/shops/:id');

// // 1. user
// router.get('/users/profile');
// router.patch('/users/profile');
// router.post('/shops'); // create shop
// router.get('/cart');
// router.patch('/add-to-cart');
// router.patch('/remove-from-cart');
// router.get('/recently-bought-products'); // esugggest buy again
// router.post('/orders/:id/vote-review');
// router.post('/orders');
// router.post('/orders/:id/confirm-received');
// router.get('/orders/history');

// // 2. shops
// router.get('/shops/profile');
// router.patch('/shops/profile');
// router.post('/shops/:id/close');
// router.get('/shops/:id/statistics');
// router.get('/shops/orders'); // all orders of shop
// router.post('/products/:id/sold-out');
// router.get('shops/products')

// // 3. admin
// router.get('/users');
// router.get('/shops/unverified');
// router.post('/confirm-shops');

// // 4. shop and user
// router.get('/orders/in-progress');
// router.get('/orders/:id/shipping-status');
// router.get('/orders/:id');
// router.patch('/orders/:id/confirm');
// router.post('/orders/:id/in-shipping'); // turn on shipping status
// router.patch('/orders/:id'); // user can modify only if order status is unverified
// router.post('/orders/:id/sended');
// router.get('/products/:id');
// router.get('/products'); // most rating, nearby, keywords, shop can only access products belong to it
// router.get('/products/:category'); // food, drink if shop, only display products of this shop
// router.get('shops/orders-history');

// router.get('/');
