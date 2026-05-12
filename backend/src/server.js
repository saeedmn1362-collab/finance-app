const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

/**
 * 🌐 CORS
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

/**
 * 📦 Body Parser
 */
app.use(express.json());

/**
 * 🔐 Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

/**
 * ❤️ Health Check
 */
app.get("/", (req, res) => {
  res.json({ message: "Finance API is running 🚀" });
});

/**
 * ❌ 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/**
 * 🚨 Error Handler (must be last)
 */
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;