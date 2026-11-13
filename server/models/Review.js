const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  author: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: String },
  comment: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
