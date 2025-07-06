const Budget = require("../models/Budget");

exports.getAllBudgets = async (req, res, next) => {
  try {
    const { month } = req.query;
    const filter = month ? { month } : {};
    const budgets = await Budget.find(filter).sort({ month: -1 });
    res.json({ status: "success", data: budgets });
  } catch (err) {
    next(err);
  }
};

exports.createBudget = async (req, res, next) => {
  try {
    const budget = await Budget.create(req.body);
    res.status(201).json({ status: "success", data: budget });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({
          status: "error",
          message: "Budget already exists for this category and month",
        });
    }
    next(err);
  }
};

exports.getBudgetById = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget)
      return res
        .status(404)
        .json({ status: "error", message: "Budget not found" });
    res.json({ status: "success", data: budget });
  } catch (err) {
    next(err);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!budget)
      return res
        .status(404)
        .json({ status: "error", message: "Budget not found" });
    res.json({ status: "success", data: budget });
  } catch (err) {
    next(err);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget)
      return res
        .status(404)
        .json({ status: "error", message: "Budget not found" });
    res.json({ status: "success", message: "Budget deleted" });
  } catch (err) {
    next(err);
  }
};

exports.getBudgetsByMonth = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ month: req.params.month });
    res.json({ status: "success", data: budgets });
  } catch (err) {
    next(err);
  }
};

exports.getBudgetComparison = async (req, res, next) => {
  try {
    const month = req.params.month;
    const budgets = await Budget.find({ month });
    const Transaction = require("../models/Transaction");
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          type: "expense",
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$category",
          totalSpent: { $sum: "$amount" },
        },
      },
    ]);

    const comparison = budgets.map((b) => {
      const spent = expenses.find((e) => e._id === b.category)?.totalSpent || 0;
      return {
        category: b.category,
        limit: b.monthlyLimit,
        spent: -spent,
        remaining: b.monthlyLimit + spent,
      };
    });

    res.json({ status: "success", data: comparison });
  } catch (err) {
    next(err);
  }
};
