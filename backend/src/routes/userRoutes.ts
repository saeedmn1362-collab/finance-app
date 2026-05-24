import { Router } from "express";

import {
  register,
  login,
  me,
} from "../modules/auth/auth.controller";

import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, me);

export default router;
