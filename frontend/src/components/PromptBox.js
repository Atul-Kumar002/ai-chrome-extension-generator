function PromptBox({ prompt, setPrompt, generateExtension }) {
  return (
    <div>
      <textarea
        placeholder="Describe your extension..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={generateExtension}>
        Generate Extension
      </button>
    </div>
  );
}

export default PromptBox;