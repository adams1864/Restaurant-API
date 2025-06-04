// filepath: c:\Users\Administrator\Documents\tewanayEng\Restaurant-API\routes\booking.routes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Create a new booking (customer)
router.post('/', authenticate, bookingController.createBooking);

// Get booking details by ID (customer or hotel_manager/admin)
router.get('/:id', authenticate, bookingController.getBookingById);

// Cancel a booking (customer or hotel_manager/admin)
router.delete('/:id', authenticate, bookingController.cancelBooking);

module.exports = router;