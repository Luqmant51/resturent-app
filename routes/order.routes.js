const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// Create new order (only if logged in)
router.post('/', orderController.createOrder);

module.exports = router;
