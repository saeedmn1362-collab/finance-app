const prisma = require("../lib/prisma");
const AppError = require("../lib/appError");

/**
 * CREATE TRANSACTION (INCOME / EXPENSE)
 */
const createTransaction = async (userId, data) => {
  const { type, amount, accountId, description, categoryId, personId, date } = data;

  const value = Number(amount);

  if (!type || !accountId || amount === undefined) {
    throw new AppError("type, amount, accountId الزامی هستند", 400);
  }

  // ✅ FIX: strict number validation
  if (!Number.isFinite(value)) {
    throw new AppError("amount نامعتبر است", 400);
  }

  if (!["INCOME", "EXPENSE"].includes(type)) {
    throw new AppError("نوع تراکنش نامعتبر است", 400);
  }

  if (value <= 0) {
    throw new AppError("مقدار باید مثبت باشد", 400);
  }

  const parsedDate = date ? new Date(date) : new Date();

  if (date && isNaN(parsedDate.getTime())) {
    throw new AppError("تاریخ نامعتبر است", 400);
  }

  return prisma.$transaction(async (tx) => {
    const account = await tx.account.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new AppError("حساب پیدا نشد", 404);
    }

    return tx.transaction.create({
      data: {
        type,
        amount: value,
        description,
        date: parsedDate,
        userId,
        accountId,
        categoryId: categoryId || null,
        personId: personId || null,
      },
    });
  });
};

/**
 * TRANSFER TRANSACTION (Dual Entry System)
 */
const transferTransaction = async (userId, data) => {
  const { fromAccountId, toAccountId, amount, description, date } = data;

  const value = Number(amount);

  if (!fromAccountId || !toAccountId || amount === undefined) {
    throw new AppError("اطلاعات انتقال کامل نیست", 400);
  }

  // ✅ FIX: strict number validation
  if (!Number.isFinite(value)) {
    throw new AppError("amount نامعتبر است", 400);
  }

  if (value <= 0) {
    throw new AppError("مقدار انتقال باید مثبت باشد", 400);
  }

  if (fromAccountId === toAccountId) {
    throw new AppError("حساب مبدا و مقصد نمی‌تواند یکی باشد", 400);
  }

  const transactionDate = date ? new Date(date) : new Date();

  if (date && isNaN(transactionDate.getTime())) {
    throw new AppError("تاریخ نامعتبر است", 400);
  }

  return prisma.$transaction(async (tx) => {
    const [from, to] = await Promise.all([
      tx.account.findFirst({ where: { id: fromAccountId, userId } }),
      tx.account.findFirst({ where: { id: toAccountId, userId } }),
    ]);

    if (!from || !to) {
      throw new AppError("حساب‌ها معتبر نیستند", 404);
    }

    const debit = await tx.transaction.create({
      data: {
        type: "EXPENSE",
        amount: value,
        description: description || "Transfer out",
        date: transactionDate,
        userId,
        accountId: fromAccountId,
        fromAccountId,
        toAccountId,
      },
    });

    const credit = await tx.transaction.create({
      data: {
        type: "INCOME",
        amount: value,
        description: description || "Transfer in",
        date: transactionDate,
        userId,
        accountId: toAccountId,
        fromAccountId,
        toAccountId,
      },
    });

    return { debit, credit };
  });
};

/**
 * GET BALANCE (Optimized Aggregation)
 */
const getBalance = async (userId, accountId) => {
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId },
  });

  if (!account) {
    throw new AppError("حساب پیدا نشد", 404);
  }

  const [incomeResult, expenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        accountId,
        type: "INCOME",
        deletedAt: null,
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        accountId,
        type: "EXPENSE",
        deletedAt: null,
      },
      _sum: { amount: true },
    }),
  ]);

  const income = Number(incomeResult._sum.amount || 0);
  const expense = Number(expenseResult._sum.amount || 0);

  return {
    accountId,
    accountName: account.name,
    accountType: account.type,
    balance: income - expense,
  };
};

/**
 * GET TRANSACTIONS
 */
const getTransactions = async (userId, filters = {}) => {
  return prisma.transaction.findMany({
    where: {
      userId,
      deletedAt: null,
      ...(filters.accountId && { accountId: filters.accountId }),
      ...(filters.type && { type: filters.type }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.startDate && filters.endDate
        ? {
            date: {
              gte: new Date(filters.startDate),
              lte: new Date(filters.endDate),
            },
          }
        : {}),
    },
    include: {
      account: { select: { name: true, type: true } },
      category: { select: { name: true } },
      person: { select: { name: true, type: true } },
    },
    orderBy: { date: "desc" },
    take: filters.limit ? Number(filters.limit) : 100,
  });
};

/**
 * DELETE TRANSACTION (Soft Delete)
 */
const deleteTransaction = async (userId, transactionId) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
      deletedAt: null,
    },
  });

  if (!transaction) {
    throw new AppError("تراکنش پیدا نشد", 404);
  }

  return prisma.transaction.update({
    where: { id: transactionId },
    data: {
      deletedAt: new Date(),
    },
  });
};

module.exports = {
  createTransaction,
  transferTransaction,
  getBalance,
  getTransactions,
  deleteTransaction,
};