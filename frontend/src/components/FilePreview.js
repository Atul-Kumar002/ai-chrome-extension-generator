import Editor from "@monaco-editor/react";
import { useState } from "react";

function FilePreview({ files, onEditRequest }) {
  const [expandedFile, setExpandedFile] = useState(null);

  return (
    <div className="preview">
      <h2>Generated Files</h2>

      {Object.entries(files).map(([filename, content]) => (
        <div className="file" key={filename}>
          <div className="file-header">
            <h3>{filename}</h3>
            <button 
              className="edit-btn"
              onClick={() => onEditRequest(filename, content)}
              title="Edit this file"
            >
              ✏️ Edit
            </button>
          </div>
          <div className="editor-container">
            <Editor
              height="300px"
              defaultLanguage={getLanguage(filename)}
              value={content}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineNumbers: "on",
                wordWrap: "on",
              }}
              theme="vs-dark"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function getLanguage(filename) {
  const ext = filename.split(".").pop();
  const langMap = {
    js: "javascript",
    json: "json",
    html: "html",
    css: "css",
    ts: "typescript",
    jsx: "javascript",
    tsx: "typescript",
  };
  return langMap[ext] || "plaintext";
}

export default FilePreview;