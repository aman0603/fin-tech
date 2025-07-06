// File: backend/controllers/analyticsController.js
const Transaction = require('../models/Transaction');

exports.getSpendingInsights = async (req, res, next) => {
  try {
    const insights = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      {
        $group: {
          _id: { month: { $substr: ['$date', 0, 7] }, category: '$category' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.month': -1, total: -1 } }
    ]);
    res.json({ status: 'success', data: insights });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    const breakdown = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.json({ status: 'success', data: breakdown });
  } catch (err) {
    next(err);
  }
};

exports.getMonthlyTrends = async (req, res, next) => {
  try {
    const trends = await Transaction.aggregate([
      {
        $group: {
          _id: { $substr: ['$date', 0, 7] },
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json({ status: 'success', data: trends });
  } catch (err) {
    next(err);
  }
};

exports.getBudgetPerformance = async (req, res, next) => {
  try {
    const Budget = require('../models/Budget');
    const budgets = await Budget.find();

    const performance = await Promise.all(
      budgets.map(async (budget) => {
        const [year, month] = budget.month.split('-');
        const start = new Date(`${budget.month}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        const spent = await Transaction.aggregate([
          {
            $match: {
              category: budget.category,
              type: 'expense',
              date: { $gte: start, $lt: end }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        const spentAmount = spent.length > 0 ? -spent[0].total : 0;

        return {
          month: budget.month,
          category: budget.category,
          limit: budget.monthlyLimit,
          spent: spentAmount,
          remaining: budget.monthlyLimit - spentAmount
        };
      })
    );

    res.json({ status: 'success', data: performance });
  } catch (err) {
    next(err);
  }
};
