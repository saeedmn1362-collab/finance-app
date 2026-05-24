import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export const requestContext = (
  req: Request & { requestId?: string; startTime?: number },
  res: Response,
  next: NextFunction
) => {
  const requestId = randomUUID();

  req.requestId = requestId;
  req.startTime = Date.now();

  res.setHeader("x-request-id", requestId);

  next();
};
