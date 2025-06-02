// filepath: c:\Users\Administrator\Documents\tewanayEng\Restaurant-API\app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const menuRoutes = require('./routes/menu.routes'); // Import menu routes
const { authenticate, authorize } = require('./middleware/auth.middleware');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes); // Mount menu routes

// Test route - requires admin role
app.get('/api/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: 'Admin route accessed successfully', user: req.user });
});

// Test route
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ message: 'Profile accessed successfully', user: req.user });
});

module.exports = app;