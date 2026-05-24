import request from "supertest";
import app from "../../app/app";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

jest.mock("../../lib/prisma", () => ({
  account: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  transaction: { create: jest.fn() },
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
  name: "Main",
  type: "BANK",
  currency: "USD",
  initialBalance: new Prisma.Decimal("0"),
  isArchived: false,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Account Integration", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("POST /api/accounts", () => {
    it("should create account", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(null);
      mockPrisma.$transaction.mockImplementation(async (fn: any) =>
        fn({
          account: { create: jest.fn().mockResolvedValue(mockAccount) },
          transaction: { create: jest.fn() },
        })
      );

      const res = await request(app)
        .post("/api/accounts")
        .set("Cookie", getAuthCookie())
        .send({ name: "Main", type: "BANK" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe("acc-1");
    });

    it("should reject without auth", async () => {
      const res = await request(app)
        .post("/api/accounts")
        .send({ name: "Main", type: "BANK" });

      expect(res.status).toBe(401);
    });

    it("should reject invalid type", async () => {
      const res = await request(app)
        .post("/api/accounts")
        .set("Cookie", getAuthCookie())
        .send({ name: "Main", type: "INVALID" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject negative balance", async () => {
      const res = await request(app)
        .post("/api/accounts")
        .set("Cookie", getAuthCookie())
        .send({ name: "Main", type: "BANK", initialBalance: -100 });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/accounts", () => {
    it("should return accounts", async () => {
      mockPrisma.account.findMany.mockResolvedValue([mockAccount]);

      const res = await request(app)
        .get("/api/accounts")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should reject without auth", async () => {
      const res = await request(app).get("/api/accounts");
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/accounts/:id", () => {
    it("should update account", async () => {
      mockPrisma.account.findFirst.mockResolvedValueOnce(mockAccount);
      mockPrisma.account.update.mockResolvedValue({
        ...mockAccount,
        name: "Updated",
      });

      const res = await request(app)
        .put("/api/accounts/acc-1")
        .set("Cookie", getAuthCookie())
        .send({ name: "Updated" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Updated");
    });

    it("should reject without auth", async () => {
      const res = await request(app)
        .put("/api/accounts/acc-1")
        .send({ name: "Updated" });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/accounts/:id", () => {
    it("should soft delete account", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(mockAccount);
      mockPrisma.account.update.mockResolvedValue({
        ...mockAccount,
        isArchived: true,
        deletedAt: new Date(),
      });

      const res = await request(app)
        .delete("/api/accounts/acc-1")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(200);
      expect(res.body.data.deleted).toBe(true);
    });

    it("should return 404 if not found", async () => {
      mockPrisma.account.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .delete("/api/accounts/non-existent")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(404);
    });
  });
});