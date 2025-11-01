const path = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Basic health
app.get('/health', (req, res) => res.json({ ok: true }));

// Connect to MongoDB and start server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mongo_crud_db';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});
