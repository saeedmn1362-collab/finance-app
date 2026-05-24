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
  const result = await authService.login(req.body, {
    ipAddress: req.ip,
    deviceInfo: req.headers["user-agent"],
  });

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh",
  });

  return res.json(successResponse(result.user));
});

export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new AppError("No refresh token", 401, "NO_REFRESH_TOKEN");
  }

  const result = await authService.refresh(refreshToken);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh",
  });

  return res.json(successResponse({ refreshed: true }));
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

  return res.json(successResponse({ loggedOut: true }));
});

export const logoutAll = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");

  await authService.logoutAll(userId);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

  return res.json(successResponse({ loggedOut: true }));
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");

  const result = await authService.me(userId);
  return res.json(successResponse(result));
});