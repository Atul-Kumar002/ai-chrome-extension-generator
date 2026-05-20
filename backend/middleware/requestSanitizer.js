// backend/middleware/requestSanitizer.js
// Sanitizes request data to reduce attack surface and protect backend input.

function cleanValue(value) {
  if (typeof value === "string") {
    return value
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/\beval\s*\(/gi, "")
      .replace(/\bFunction\s*\(/g, "")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(cleanValue);
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cleanValue(entry)])
    );
  }

  return value;
}

export function sanitizeRequestBody(req, res, next) {
  req.body = cleanValue(req.body);
  req.query = cleanValue(req.query);
  req.params = cleanValue(req.params);
  next();
}
