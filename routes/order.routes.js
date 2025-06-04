// filepath: c:\Users\Administrator\Documents\tewanayEng\Restaurant-API\routes\order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Create a new order (customer)
router.post('/', authenticate, orderController.createOrder);

// Get order details by ID (customer or hotel_manager/admin)
router.get('/:id', authenticate, orderController.getOrderById);

// Update order status (hotel_manager/admin)
router.put('/:id', authenticate, authorize(['hotel_manager', 'admin']), orderController.updateOrderStatus);

module.exports = router;