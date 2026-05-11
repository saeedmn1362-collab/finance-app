const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Custom AppError
  if (err.name === "AppError") {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "خطای validation", error: err.message });
  }

  // Prisma errors
  if (err.code === "P2002") {
    return res.status(400).json({ message: "این مقدار قبلاً ثبت شده" });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ message: "رکورد یافت نشد" });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "توکن نامعتبر است" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "توکن منقضی شده" });
  }

  res.status(500).json({ message: "خطای سرور", error: err.message });
};

module.exports = errorHandler;