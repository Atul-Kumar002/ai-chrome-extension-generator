import { useState } from "react";
import { generateExtension as generateExtensionAPI, editFile } from "../services/api";
import PromptBox from "../components/PromptBox";
import FilePreview from "../components/FilePreview";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

function Home() {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  
  // Edit request state (temporary memory)
  const [editHistory, setEditHistory] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [editPrompt, setEditPrompt] = useState("");

  const generateExtension = async () => {
    try {
      setLoading(true);
      const response = await generateExtensionAPI(prompt);
      setFiles(response.data.files);
      setDownloadUrl(response.data.downloadUrl);
      setEditHistory([]);
      setEditingFile(null);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Generation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditRequest = (filename, content) => {
    setEditingFile(filename);
    setEditPrompt("");
    // Store in history for reference
    setEditHistory([
      ...editHistory,
      { filename, originalContent: content, timestamp: Date.now() }
    ]);
  };

  const applyEdit = async () => {
    if (!editPrompt.trim()) {
      alert("Please describe the changes you want to make");
      return;
    }

    try {
      setLoading(true);
      const response = await editFile(
        editingFile,
        files[editingFile],
        editPrompt,
        prompt
      );

      setFiles(prev => ({
        ...prev,
        [editingFile]: response.data.editedContent
      }));
      
      setEditingFile(null);
      setEditPrompt("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Edit failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingFile(null);
    setEditPrompt("");
  };

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <div className="hero">
          <h1>✨ Extensio.ai</h1>
          <p>
            Build Chrome Extensions with AI — No Coding Required
          </p>
        </div>

        <div className="main-grid">
          <div className="card">
            {editingFile ? (
              <div className="edit-panel">
                <h3>Edit: {editingFile}</h3>
                <p className="edit-subtitle">Describe the changes you want</p>
                <textarea
                  placeholder="E.g., 'Add error handling', 'Change button color to red', 'Add console.log statements'..."
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="edit-textarea"
                />
                <div className="edit-buttons">
                  <button 
                    className="apply-btn"
                    onClick={applyEdit}
                    disabled={loading}
                  >
                    Apply Edit
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={cancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <PromptBox 
                  prompt={prompt}
                  setPrompt={setPrompt}
                  generateExtension={generateExtension}
                />
                <div className="button-group">
                  <button
                    className="generate-btn"
                    onClick={generateExtension}
                    disabled={loading || !prompt.trim()}
                  >
                    🚀 Generate Extension
                  </button>

                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <button className="download-btn">
                        ⬇️ Download ZIP
                      </button>
                    </a>
                  )}
                </div>
              </>
            )}

            {loading && <LoadingSpinner />}
          </div>

          <div className="card preview">
            {Object.keys(files).length === 0 && !loading ? (
              <div className="empty-state">
                <p>🎨 No files generated yet</p>
                <small>Describe your extension and click Generate to get started</small>
              </div>
            ) : loading ? (
              <LoadingSpinner />
            ) : (
              <FilePreview 
                files={files}
                onEditRequest={handleEditRequest}
              />
            )}
          </div>
        </div>

        {editHistory.length > 0 && (
          <div className="history-panel">
            <p className="history-title">📝 Edit History (Session)</p>
            <div className="history-items">
              {editHistory.map((item, idx) => (
                <small key={idx} className="history-item">
                  {item.filename} • {new Date(item.timestamp).toLocaleTimeString()}
                </small>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;