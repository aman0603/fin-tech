const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    monthlyLimit: { type: Number, required: true, min: 0 },
    month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
  },
  { timestamps: true }
);

budgetSchema.index({ month: 1, category: 1 }, { unique: true });
budgetSchema.index({ month: -1 });

module.exports = mongoose.model("Budget", budgetSchema);
