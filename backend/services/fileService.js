import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function writeExtensionFiles(files) {
  const folderName = uuidv4();

  const folderPath = path.join("temp", folderName);

  fs.mkdirSync(folderPath, { recursive: true });

  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(folderPath, filename);

    fs.writeFileSync(filePath, content, "utf-8");
  }

  return folderPath;
}