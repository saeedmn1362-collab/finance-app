import { accountService } from "../account.service";
import prisma from "../../../lib/prisma";
import { AppError } from "../../../core/errors/AppError";
import { Prisma } from "@prisma/client";

jest.mock("../../../lib/prisma", () => ({
  account: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
}));

const mockPrisma = prisma as any;

const mockAccount = {
  id: "acc-1",
  userId: "user-1",
  name: "Main",
  type: "BANK",
  currency: "USD",
  initialBalance: new Prisma.Decimal("0"),
  isArchived: false,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Account Service", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createAccount", () => {
    it("should create account", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(null);
      mockPrisma.$transaction.mockImplementation(async (fn: any) =>
        fn({
          account: { create: jest.fn().mockResolvedValue(mockAccount) },
          transaction: { create: jest.fn() },
        })
      );

      const result = await accountService.createAccount("user-1", {
        name: "Main",
        type: "BANK",
      });

      expect(result.id).toBe("acc-1");
    });

    it("should reject duplicate name", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);

      await expect(
        accountService.createAccount("user-1", {
          name: "Main",
          type: "BANK",
        })
      ).rejects.toThrow(AppError);
    });

    it("should reject negative initial balance", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(null);

      await expect(
        accountService.createAccount("user-1", {
          name: "Main",
          type: "BANK",
          initialBalance: -100,
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe("getAccounts", () => {
    it("should return accounts", async () => {
      mockPrisma.account.findMany.mockResolvedValue([mockAccount]);

      const result = await accountService.getAccounts("user-1");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("acc-1");
    });
  });

  describe("updateAccount", () => {
    it("should update account", async () => {
      mockPrisma.account.findFirst.mockResolvedValueOnce(mockAccount);
      mockPrisma.account.update.mockResolvedValue({
        ...mockAccount,
        name: "Updated",
      });

      const result = await accountService.updateAccount(
        "user-1",
        "acc-1",
        { name: "Updated" }
      );

      expect(result.name).toBe("Updated");
    });

    it("should reject if account not found", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(null);

      await expect(
        accountService.updateAccount("user-1", "acc-1", { name: "X" })
      ).rejects.toThrow(AppError);
    });

    it("should reject duplicate name", async () => {
      mockPrisma.account.findFirst
        .mockResolvedValueOnce(mockAccount)
        .mockResolvedValueOnce({ ...mockAccount, id: "acc-2" });

      await expect(
        accountService.updateAccount("user-1", "acc-1", { name: "Other" })
      ).rejects.toThrow(AppError);
    });
  });

  describe("deleteAccount", () => {
    it("should soft delete account", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);
      mockPrisma.account.update.mockResolvedValue({
        ...mockAccount,
        isArchived: true,
        deletedAt: new Date(),
      });

      const result = await accountService.deleteAccount("user-1", "acc-1");

      expect(result.deleted).toBe(true);
    });

    it("should reject if account not found", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(null);

      await expect(
        accountService.deleteAccount("user-1", "acc-1")
      ).rejects.toThrow(AppError);
    });
  });
});