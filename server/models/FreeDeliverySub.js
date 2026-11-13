const mongoose = require('mongoose');

const FreeDeliverySubSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '+92 300 1234567' },
  selectedPlan: { type: String, required: true }, // "1 Month", "2 Months", "3 Months"
  amountPaid: { type: Number, required: true }, // 100, 200, 300
  duration: { type: String, required: true }, // "1 Month", "2 Months", "3 Months"
  paymentStatus: { type: String, required: true, default: 'Paid' }, // "Paid", "Pending", "Failed"
  paymentMethod: { type: String, required: true, default: 'Online Card Payment' },
  transactionId: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  startDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  status: { type: String, default: 'Active' } // "Active", "Expired"
}, { timestamps: true });

module.exports = mongoose.model('FreeDeliverySub', FreeDeliverySubSchema);
