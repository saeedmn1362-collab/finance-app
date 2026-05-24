import { ZodError } from "zod";

export const getErrorMessage = (err: unknown): string => {
  if (err instanceof ZodError) {
    return err.errors[0]?.message || "Validation error";
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Unknown error";
};
