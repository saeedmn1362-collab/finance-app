import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

export type CreateTransactionInput = {
  type: "INCOME" | "EXPENSE";
  amount: Prisma.Decimal;
  userId: string;
  accountId: string;
  description?: string | null;
  date: Date;
};

export const transactionRepository = {
  create(data: CreateTransactionInput) {
    return prisma.transaction.create({ data });
  },

  createInTx(tx: Prisma.TransactionClient, data: CreateTransactionInput) {
    return tx.transaction.create({ data });
  },

  findMany(where: Prisma.TransactionWhereInput, skip: number, take: number) {
    return prisma.transaction.findMany({
      where,
      skip,
      take,
      orderBy: { date: "desc" },
    });
  },

  count(where: Prisma.TransactionWhereInput) {
    return prisma.transaction.count({ where });
  },

  aggregateIncome(tx: Prisma.TransactionClient, userId: string, accountId: string) {
    return tx.transaction.aggregate({
      where: { userId, accountId, type: "INCOME", deletedAt: null },
      _sum: { amount: true },
    });
  },

  aggregateExpense(tx: Prisma.TransactionClient, userId: string, accountId: string) {
    return tx.transaction.aggregate({
      where: { userId, accountId, type: "EXPENSE", deletedAt: null },
      _sum: { amount: true },
    });
  },

  softDelete(id: string, userId: string) {
    return prisma.transaction.updateMany({
      where: { id, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },
};
