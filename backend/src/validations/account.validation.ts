import { z } from "zod";

export const createAccountSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    type: z.enum(["CASH", "BANK", "WALLET"]),
    currency: z.string().optional(),
    initialBalance: z.number().min(0).optional(),
  }),
});

export const updateAccountSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.enum(["CASH", "BANK", "WALLET"]).optional(),
    currency: z.string().optional(),
  }),
});