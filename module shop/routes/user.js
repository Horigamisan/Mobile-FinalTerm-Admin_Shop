const express = require('express');

const { userController } = require('../controllers');

const router = express.Router();

router.get('/profile', userController.profile);
router.patch('/profile', userController.editProfile);
// router.get('/order-history', orderController.getAll);

module.exports = router;
