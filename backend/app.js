const express = require('express');
const morgan = require('morgan');
const cors = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors);
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
