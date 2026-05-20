import express from "express";
import { generateExtensionCode } from "../services/aiService.js";
import { validateExtensionFiles } from "../services/validateService.js";
import { writeExtensionFiles } from "../services/fileService.js";
import { zipExtensionFolder } from "../services/zipService.js";
import { premiumFeatureGuard } from "../middleware/subscriptionMiddleware.js";
import { securityAuditMiddleware } from "../middleware/securityAuditMiddleware.js";

const router = express.Router();

async function createGeneratedExtension(req, res, next) {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required"
      });
    }

    const generatedFiles = await generateExtensionCode(prompt);
    console.log("AI Response:", generatedFiles);
    validateExtensionFiles(generatedFiles);
    res.locals.generatedFiles = generatedFiles;
    next();
  } catch (error) {
    console.error("Generation Error:", error);
    next(error);
  }
}

async function packageGeneratedExtension(req, res) {
  try {
    const generatedFiles = res.locals.generatedFiles;
    const folderPath = await writeExtensionFiles(generatedFiles);
    const zipPath = await zipExtensionFolder(folderPath);
    const normalizedZipPath = zipPath.replace(/\\/g, "/");

    res.json({
      success: true,
      validationPassed: true,
      message: "Validation Passed: Extension generated successfully",
      files: generatedFiles,
      downloadUrl: `http://localhost:5000/${normalizedZipPath}`
    });
  } catch (error) {
    console.error("Packaging Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while packaging the extension"
    });
  }
}

router.post(
  "/",
  premiumFeatureGuard,
  createGeneratedExtension,
  securityAuditMiddleware,
  packageGeneratedExtension
);

export default router;