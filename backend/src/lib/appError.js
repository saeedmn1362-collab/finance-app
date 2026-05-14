class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);

    this.statusCode = statusCode;
    this.status = this.#getStatus(statusCode);
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  #getStatus(statusCode) {
    return String(statusCode).startsWith("4") ? "fail" : "error";
  }
}

module.exports = AppError;