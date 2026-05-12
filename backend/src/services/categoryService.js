const prisma = require("../prisma/client");


// =========================
// 🔒 Cycle Detection
// =========================
const checkCycle = async (userId, parentId, childId) => {
  let currentParentId = parentId;

  while (currentParentId) {
    if (currentParentId === childId) {
      throw new Error("Category hierarchy cycle detected");
    }

    const parent = await prisma.category.findFirst({
      where: {
        id: currentParentId,
        userId,
      },
      select: {
        parentId: true,
      },
    });

    currentParentId = parent?.parentId || null;
  }
};


// =========================
// CREATE
// =========================
const createCategory = async (userId, data) => {
  const { name, type, parentId, color, icon } = data;

  const exists = await prisma.category.findFirst({
    where: { userId, name, type },
  });

  if (exists) {
    throw new Error("Category already exists");
  }

  if (parentId) {
    const parent = await prisma.category.findFirst({
      where: { id: parentId, userId },
    });

    if (!parent) {
      throw new Error("Invalid parent category");
    }
  }

  return prisma.category.create({
    data: {
      name,
      type,
      parentId: parentId || null,
      color: color || null,
      icon: icon || null,
      userId,
    },
  });
};


// =========================
// GET LIST
// =========================
const getCategories = async (userId, filters = {}) => {
  return prisma.category.findMany({
    where: {
      userId,
      ...(filters.type && { type: filters.type }),
      ...(filters.isArchived !== undefined && {
        isArchived: filters.isArchived,
      }),
    },
    orderBy: { createdAt: "desc" },
  });
};


// =========================
// UPDATE
// =========================
const updateCategory = async (userId, categoryId, data) => {
  const { name, type, parentId, color, icon, isArchived } = data;

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (parentId && parentId === categoryId) {
    throw new Error("Category cannot be parent of itself");
  }

  if (parentId) {
    const parent = await prisma.category.findFirst({
      where: { id: parentId, userId },
    });

    if (!parent) {
      throw new Error("Invalid parent category");
    }

    await checkCycle(userId, parentId, categoryId);
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(name !== undefined && { name }),
      ...(type !== undefined && { type }),
      ...(parentId !== undefined && { parentId }),
      ...(color !== undefined && { color }),
      ...(icon !== undefined && { icon }),
      ...(isArchived !== undefined && { isArchived }),
    },
  });
};


// =========================
// DELETE
// =========================
const deleteCategory = async (userId, categoryId) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const deleted = await prisma.category.delete({
    where: { id: categoryId },
  });

  return {
    deleted: true,
    category: deleted,
  };
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};