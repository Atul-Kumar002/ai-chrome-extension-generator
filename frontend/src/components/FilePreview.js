function FilePreview({ files }) {
  return (
    <div className="preview">
      <h2>Generated Files</h2>

      {Object.entries(files).map(([filename, content]) => (
        <div className="file" key={filename}>
          <h3>{filename}</h3>
          <pre>{content}</pre>
        </div>
      ))}
    </div>
  );
}

export default FilePreview;