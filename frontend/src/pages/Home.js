import { useEffect, useRef, useState } from "react";
import { generateExtension as generateExtensionAPI, editFile, getSubscriptionStatus, saveManualEdit } from "../services/api";
import { getProjects, saveProject } from "../services/storage";
import { isPremiumPrompt, getPremiumNotice } from "../services/subscription";
import { setPageMetadata } from "../utils/seo";
import PromptBox from "../components/PromptBox";
import FilePreview from "../components/FilePreview";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import SubscriptionModal from "../components/SubscriptionModal";

function Home({ onNavigate }) {
  const [prompt, setPrompt] = useState("");
  const [generatedFiles, setGeneratedFiles] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState({ tier: "Free", badge: "Free" });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [premiumReason, setPremiumReason] = useState("");
  const previewRef = useRef(null);
  
  // Edit request state (temporary memory)
  const [editHistory, setEditHistory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");

  useEffect(() => {
    setPageMetadata({
      title: "Generate Chrome Extensions | Extensio.ai",
      description: "Create Chrome extensions with AI instantly and securely with Extensio.ai.",
    });

    const refreshSubscription = async () => {
      try {
        const response = await getSubscriptionStatus();
        if (response.data?.subscription?.currentPlan) {
          setSubscriptionPlan(response.data.subscription.currentPlan);
        }
      } catch (error) {
        console.warn("Unable to fetch subscription status", error);
      }
    };

    refreshSubscription();

    // Load last opened project from dashboard
    const lastOpenedId = localStorage.getItem("extensio_last_opened");
    if (lastOpenedId) {
      try {
        const projects = getProjects();
        const project = projects.find((p) => String(p.id) === String(lastOpenedId));
        if (project) {
          setPrompt(project.prompt || "");
          setGeneratedFiles(project.files || {});
          const firstFile = Object.keys(project.files || {})[0] || null;
          setSelectedFile(firstFile);
          localStorage.removeItem("extensio_last_opened");
        }
      } catch (err) {
        console.error("Error loading last opened project:", err);
      }
    }
  }, []);

  const generateExtension = async () => {
    if (isPremiumPrompt(prompt) && subscriptionPlan?.tier === "Free") {
      setPremiumReason(getPremiumNotice());
      setShowSubscriptionModal(true);
      setStatusMessage(`Premium feature locked: ${getPremiumNotice()}`);
      setStatusType("error");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("");
      setStatusType("");

      const response = await generateExtensionAPI(prompt);
      console.log("Generated Files:", response.data);

      const responseFiles = response.data?.files;
      if (!responseFiles || typeof responseFiles !== "object" || Object.keys(responseFiles).length === 0) {
        throw new Error("Generation failed. Invalid extension structure.");
      }

      const firstFile = Object.keys(responseFiles)[0];
      setGeneratedFiles(responseFiles);
      setSelectedFile(firstFile || null);
      setDownloadUrl(response.data.downloadUrl);
      setEditHistory([]);
      setEditMode(false);
      setEditingFile(null);
      setEditingContent("");
      setEditPrompt("");
      setStatusMessage(response.data.message || "Validation Passed: Extension generated successfully");
      setStatusType("success");

      const newProject = {
        id: Date.now(),
        title: response.data.generatedTitle || response.data.title || "Untitled Extension",
        prompt,
        files: responseFiles,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveProject(newProject);
      window.dispatchEvent(new CustomEvent("extensio:projects-updated"));

      if (previewRef.current) {
        previewRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (error) {
      const premiumBlocked = error.response?.status === 402 || error.response?.data?.premiumRequired;
      const unsafeDetected = error.response?.data?.message?.includes("Unsafe extension code detected");
      if (premiumBlocked) {
        setPremiumReason(getPremiumNotice());
        setShowSubscriptionModal(true);
        setStatusMessage(`Premium feature locked: ${error.response?.data?.message || getPremiumNotice()}`);
      } else if (unsafeDetected) {
        setStatusMessage("Unsafe extension code detected.");
      } else {
        setStatusMessage(`Validation Failed: ${error.response?.data?.message || error.message || "Generation failed"}`);
      }
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setEditPrompt("");
    setStatusMessage("");
    setStatusType("");
    setEditMode(!editMode);
  };

  const handleFileChange = (filename, content) => {
    setGeneratedFiles(prev => ({
      ...prev,
      [filename]: content
    }));
  };

  const applyEdit = async () => {
    if (!editPrompt.trim()) {
      // Save manual edits
      try {
        setLoading(true);
        setStatusMessage("");
        setStatusType("");

        const response = await saveManualEdit(generatedFiles);

        const updatedFiles = response.data.files || {};
        setGeneratedFiles(updatedFiles);
        setDownloadUrl(response.data.downloadUrl);
        setStatusMessage(response.data.message || "Manual changes saved successfully");
        setStatusType("success");
        
        if (selectedFile && updatedFiles[selectedFile]) {
          setSelectedFile(selectedFile);
        } else {
          const firstFile = Object.keys(updatedFiles)[0] || null;
          setSelectedFile(firstFile);
        }
      } catch (error) {
        setStatusMessage(error.response?.data?.message || "Failed to save manual changes");
        setStatusType("error");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (isPremiumPrompt(editPrompt) && subscriptionPlan?.tier === "Free") {
      setPremiumReason(getPremiumNotice());
      setShowSubscriptionModal(true);
      setStatusMessage(`Premium feature locked: ${getPremiumNotice()}`);
      setStatusType("error");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("");
      setStatusType("");

      const response = await editFile(
        generatedFiles,
        "", // Target is empty string for the whole extension
        editPrompt,
        prompt
      );

      const updatedFiles = response.data.files || {};
      setGeneratedFiles(updatedFiles);
      setDownloadUrl(response.data.downloadUrl);
      setStatusMessage(response.data.message || "Validation Passed: Changes applied successfully");
      setStatusType("success");
      
      // Store in session history for reference
      setEditHistory(prev => [
        ...prev,
        { editRequest: editPrompt, timestamp: Date.now() }
      ]);
      
      setEditPrompt("");
      if (selectedFile && updatedFiles[selectedFile]) {
        setSelectedFile(selectedFile);
      } else {
        const firstFile = Object.keys(updatedFiles)[0] || null;
        setSelectedFile(firstFile);
      }
    } catch (error) {
      const premiumBlocked = error.response?.status === 402 || error.response?.data?.premiumRequired;
      const unsafeDetected = error.response?.data?.message?.includes("Unsafe extension code detected");
      if (premiumBlocked) {
        setPremiumReason(getPremiumNotice());
        setShowSubscriptionModal(true);
        setStatusMessage(`Premium feature locked: ${error.response?.data?.message || getPremiumNotice()}`);
      } else if (unsafeDetected) {
        setStatusMessage("Unsafe extension code detected.");
      } else {
        setStatusMessage(`Validation Failed: ${error.response?.data?.message || "AI modification failed"}`);
      }
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditPrompt("");
    setStatusMessage("");
    setStatusType("");
  };

  const closeSubscriptionModal = () => {
    setShowSubscriptionModal(false);
    setPremiumReason("");
  };

  const handleUpgrade = () => {
    setShowSubscriptionModal(false);
    if (onNavigate) {
      onNavigate("pricing");
    }
  };

  const exitEditMode = () => {
    setEditMode(false);
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
                prompt={editMode ? editPrompt : prompt}
                setPrompt={editMode ? setEditPrompt : setPrompt}
                onSubmit={editMode ? applyEdit : generateExtension}
                editMode={editMode}
              />
              <div className="button-group">
                 {editMode ? (
                  <>
                    <button
                      className="generate-btn"
                      onClick={applyEdit}
                      disabled={loading}
                    >
                      {editPrompt.trim() ? "✏️ Apply AI Edit" : "💾 Save Manual Changes"}
                    </button>
                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginLeft: '12px' }}
                      >
                        <button className="download-btn" type="button">
                          ⬇️ Download ZIP
                        </button>
                      </a>
                    )}
                    <button
                      className="cancel-btn"
                      onClick={cancelEdit}
                      disabled={loading}
                      style={{ marginLeft: '12px' }}
                    >
                      ❌ Cancel Edit
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </>

            {loading && <LoadingSpinner />}
          </div>

          <div className="card preview" ref={previewRef}>
            {loading && <LoadingSpinner />}

            {!loading && statusMessage && (
              <div
                className={`status-banner status-${statusType || "info"}`}
                style={{
                  marginBottom: "16px",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  backgroundColor: statusType === "success" ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                  border: `1px solid ${statusType === "success" ? "rgba(34, 197, 94, 0.24)" : "rgba(239, 68, 68, 0.24)"}`,
                  color: statusType === "success" ? "#166534" : "#991b1b",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              >
                {statusMessage}
              </div>
            )}

            {!loading && generatedFiles && Object.keys(generatedFiles).length > 0 ? (
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
                <FilePreview
                  files={generatedFiles}
                  selectedFile={selectedFile}
                  onFileSelect={(filename) => setSelectedFile(filename)}
                  readOnly={!editMode}
                  onFileChange={handleFileChange}
                />

              </>
            ) : !loading && !statusMessage ? (
              <div className="empty-state">
                <p>🎨 No files generated yet</p>
                <small>Describe your extension and click Generate to get started</small>
              </div>
            ) : null}
          </div>
        </div>

        {editHistory.length > 0 && (
          <div className="history-panel">
            <p className="history-title">📝 Edit History (Session)</p>
            <div className="history-items">
              {editHistory.map((item, idx) => (
                <small key={idx} className="history-item">
                  "{item.editRequest}" • {new Date(item.timestamp).toLocaleTimeString()}
                </small>
              ))}
            </div>
          </div>
        )}

        {showSubscriptionModal && (
          <SubscriptionModal
            onClose={closeSubscriptionModal}
            onUpgrade={handleUpgrade}
            reason={premiumReason}
            currentPlan={subscriptionPlan?.badge}
          />
        )}
      </div>
    </div>
  );
}

export default Home;