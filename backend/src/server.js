const express = require("express");
const cors = require("cors");
require("dotenv").config();

// =========================
// 📦 Routes
// =========================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportsRoutes = require("./routes/reportsRoutes"); // ✅ REPORTS

// =========================
// ⚙️ Middleware
// =========================
const errorHandler = require("./middleware/errorHandler");

const app = express();

// =========================
// 🌐 CORS
// =========================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// =========================
// 📦 BODY PARSER
// =========================
app.use(express.json());

// =========================
// 🔐 API ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes); // ✅ REPORTS ACTIVE

// =========================
// ❤️ HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Finance API is running 🚀",
    version: "1.0.0",
  });
});

// =========================
// ❌ 404
// =========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =========================
// 🚨 ERROR HANDLER
// =========================
app.use(errorHandler);

// =========================
// 🚀 START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;