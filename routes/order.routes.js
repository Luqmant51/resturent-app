const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.post('/orders/:id/confirm', orderController.confirmOrder);
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
