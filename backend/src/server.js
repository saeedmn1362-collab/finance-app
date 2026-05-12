```javascript
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
const dashboardRoutes = require("./routes/dashboardRoutes"); // ✅ NEW

// =========================
// ⚙️ Middleware
// =========================
const errorHandler = require("./middleware/errorHandler");

const app = express();

// =========================
// 🌐 CORS CONFIG
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

app.use("/api/dashboard", dashboardRoutes); // ✅ NEW

// =========================
// ❤️ HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Finance API is running 🚀",
    version: "1.0.0",
  });
});

// =========================
// ❌ 404 HANDLER
// =========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =========================
// 🚨 GLOBAL ERROR HANDLER
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
```
