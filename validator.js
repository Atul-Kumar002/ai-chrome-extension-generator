function validateJSON(output) {
  try {
    const parsed = JSON.parse(output);

    if (!parsed || typeof parsed !== "object") {
      return { valid: false, error: "JSON must be an object" };
    }

    if (
      !parsed["manifest.json"] ||
      typeof parsed["manifest.json"] !== "object" ||
      !parsed["content.js"] ||
      typeof parsed["content.js"] !== "string"
    ) {
      return { valid: false, error: "Missing or invalid required files" };
    }

    return { valid: true, data: parsed };
  } catch (err) {
    return { valid: false, error: "Invalid JSON format" };
  }
}

module.exports = validateJSON;