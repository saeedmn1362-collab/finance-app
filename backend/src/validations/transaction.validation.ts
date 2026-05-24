import { z } from "zod";

/**
 * SAFE AMOUNT PARSER (handles string, number, undefined safely)
 */
const amountSchema = z.preprocess((val) => {
  if (val === undefined || val === null || val === "") {
    return undefined;
  }

  if (typeof val === "string") {
    const parsed = Number(val);
    return isNaN(parsed) ? undefined : parsed;
  }

  return val;
},
z.number({
  required_error: "amount is required",
  invalid_type_error: "amount must be number",
}).positive("amount must be greater than zero"));

/**
 * CREATE TRANSACTION VALIDATION
 */
export const createTransactionSchema = z
  .object({
    type: z.enum([
      "INCOME",
      "EXPENSE",
      "TRANSFER",
      "RECEIVABLE",
      "PAYABLE",
    ]),

    amount: amountSchema,

    accountId: z.string().min(1, "accountId is required"),

    description: z.string().max(500).optional(),
    categoryId: z.string().optional(),
    personId: z.string().optional(),
    date: z.string().optional(),
  })
  .strict();

/**
 * TRANSFER VALIDATION
 */
export const transferSchema = z
  .object({
    fromAccountId: z.string().min(1),
    toAccountId: z.string().min(1),

    amount: amountSchema,

    description: z.string().max(500).optional(),
  })
  .strict();
