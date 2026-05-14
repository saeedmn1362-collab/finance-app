const { PrismaClient } = require("@prisma/client");

// =========================
// 🧠 Prisma Singleton Pattern (Production Safe)
// =========================

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

// جلوگیری از multiple instances در dev (nodemon / hot reload)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;