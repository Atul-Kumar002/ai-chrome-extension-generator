import { useState } from "react";
import API from "../services/api";
import Editor from "@monaco-editor/react";

function Home() {

  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const generateExtension = async () => {

    try {

      setLoading(true);

      const response = await API.post("/generate", {
        prompt
      });

      setFiles(response.data.files);
      setDownloadUrl(response.data.downloadUrl);

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Generation failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container">

      <div className="hero">

        <h1>Extensio.ai</h1>

        <p>
          Build Chrome Extensions with AI — No Coding Required
        </p>

      </div>

      <div className="main-grid">

        <div className="card">

          <textarea
            placeholder="Describe your Chrome extension idea..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="button-group">

            <button
              className="generate-btn"
              onClick={generateExtension}
            >
              Generate Extension
            </button>

            {downloadUrl && (

              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
              >

                <button className="download-btn">
                  Download ZIP
                </button>

              </a>

            )}

          </div>

          {loading && (
            <p className="loading">
              Generating extension...
            </p>
          )}

        </div>

        <div className="card preview">

          <h2>Generated Files</h2>

          {Object.keys(files).length === 0 && (
            <p>No files generated yet.</p>
          )}

          {Object.entries(files).map(([filename, content]) => (

            <div className="file" key={filename}>

              <h3>{filename}</h3>

              <Editor
                height="300px"
                defaultLanguage={
                  filename.endsWith(".js")
                    ? "javascript"
                    : filename.endsWith(".json")
                    ? "json"
                    : filename.endsWith(".html")
                    ? "html"
                    : "plaintext"
                }
                value={content}
                theme="vs-dark"
                options={{
                  minimap: {
                    enabled: false
                  },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true
                }}
              />

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default Home;