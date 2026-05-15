import express from "express";
import { generateExtensionCode } from "../services/aiService.js";
import { editExtensionFile } from "../services/editService.js";
import { validateExtensionFiles } from "../services/validateService.js";
import { writeExtensionFiles } from "../services/fileService.js";
import { zipExtensionFolder } from "../services/zipService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate prompt
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required"
      });
    }

    // Generate extension files using AI
    const generatedFiles = await generateExtensionCode(prompt);

    // Validate generated files
    validateExtensionFiles(generatedFiles);

    // Write files to temp folder
    const folderPath = await writeExtensionFiles(generatedFiles);

    // Create ZIP file
    const zipPath = await zipExtensionFolder(folderPath);

    // Convert Windows backslashes to forward slashes
    const normalizedZipPath = zipPath.replace(/\\/g, "/");

    // Send response
    res.json({
      success: true,
      message: "Extension generated successfully",
      files: generatedFiles,
      downloadUrl: `http://localhost:5000/${normalizedZipPath}`
    });

  } catch (error) {

    console.error("Generation Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });

  }
});

// Edit file endpoint
router.post("/edit", async (req, res) => {
  try {
    const { filename, currentContent, editRequest, originalPrompt } = req.body;

    // Validate required fields
    if (!filename || !currentContent || !editRequest) {
      return res.status(400).json({
        success: false,
        message: "filename, currentContent, and editRequest are required"
      });
    }

    // Edit the file using AI
    const editedContent = await editExtensionFile(
      filename,
      currentContent,
      editRequest,
      originalPrompt || ""
    );

    // Send response
    res.json({
      success: true,
      message: "File edited successfully",
      editedContent: editedContent
    });

  } catch (error) {

    console.error("Edit Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Edit operation failed"
    });

  }
});

export default router;