import "dotenv/config";
import app from "./app/app";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[BOOT] Finance API started on port ${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`[SHUTDOWN] ${signal} received. Closing server...`);
  server.close(() => {
    console.log("[SHUTDOWN] Server closed successfully");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("[SHUTDOWN] Forced exit");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
