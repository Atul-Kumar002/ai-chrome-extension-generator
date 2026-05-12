import fs from "fs";
import archiver from "archiver";

export async function zipExtensionFolder(folderPath) {
  return new Promise((resolve, reject) => {
    const zipPath = `${folderPath}.zip`;

    const output = fs.createWriteStream(zipPath);

    const archive = archiver("zip", {
      zlib: { level: 9 }
    });

    output.on("close", () => {
      resolve(zipPath);
    });

    archive.on("error", err => {
      reject(err);
    });

    archive.pipe(output);

    archive.directory(folderPath, false);

    archive.finalize();
  });
}