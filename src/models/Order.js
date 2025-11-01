const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  customerName: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
