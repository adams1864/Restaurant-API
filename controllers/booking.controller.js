// filepath: c:\Users\Administrator\Documents\tewanayEng\Restaurant-API\controllers\booking.controller.js
const pool = require('../config/database');

const createBooking = async (req, res) => {
  try {
    const { table_number, booking_date, booking_time, number_of_guests } = req.body;
    const customer_id = req.user.userId; // Get customer ID from JWT

    // Check if the table is already booked for the given date and time
    const [existingBookings] = await pool.execute(
      'SELECT * FROM bookings WHERE table_number = ? AND booking_date = ? AND booking_time = ? AND status != "cancelled"',
      [table_number, booking_date, booking_time]
    );

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Table is already booked for the selected date and time' });
    }

    // Create the booking
    const [result] = await pool.execute(
      'INSERT INTO bookings (customer_id, table_number, booking_date, booking_time, number_of_guests) VALUES (?, ?, ?, ?, ?)',
      [customer_id, table_number, booking_date, booking_time, number_of_guests]
    );

    const booking_id = result.insertId;

    res.status(201).json({ message: 'Booking created successfully', booking_id });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;
    const user_role = req.user.role;

    // Check if the user is the customer who made the booking or an admin/hotel_manager
    let [bookingRows] = await pool.execute('SELECT * FROM bookings WHERE id = ?', [id]);
    if (bookingRows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const booking = bookingRows[0];

    if (user_role !== 'admin' && user_role !== 'hotel_manager' && booking.customer_id !== user_id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({ message: 'Error getting booking' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;
    const user_role = req.user.role;

    // Check if the user is the customer who made the booking or an admin/hotel_manager
    let [bookingRows] = await pool.execute('SELECT * FROM bookings WHERE id = ?', [id]);
    if (bookingRows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const booking = bookingRows[0];

    if (user_role !== 'admin' && user_role !== 'hotel_manager' && booking.customer_id !== user_id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Cancel the booking
    const [result] = await pool.execute(
      'UPDATE bookings SET status = "cancelled" WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  cancelBooking,
};