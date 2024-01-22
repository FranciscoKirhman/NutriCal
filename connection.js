require('dotenv').config(); // Add this to the top to use dotenv for environment variables
const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

// Use environment variables for credentials
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: 'gcb99637f1c00f0_tabla1_high.adb.oraclecloud.com' // Example: 'localhost/orcl'
};

// Initialize the application
const app = express();
app.use(cors()); // Enable CORS for all routes

const port = process.env.PORT || 3000; // The port the app will listen on

// Endpoint to fetch data from the Oracle database
app.get('/query', async (req, res) => {
  let connection;

  try {
    // Try to establish a connection to the Oracle database
    connection = await oracledb.getConnection(dbConfig);

    // Your SQL query here
    const result = await connection.execute(`SELECT * FROM Nutrientes`);

    // Send the query results back to the client
    res.json(result.rows);
  } catch (err) {
    // Detailed error logging
    console.error('Error occurred:', err);

    // Send a more informative error message to the client
    res.status(500).send('Error occurred while fetching data');
  } finally {
    // Ensure the connection is always closed, even if an error occurs
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Start the server on all network interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
