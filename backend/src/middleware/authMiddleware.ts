import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../core/errors/AppError";
import { AuthRequest } from "../core/http/types";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next(new AppError("Unauthorized", 401, "AUTH_NO_TOKEN"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    (req as AuthRequest).user = { userId: decoded.userId };

    next();
  } catch {
    return next(new AppError("Invalid or expired token", 401, "AUTH_INVALID_TOKEN"));
  }
};