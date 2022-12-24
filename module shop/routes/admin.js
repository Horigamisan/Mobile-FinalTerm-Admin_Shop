const express = require('express');
const { adminController, authController } = require('../controllers');

const router = express.Router();

router.use(authController.restricTo('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/shops', adminController.getAllShops);
router.post('/shops/:id/allow', adminController.allowShop);
router.post('/shops/:id/reject', adminController.rejectShop);

module.exports = router;
