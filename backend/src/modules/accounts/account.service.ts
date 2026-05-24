import prisma from "../../lib/prisma";
import { AppError } from "../../core/errors/AppError";
import { AccountType, Prisma } from "@prisma/client";

export interface CreateAccountDTO {
  name: string;
  type: AccountType;
  currency?: string;
  initialBalance?: number | string;
}

export interface UpdateAccountDTO {
  name?: string;
  type?: AccountType;
  currency?: string;
}

export const accountService = {
  async createAccount(userId: string, data: CreateAccountDTO) {
    const { name, type, currency = "USD", initialBalance = 0 } = data;

    const balance = Number(initialBalance);
    if (!Number.isFinite(balance) || balance < 0) {
      throw new AppError("Invalid initial balance", 400, "INVALID_INITIAL_BALANCE");
    }

    const existing = await prisma.account.findFirst({
      where: { userId, name, deletedAt: null },
    });

    if (existing) {
      throw new AppError("Account name already exists", 400, "ACCOUNT_EXISTS");
    }

    return prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          name,
          type,
          currency,
          initialBalance: new Prisma.Decimal(balance),
          userId,
        },
      });

      if (balance > 0) {
        await tx.transaction.create({
          data: {
            type: "INCOME",
            amount: new Prisma.Decimal(balance),
            description: "Initial balance",
            date: new Date(),
            userId,
            accountId: account.id,
          },
        });
      }

      return account;
    });
  },

  async getAccounts(userId: string) {
    return prisma.account.findMany({
      where: {
        userId,
        isArchived: false,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateAccount(userId: string, accountId: string, data: UpdateAccountDTO) {
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId, isArchived: false, deletedAt: null },
    });

    if (!account) {
      throw new AppError("Account not found", 404, "ACCOUNT_NOT_FOUND");
    }

    if (data.name && data.name !== account.name) {
      const duplicate = await prisma.account.findFirst({
        where: { userId, name: data.name, id: { not: accountId }, deletedAt: null },
      });

      if (duplicate) {
        throw new AppError("Account name already exists", 400, "ACCOUNT_EXISTS");
      }
    }

    return prisma.account.update({
      where: { id: accountId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
      },
    });
  },

  async deleteAccount(userId: string, accountId: string) {
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId, isArchived: false, deletedAt: null },
    });

    if (!account) {
      throw new AppError("Account not found", 404, "ACCOUNT_NOT_FOUND");
    }

    await prisma.account.update({
      where: { id: accountId },
      data: {
        isArchived: true,
        deletedAt: new Date(),
      },
    });

    return { deleted: true };
  },
};