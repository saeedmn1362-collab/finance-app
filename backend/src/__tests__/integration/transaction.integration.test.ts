import request from "supertest";
import app from "../../app/app";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

jest.mock("../../lib/prisma", () => ({
  account: { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn(), create: jest.fn() },
  transaction: { create: jest.fn(), findMany: jest.fn(), count: jest.fn(), updateMany: jest.fn(), aggregate: jest.fn() },
  $transaction: jest.fn(),
}));

const mockPrisma = prisma as any;

const getAuthCookie = () => {
  const token = jwt.sign(
    { userId: "user-1" },
    process.env.JWT_SECRET || "test-secret"
  );
  return `token=${token}`;
};

const mockAccount = {
  id: "acc-1",
  userId: "user-1",
  initialBalance: new Prisma.Decimal("1000"),
  isArchived: false,
  deletedAt: null,
};

describe("Transaction Integration", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("POST /api/transactions", () => {
    it("should create transaction", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);
      mockPrisma.transaction.create.mockResolvedValue({
        id: "tx-1",
        type: "INCOME",
        amount: new Prisma.Decimal("100"),
        userId: "user-1",
        accountId: "acc-1",
      });

      const res = await request(app)
        .post("/api/transactions")
        .set("Cookie", getAuthCookie())
        .send({ type: "INCOME", amount: 100, accountId: "acc-1" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe("tx-1");
    });

    it("should reject without auth", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .send({ type: "INCOME", amount: 100, accountId: "acc-1" });

      expect(res.status).toBe(401);
    });

    it("should reject invalid payload", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Cookie", getAuthCookie())
        .send({ type: "INVALID", amount: -10 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/transactions/transfer", () => {
    it("should reject same account transfer", async () => {
      const res = await request(app)
        .post("/api/transactions/transfer")
        .set("Cookie", getAuthCookie())
        .send({ fromAccountId: "acc-1", toAccountId: "acc-1", amount: 100 });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("INVALID_TRANSFER");
    });

    it("should reject without auth", async () => {
      const res = await request(app)
        .post("/api/transactions/transfer")
        .send({ fromAccountId: "acc-1", toAccountId: "acc-2", amount: 100 });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/transactions", () => {
    it("should return transactions list", async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([]);
      mockPrisma.transaction.count.mockResolvedValue(0);

      const res = await request(app)
        .get("/api/transactions")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.total).toBe(0);
    });

    it("should reject without auth", async () => {
      const res = await request(app).get("/api/transactions");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/transactions/balance/:accountId", () => {
    it("should return balance", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);
      mockPrisma.$transaction.mockImplementation(async (fn: any) =>
        fn({
          transaction: {
            aggregate: jest.fn()
              .mockResolvedValueOnce({ _sum: { amount: new Prisma.Decimal("200") } })
              .mockResolvedValueOnce({ _sum: { amount: new Prisma.Decimal("50") } }),
          },
        })
      );

      const res = await request(app)
        .get("/api/transactions/balance/acc-1")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(200);
      expect(res.body.data.balance).toBe(1150);
    });
  });

  describe("DELETE /api/transactions/:id", () => {
    it("should soft delete transaction", async () => {
      mockPrisma.transaction.updateMany.mockResolvedValue({ count: 1 });

      const res = await request(app)
        .delete("/api/transactions/tx-1")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(200);
      expect(res.body.data.deleted).toBe(true);
    });

    it("should return 404 if not found", async () => {
      mockPrisma.transaction.updateMany.mockResolvedValue({ count: 0 });

      const res = await request(app)
        .delete("/api/transactions/non-existent")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(404);
    });
  });
});