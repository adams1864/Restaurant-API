// filepath: c:\Users\Administrator\Documents\tewanayEng\Restaurant-API\controllers\order.controller.js
const pool = require('../config/database');

const createOrder = async (req, res) => {
  try {
    const { order_items } = req.body; // Array of { menu_item_id, quantity }
    const customer_id = req.user.userId; // Get customer ID from JWT

    // Calculate total amount
    let total_amount = 0;
    for (const item of order_items) {
      const [menuItemRows] = await pool.execute(
        'SELECT price FROM menus WHERE id = ?',
        [item.menu_item_id]
      );
      if (menuItemRows.length === 0) {
        return res.status(400).json({ message: `Menu item not found: ${item.menu_item_id}` });
      }
      total_amount += menuItemRows[0].price * item.quantity;
    }

    // Create the order
    const [orderResult] = await pool.execute(
      'INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)',
      [customer_id, total_amount]
    );
    const order_id = orderResult.insertId;

    // Create the order items
    for (const item of order_items) {
      const [menuItemRows] = await pool.execute(
        'SELECT price FROM menus WHERE id = ?',
        [item.menu_item_id]
      );
      const price = menuItemRows[0].price;
      await pool.execute(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.menu_item_id, item.quantity, price]
      );
    }

    res.status(201).json({ message: 'Order created successfully', order_id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;
    const user_role = req.user.role;

    // Check if the user is the customer who placed the order or an admin/hotel_manager
    let [orderRows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
    if (orderRows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const order = orderRows[0];

    if (user_role !== 'admin' && user_role !== 'hotel_manager' && order.customer_id !== user_id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Get the order items
    const [orderItemsRows] = await pool.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    res.status(200).json({ order, order_items: orderItemsRows });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ message: 'Error getting order' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'pending', 'confirmed', 'preparing', 'delivered', 'cancelled'

    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
};