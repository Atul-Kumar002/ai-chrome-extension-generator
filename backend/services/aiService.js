import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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
- include required permissions
- include content_scripts
- properly inject content.js

3. content.js MUST:
- contain COMPLETE working JavaScript
- immediately execute
- modify the DOM properly

4. Do NOT use placeholders.

5. Do NOT explain anything.

6. Return RAW JSON ONLY.

7. Escape quotes correctly.

8. Extensions MUST work immediately after installation.

9. If user asks to modify website appearance:
- use document.body.style
- use querySelectorAll when needed

10. NEVER return markdown.

11. Do NOT include icons in manifest.json unless actual image files are generated.
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

    console.log("RAW AI RESPONSE:");
    console.log(text);

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI SERVICE ERROR:");
    console.error(error);

    throw new Error(error.message || "AI generation failed");
  }
}
