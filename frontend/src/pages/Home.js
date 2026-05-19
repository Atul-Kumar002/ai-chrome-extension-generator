import { useState } from "react";
import { generateExtension as generateExtensionAPI, editFile } from "../services/api";
import { getProjects, saveProject } from "../services/storage";
import PromptBox from "../components/PromptBox";
import FilePreview from "../components/FilePreview";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

function Home({ onNavigate }) {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  
  // Edit request state (temporary memory)
  const [editHistory, setEditHistory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [editPrompt, setEditPrompt] = useState("");

  const generateExtension = async () => {
    try {
      setLoading(true);
      setStatusMessage("");
      setStatusType("");

      const response = await generateExtensionAPI(prompt);
      setFiles(response.data.files);
      setDownloadUrl(response.data.downloadUrl);
      setEditHistory([]);
      setEditMode(false);
      setEditingFile(null);
      setEditingContent("");
      setEditPrompt("");
      setStatusMessage("Extension generated successfully");
      setStatusType("success");

      const newProject = {
        id: Date.now(),
        title: response.data.generatedTitle || response.data.title || "Untitled Extension",
        prompt,
        files: response.data.files || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveProject(newProject);
      console.log("Saved Projects:", getProjects());

      if (onNavigate) {
        onNavigate("dashboard");
      }
    } catch (error) {
      setStatusMessage(error.response?.data?.message || "Generation failed");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Exiting edit mode
      setEditingFile(null);
      setEditingContent("");
      setEditPrompt("");
    }
  };

  const handleEditRequest = (filename, content) => {
    setEditingFile(filename);
    setEditPrompt("");
    setStatusMessage("");
    setStatusType("");
    // Store in history for reference
    setEditHistory(prev => [
      ...prev,
      { filename, originalContent: content, timestamp: Date.now() }
    ]);
  };

  const applyEdit = async () => {
    if (!editingFile) {
      setStatusMessage("Please select a file to edit first.");
      setStatusType("error");
      return;
    }

    if (!editPrompt.trim()) {
      setStatusMessage("Please describe the changes you want to make.");
      setStatusType("error");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("");
      setStatusType("");

      const response = await editFile(
        files,
        editingFile,
        editPrompt,
        prompt
      );

      const updatedFiles = response.data.files || {};
      setFiles(updatedFiles);
      setStatusMessage("Changes applied successfully");
      setStatusType("success");
      setEditingFile(null);
      setEditingContent("");
      setEditPrompt("");
    } catch (error) {
      setStatusMessage(error.response?.data?.message || "AI modification failed");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingFile(null);
    setEditingContent("");
    setEditPrompt("");
  };

  const exitEditMode = () => {
    setEditMode(false);
    setEditingFile(null);
    setEditingContent("");
    setEditPrompt("");
  };

  return (
    <div className="app">
      <Navbar onNavigate={onNavigate} />
      <div className="container">
        <div className="hero">
          <h1>✨ Extensio.ai</h1>
          <p>
            Build Chrome Extensions with AI — No Coding Required
          </p>
        </div>

        <div className="main-grid">
          <div className="card">
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
              <>
                <div style={{ marginBottom: '16px' }}>
                  <button
                    className="edit-mode-btn"
                    onClick={toggleEditMode}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: editMode ? '#ff6b6b' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {editMode ? '✕ Exit Edit Mode' : '✏️ Edit Mode'}
                  </button>
                </div>
                {editMode && editingFile && (
                  <div className="file-selector" style={{
                    padding: '12px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    marginBottom: '12px',
                    maxHeight: '150px',
                    overflowY: 'auto'
                  }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold' }}>Editing: <span style={{ color: '#2196F3' }}>{editingFile}</span></p>
                  </div>
                )}
                <FilePreview 
                  files={files}
                  editMode={editMode}
                  selectedFile={editingFile}
                  onFileSelect={handleEditRequest}
                />

                {statusMessage && (
                  <div style={{
                    marginTop: '18px',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    backgroundColor: statusType === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    border: `1px solid ${statusType === 'success' ? 'rgba(34, 197, 94, 0.24)' : 'rgba(239, 68, 68, 0.24)'}`,
                    color: statusType === 'success' ? '#166534' : '#991b1b',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                  }}>
                    {statusMessage}
                  </div>
                )}

                {editMode && (
                  <div className="edit-panel">
                    <h3>Edit Request</h3>
                    <p className="edit-subtitle">
                      Use natural language to revise the current extension files. Only requested changes will be applied.
                    </p>
                    {editingFile ? (
                      <p style={{ margin: '0 0 12px', color: '#60a5fa' }}>
                        Selected file: <strong>{editingFile}</strong>
                      </p>
                    ) : (
                      <p style={{ margin: '0 0 12px', color: '#94a3b8' }}>
                        Select a file above to begin editing.
                      </p>
                    )}
                    <textarea
                      placeholder="E.g., 'Make all buttons blue and add rounded corners.'"
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      className="edit-textarea"
                      disabled={!editingFile || loading}
                    />
                    <div className="edit-buttons">
                      <button 
                        className="apply-btn"
                        onClick={applyEdit}
                        disabled={!editingFile || loading}
                      >
                        Apply Changes
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
                )}
              </>
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