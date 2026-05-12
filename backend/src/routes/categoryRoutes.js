const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const categoryController = require("../controllers/categoryController");


// =========================
// CREATE CATEGORY
// =========================
router.post("/", authMiddleware, categoryController.createCategory);


// =========================
// GET ALL CATEGORIES (FLAT)
// =========================
router.get("/", authMiddleware, categoryController.getCategories);


// =========================
// 🌳 GET CATEGORY TREE (برای UI)
// =========================
router.get("/tree", authMiddleware, categoryController.getCategoryTree);


// =========================
// UPDATE CATEGORY
// =========================
router.put("/:id", authMiddleware, categoryController.updateCategory);


// =========================
// DELETE CATEGORY
// =========================
router.delete("/:id", authMiddleware, categoryController.deleteCategory);


module.exports = router;