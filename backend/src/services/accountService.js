const prisma = require("../lib/prisma");
const AppError = require("../lib/appError");

/**
 * CREATE ACCOUNT (with transaction safety)
 */
const createAccount = async (userId, data) => {
  const { name, type, initialBalance = 0 } = data;

  if (!name || !type) {
    throw new AppError("نام و نوع حساب الزامی هستند", 400);
  }

  const balance = Number(initialBalance) || 0;

  if (balance < 0) {
    throw new AppError("مقدار اولیه نمی‌تواند منفی باشد", 400);
  }

  return await prisma.$transaction(async (tx) => {
    try {
      // Create account
      const account = await tx.account.create({
        data: { name, type, userId },
      });

      // Create initial balance transaction
      if (balance > 0) {
        await tx.transaction.create({
          data: {
            type: "INCOME",
            amount: balance,
            description: "Initial balance",
            date: new Date(),
            userId,
            accountId: account.id,
          },
        });
      }

      return account;
    } catch (err) {
      if (err.code === "P2002") {
        throw new AppError("این نام حساب قبلاً استفاده شده است", 400);
      }
      throw err;
    }
  });
};

/**
 * GET ALL ACCOUNTS
 */
const getAccounts = async (userId) => {
  return await prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * UPDATE ACCOUNT
 */
const updateAccount = async (userId, accountId, data) => {
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId },
  });

  if (!account) {
    throw new AppError("حساب پیدا نشد", 404);
  }

  return await prisma.account.update({
    where: { id: accountId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.type && { type: data.type }),
    },
  });
};

/**
 * DELETE ACCOUNT (SAFE)
 */
const deleteAccount = async (userId, accountId) => {
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId },
    include: { transactions: true },
  });

  if (!account) {
    throw new AppError("حساب پیدا نشد", 404);
  }

  if (account.transactions.length > 0) {
    throw new AppError("این حساب تراکنش دارد و قابل حذف نیست", 400);
  }

  await prisma.account.delete({
    where: { id: accountId },
  });

  return { message: "حساب حذف شد" };
};

module.exports = {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
};
