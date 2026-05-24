import { AuthUser } from "../core/http/types";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      requestId?: string;
      startTime?: number;
    }
  }
}

export {};
