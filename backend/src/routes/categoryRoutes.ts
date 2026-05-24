import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createCategory,
  getCategories,
  getCategoryTree,
  updateCategory,
  deleteCategory,
} from "../modules/category/category.controller";
import { validate } from "../core/validation/validate";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createCategorySchema), createCategory);
router.get("/", getCategories);
router.get("/tree", getCategoryTree);
router.put("/:id", validate(updateCategorySchema), updateCategory);
router.delete("/:id", deleteCategory);

export default router;