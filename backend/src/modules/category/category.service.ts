import prisma from "../../lib/prisma";
import { AppError } from "../../core/errors/AppError";
import { CategoryType } from "@prisma/client";
import { buildCategoryTree } from "./utils/buildCategoryTree";

/**
 * =========================
 * DTOs
 * =========================
 */
export interface CreateCategoryDTO {
  name: string;
  type: CategoryType;
  parentId?: string | null;
  color?: string | null;
  icon?: string | null;
}

export interface UpdateCategoryDTO {
  name?: string;
  type?: CategoryType;
  parentId?: string | null;
  color?: string | null;
  icon?: string | null;
}

/**
 * =========================
 * Helpers
 * =========================
 */
const ensureParentExists = async (
  userId: string,
  parentId: string,
  expectedType?: CategoryType
) => {
  const parent = await prisma.category.findFirst({
    where: {
      id: parentId,
      userId,
      isArchived: false,
      deletedAt: null,
    },
  });

  if (!parent) {
    throw new AppError(
      "Parent category not found",
      404,
      "PARENT_CATEGORY_NOT_FOUND"
    );
  }

  if (expectedType && parent.type !== expectedType) {
    throw new AppError(
      "Parent category type mismatch",
      400,
      "CATEGORY_TYPE_MISMATCH"
    );
  }

  return parent;
};

const ensureNoCycle = async (
  userId: string,
  parentId: string,
  currentId: string
) => {
  let cursor: string | null = parentId;

  while (cursor) {
    if (cursor === currentId) {
      throw new AppError(
        "Category cycle detected",
        400,
        "CATEGORY_CYCLE"
      );
    }

    const parent: { parentId: string | null } | null =
      await prisma.category.findFirst({
        where: {
          id: cursor,
          userId,
          isArchived: false,
          deletedAt: null,
        },
        select: { parentId: true },
      });

    cursor = parent?.parentId ?? null;
  }
};

/**
 * =========================
 * CREATE
 * =========================
 */
export const createCategory = async (
  userId: string,
  data: CreateCategoryDTO
) => {
  const exists = await prisma.category.findFirst({
    where: {
      userId,
      name: data.name,
      type: data.type,
      deletedAt: null,
    },
  });

  if (exists) {
    throw new AppError(
      "Category already exists",
      400,
      "CATEGORY_EXISTS"
    );
  }

  if (data.parentId) {
    await ensureParentExists(userId, data.parentId, data.type);
  }

  return prisma.category.create({
    data: {
      userId,
      name: data.name,
      type: data.type,
      parentId: data.parentId ?? null,
      color: data.color ?? null,
      icon: data.icon ?? null,
    },
  });
};

/**
 * =========================
 * LIST
 * =========================
 */
export const getCategories = async (
  userId: string,
  filters?: {
    type?: CategoryType;
    includeArchived?: boolean;
  }
) => {
  return prisma.category.findMany({
    where: {
      userId,
      ...(filters?.type ? { type: filters.type } : {}),
      ...(filters?.includeArchived
        ? {}
        : { isArchived: false, deletedAt: null }),
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * =========================
 * TREE
 * =========================
 */
export const getCategoryTree = async (userId: string) => {
  const categories = await prisma.category.findMany({
    where: {
      userId,
      isArchived: false,
      deletedAt: null,
    },
    orderBy: { createdAt: "asc" },
  });

  return buildCategoryTree(categories);
};

/**
 * =========================
 * UPDATE (FIXED FINAL VERSION)
 * =========================
 */
export const updateCategory = async (
  userId: string,
  id: string,
  data: UpdateCategoryDTO
) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      userId,
      isArchived: false,
      deletedAt: null,
    },
  });

  if (!category) {
    throw new AppError(
      "Category not found",
      404,
      "CATEGORY_NOT_FOUND"
    );
  }

  if (data.parentId === id) {
    throw new AppError(
      "Category cannot be its own parent",
      400,
      "INVALID_PARENT_CATEGORY"
    );
  }

  /**
   * ✅ SAFE DUPLICATE CHECK (FINAL FIX)
   */
  const hasNameChange =
    typeof data.name === "string" &&
    data.name.trim().length > 0 &&
    data.name !== category.name;

  if (hasNameChange) {
    const duplicate = await prisma.category.findFirst({
      where: {
        userId,
        name: data.name,
        deletedAt: null,
        id: { not: id },
      },
    });

    if (duplicate) {
      throw new AppError(
        "Category already exists",
        400,
        "CATEGORY_EXISTS"
      );
    }
  }

  if (data.parentId) {
    await ensureParentExists(
      userId,
      data.parentId,
      data.type ?? category.type
    );

    await ensureNoCycle(userId, data.parentId, id);
  }

  return prisma.category.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
      ...(data.parentId !== undefined
        ? { parentId: data.parentId ?? null }
        : {}),
      ...(data.color !== undefined ? { color: data.color } : {}),
      ...(data.icon !== undefined ? { icon: data.icon } : {}),
    },
  });
};

/**
 * =========================
 * DELETE (SOFT)
 * =========================
 */
export const deleteCategory = async (
  userId: string,
  id: string
) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      userId,
      isArchived: false,
      deletedAt: null,
    },
  });

  if (!category) {
    throw new AppError(
      "Category not found",
      404,
      "CATEGORY_NOT_FOUND"
    );
  }

  await prisma.category.update({
    where: { id },
    data: {
      isArchived: true,
      deletedAt: new Date(),
    },
  });

  return { deleted: true };
};