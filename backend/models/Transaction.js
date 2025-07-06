const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true, maxlength: 200 },
  date: { type: Date, required: true, default: Date.now },
  type: { type: String, required: true, enum: ['income', 'expense'] },
  category: { type: String, required: true },
}, { timestamps: true });

transactionSchema.index({ date: -1 });
transactionSchema.index({ category: 1, date: -1 });
transactionSchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);

