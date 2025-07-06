// File: backend/routes/budgets.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/budgetController');
const { validateBudget } = require('../middleware/validation');

router.get('/', controller.getAllBudgets);
router.post('/', validateBudget, controller.createBudget);
router.get('/:id', controller.getBudgetById);
router.put('/:id', validateBudget, controller.updateBudget);
router.delete('/:id', controller.deleteBudget);
router.get('/month/:month', controller.getBudgetsByMonth);
router.get('/comparison/:month', controller.getBudgetComparison);

module.exports = router;
