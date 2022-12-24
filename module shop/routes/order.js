const express = require('express');
const { orderController } = require('../controllers');
const router = express.Router();

router.get('/selling-history', orderController.getSellingHistory);
router.get('/unverified-orders', orderController.getUnverifiedOrders);
router.post('/:id/confirm', orderController.confirmOrder);
router.post('/:id/reject', orderController.rejectOrder);
router.post('/:id/mark-as-sent', orderController.markAsSent);
router.post('/:id/mark-as-done', orderController.markAsDone);
router.post('/:id/voting', orderController.voting);
router.get('/history-order', orderController.getHistoryOrder);
router.get('/in-progress', orderController.getInProgressOrders);
router.get('/checkout', orderController.checkOut);
router.get('/:id', orderController.getOrderDetail);
router.patch('/:id', orderController.updateOrder);
router.post('/', orderController.createOrder);

module.exports = router;
