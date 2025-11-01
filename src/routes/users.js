const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create
router.post('/', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'email already exists' });
    const user = new User({ name, email, age });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid id' });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'not found' });
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ error: 'email already in use' });
    }
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.age = age ?? user.age;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid request' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'invalid id' });
  }
});

module.exports = router;
