const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  planName: { type: String },
  frequency: { type: String },
  items: [{ type: String }],
  amount: { type: Number },
  nextDelivery: { type: String },
  assignedPromoCode: { type: String },
  promoDiscountPercent: { type: Number, default: 5 },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
