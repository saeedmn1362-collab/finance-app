import { Response } from "express";
import { asyncHandler } from "../../core/http/asyncHandler";
import { successResponse } from "../../core/http/response";
import { AppError } from "../../core/errors/AppError";
import { AuthRequest } from "../../core/http/types";
import * as categoryService from "./category.service";

const getUserId = (req: AuthRequest) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  return userId;
};

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await categoryService.createCategory(
    getUserId(req),
    req.body
  );

  return res.status(201).json(successResponse(result));
});

export const getCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await categoryService.getCategories(getUserId(req));
  return res.json(successResponse(result));
});

export const getCategoryTree = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await categoryService.getCategoryTree(getUserId(req));
  return res.json(successResponse(result));
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await categoryService.updateCategory(
    getUserId(req),
    String(req.params.id),
    req.body
  );

  return res.json(successResponse(result));
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await categoryService.deleteCategory(
    getUserId(req),
    String(req.params.id)
  );

  return res.json(successResponse(result));
});
