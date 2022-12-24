const express = require('express');

const { shopController } = require('../controllers');
const productRouter = require('./product');

const router = express.Router();

router.get('/my-shop', shopController.profile);
router.patch('/my-shop', shopController.editProfile);
router.post('/my-shop/close', shopController.closeShop);
router.post('/my-shop/reopen', shopController.reopenShop);
router.get('/:id', shopController.getShopDetail);
router.delete('/:id', shopController.deleteShop);
router.post('/', shopController.createShop);

// router.get('/statistics');
// router.get('/orders/today'); // all orders of shop
// router.get('/orders/unverified');
// router.get('/order/selling-history')

// router.use('/products', productRouter);
router.get('/', shopController.getShops); // most rating, nearby, all verified shop

module.exports = router;
