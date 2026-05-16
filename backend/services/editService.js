import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function editExtensionFile(filename, currentContent, editRequest, originalPrompt) {
  try {
    const systemPrompt = `
You are an elite Chrome Extension developer.

You will edit existing Chrome Extension code based on user requests.

Return ONLY valid edited code.

Rules:

1. Preserve the overall structure and functionality.
2. Make ONLY the requested changes.
3. Keep the code clean and working.
4. Do NOT add unnecessary comments.
5. Return the COMPLETE edited file content.
6. If editing manifest.json, return valid JSON.
7. If editing JavaScript, return complete working code.
8. Do NOT explain anything.
9. Return RAW code ONLY (no markdown, no backticks, no explanations).
10. Ensure the code is properly formatted.
11. The edited code must be immediately functional.
12. Escape quotes correctly for JSON files.
`;

    const userMessage = `
Original prompt: "${originalPrompt}"

File to edit: ${filename}

Current content:
<START_FILE_CONTENT>
${currentContent}
<END_FILE_CONTENT>

Edit request: ${editRequest}

Return the complete edited file content. Do not include markdown formatting or backticks.
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
          content: userMessage,
        },
      ],
      temperature: 0.3,
    });

    const editedContent = response.choices[0].message.content.trim();

    console.log("EDIT RESPONSE for", filename);
    console.log("First 200 chars:", editedContent.substring(0, 200));

    // Clean markdown formatting if present
    const cleanedContent = editedContent
      .replace(/```javascript/g, "")
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Validate JSON if it's a JSON file
    if (filename.endsWith(".json")) {
      try {
        JSON.parse(cleanedContent);
      } catch (e) {
        throw new Error(`Invalid JSON generated for ${filename}: ${e.message}`);
      }
    }

    return cleanedContent;
  } catch (error) {
    console.error("EDIT SERVICE ERROR:");
    console.error(error);
    throw new Error(error.message || "File edit failed");
  }
}
