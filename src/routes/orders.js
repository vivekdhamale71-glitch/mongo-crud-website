const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Create order (purchase)
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, customerName, customerEmail } = req.body;
    if (!productId || !quantity || !customerName || !customerEmail) return res.status(400).json({ error: 'missing fields' });
    const qty = Number(quantity);
    if (qty <= 0) return res.status(400).json({ error: 'quantity must be >= 1' });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'product not found' });
    if (product.stock < qty) return res.status(400).json({ error: 'not enough stock' });

    const totalPrice = product.price * qty;
    const order = new Order({ product: product._id, quantity: qty, totalPrice, customerName, customerEmail });

    // decrement stock
    product.stock -= qty;
    await product.save();
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Read all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Read one order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product');
    if (!order) return res.status(404).json({ error: 'not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid id' });
  }
});

// Delete order (optionally restock)
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'not found' });
    // don't restock automatically to keep behavior simple
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid id' });
  }
});

module.exports = router;
