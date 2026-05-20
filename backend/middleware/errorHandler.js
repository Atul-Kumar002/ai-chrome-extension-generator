// backend/middleware/errorHandler.js
import { logger } from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error("Unhandled server error", {
    path: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: err.stack,
  });

  const status = err.status || 500;
  const response = {
    success: false,
    message: err.userMessage || "Internal server error. Please try again later.",
  };

  if (process.env.NODE_ENV !== "production") {
    response.details = err.message;
  }

  res.status(status).json(response);
}
