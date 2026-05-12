const transactionService = require("../services/transactionService");

/**
 * CREATE TRANSACTION (INCOME/EXPENSE)
 */
const createTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;

    const transaction = await transactionService.createTransaction(
      userId,
      req.body
    );

    res.status(201).json({
      message: "تراکنش ایجاد شد",
      transaction,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

/**
 * CREATE TRANSFER
 */
const createTransfer = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await transactionService.transferTransaction(
      userId,
      req.body
    );

    res.status(201).json({
      message: "انتقال موفق",
      debit: result.debit,
      credit: result.credit,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

/**
 * GET ACCOUNT BALANCE
 */
const getBalance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const accountId = req.params.accountId;

    const balance = await transactionService.getBalance(userId, accountId);

    res.json({
      message: "موجودی حساب",
      data: balance,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

/**
 * GET TRANSACTIONS
 */
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const filters = {
      accountId: req.query.accountId,
      type: req.query.type,
      categoryId: req.query.categoryId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,

      // ✅ اصلاح مهم: محدودیت امن
      limit: Math.min(Number(req.query.limit) || 100, 500),
    };

    const transactions = await transactionService.getTransactions(
      userId,
      filters
    );

    res.json({
      message: "لیست تراکنش‌ها",
      count: transactions.length,
      transactions,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

/**
 * DELETE TRANSACTION
 */
const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactionId = req.params.id;

    const result = await transactionService.deleteTransaction(
      userId,
      transactionId
    );

    // ✅ اصلاح مهم: تشخیص نوع حذف
    res.json({
      message: result.softDeleted
        ? "تراکنش با حذف نرم غیرفعال شد"
        : "تراکنش حذف شد",
      result,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createTransaction,
  createTransfer,
  getBalance,
  getTransactions,
  deleteTransaction,
};