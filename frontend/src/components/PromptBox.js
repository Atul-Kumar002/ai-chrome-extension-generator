function PromptBox({ prompt, setPrompt, onSubmit, editMode }) {
  const suggestions = [
    "🔒 Password manager that securely stores login credentials",
    "📱 Grammar checker that highlights typos and suggests fixes",
    "🎨 Color picker tool for web designers",
    "⏱️ Pomodoro timer with notifications",
    "🔗 URL shortener with custom aliases",
  ];

  const insertSuggestion = (text) => {
    setPrompt(text);
  };

  return (
    <div className="prompt-box">
      <h3>{editMode ? "Edit your generated extension" : "What extension would you like to build?"}</h3>
      <textarea
        placeholder={
          editMode
            ? "Enter a natural language edit request for the current extension..."
            : "Describe your Chrome extension idea in detail..."
        }
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key === "Enter") onSubmit();
        }}
      />
      {!editMode && (
        <div className="suggestions">
          <p>Try a template:</p>
          <div className="suggestion-chips">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="chip"
                onClick={() => insertSuggestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PromptBox;