import "../styles/loading.css";

function LoadingSpinner({ status = "Generating extension..." }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">{status}</p>
      <div className="pulse-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default LoadingSpinner;