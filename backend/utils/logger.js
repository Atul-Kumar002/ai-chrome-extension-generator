// backend/utils/logger.js
// Minimal production logging utility with structured output.
const isProduction = process.env.NODE_ENV === "production";

function timestamp() {
  return new Date().toISOString();
}

function format(level, message, meta = {}) {
  const payload = {
    timestamp: timestamp(),
    level,
    message,
    environment: process.env.NODE_ENV || "development",
    ...meta,
  };
  return JSON.stringify(payload);
}

export const logger = {
  info: (message, meta) => {
    if (isProduction) {
      console.log(format("info", message, meta));
    } else {
      console.info(`[INFO] ${message}`, meta || "");
    }
  },
  warn: (message, meta) => {
    if (isProduction) {
      console.warn(format("warn", message, meta));
    } else {
      console.warn(`[WARN] ${message}`, meta || "");
    }
  },
  error: (message, meta) => {
    if (isProduction) {
      console.error(format("error", message, meta));
    } else {
      console.error(`[ERROR] ${message}`, meta || "");
    }
  },
  debug: (message, meta) => {
    if (!isProduction) {
      console.debug(`[DEBUG] ${message}`, meta || "");
    }
  },
};
