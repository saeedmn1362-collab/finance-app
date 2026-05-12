const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const transactionController = require("../controllers/transactionController");

// Protected routes
router.use(authMiddleware);

// CREATE TRANSACTION (INCOME/EXPENSE)
router.post("/", transactionController.createTransaction);

// CREATE TRANSFER
router.post("/transfer", transactionController.createTransfer);

// GET TRANSACTIONS
router.get("/", transactionController.getTransactions);

// GET ACCOUNT BALANCE
router.get("/balance/:accountId", transactionController.getBalance);

// DELETE TRANSACTION
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;