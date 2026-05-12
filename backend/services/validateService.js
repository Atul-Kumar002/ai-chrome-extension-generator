export function validateExtensionFiles(files) {

  if (!files["manifest.json"]) {
    throw new Error("manifest.json missing");
  }

  const blockedPatterns = [
    "..",
    "eval(",
    "child_process",
    "fs.unlink",
    "rm -rf",
    "process.exit"
  ];

  for (const [filename, content] of Object.entries(files)) {

    // Check filename safety
    if (
      blockedPatterns.some(pattern =>
        filename.includes(pattern)
      )
    ) {
      throw new Error("Unsafe filename detected");
    }

    // Check content safety
    if (
      typeof content === "string" &&
      blockedPatterns.some(pattern =>
        content.includes(pattern)
      )
    ) {
      throw new Error("Unsafe content detected");
    }

  }

  return true;
    
}