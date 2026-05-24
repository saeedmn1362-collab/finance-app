import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // SUPPORT BOTH COOKIE NAMES
    const token =
      req.cookies?.accessToken || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTH_NO_TOKEN",
          message: "Authentication token missing",
        },
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    req.user = {
      userId: decoded.userId || decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTH_INVALID_TOKEN",
        message: "Invalid or expired token",
      },
    });
  }
};