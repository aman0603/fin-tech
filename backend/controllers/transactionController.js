const Transaction = require("../models/Transaction");

exports.getAllTransactions = async (req, res, next) => {
  try {
    const { category, type, startDate, endDate } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json({ status: "success", data: transactions });
  } catch (err) {
    next(err);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json({ status: "success", data: transaction });
  } catch (err) {
    next(err);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    res.json({ status: "success", data: transaction });
  } catch (err) {
    next(err);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!transaction)
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    res.json({ status: "success", data: transaction });
  } catch (err) {
    next(err);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction)
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    res.json({ status: "success", message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
};
