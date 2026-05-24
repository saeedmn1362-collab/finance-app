import prisma from "../../lib/prisma";
import { AppError } from "../../core/errors/AppError";
import { Prisma, TransactionType } from "@prisma/client";

/**
 * Safe number converter for Prisma Decimal
 */
const toNumber = (v: any) => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  return new Prisma.Decimal(v).toNumber();
};

/**
 * DTOs
 */
export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number | string;
  accountId: string;
  date?: string;
}

export interface TransferDTO {
  fromAccountId: string;
  toAccountId: string;
  amount: number | string;
}

export interface GetTransactionsFilter {
  page?: number;
  limit?: number;
    accountId?: string;
  from?: string;
  to?: string;
}

export const transactionService = {
  /**
   * CREATE
   */
  async createTransaction(userId: string, data: CreateTransactionDTO) {
    const { type, amount, accountId, date } = data;

    if (amount === null || amount === undefined || amount === "") {
      throw new AppError("Invalid amount", 400, "INVALID_AMOUNT");
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new AppError("Invalid amount", 400, "INVALID_AMOUNT");
    }

    if (date && isNaN(Date.parse(date))) {
      throw new AppError("Invalid date", 400, "INVALID_DATE");
    }

    const account = await prisma.account.findFirst({
      where: { id: accountId, userId, deletedAt: null, isArchived: false },
    });

    if (!account) {
      throw new AppError("Account not found", 404, "ACCOUNT_NOT_FOUND");
    }

    return prisma.transaction.create({
      data: {
        type,
        amount: new Prisma.Decimal(numericAmount),
        userId,
        accountId,
        date: date ? new Date(date) : new Date(),
      },
    });
  },

  /**
   * TRANSFER
   */
  async transferTransaction(userId: string, data: TransferDTO) {
    const { fromAccountId, toAccountId, amount } = data;

    if (fromAccountId === toAccountId) {
      throw new AppError("Cannot transfer to same account", 400, "INVALID_TRANSFER");
    }

    if (amount === null || amount === undefined || amount === "") {
      throw new AppError("Invalid amount", 400, "INVALID_AMOUNT");
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new AppError("Invalid amount", 400, "INVALID_AMOUNT");
    }

    return prisma.$transaction(async (tx) => {
      const fromAccount = await tx.account.findFirst({
        where: { id: fromAccountId, userId, deletedAt: null, isArchived: false },
      });

      const toAccount = await tx.account.findFirst({
        where: { id: toAccountId, userId, deletedAt: null, isArchived: false },
      });

      if (!fromAccount || !toAccount) {
        throw new AppError("Account not found", 404, "ACCOUNT_NOT_FOUND");
      }

      const incomeAgg = await tx.transaction.aggregate({
        where: { accountId: fromAccountId, type: TransactionType.INCOME },
        _sum: { amount: true },
      });

      const expenseAgg = await tx.transaction.aggregate({
        where: { accountId: fromAccountId, type: TransactionType.EXPENSE },
        _sum: { amount: true },
      });

      const income = toNumber(incomeAgg._sum.amount);
      const expense = toNumber(expenseAgg._sum.amount);
      const initial = toNumber(fromAccount.initialBalance);

      const balance = initial + income - expense;

      if (balance < numericAmount) {
        throw new AppError("Insufficient balance", 400, "INSUFFICIENT_BALANCE");
      }

      const outTx = await tx.transaction.create({
        data: {
          type: TransactionType.TRANSFER_OUT,
          amount: new Prisma.Decimal(numericAmount),
          userId,
          accountId: fromAccountId,
        },
      });

      const inTx = await tx.transaction.create({
        data: {
          type: TransactionType.TRANSFER_IN,
          amount: new Prisma.Decimal(numericAmount),
          userId,
          accountId: toAccountId,
        },
      });

      return { from: outTx, to: inTx };
    });
  },

  /**
   * BALANCE
   */
  async getBalance(userId: string, accountId: string) {
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId, deletedAt: null, isArchived: false },
    });

    if (!account) {
      throw new AppError("Account not found", 404, "ACCOUNT_NOT_FOUND");
    }

    return prisma.$transaction(async (tx) => {
      const incomeAgg = await tx.transaction.aggregate({
        where: { accountId, type: TransactionType.INCOME },
        _sum: { amount: true },
      });

      const expenseAgg = await tx.transaction.aggregate({
        where: { accountId, type: TransactionType.EXPENSE },
        _sum: { amount: true },
      });

      const balance =
        toNumber(account.initialBalance) +
        toNumber(incomeAgg._sum.amount) -
        toNumber(expenseAgg._sum.amount);

      return {
        accountId,
        balance,
      };
    });
  },

  /**
   * GET
   */
  async getTransactions(userId: string, filters: GetTransactionsFilter = {}) {
    let { page = 1, limit = 10 } = filters;

    page = Math.max(1, Number(page) || 1);
    limit = Math.min(100, Number(limit) || 10);

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.transaction.count({
        where: { userId },
      }),
    ]);

    return {
      transactions,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * DELETE
   */
  async deleteTransaction(userId: string, id: string) {
    const result = await prisma.transaction.updateMany({
      where: { id, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    if (result.count === 0) {
      throw new AppError("Transaction not found", 404, "NOT_FOUND");
    }

    return { deleted: true };
  },
};