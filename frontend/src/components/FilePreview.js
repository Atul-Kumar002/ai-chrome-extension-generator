import Editor from "@monaco-editor/react";

function FilePreview({ files, selectedFile, onFileSelect, readOnly = true, onFileChange }) {
  const fileNames = Object.keys(files || {});
  const activeFile = selectedFile && files[selectedFile] ? selectedFile : fileNames[0] || null;
  const activeContent = activeFile ? files[activeFile] : "";

  return (
    <div className="preview">
      <h2>Generated Files</h2>

      <div className="file-tabs" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
        {fileNames.map((filename) => (
          <button
            key={filename}
            type="button"
            onClick={() => onFileSelect?.(filename, files[filename])}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: filename === activeFile ? "1px solid #60a5fa" : "1px solid rgba(255,255,255,0.12)",
              background: filename === activeFile ? "rgba(96, 165, 250, 0.2)" : "transparent",
              color: "inherit",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            {filename}
          </button>
        ))}
      </div>

      {activeFile ? (
        <div className="file" key={activeFile}>
          <div className="file-header">
            <h3>{activeFile}</h3>
          </div>
          <div className="editor-container">
            <Editor
              key={activeFile}
              height="400px"
              language={getLanguage(activeFile)}
              value={activeContent}
              onChange={(value) => {
                onFileChange?.(activeFile, value || "");
              }}
              options={{
                readOnly: readOnly,
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
      ) : null}
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
