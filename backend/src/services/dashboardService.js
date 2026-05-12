const prisma = require("../prisma/client");


// =========================
// BUILD CATEGORY MAP
// =========================
const buildCategoryMap = (categories) => {
  const map = {};

  for (const cat of categories) {
    map[cat.id] = cat;
  }

  return map;
};


// =========================
// FIND ROOT CATEGORY
// =========================
const findRootCategory = (category, categoryMap) => {
  let current = category;

  while (current?.parentId) {
    current = categoryMap[current.parentId];
  }

  return current;
};


// =========================
// GET DASHBOARD SUMMARY
// =========================
const getDashboardSummary = async (userId) => {

  // =========================
  // Accounts
  // =========================
  const accounts = await prisma.account.findMany({
    where: {
      userId,
      isArchived: false,
    },

    orderBy: {
      createdAt: "desc",
    },
  });


  // =========================
  // Recent Transactions
  // =========================
  const recentTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      deletedAt: null,
    },

    include: {
      category: true,
      account: true,
    },

    orderBy: {
      date: "desc",
    },

    take: 10,
  });


  // =========================
  // All Transactions
  // =========================
  const allTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      deletedAt: null,
    },

    select: {
      id: true,
      type: true,
      amount: true,
      createdAt: true,
      accountId: true,
      categoryId: true,
    },
  });


  // =========================
  // Categories
  // =========================
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
  });

  const categoryMap = buildCategoryMap(categories);


  // =========================
  // Income / Expense
  // =========================
  let income = 0;
  let expense = 0;

  for (const tx of allTransactions) {
    const amount = Number(tx.amount);

    if (tx.type === "INCOME") {
      income += amount;
    }

    if (tx.type === "EXPENSE") {
      expense += amount;
    }
  }


  // =========================
  // REAL ACCOUNT BALANCES
  // =========================
  const accountBalances = accounts.map((account) => {

    let balance = Number(account.initialBalance);

    for (const tx of allTransactions) {

      if (tx.accountId !== account.id) {
        continue;
      }

      const amount = Number(tx.amount);

      if (tx.type === "INCOME") {
        balance += amount;
      }

      if (tx.type === "EXPENSE") {
        balance -= amount;
      }
    }

    return {
      id: account.id,
      name: account.name,
      type: account.type,
      balance,
    };
  });


  // =========================
  // TOTAL BALANCE
  // =========================
  const totalBalance = accountBalances.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );


  // =========================
  // NET
  // =========================
  const net = income - expense;


  // =========================
  // EXPENSE BY ROOT CATEGORY
  // =========================
  const expenseByCategoryMap = {};

  for (const tx of allTransactions) {

    if (tx.type !== "EXPENSE") {
      continue;
    }

    if (!tx.categoryId) {
      continue;
    }

    const category = categoryMap[tx.categoryId];

    if (!category) {
      continue;
    }

    const root = findRootCategory(category, categoryMap);

    const rootName = root?.name || "Other";

    if (!expenseByCategoryMap[rootName]) {
      expenseByCategoryMap[rootName] = 0;
    }

    expenseByCategoryMap[rootName] += Number(tx.amount);
  }

  const expenseByCategory = Object.entries(
    expenseByCategoryMap
  ).map(([name, amount]) => ({
    name,
    amount,
  }));


  // =========================
  // MONTHLY SUMMARY
  // =========================
  const monthlyMap = {};

  for (const tx of allTransactions) {

    const date = new Date(tx.createdAt);

    const monthKey =
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = {
        income: 0,
        expense: 0,
      };
    }

    const amount = Number(tx.amount);

    if (tx.type === "INCOME") {
      monthlyMap[monthKey].income += amount;
    }

    if (tx.type === "EXPENSE") {
      monthlyMap[monthKey].expense += amount;
    }
  }

  const monthlySummary = Object.entries(monthlyMap).map(
    ([month, values]) => ({
      month,
      income: values.income,
      expense: values.expense,
      net: values.income - values.expense,
    })
  );


  // =========================
  // FINAL RESPONSE
  // =========================
  return {
    totalBalance,
    income,
    expense,
    net,

    accounts: accountBalances,

    recentTransactions,

    expenseByCategory,

    monthlySummary,
  };
};


module.exports = {
  getDashboardSummary,
};