import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getSummary } from "../modules/dashboard/dashboard.controller";

const router = Router();

router.use(authMiddleware);

router.get("/summary", getSummary);

export default router;