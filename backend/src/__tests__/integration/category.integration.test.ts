import request from "supertest";
import app from "../../app/app";
import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";

jest.mock("../../lib/prisma", () => ({
  category: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
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

const mockCategory = {
  id: "cat-1",
  userId: "user-1",
  name: "Food",
  type: "EXPENSE",
  parentId: null,
  color: null,
  icon: null,
  isArchived: false,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Category Integration", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("POST /api/categories", () => {
    it("should create category", async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);
      mockPrisma.category.create.mockResolvedValue(mockCategory);

      const res = await request(app)
        .post("/api/categories")
        .set("Cookie", getAuthCookie())
        .send({ name: "Food", type: "EXPENSE" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe("cat-1");
    });

    it("should reject without auth", async () => {
      const res = await request(app)
        .post("/api/categories")
        .send({ name: "Food", type: "EXPENSE" });

      expect(res.status).toBe(401);
    });

    it("should reject invalid type", async () => {
      const res = await request(app)
        .post("/api/categories")
        .set("Cookie", getAuthCookie())
        .send({ name: "Food", type: "INVALID" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject missing name", async () => {
      const res = await request(app)
        .post("/api/categories")
        .set("Cookie", getAuthCookie())
        .send({ type: "EXPENSE" });

      expect(res.status).toBe(400);
    });

    it("should reject duplicate category", async () => {
      mockPrisma.category.findFirst.mockResolvedValue(mockCategory);

      const res = await request(app)
        .post("/api/categories")
        .set("Cookie", getAuthCookie())
        .send({ name: "Food", type: "EXPENSE" });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("CATEGORY_EXISTS");
    });
  });

  describe("GET /api/categories", () => {
    it("should return categories", async () => {
      mockPrisma.category.findMany.mockResolvedValue([mockCategory]);

      const res = await request(app)
        .get("/api/categories")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should reject without auth", async () => {
      const res = await request(app).get("/api/categories");
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/categories/tree", () => {
    it("should return category tree", async () => {
      const child = { ...mockCategory, id: "cat-2", parentId: "cat-1" };
      mockPrisma.category.findMany.mockResolvedValue([mockCategory, child]);

      const res = await request(app)
        .get("/api/categories/tree")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].children).toHaveLength(1);
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("should update category", async () => {
      mockPrisma.category.findFirst
        .mockResolvedValueOnce(mockCategory)
        .mockResolvedValueOnce(null);
      mockPrisma.category.update.mockResolvedValue({
        ...mockCategory,
        name: "Updated",
      });

      const res = await request(app)
        .put("/api/categories/cat-1")
        .set("Cookie", getAuthCookie())
        .send({ name: "Updated" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Updated");
    });

    it("should reject without auth", async () => {
      const res = await request(app)
        .put("/api/categories/cat-1")
        .send({ name: "Updated" });

      expect(res.status).toBe(401);
    });

    it("should return 404 if not found", async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .put("/api/categories/non-existent")
        .set("Cookie", getAuthCookie())
        .send({ name: "Updated" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("should soft delete category", async () => {
      mockPrisma.category.findFirst.mockResolvedValue(mockCategory);
      mockPrisma.category.update.mockResolvedValue({
        ...mockCategory,
        isArchived: true,
        deletedAt: new Date(),
      });

      const res = await request(app)
        .delete("/api/categories/cat-1")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(200);
      expect(res.body.data.deleted).toBe(true);
    });

    it("should reject without auth", async () => {
      const res = await request(app).delete("/api/categories/cat-1");
      expect(res.status).toBe(401);
    });

    it("should return 404 if not found", async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);

      const res = await request(app)
        .delete("/api/categories/non-existent")
        .set("Cookie", getAuthCookie());

      expect(res.status).toBe(404);
    });
  });
});