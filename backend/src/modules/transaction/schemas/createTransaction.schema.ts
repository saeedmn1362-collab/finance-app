import { z } from "zod";

export const createTransactionSchema = z.object({
  body: z.object({
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.number().positive(),
    accountId: z.string().min(1),
    date: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const transferSchema = z.object({
  body: z.object({
    fromAccountId: z.string().min(1),
    toAccountId: z.string().min(1),
    amount: z.number().positive(),
    date: z.string().optional(),
    description: z.string().optional(),
  }),
});
