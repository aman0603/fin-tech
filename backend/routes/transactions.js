// File: backend/routes/transactions.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController');
const { validateTransaction } = require('../middleware/validation');

router.get('/', controller.getAllTransactions);
router.post('/', validateTransaction, controller.createTransaction);
router.get('/:id', controller.getTransactionById);
router.put('/:id', validateTransaction, controller.updateTransaction);
router.delete('/:id', controller.deleteTransaction);

module.exports = router;
