// models/cart.js
const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
    required: true 
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image_product: { type: String },
  description: { type: String }
});

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cart', cartSchema);