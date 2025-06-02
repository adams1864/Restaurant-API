const app = require('./app');
const pool = require('./config/database'); // Import the database connection pool
require('dotenv').config();

const port = process.env.PORT || 3000;

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connection successful ✅');
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error('MySQL connection failed ❌:', error);
    process.exit(1); // Exit if the database connection fails
  }
}

async function startServer() {
  await testConnection();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();