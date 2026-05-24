import { Response } from "express";
import { accountService } from "./account.service";
import { AppError } from "../../core/errors/AppError";
import { successResponse } from "../../core/http/response";
import { asyncHandler } from "../../core/http/asyncHandler";
import { AuthRequest } from "../../core/http/types";

const getUserId = (req: AuthRequest): string => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  return userId;
};

const getParamId = (req: AuthRequest): string => {
  const id = req.params.id;
  if (!id) throw new AppError("Missing id", 400, "BAD_REQUEST");
  return Array.isArray(id) ? id[0] : id;
};

export const createAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await accountService.createAccount(getUserId(req), req.body);
  return res.status(201).json(successResponse(result));
});

export const getAccounts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await accountService.getAccounts(getUserId(req));
  return res.json(successResponse(result));
});

export const updateAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await accountService.updateAccount(
    getUserId(req),
    getParamId(req),
    req.body
  );
  return res.json(successResponse(result));
});

export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await accountService.deleteAccount(
    getUserId(req),
    getParamId(req)
  );
  return res.json(successResponse(result));
});