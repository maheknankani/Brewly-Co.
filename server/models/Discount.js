const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercent: { type: Number, required: true },
  description: { type: String },
  userId: { type: String },
  customerEmail: { type: String },
  subscribedDate: { type: Date, default: Date.now },
  startDate: { type: Date },
  endDate: { type: Date },
  isUsed: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  isSubscriberOnly: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Discount', DiscountSchema);
