import request from "supertest";
import app from "../../app/app";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

jest.mock("../../lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn(),
}));

const mockPrisma = prisma as any;

const mockUser = {
  id: "user-1",
  name: "John",
  email: "john@test.com",
  password: "hashed-password",
};

describe("Auth Integration", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("POST /api/auth/register", () => {
    it("should register successfully", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: "user-1",
        name: "John",
        email: "john@test.com",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "John",
        email: "john@test.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("john@test.com");
      expect(res.body.data.password).toBeUndefined();
    });

    it("should reject duplicate email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app).post("/api/auth/register").send({
        name: "John",
        email: "john@test.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("EMAIL_EXISTS");
    });

    it("should reject missing fields", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "john@test.com",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login and set cookie", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (require("bcryptjs").compare as jest.Mock).mockResolvedValue(true);

      const res = await request(app).post("/api/auth/login").send({
        email: "john@test.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe("user-1");
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should reject wrong password", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (require("bcryptjs").compare as jest.Mock).mockResolvedValue(false);

      const res = await request(app).post("/api/auth/login").send({
        email: "john@test.com",
        password: "wrong",
      });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
    });

    it("should reject unknown email", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post("/api/auth/login").send({
        email: "nobody@test.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should reject without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should reject invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", "token=invalid-token");

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe("AUTH_INVALID_TOKEN");
    });

    it("should return user with valid token", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (require("bcryptjs").compare as jest.Mock).mockResolvedValue(true);

      const loginRes = await request(app).post("/api/auth/login").send({
        email: "john@test.com",
        password: "password123",
      });

      const cookie = loginRes.headers["set-cookie"][0];

      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        name: "John",
        email: "john@test.com",
      });

      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("user-1");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should clear cookie", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.status).toBe(200);
      expect(res.body.data.loggedOut).toBe(true);
    });
  });

  describe("404 handler", () => {
    it("should return 404 for unknown routes", async () => {
      const res = await request(app).get("/api/unknown-route");

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });
});