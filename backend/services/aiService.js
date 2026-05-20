import Groq from "groq-sdk";
import { GROQ_API_KEY } from "../config/envConfig.js";
import { logger } from "../utils/logger.js";

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

export async function generateExtensionCode(userPrompt) {
  try {
    const systemPrompt = `
You are an elite Chrome Extension developer.

Generate FULLY WORKING Chrome Extensions using Manifest V3.

Return ONLY valid JSON.

The response format MUST be:

{
  "manifest.json": "...",
  "content.js": "...",
  "popup.html": "...",
  "popup.js": "..."
}

Rules:

1. ALWAYS include:
- manifest.json
- content.js
- popup.html

2. manifest.json MUST:
- use Manifest V3
- include required permissions only when needed
- include content_scripts for any DOM changes
- properly inject content.js
- NOT use unsafe content_security_policy values
- NOT include remote URLs or external scripts

3. content.js MUST:
- contain COMPLETE working JavaScript
- immediately execute
- modify the DOM using document.body.style or querySelector/querySelectorAll
- NOT use eval(), Function(), new Function(), import(), or external network calls

4. popup.js MUST:
- be a small local script that supports the extension popup if included
- NOT use external resources or remote imports

5. Do NOT use placeholders.

6. Do NOT explain anything.

7. Return RAW JSON ONLY.

8. Escape quotes correctly.

9. Extensions MUST work immediately after installation.

10. If the user asks to change page styling, do it through content_scripts and DOM methods.

11. NEVER return markdown.

12. Do NOT include icons in manifest.json unless actual image files are generated.
`;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],

      temperature: 0.2,
    });

    const text = response.choices[0].message.content;
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    logger.error("AI service error", { error: error?.message || error });
    throw new Error(error.message || "AI generation failed");
  }
}
