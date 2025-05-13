import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'AutBot server is running!' });
});

// Query endpoint
app.post('/api/query', (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid input. Please provide a string in the query field.' 
      });
    }

    const response = `${query} that's so fun`;
    res.json({ response });
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Listen: server is running on port ${port}`);
}); 