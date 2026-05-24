import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// routes
import authRoutes from "../routes/authRoutes";
import accountRoutes from "../routes/accountRoutes";
import transactionRoutes from "../routes/transactionRoutes";
import categoryRoutes from "../routes/categoryRoutes";
import dashboardRoutes from "../routes/dashboardRoutes";

// middleware
import { requestContext } from "../core/http/requestContext";
import { requestLogger } from "../core/logger/requestLogger";
import { errorMiddleware } from "../core/errors/error.middleware";

const app = express();

/**
 * SECURITY
 */
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

/**
 * RATE LIMIT CONFIG
 */
const isTest = process.env.NODE_ENV === "test";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 10000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later",
    },
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many auth attempts, please try again later",
    },
  },
});

/**
 * CORE
 */
app.use(cookieParser());
app.use(express.json());

/**
 * CONTEXT (must be first)
 */
app.use(requestContext);

/**
 * LOGGER
 */
app.use(requestLogger);

/**
 * GLOBAL RATE LIMIT
 */
app.use(limiter);

/**
 * HEALTH
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * ROUTES
 */
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

/**
 * 404
 */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

/**
 * ERROR HANDLER
 */
app.use(errorMiddleware);

export default app;