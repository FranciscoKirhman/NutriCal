const express = require('express');
const oracledb = require('oracledb');

// Your Oracle credentials and connection string
const dbConfig = {
  user: 'admin',
  password: 'FKo56962182752',
  connectString: 'adb.sa-santiago-1.oraclecloud.com' // Example: 'localhost/orcl'
};

// Initialize the application
const app = express();
const port = process.env.PORT || 3000; // The port the app will listen on

// Endpoint to fetch data from the Oracle database
app.get('/query', async (req, res) => {
  let connection;

  try {
    // Try to establish a connection to the Oracle database
    connection = await oracledb.getConnection(dbConfig);

    // Your SQL query here
    const result = await connection.execute(`SELECT * FROM your_table WHERE rownum <= 10`);

    // Send the query results back to the client
    res.json(result.rows);
  } catch (err) {
    // If an error occurs, log it and send an error response
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    // Ensure the connection is always closed, even if an error occurs
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

