// File: backend/middleware/validation.js
const { body, param, query, validationResult } = require('express-validator');

const predefinedCategories = ['Food', 'Rent', 'Utilities', 'Entertainment', 'Salary', 'Other'];

exports.validateTransaction = [
  body('amount').isNumeric().not().isEmpty(),
  body('description').isString().isLength({ min: 1, max: 200 }),
  body('date').isISO8601().toDate(),
  body('type').isIn(['income', 'expense']),
  body('category').isIn(predefinedCategories),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateBudget = [
  body('category').isIn(predefinedCategories),
  body('monthlyLimit').isFloat({ gt: 0 }),
  body('month').matches(/^\d{4}-\d{2}$/),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];