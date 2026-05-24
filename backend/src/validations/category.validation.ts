import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    type: z.enum(["INCOME", "EXPENSE"]),
    parentId: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    parentId: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
  }),
});