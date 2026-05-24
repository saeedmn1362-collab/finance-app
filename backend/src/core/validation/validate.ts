import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((e) => e.message)
          .join(", ");

        return next(
          new AppError(message, 400, "VALIDATION_ERROR")
        );
      }

      next(error);
    }
  };
