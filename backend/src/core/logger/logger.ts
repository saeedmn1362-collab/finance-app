import pino from "pino";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

export const logger = pino({
  level: isTest ? "silent" : isProd ? "info" : "debug",

  base: {
    service: "finance-api",
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  transport:
    isProd || isTest
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
    bindings(bindings) {
      return {
        ...bindings,
        node: process.version,
      };
    },
  },
});