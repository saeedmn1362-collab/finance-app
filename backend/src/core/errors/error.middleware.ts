import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let code = "INTERNAL_ERROR";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code || "APP_ERROR";
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
    },
  });
};
