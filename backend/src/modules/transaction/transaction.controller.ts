import { Response } from "express";
import { asyncHandler } from "../../core/http/asyncHandler";
import { successResponse } from "../../core/http/response";
import { transactionService } from "./transaction.service";
import { TransactionType } from "@prisma/client";
import { AuthRequest } from "../../core/http/types";

const getUserId = (req: AuthRequest) => {
  const userId = req.user?.userId;
  if (!userId) throw new Error("Unauthorized");
  return userId;
};

export const createTransaction = asyncHandler(
  async (req, res: Response) => {
    const result = await transactionService.createTransaction(
      getUserId(req),
      req.body
    );
    return res.status(201).json(successResponse(result));
  }
);

export const createTransfer = asyncHandler(
  async (req, res: Response) => {
    const result = await transactionService.transferTransaction(
      getUserId(req),
      req.body
    );
    return res.status(201).json(successResponse(result));
  }
);

export const getTransactions = asyncHandler(
  async (req, res: Response) => {
    const { page, limit, accountId, from, to } = req.query;

    const result = await transactionService.getTransactions(
      getUserId(req),
      {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        accountId: accountId as string | undefined,
        from: from as string | undefined,
        to: to as string | undefined,
      }
    );

    return res.json(successResponse(result.transactions, result.meta));
  }
);

export const getBalance = asyncHandler(
  async (req, res: Response) => {
    const result = await transactionService.getBalance(
      getUserId(req),
      String(req.params.accountId)
    );
    return res.json(successResponse(result));
  }
);

export const deleteTransaction = asyncHandler(
  async (req, res: Response) => {
    const result = await transactionService.deleteTransaction(
      getUserId(req),
      String(req.params.id)
    );
    return res.json(successResponse(result));
  }
);