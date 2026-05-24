import request from "supertest";
import app from "../../app/app";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

jest.mock("../../lib/prisma", () => ({
  account: { findMany: jest.fn() },
  transaction: {
    aggregate: jest.fn(),
    count: jest.fn(),
    findMany: jest.fn(),
  },
}));

const mockPrisma = prisma as any;

const getAuthCookie = () => {
  const token = jwt.sign(
    { userId: "user-1" },
    process.env.JWT_SECRET || "test-secret"
  );
  return `token=${token}`;
};

describe("Dashboard Integration", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("GET /api/dashboard/summary", () => {
    it("should return dashboard summary", async () => {
      mockPrisma.account.findMany.mockResolvedValue([
        {
          id: "acc-1",
          name: "Main",
          type: "BANK",
          currency: "USD",
          initialBalance: new Prisma.Decimal("1000"),
        },
      ]);

      mockPrisma.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { amount: new Prisma.Decimal("500") } })
        .mockResolvedValueOnce({ _sum: { amount: new Prisma.Decimal("200") } });

      mockPrisma.transaction.count.mockResolvedValue(5);

      mockPrisma.transaction.findMany.mockResolvedValue([
        {
          id: "tx-1",
          type: "INCOME",
          amount: new Prisma.Decimal("500"),
          description: "Salary",
          date: new Date(),
          account: { id: "acc-1", name: "Main" },
          category: null,
        },
      ]);

      const res = await request(app)
        .get("/api/dashboard/summary")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.balance.total).toBe(1000);
      expect(res.body.data.month.income).toBe(500);
      expect(res.body.data.month.expense).toBe(200);
      expect(res.body.data.month.net).toBe(300);
      expect(res.body.data.month.transactionCount).toBe(5);
      expect(Array.isArray(res.body.data.recentTransactions)).toBe(true);
    });

    it("should reject without auth", async () => {
      const res = await request(app).get("/api/dashboard/summary");
      expect(res.status).toBe(401);
    });

    it("should return zero values when no data", async () => {
      mockPrisma.account.findMany.mockResolvedValue([]);
      mockPrisma.transaction.aggregate
        .mockResolvedValueOnce({ _sum: { amount: null } })
        .mockResolvedValueOnce({ _sum: { amount: null } });
      mockPrisma.transaction.count.mockResolvedValue(0);
      mockPrisma.transaction.findMany.mockResolvedValue([]);

      const res = await request(app)
        .get("/api/dashboard/summary")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(200);
      expect(res.body.data.balance.total).toBe(0);
      expect(res.body.data.month.income).toBe(0);
      expect(res.body.data.month.expense).toBe(0);
      expect(res.body.data.month.transactionCount).toBe(0);
    });
  });
});