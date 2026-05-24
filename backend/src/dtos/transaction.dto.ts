import { z } from "zod";

export const createTransactionDto = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive(),
  accountId: z.string(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
});
