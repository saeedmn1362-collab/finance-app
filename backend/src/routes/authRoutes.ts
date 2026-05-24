import { Router } from "express";
import {
  register,
  login,
  me,
  logout,
  logoutAll,
  refresh,
} from "../modules/auth/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/me", authMiddleware, me);
router.post("/logout", logout);
router.post("/logout-all", authMiddleware, logoutAll);

export default router;