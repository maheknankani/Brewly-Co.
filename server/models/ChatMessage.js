const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sender: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
