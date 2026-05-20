import express from "express";
import { editExtensionFiles } from "../services/editService.js";
import { premiumFeatureGuard } from "../middleware/subscriptionMiddleware.js";
import { securityAuditMiddleware } from "../middleware/securityAuditMiddleware.js";
import { validateExtensionFiles } from "../services/validateService.js";
import { writeExtensionFiles } from "../services/fileService.js";
import { zipExtensionFolder } from "../services/zipService.js";

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
    const editedFiles = res.locals.editedFiles;
    
    // Validate, package & zip the newly edited files to get updated ZIP
    validateExtensionFiles(editedFiles);
    const folderPath = await writeExtensionFiles(editedFiles);
    const zipPath = await zipExtensionFolder(folderPath);
    const normalizedZipPath = zipPath.replace(/\\/g, "/");

    res.json({
      success: true,
      validationPassed: true,
      message: "Validation Passed: Extension files edited successfully",
      files: editedFiles,
      downloadUrl: `http://localhost:5000/${normalizedZipPath}`
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

async function saveManualEdit(req, res) {
  try {
    const { files } = req.body;
    if (!files || typeof files !== "object" || Object.keys(files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Extension files are required for saving"
      });
    }

    validateExtensionFiles(files);
    
    const folderPath = await writeExtensionFiles(files);
    const zipPath = await zipExtensionFolder(folderPath);
    const normalizedZipPath = zipPath.replace(/\\/g, "/");

    res.json({
      success: true,
      validationPassed: true,
      message: "Extension files saved successfully",
      files,
      downloadUrl: `http://localhost:5000/${normalizedZipPath}`
    });
  } catch (error) {
    console.error("Save Manual Edit Error:", error);
    res.status(500).json({
      success: false,
      validationPassed: false,
      message: error.message || "Failed to save manual edits"
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

router.post(
  "/save",
  securityAuditMiddleware,
  saveManualEdit
);

export default router;
