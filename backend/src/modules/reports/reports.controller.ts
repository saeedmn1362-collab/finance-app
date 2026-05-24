import { Response } from "express";
import { asyncHandler } from "../../core/http/asyncHandler";
import { successResponse } from "../../core/http/response";
import reportsService from "./reports.service";
import { AuthRequest } from "../../core/http/types";

export const getMonthlyReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await reportsService.getMonthlyReport(req.user!.userId);

  res.json(successResponse(result));
});

export const getYearlyReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await reportsService.getYearlyReport(req.user!.userId);

  res.json(successResponse(result));
});
