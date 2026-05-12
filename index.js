require("dotenv").config();
const fs = require("fs");
const path = require("path");
const os = require("os");
const http = require("http");
const archiver = require("archiver");
const Groq = require("groq-sdk");

const systemPrompt = require("./prompt");
const validateJSON = require("./validator");

const hasApiKey = Boolean(process.env.GROQ_API_KEY);
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function getTempExtensionFolder() {
  const tempDir = path.join(os.tmpdir(), `zaalima-extension-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });
  return tempDir;
}

function writeExtensionFiles(extensionData, folderPath) {
  for (const [fileName, fileContent] of Object.entries(extensionData)) {
    if (fileContent === undefined || fileContent === null) {
      continue;
    }

    const outputPath = path.join(folderPath, fileName);
    const directory = path.dirname(outputPath);

    fs.mkdirSync(directory, { recursive: true });

    const contents =
      typeof fileContent === "object"
        ? JSON.stringify(fileContent, null, 2)
        : String(fileContent);

    fs.writeFileSync(outputPath, contents, "utf-8");
    console.log(`✔ Wrote ${outputPath}`);
  }
}

function zipFolder(folderPath) {
  return new Promise((resolve, reject) => {
    const zipPath = `${folderPath}.zip`;
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`\n✅ Zip created: ${zipPath} (${archive.pointer()} bytes)`);
      resolve(zipPath);
    });

    archive.on("warning", (err) => {
      if (err.code === "ENOENT") {
        console.warn(err.message);
      } else {
        reject(err);
      }
    });

    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
  });
}

function startDownloadServer(zipPath, initialPort = 3000, maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    const tryPort = (port, remaining) => {
      const server = http.createServer((req, res) => {
        if (req.url === "/download") {
          const stat = fs.statSync(zipPath);
          res.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="${path.basename(zipPath)}"`,
            "Content-Length": stat.size,
          });
          fs.createReadStream(zipPath).pipe(res);
          return;
        }

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`Extension zip ready. Download at http://localhost:${port}/download\n`);
      });

      server.on("error", (err) => {
        if (err.code === "EADDRINUSE" && remaining > 0) {
          console.warn(`Port ${port} is in use. Trying port ${port + 1}...`);
          tryPort(port + 1, remaining - 1);
          return;
        }
        reject(err);
      });

      server.listen(port, () => {
        console.log(`\n🚀 Download server running at http://localhost:${port}/download`);
        resolve(server);
      });
    };

    tryPort(initialPort, maxAttempts);
  });
}

async function generateExtension(userInput) {
  try {
    let output;

    if (!hasApiKey) {
      console.warn("⚠️ No GROQ_API_KEY found. Using local sample JSON to validate the zip workflow.");
      output = JSON.stringify(
        {
          "manifest.json": {
            manifest_version: 3,
            name: "Red Background Extension",
            version: "1.0.0",
            action: {
              default_title: "Change background to red",
            },
            content_scripts: [
              {
                matches: ["<all_urls>"],
                js: ["content.js"],
              },
            ],
            permissions: ["activeTab"],
          },
          "content.js": "document.body.style.backgroundColor = 'red';",
        },
        null,
        2
      );
    } else {
      const response = await client.chat.completions.create({
        model: "groq/compound",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput },
        ],
      });
      output = response.choices[0].message.content;
    }

    console.log("\n🔹 RAW OUTPUT:\n", output);

    const validation = validateJSON(output);
    if (!validation.valid) {
      console.error("❌ Validation Failed:", validation.error);
      return;
    }

    console.log("\n✅ Valid JSON Generated!\n");
    const extensionFolder = getTempExtensionFolder();
    writeExtensionFiles(validation.data, extensionFolder);

    const zipPath = await zipFolder(extensionFolder);
    const port = parseInt(process.env.PORT || "3000", 10);
    const server = await startDownloadServer(zipPath, port);

    process.on("SIGINT", () => {
      console.log("\nStopping download server...");
      server.close(() => process.exit(0));
    });

    console.log("\n✅ Extension generation complete. Keep this process running to serve the zip file.");
  } catch (err) {
    console.error("Error:", err.message || err);
  }
}

const userRequest = process.argv.slice(2).join(" ") || "Create a Chrome extension that changes background color to red";
generateExtension(userRequest);