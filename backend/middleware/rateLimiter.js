// backend/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please wait a moment and try again.",
  },
});
