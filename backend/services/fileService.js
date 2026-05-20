import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger.js";

export async function writeExtensionFiles(files) {
  try {
    const folderName = uuidv4();

  const folderPath = path.join("temp", folderName);

  fs.mkdirSync(folderPath, { recursive: true });

    for (const [filename, content] of Object.entries(files)) {
      const filePath = path.join(folderPath, filename);

      fs.writeFileSync(filePath, content, "utf-8");
    }

    return folderPath;
  } catch (error) {
    logger.error("Failed to write extension files", { error: error?.message || error });
    throw new Error("Could not write extension files to disk.");
  }
}