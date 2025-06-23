// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const { validateProduct } = require('./middleware/validate');
const { NotFoundError, ValidationError, errorHandler }= require('./middleware/errorHandler');
//Error handling middleware


// Middleware setup
app.use(bodyParser.json());
app.use(logger);
app.use(auth);

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// Get all products (with filtering, pagination, and search)
app.get('/api/products', (req, res) => {
  let {category, page = 1, limit = 10, search } = req.query;
  let filtered = [...products];

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + Number(limit));

  res.json({
    total: filtered.length,
    page: Number(page),
    limit: Number(limit),
    data: paginated
  });
});

//Get product by ID
app.get('/api/products/:id', (req, res, next)=>{
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
});

//Create a new product
app.post('/api/products', validateProduct, (req, res)=>{
  const newProduct = { id: uuidv4(), ...req.body};
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update a product
app.put('/api/products/:id', validateProduct, (req, res, next)=>{
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));

  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
});

// Product statistics
app.get('/api/products-stats', (req, res)=> {
  const stats = {};
  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json(stats)
});



// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 