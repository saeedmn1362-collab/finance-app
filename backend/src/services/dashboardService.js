const prisma = require("../prisma/client");

// =========================
// HELPERS
// =========================

// پیدا کردن Root Category
const getRootCategory = (category) => {
  let current = category;

  while (current?.parent) {
    current = current.parent;
  }

  return current;
};

// =========================
// DASHBOARD SERVICE
// =========================
const getDashboardData = async (userId) => {
  // =========================
  // ACCOUNTS + BALANCE
  // =========================
  const accounts = await prisma.account.findMany({
    where: {
      userId,
      isArchived: false,
    },
    include: {
      transactions: {
        where: {
          deletedAt: null,
        },
        select: {
          type: true,
          amount: true,
        },
      },
    },
  });

  const accountsWithBalance = accounts.map((account) => {
    let balance = Number(account.initialBalance);

    for (const tx of account.transactions) {
      const amount = Number(tx.amount);

      if (tx.type === "INCOME") balance += amount;
      if (tx.type === "EXPENSE") balance -= amount;
    }

    return {
      id: account.id,
      name: account.name,
      type: account.type,
      currency: account.currency,
      balance,
    };
  });

  // مرتب‌سازی حساب‌ها بر اساس موجودی
  accountsWithBalance.sort((a, b) => b.balance - a.balance);

  const totalBalance = accountsWithBalance.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );

  // =========================
  // MONTHLY STATS
  // =========================
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const monthlyTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      deletedAt: null,
      date: {
        gte: startOfMonth,
      },
    },
    select: {
      type: true,
      amount: true,
    },
  });

  let incomeThisMonth = 0;
  let expenseThisMonth = 0;

  for (const tx of monthlyTransactions) {
    const amount = Number(tx.amount);

    if (tx.type === "INCOME") incomeThisMonth += amount;
    if (tx.type === "EXPENSE") expenseThisMonth += amount;
  }

  // =========================
  // RECENT TRANSACTIONS (LIGHTWEIGHT)
  // =========================
  const recentTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
      type: true,
      amount: true,
      date: true,
      description: true,
      category: {
        select: {
          name: true,
        },
      },
      account: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 10,
  });

  // =========================
  // EXPENSE BY ROOT CATEGORY
  // =========================
  const expenses = await prisma.transaction.findMany({
    where: {
      userId,
      deletedAt: null,
      type: "EXPENSE",
    },
    include: {
      category: {
        include: {
          parent: true,
        },
      },
    },
  });

  const expenseMap = {};

  for (const tx of expenses) {
    if (!tx.category) continue;

    const root = getRootCategory(tx.category);
    const key = root?.name || "Unknown";

    if (!expenseMap[key]) {
      expenseMap[key] = 0;
    }

    expenseMap[key] += Number(tx.amount);
  }

  const expenseByCategory = Object.entries(expenseMap).map(
    ([category, total]) => ({
      category,
      total,
    })
  );

  // =========================
  // FINAL RESPONSE
  // =========================
  return {
    totalBalance,
    incomeThisMonth,
    expenseThisMonth,
    accounts: accountsWithBalance,
    recentTransactions,
    expenseByCategory,
  };
};

module.exports = {
  getDashboardData,
};