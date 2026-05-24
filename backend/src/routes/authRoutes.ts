import { Router } from "express";
import {
  register,
  login,
  me,
  logout,
} from "../modules/auth/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", logout);

export default router;