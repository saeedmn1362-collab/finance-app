import * as categoryService from "../category.service";
import prisma from "../../../lib/prisma";
import { AppError } from "../../../core/errors/AppError";

jest.mock("../../../lib/prisma", () => ({
  category: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockPrisma = prisma as any;

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

describe("Category Service", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createCategory", () => {
    it("should create category", async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);
      mockPrisma.category.create.mockResolvedValue(mockCategory);

      const result = await categoryService.createCategory("user-1", {
        name: "Food",
        type: "EXPENSE",
      });

      expect(result.id).toBe("cat-1");
    });

    it("should reject duplicate category", async () => {
      mockPrisma.category.findFirst.mockResolvedValue(mockCategory);

      await expect(
        categoryService.createCategory("user-1", {
          name: "Food",
          type: "EXPENSE",
        })
      ).rejects.toThrow(AppError);
    });

    it("should reject if parent not found", async () => {
      mockPrisma.category.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await expect(
        categoryService.createCategory("user-1", {
          name: "Snacks",
          type: "EXPENSE",
          parentId: "non-existent",
        })
      ).rejects.toThrow(AppError);
    });

    it("should reject parent type mismatch", async () => {
      mockPrisma.category.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ ...mockCategory, type: "INCOME" });

      await expect(
        categoryService.createCategory("user-1", {
          name: "Snacks",
          type: "EXPENSE",
          parentId: "cat-1",
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe("getCategories", () => {
    it("should return categories", async () => {
      mockPrisma.category.findMany.mockResolvedValue([mockCategory]);

      const result = await categoryService.getCategories("user-1");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("cat-1");
    });

    it("should filter by type", async () => {
      mockPrisma.category.findMany.mockResolvedValue([mockCategory]);

      const result = await categoryService.getCategories("user-1", {
        type: "EXPENSE",
      });

      expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: "EXPENSE" }),
        })
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("getCategoryTree", () => {
    it("should return tree structure", async () => {
      const child = { ...mockCategory, id: "cat-2", parentId: "cat-1" };
      mockPrisma.category.findMany.mockResolvedValue([mockCategory, child]);

      const result = await categoryService.getCategoryTree("user-1");

      expect(result).toHaveLength(1);
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children[0].id).toBe("cat-2");
    });
  });

  describe("updateCategory", () => {
    it("should update category", async () => {
      mockPrisma.category.findFirst
        .mockResolvedValueOnce(mockCategory)
        .mockResolvedValueOnce(null);

      mockPrisma.category.update.mockResolvedValue({
        ...mockCategory,
        name: "Updated",
      });

      const result = await categoryService.updateCategory(
        "user-1",
        "cat-1",
        { name: "Updated" }
      );

      expect(result.name).toBe("Updated");
    });

    it("should reject if category not found", async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);

      await expect(
        categoryService.updateCategory("user-1", "cat-1", { name: "X" })
      ).rejects.toThrow(AppError);
    });

    it("should reject self as parent", async () => {
      mockPrisma.category.findFirst.mockResolvedValue(mockCategory);

      await expect(
        categoryService.updateCategory("user-1", "cat-1", {
          parentId: "cat-1",
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe("deleteCategory", () => {
    it("should soft delete category", async () => {
      mockPrisma.category.findFirst.mockResolvedValue(mockCategory);
      mockPrisma.category.update.mockResolvedValue({
        ...mockCategory,
        isArchived: true,
        deletedAt: new Date(),
      });

      const result = await categoryService.deleteCategory("user-1", "cat-1");

      expect(result.deleted).toBe(true);
    });

    it("should reject if category not found", async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null);

      await expect(
        categoryService.deleteCategory("user-1", "cat-1")
      ).rejects.toThrow(AppError);
    });
  });
});
describe("updateCategory — cycle detection", () => {
  it("should reject circular reference", async () => {
    mockPrisma.category.findFirst
      // 1) find category by id (exists)
      .mockResolvedValueOnce(mockCategory)
      // 2) duplicate check → no duplicate
      .mockResolvedValueOnce(null)
      // 3) parent category exists
      .mockResolvedValueOnce({ id: "cat-parent", parentId: null })
      // 4) checkCycle → parent of parent is cat-1 → cycle
      .mockResolvedValueOnce({ parentId: "cat-1" });

    await expect(
      categoryService.updateCategory("user-1", "cat-1", {
        parentId: "cat-parent",
      })
    ).rejects.toThrow(AppError);
  });
});
