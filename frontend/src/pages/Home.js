import { useState } from "react";
import { generateExtension as generateExtensionAPI, editFile } from "../services/api";
import PromptBox from "../components/PromptBox";
import FilePreview from "../components/FilePreview";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

function Home({ onNavigate }) {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  
  // Edit request state (temporary memory)
  const [editHistory, setEditHistory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editPrompt, setEditPrompt] = useState("");

  const generateExtension = async () => {
    try {
      setLoading(true);
      const response = await generateExtensionAPI(prompt);
      setFiles(response.data.files);
      setDownloadUrl(response.data.downloadUrl);
      setEditHistory([]);
      setEditMode(false);
      setEditingFile(null);
      setEditingContent("");
      setEditPrompt("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Generation failed"
      );
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
    setEditingContent(content);
    setEditPrompt("");
    // Store in history for reference
    setEditHistory(prev => [
      ...prev,
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
        editingContent,
        editPrompt,
        prompt
      );

      setFiles(prev => ({
        ...prev,
        [editingFile]: response.data.editedContent
      }));
      
      setEditingFile(null);
      setEditingContent("");
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
                    Back to Files
                  </button>
                  <button 
                    className="exit-edit-btn"
                    onClick={exitEditMode}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#999',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Exit Edit Mode
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
                  onFileSelect={handleEditRequest}
                />
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