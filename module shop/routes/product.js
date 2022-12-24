const express = require('express');

const { productController } = require('../controllers');

const router = express.Router();

router.get('/today', productController.getTodayMenus);
router.post('/:id/unmark-sold-out', productController.unmarkSoldOut);
router.post('/:id/sold-out', productController.markAsSoldOut);
router.post('/:id/add-to-menu', productController.addToMenu);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id', productController.editProduct);
router.post('/today', productController.createTodayMenu);
router.get('/:id', productController.getProductDetail);
router.post('/', productController.addShopProduct);
router.get('/', productController.getProducts); // only for shop

module.exports = router;
