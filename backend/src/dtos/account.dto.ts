import { z } from "zod";

export const createAccountDto = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  initialBalance: z.number().optional(),
});

export const updateAccountDto = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  initialBalance: z.number().optional(),
});
