import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const requireUserId = (req: AuthRequest): string => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
};
