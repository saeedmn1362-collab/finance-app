import { Response } from "express";
import * as authService from "./auth.service";
import { asyncHandler } from "../../core/http/asyncHandler";
import { successResponse } from "../../core/http/response";
import { AuthRequest } from "../../core/http/types";
import { AppError } from "../../core/errors/AppError";

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.register(req.body);
  return res.status(201).json(successResponse(result));
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.login(req.body);

  res.cookie("token", result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.json(successResponse(result.user));
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const result = await authService.me(userId);

  return res.json(successResponse(result));
});

export const logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
  res.clearCookie("token");
  return res.json(successResponse({ loggedOut: true }));
});
