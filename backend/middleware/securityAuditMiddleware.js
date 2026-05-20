import { auditExtensionFiles } from "../services/securityService.js";

// Middleware to audit extension files before packaging or returning them.
// It supports both AI-generated files and edited extension outputs.
export async function securityAuditMiddleware(req, res, next) {
  const files = res.locals.generatedFiles || res.locals.editedFiles || req.body.files;

  if (!files || typeof files !== "object") {
    return next();
  }

  const report = auditExtensionFiles(files);

  if (!report.passed) {
    console.warn("[securityAuditMiddleware] Unsafe extension detected", report);
    return res.status(400).json({
      success: false,
      validationPassed: false,
      message: "Unsafe extension code detected.",
      securityReport: report,
    });
  }

  next();
}
