import { Response } from "express";
import { asyncHandler } from "../../core/http/asyncHandler";
import { successResponse } from "../../core/http/response";
import userService from "./user.service";
import { AuthRequest } from "../../core/http/types";

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await userService.getProfile(req.user.userId);
  res.json(successResponse(result));
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await userService.updateProfile(req.user.userId, req.body);
  res.json(successResponse(result));
});
