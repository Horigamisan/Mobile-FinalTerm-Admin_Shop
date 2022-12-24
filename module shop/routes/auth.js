const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');

router.get('/signout', authController.signout);
router.get('/resend-otp', authController.resendOtp);
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/verify-account', authController.verifyAccount);

module.exports = router;
