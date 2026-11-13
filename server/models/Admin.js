const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Head Roaster Admin' },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'admin'
  },
  lastLogin: { type: Date, default: Date.now },
  token: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
