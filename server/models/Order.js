const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  date: { type: Date, default: Date.now },
  items: [
    {
      productId: { type: String },
      productName: { type: String },
      weight: { type: String },
      grind: { type: String },
      quantity: { type: Number },
      price: { type: Number }
    }
  ],
  subtotal: { type: Number },
  discount: { type: Number },
  shipping: { type: Number },
  total: { type: Number },
  status: { type: String, default: 'Processing' },
  confirmationEmailSent: { type: Boolean, default: false },
  trackingSteps: [
    {
      step: { type: String },
      date: { type: String },
      completed: { type: Boolean, default: false }
    }
  ],
  shippingAddress: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
