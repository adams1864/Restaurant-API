// filepath: c:\Users\Administrator\Documents\tewanayEng\Restaurant-API\routes\menu.routes.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Create a new menu item (hotel_manager or admin)
router.post('/', authenticate, authorize(['hotel_manager', 'admin']), menuController.createMenuItem);

// Get all menu items (authenticated users)
router.get('/', authenticate, menuController.getAllMenuItems);

// Get a specific menu item by ID (authenticated users)
router.get('/:id', authenticate, menuController.getMenuItemById);

// Update a menu item (hotel_manager or admin)
router.put('/:id', authenticate, authorize(['hotel_manager', 'admin']), menuController.updateMenuItem);

// Delete a menu item (hotel_manager or admin)
router.delete('/:id', authenticate, authorize(['hotel_manager', 'admin']), menuController.deleteMenuItem);

module.exports = router;