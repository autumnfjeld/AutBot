require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'AutBot server is running!' });
});

// Start server
app.listen(port, () => {
  console.log(`Listen: server is running on port ${port}`);
}); 