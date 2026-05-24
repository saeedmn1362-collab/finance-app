import pino from "pino";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

export const logger = pino({
  level: isProd ? "info" : "debug",

  base: {
    service: "finance-api",
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  transport: isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },

  formatters: {
    level(label) {
      return { level: label };
    },
  },
});
