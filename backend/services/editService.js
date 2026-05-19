import Groq from "groq-sdk";
import dotenv from "dotenv";
import { validateExtensionFiles } from "./validateService.js";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function formatFileBlock(name, content) {
  return `${name}:
${content.trim()}
`;
}

function validateSyntax(files) {
  if (files["manifest.json"]) {
    JSON.parse(files["manifest.json"]);
  }

  ["content.js", "popup.js"].forEach((filename) => {
    if (files[filename] && files[filename].trim()) {
      new Function(files[filename]);
    }
  });
}

export async function editExtensionFiles(
  files,
  editRequest,
  targetFile = "",
  originalPrompt = ""
) {
  const fileNames = ["manifest.json", "content.js", "popup.html", "popup.js"];
  const currentFiles = fileNames.reduce((acc, name) => {
    acc[name] = files[name] || "";
    return acc;
  }, {});

  const fileBlocks = Object.entries(files)
    .map(([name, content]) => formatFileBlock(name, content))
    .join("\n");

  const systemPrompt = `You are an elite Chrome Extension developer.

When asked to modify an extension, preserve the current working logic and file structure.
Only change code relevant to the user's request.
Always maintain Manifest V3 compatibility.
Avoid unnecessary rewrites and do not remove existing extension behavior.
Return RAW JSON only, with keys exactly: manifest.json, content.js, popup.html, popup.js.
Do not include markdown or explanations.
`;

  const userPrompt = `Current extension files:
${fileBlocks}

Modification request: ${editRequest}

Original generation prompt: ${originalPrompt}

Guidelines:
- Preserve working logic unless the request specifically changes behavior.
- Preserve the structure of manifest.json and keep it Manifest V3 compatible.
- If possible, only modify ${targetFile || "the file(s) relevant to this request"}.
- Do not remove files or delete features that are not part of the edit.
- If a file does not need changes, return it unchanged.
- Return valid JSON only.
`;

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const text = response.choices[0].message.content;
  const cleanedText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleanedText);
  } catch (error) {
    console.error("Edit Service JSON parse error:", error);
    throw new Error("AI returned invalid JSON. Edit operation failed.");
  }

  const mergedFiles = { ...currentFiles };
  for (const key of fileNames) {
    if (typeof parsed[key] === "string" && parsed[key].trim()) {
      mergedFiles[key] = parsed[key];
    }
  }

  validateExtensionFiles(mergedFiles);
  validateSyntax(mergedFiles);

  return mergedFiles;
}
