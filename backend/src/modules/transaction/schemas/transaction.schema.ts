import { z } from "zod";

/**
 * =========================
 * CREATE TRANSACTION
 * =========================
 */
export const createTransactionSchema = z.object({
  body: z.object({
    type: z.enum(["INCOME", "EXPENSE"]),

    amount: z.coerce
      .number()
      .positive("Amount must be greater than zero"),

    accountId: z.string().min(1, "Account ID is required"),

    date: z.string().datetime().optional(),

    description: z.string().max(500).optional(),
  }),
});

/**
 * =========================
 * TRANSFER
 * =========================
 */
export const transferTransactionSchema = z.object({
  body: z.object({
    fromAccountId: z.string().min(1),

    toAccountId: z.string().min(1),

    amount: z.coerce
      .number()
      .positive("Amount must be greater than zero"),

    date: z.string().datetime().optional(),

    description: z.string().max(500).optional(),
  }),
});

/**
 * =========================
 * GET TRANSACTIONS
 * =========================
 */
export const getTransactionsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),

    limit: z.coerce.number().int().positive().max(100).optional(),

    type: z.enum(["INCOME", "EXPENSE"]).optional(),

    accountId: z.string().optional(),

    from: z.string().optional(),

    to: z.string().optional(),
  }),
});
