// File: backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');

router.get('/spending-insights', controller.getSpendingInsights);
router.get('/category-breakdown', controller.getCategoryBreakdown);
router.get('/monthly-trends', controller.getMonthlyTrends);
router.get('/budget-performance', controller.getBudgetPerformance);

module.exports = router;