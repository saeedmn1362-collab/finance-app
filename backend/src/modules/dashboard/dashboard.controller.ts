import { Response } from "express";
import { asyncHandler } from "../../core/http/asyncHandler";
import { successResponse } from "../../core/http/response";
import { AppError } from "../../core/errors/AppError";
import { AuthRequest } from "../../core/http/types";
import { dashboardService } from "./dashboard.service";

export const getSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");

  const result = await dashboardService.getSummary(userId);
  return res.json(successResponse(result));
});