// filepath: /e:/BookHavenWeb/backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Mock data
const products = [
  { id: 1, name: 'Book 1', description: 'Description for Book 1', price: 10 },
  { id: 2, name: 'Book 2', description: 'Description for Book 2', price: 15 },
  { id: 3, name: 'Book 3', description: 'Description for Book 3', price: 20 },
];

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});