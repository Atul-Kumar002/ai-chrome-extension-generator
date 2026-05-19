import express from "express";
import { editExtensionFiles } from "../services/editService.js";

const router = express.Router();

router.post("/", async (req, res) => {
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

    res.json({
      success: true,
      message: "Extension files edited successfully",
      files: editedFiles
    });
  } catch (error) {
    console.error("Edit Route Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "AI modification failed"
    });
  }
});

export default router;
