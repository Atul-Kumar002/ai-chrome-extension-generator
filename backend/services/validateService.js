export function validateExtensionFiles(files) {
  console.log("[validateService] Starting extension validation");

  const errors = [];
  const requiredFiles = ["manifest.json", "popup.html", "content.js"];
  const safeString = (value) => typeof value === "string" && value.trim().length > 0;

  if (!files || typeof files !== "object") {
    errors.push("Extension files must be provided as an object.");
  }

  requiredFiles.forEach((filename) => {
    if (!safeString(files?.[filename])) {
      errors.push(`${filename} is missing or empty.`);
    }
  });

  Object.entries(files || {}).forEach(([filename, content]) => {
    if (!safeString(content)) {
      errors.push(`${filename} is empty or invalid.`);
    }
  });

  const blockedPatterns = [
    "..",
    "eval(",
    "child_process",
    "fs.unlink",
    "rm -rf",
    "process.exit"
  ];

  Object.entries(files || {}).forEach(([filename, content]) => {
    if (blockedPatterns.some((pattern) => filename.includes(pattern))) {
      errors.push(`Unsafe filename detected: ${filename}`);
    }

    if (typeof content === "string" && blockedPatterns.some((pattern) => content.includes(pattern))) {
      errors.push(`Unsafe content detected in ${filename}.`);
    }
  });

  let manifest = null;
  if (safeString(files?.["manifest.json"])) {
    try {
      manifest = JSON.parse(files["manifest.json"]);
    } catch (error) {
      errors.push(`manifest.json malformed JSON: ${error.message}`);
    }
  }

  if (manifest) {
    if (manifest.manifest_version !== 3) {
      errors.push("manifest.json must use Manifest V3.");
    }

    if (!safeString(manifest.name)) {
      errors.push("manifest.json must include a valid name.");
    }

    if (!safeString(manifest.version)) {
      errors.push("manifest.json must include a valid version.");
    }

    if (manifest.permissions) {
      if (!Array.isArray(manifest.permissions)) {
        errors.push("manifest.json permissions must be an array.");
      } else {
        manifest.permissions.forEach((permission, index) => {
          if (typeof permission !== "string" || permission.trim() === "") {
            errors.push(`manifest.json permission at index ${index} is invalid.`);
          }
        });
      }
    }

    if (!manifest.action || !safeString(manifest.action.default_popup)) {
      errors.push("manifest.json must include action.default_popup for the extension popup.");
    } else if (!safeString(files?.[manifest.action.default_popup])) {
      errors.push(`manifest.json references popup file ${manifest.action.default_popup} that is missing.`);
    }

    const background = manifest.background || {};
    const serviceWorker = background.service_worker;
    if (Object.keys(background).length > 0 && !safeString(serviceWorker)) {
      errors.push("manifest.json must include background.service_worker for Manifest V3.");
    }

    if (safeString(serviceWorker) && !safeString(files?.[serviceWorker])) {
      errors.push(`manifest.json references service worker file ${serviceWorker} that is missing.`);
    }

    if (Array.isArray(manifest.content_scripts)) {
      if (manifest.content_scripts.length === 0) {
        errors.push("manifest.json content_scripts must include at least one entry when present.");
      }

      manifest.content_scripts.forEach((entry, index) => {
        if (!entry || typeof entry !== "object") {
          errors.push(`content_scripts[${index}] must be an object.`);
          return;
        }

        if (!Array.isArray(entry.js) || entry.js.length === 0) {
          errors.push(`content_scripts[${index}] must include at least one js file.`);
        } else {
          entry.js.forEach((scriptName) => {
            if (!safeString(files?.[scriptName])) {
              errors.push(`content_scripts[${index}] references missing file: ${scriptName}`);
            }
          });
        }
      });
    }

    if (manifest.web_accessible_resources && !Array.isArray(manifest.web_accessible_resources)) {
      errors.push("manifest.json web_accessible_resources must be an array.");
    }
  }

  ["content.js", "popup.js"].forEach((filename) => {
    const content = files?.[filename];
    if (!safeString(content)) return;

    try {
      if (/\b(import|export)\b/.test(content)) {
        console.log(`[validateService] Skipping module syntax check for ${filename}`);
      } else {
        new Function(content);
      }
    } catch (error) {
      errors.push(`${filename} syntax error: ${error.message}`);
    }
  });

  if (errors.length > 0) {
    console.error("[validateService] Validation failed:", errors);
    throw new Error(errors.join(" "));
  }

  console.log("[validateService] Validation passed for extension files.");
  return true;
}
