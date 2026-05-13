const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 🧠 Build category map (future-proof for hierarchy)
 */
const buildCategoryCache = (categories) => {
  const map = {};
  categories.forEach((c) => (map[c.id] = c));
  return map;
};

/**
 * 🧠 Find root category (future hierarchy support)
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
 * 📊 MONTHLY REPORT — ENTERPRISE VERSION
 */
async function getMonthlyReport(userId, year, month, page = 1, limit = 50) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // ⭐ 1) Global summary (not paginated)
  const summaryAgg = await prisma.transaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
    where: {
      userId,
      deletedAt: null,
      date: { gte: startDate, lte: endDate }
    }
  });

  let income = 0;
  let expense = 0;

  summaryAgg.forEach((row) => {
    const amount = Number(row._sum.amount || 0);
    if (row.type === "INCOME") income += amount;
    if (row.type === "EXPENSE") expense += amount;
  });

  const net = income - expense;
  const savingsRate = income > 0 ? Number(((net / income) * 100).toFixed(2)) : 0;

  // ⭐ 2) Previous balance (aggregate, ultra-fast)
  const prevAgg = await prisma.transaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
    where: {
      userId,
      deletedAt: null,
      date: { lt: startDate }
    }
  });

  let previousBalance = 0;

  prevAgg.forEach((row) => {
    const amount = Number(row._sum.amount || 0);
    if (row.type === "INCOME") previousBalance += amount;
    if (row.type === "EXPENSE") previousBalance -= amount;
  });

  // ⭐ 3) Paginated runningBalance (DB-level)
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      deletedAt: null,
      date: { gte: startDate, lte: endDate }
    },
    include: { category: true },
    orderBy: [
      { date: "asc" },
      { id: "asc" }
    ],
    skip: (page - 1) * limit,
    take: limit
  });

  // ⭐ 4) Total count for pagination
  const totalTransactions = await prisma.transaction.count({
    where: {
      userId,
      deletedAt: null,
      date: { gte: startDate, lte: endDate }
    }
  });

  // ⭐ 5) Build running balance only for this page
  let balance = previousBalance;
  const runningBalance = [];

  for (const tx of transactions) {
    const amount = Number(tx.amount || 0);

    balance += tx.type === "INCOME" ? amount : -amount;

    runningBalance.push({
      id: tx.id,
      date: tx.date,
      balance
    });
  }

  // ⭐ 6) Expense by category (global + root-aware)
  const categories = await prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true, parentId: true }
  });

  const categoryMap = buildCategoryCache(categories);

  const expenseAgg = await prisma.transaction.groupBy({
    by: ["categoryId"],
    _sum: { amount: true },
    where: {
      userId,
      deletedAt: null,
      type: "EXPENSE",
      date: { gte: startDate, lte: endDate }
    }
  });

  const expenseByCategory = [];

  for (const row of expenseAgg) {
    const cat = categoryMap[row.categoryId];
    if (!cat) continue;

    const root = findRootCategory(cat, categoryMap);

    expenseByCategory.push({
      categoryId: root?.id || cat.id,
      name: root?.name || cat.name,
      total: Number(row._sum.amount || 0)
    });
  }

  return {
    period: { year, month },
    summary: { income, expense, net, savingsRate },
    runningBalance,
    pagination: {
      page,
      limit,
      total: totalTransactions,
      pages: Math.ceil(totalTransactions / limit)
    },
    expenseByCategory,
    transactionCount: totalTransactions
  };
}

module.exports = {
  getMonthlyReport
};
