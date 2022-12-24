const express = require('express');
const { cartController } = require('../controllers');

const router = express.Router();

router.patch('/add', cartController.addToCart);
router.patch('/remove', cartController.removeFromCart);
router.get('/recently-bought-products', cartController.getRecentlyBought); // sugggest buy again
router.get('/', cartController.getCart);
router.all('*', (req, res, next) => {
	console.log('here');
	next();
});

module.exports = router;

// cartmodel get where user id
// cartmodel add 1 if exist else add
// cartmodel minus 1 if quantity > 0 else remove
