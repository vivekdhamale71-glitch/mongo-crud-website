const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Create product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    if (!name || price == null) return res.status(400).json({ error: 'name and price are required' });
    const p = new Product({ name, description, price: Number(price), stock: Number(stock ?? 0) });
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Read all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Read one product
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'not found' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid id' });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'not found' });
    p.name = name ?? p.name;
    p.description = description ?? p.description;
    p.price = price != null ? Number(price) : p.price;
    p.stock = stock != null ? Number(stock) : p.stock;
    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid request' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: 'not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid id' });
  }
});

module.exports = router;
