import { transactionService } from "../transaction.service";
import prisma from "../../../lib/prisma";
import { AppError } from "../../../core/errors/AppError";
import { Prisma } from "@prisma/client";

jest.mock("../../../lib/prisma", () => ({
  account: {
    findFirst: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
    aggregate: jest.fn(),
  },
  $transaction: jest.fn(),
}));

const mockPrisma = prisma as any;

const mockAccount = {
  id: "account-1",
  userId: "user-1",
  initialBalance: new Prisma.Decimal("1000"),
  deletedAt: null,
  isArchived: false,
};

describe("Transaction Service", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createTransaction", () => {
    it("should create transaction", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);
      mockPrisma.transaction.create.mockResolvedValue({
        id: "tx-1",
        type: "INCOME",
        amount: new Prisma.Decimal("100"),
      } as any);

      const result = await transactionService.createTransaction("user-1", {
        type: "INCOME",
        amount: 100,
        accountId: "account-1",
      });

      expect(result.id).toBe("tx-1");
    });

    it("should reject invalid amount", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);

      await expect(
        transactionService.createTransaction("user-1", {
          type: "INCOME",
          amount: "abc",
          accountId: "account-1",
        })
      ).rejects.toThrow(AppError);
    });

    it("should reject invalid date", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);

      await expect(
        transactionService.createTransaction("user-1", {
          type: "INCOME",
          amount: 100,
          accountId: "account-1",
          date: "not-a-date",
        })
      ).rejects.toThrow(AppError);
    });

    it("should reject if account not found", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(null);

      await expect(
        transactionService.createTransaction("user-1", {
          type: "INCOME",
          amount: 100,
          accountId: "non-existent",
        })
      ).rejects.toThrow(AppError);
    });

    it("should accept valid date string", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);
      mockPrisma.transaction.create.mockResolvedValue({
        id: "tx-2",
        type: "INCOME",
        amount: new Prisma.Decimal("100"),
      } as any);

      const result = await transactionService.createTransaction("user-1", {
        type: "INCOME",
        amount: 100,
        accountId: "account-1",
        date: "2024-01-15T00:00:00.000Z",
      });

      expect(result.id).toBe("tx-2");
    });
  });

  describe("transferTransaction", () => {
    it("should reject same account", async () => {
      await expect(
        transactionService.transferTransaction("user-1", {
          fromAccountId: "a",
          toAccountId: "a",
          amount: 100,
        })
      ).rejects.toThrow(AppError);
    });

    it("should transfer successfully", async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: any) =>
        fn({
          account: {
            findFirst: jest.fn()
              .mockResolvedValueOnce(mockAccount)
              .mockResolvedValueOnce({ ...mockAccount, id: "account-2" }),
          },
          transaction: {
            aggregate: jest.fn()
              .mockResolvedValueOnce({ _sum: { amount: new Prisma.Decimal("0") } })
              .mockResolvedValueOnce({ _sum: { amount: new Prisma.Decimal("0") } }),
            create: jest.fn()
              .mockResolvedValueOnce({ id: "tx-out" })
              .mockResolvedValueOnce({ id: "tx-in" }),
          },
        })
      );

      const result = await transactionService.transferTransaction("user-1", {
        fromAccountId: "account-1",
        toAccountId: "account-2",
        amount: 100,
      });

      expect(result.from.id).toBe("tx-out");
      expect(result.to.id).toBe("tx-in");
    });
  });

  describe("getBalance", () => {
    it("should return balance", async () => {
      mockPrisma.account.findFirst.mockResolvedValue({
        ...mockAccount,
        initialBalance: new Prisma.Decimal("500"),
      });

      mockPrisma.$transaction.mockImplementation(async (fn: any) =>
        fn({
          transaction: {
            aggregate: jest.fn()
              .mockResolvedValueOnce({ _sum: { amount: new Prisma.Decimal("200") } })
              .mockResolvedValueOnce({ _sum: { amount: new Prisma.Decimal("100") } }),
          },
        })
      );

      const result = await transactionService.getBalance("user-1", "account-1");

      expect(result.balance).toBe(600);
    });
  });

  describe("getTransactions", () => {
    it("should return list", async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([]);
      mockPrisma.transaction.count.mockResolvedValue(0);

      const result = await transactionService.getTransactions("user-1");

      expect(result.meta.total).toBe(0);
    });
  });

  describe("deleteTransaction", () => {
    it("should soft delete", async () => {
      mockPrisma.transaction.updateMany.mockResolvedValue({ count: 1 });

      const result = await transactionService.deleteTransaction("user-1", "tx-1");

      expect(result.deleted).toBe(true);
    });
  });
});