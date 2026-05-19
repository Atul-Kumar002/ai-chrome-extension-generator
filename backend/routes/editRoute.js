import express from "express";
import { editExtensionFiles } from "../services/editService.js";
import { premiumFeatureGuard } from "../middleware/subscriptionMiddleware.js";
import { securityAuditMiddleware } from "../middleware/securityAuditMiddleware.js";

const router = express.Router();

async function performEdit(req, res, next) {
  try {
    const { files, targetFile, editRequest, originalPrompt } = req.body;

    if (!files || typeof files !== "object" || Object.keys(files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Current extension files are required"
      });
    }

    if (!editRequest || !editRequest.trim()) {
      return res.status(400).json({
        success: false,
        message: "Edit request is required"
      });
    }

    const editedFiles = await editExtensionFiles(
      files,
      editRequest,
      targetFile,
      originalPrompt || ""
    );

    res.locals.editedFiles = editedFiles;
    next();
  } catch (error) {
    console.error("Edit Route Error:", error);
    next(error);
  }
}

async function returnEditedExtension(req, res) {
  try {
    const sanitizedFiles = res.locals.sanitizedFiles || res.locals.editedFiles;

    res.json({
      success: true,
      validationPassed: true,
      message: "Validation Passed: Extension files edited successfully",
      files: sanitizedFiles
    });
  } catch (error) {
    console.error("Edit Response Error:", error);
    res.status(500).json({
      success: false,
      validationPassed: false,
      message: error.message || "AI modification failed",
      fallbackFiles: req.body.files
    });
  }
}

router.post(
  "/",
  premiumFeatureGuard,
  performEdit,
  securityAuditMiddleware,
  returnEditedExtension
);

export default router;
