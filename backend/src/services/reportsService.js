const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 🧠 Build category map
 */
const buildCategoryCache = (categories) => {
  const map = {};
  categories.forEach((c) => (map[c.id] = c));
  return map;
};

/**
 * 🧠 Find root category
 */
const findRootCategory = (category, map) => {
  if (!category) return null;

  let current = category;

  while (current?.parentId && map[current.parentId]) {
    current = map[current.parentId];
  }

  return current;
};

/**
 * 📊 MONTHLY REPORT (FINAL)
 */
async function getMonthlyReport(userId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const categories = await prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true, parentId: true },
  });

  const categoryMap = buildCategoryCache(categories);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      deletedAt: null,
      date: { gte: startDate, lte: endDate },
    },
    include: { category: true },
    orderBy: { date: "asc" },
  });

  let income = 0;
  let expense = 0;

  const expenseByCategory = {};
  const runningBalance = [];

  // previous balance
  const previous = await prisma.transaction.findMany({
    where: {
      userId,
      deletedAt: null,
      date: { lt: startDate },
    },
    select: { type: true, amount: true },
  });

  let balance = 0;

  for (const tx of previous) {
    const amount = Number(tx.amount || 0);
    if (tx.type === "INCOME") balance += amount;
    if (tx.type === "EXPENSE") balance -= amount;
  }

  // sort transactions (safety)
  transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

  for (const tx of transactions) {
    const amount = Number(tx.amount || 0);

    if (tx.type === "INCOME") income += amount;
    if (tx.type === "EXPENSE") expense += amount;

    balance += tx.type === "INCOME" ? amount : -amount;

    runningBalance.push({
      id: tx.id,
      date: tx.date,
      balance,
    });

    if (tx.type === "EXPENSE" && tx.categoryId) {
      const cat = categoryMap[tx.categoryId] || null;
      const root = findRootCategory(cat, categoryMap);

      const key = root?.id || "unknown";
      const name = root?.name || "Other";

      if (!expenseByCategory[key]) {
        expenseByCategory[key] = { categoryId: key, name, total: 0 };
      }

      expenseByCategory[key].total += amount;
    }
  }

  const net = income - expense;

  const savingsRate =
    income > 0 ? Number(((net / income) * 100).toFixed(2)) : 0;

  return {
    period: { year, month },
    summary: {
      income,
      expense,
      net,
      savingsRate,
    },
    runningBalance,
    expenseByCategory: Object.values(expenseByCategory),
    transactionCount: transactions.length,
  };
}

/**
 * 📊 YEARLY REPORT (FINAL)
 */
async function getYearlyReport(userId, year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      deletedAt: null,
      date: { gte: startDate, lte: endDate },
    },
    select: { type: true, amount: true, date: true },
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    income: 0,
    expense: 0,
    net: 0,
    savingsRate: 0,
  }));

  for (const tx of transactions) {
    const m = new Date(tx.date).getMonth();
    const amount = Number(tx.amount || 0);

    if (tx.type === "INCOME") months[m].income += amount;
    if (tx.type === "EXPENSE") months[m].expense += amount;
  }

  months.forEach((m) => {
    m.net = m.income - m.expense;
    m.savingsRate =
      m.income > 0 ? Number(((m.net / m.income) * 100).toFixed(2)) : 0;
  });

  return months;
}

module.exports = {
  getMonthlyReport,
  getYearlyReport,
};
