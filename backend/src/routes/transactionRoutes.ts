import { Router } from "express";

import {
  createTransaction,
  createTransfer,
  getTransactions,
  getBalance,
  deleteTransaction,
} from "../modules/transaction/transaction.controller";

import { authMiddleware } from "../middleware/authMiddleware";

import { validate } from "../core/validation/validate";

import {
  createTransactionSchema,
  transferTransactionSchema,
  getTransactionsSchema,
} from "../modules/transaction/schemas/transaction.schema";

const router = Router();

/**
 * =========================
 * AUTH GUARD
 * =========================
 */
router.use(authMiddleware);

/**
 * =========================
 * CREATE TRANSACTION
 * =========================
 */
router.post(
  "/",
  validate(createTransactionSchema),
  createTransaction
);

/**
 * =========================
 * TRANSFER
 * =========================
 */
router.post(
  "/transfer",
  validate(transferTransactionSchema),
  createTransfer
);

/**
 * =========================
 * GET TRANSACTIONS
 * =========================
 */
router.get(
  "/",
  validate(getTransactionsSchema),
  getTransactions
);

/**
 * =========================
 * GET BALANCE
 * =========================
 */
router.get(
  "/balance/:accountId",
  getBalance
);

/**
 * =========================
 * DELETE TRANSACTION
 * =========================
 */
router.delete(
  "/:id",
  deleteTransaction
);

export default router;
