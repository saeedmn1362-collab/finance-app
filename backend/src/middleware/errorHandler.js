const errorHandler = (err, req, res, next) => {
  // ✅ AppError (Operational)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // ✅ Prisma Errors
  if (err.code === "P2002") {
    return res.status(400).json({
      message: "این مقدار قبلاً استفاده شده است",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      message: "رکورد پیدا نشد",
    });
  }

  // ✅ Unknown Errors
  console.error("UNEXPECTED ERROR:", err);
  return res.status(500).json({
    message: "خطای داخلی سرور",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = errorHandler;