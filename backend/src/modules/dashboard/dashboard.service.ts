import prisma from "../../lib/prisma";
import { Prisma, TransactionType } from "@prisma/client";

const toNumber = (v: Prisma.Decimal | null | undefined): number => {
  if (!v) return 0;
  return new Prisma.Decimal(v).toNumber();
};

export const dashboardService = {
  async getSummary(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [
      accounts,
      incomeAgg,
      expenseAgg,
      transactionCount,
      recentTransactions,
    ] = await Promise.all([
      prisma.account.findMany({
        where: { userId, isArchived: false, deletedAt: null },
        select: { id: true, name: true, type: true, currency: true, initialBalance: true },
      }),

      prisma.transaction.aggregate({
        where: {
          userId,
          type: TransactionType.INCOME,
          deletedAt: null,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),

      prisma.transaction.aggregate({
        where: {
          userId,
          type: TransactionType.EXPENSE,
          deletedAt: null,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),

      prisma.transaction.count({
        where: {
          userId,
          deletedAt: null,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
      }),

      prisma.transaction.findMany({
        where: { userId, deletedAt: null },
        orderBy: { date: "desc" },
        take: 5,
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          date: true,
          account: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
        },
      }),
    ]);

    const totalBalance = accounts.reduce((sum, account) => {
      return sum + toNumber(account.initialBalance);
    }, 0);

    return {
      balance: {
        total: totalBalance,
        currency: "USD",
      },
      month: {
        income: toNumber(incomeAgg._sum.amount),
        expense: toNumber(expenseAgg._sum.amount),
        net: toNumber(incomeAgg._sum.amount) - toNumber(expenseAgg._sum.amount),
        transactionCount,
      },
      recentTransactions,
    };
  },
};