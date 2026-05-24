import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

export const requestLogger = (
  req: Request & { requestId?: string; user?: { userId: string } },
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const logPayload = {
      msg: "HTTP_REQUEST",
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      requestId: req.requestId ?? "unknown",
      userId: req.user?.userId ?? null,
      duration,
      success: res.statusCode < 400,
    };

    if (res.statusCode >= 500) logger.error(logPayload);
    else if (res.statusCode >= 400) logger.warn(logPayload);
    else logger.info(logPayload);
  });

  next();
};
