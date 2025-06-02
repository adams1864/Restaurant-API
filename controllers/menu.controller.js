// filepath: c:\Users\Administrator\Documents\tewanayEng\Restaurant-API\controllers\menu.controller.js
const pool = require('../config/database');

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, image_url } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO menus (name, description, price, image_url) VALUES (?, ?, ?, ?)',
      [name, description, price, image_url]
    );
    const menuItemId = result.insertId;
    res.status(201).json({ message: 'Menu item created successfully', menuItemId });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Error creating menu item' });
  }
};

const getAllMenuItems = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM menus');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error getting all menu items:', error);
    res.status(500).json({ message: 'Error getting all menu items' });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM menus WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error getting menu item by ID:', error);
    res.status(500).json({ message: 'Error getting menu item by ID' });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url } = req.body;
    const [result] = await pool.execute(
      'UPDATE menus SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?',
      [name, description, price, image_url, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Error updating menu item' });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM menus WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Error deleting menu item' });
  }
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};