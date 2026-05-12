const categoryService = require("../services/categoryService");


// =========================
// CREATE CATEGORY
// =========================
exports.createCategory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const category = await categoryService.createCategory(userId, req.body);

    res.status(201).json({
      message: "Category created",
      data: category,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};


// =========================
// GET ALL (FLAT LIST)
// =========================
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;

    const categories = await categoryService.getCategories(userId, req.query);

    res.json({
      message: "Categories loaded",
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// =========================
// 🌳 GET TREE (FOR UI)
// =========================
const buildTree = (categories, parentId = null) => {
  return categories
    .filter((c) => c.parentId === parentId)
    .map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      color: c.color,
      icon: c.icon,
      parentId: c.parentId,
      isArchived: c.isArchived,
      children: buildTree(categories, c.id),
    }));
};

exports.getCategoryTree = async (req, res) => {
  try {
    const userId = req.user.userId;

    const categories = await categoryService.getCategories(userId, req.query);

    const tree = buildTree(categories);

    res.json({
      message: "Category tree loaded",
      data: tree,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// =========================
// UPDATE CATEGORY
// =========================
exports.updateCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categoryId = req.params.id;

    const updated = await categoryService.updateCategory(
      userId,
      categoryId,
      req.body
    );

    res.json({
      message: "Category updated",
      data: updated,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};


// =========================
// DELETE CATEGORY
// =========================
exports.deleteCategory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categoryId = req.params.id;

    const result = await categoryService.deleteCategory(userId, categoryId);

    res.json({
      message: "Category deleted",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};