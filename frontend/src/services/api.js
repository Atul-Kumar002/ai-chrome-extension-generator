import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const generateExtension = (prompt) =>
  API.post("/generate", { prompt });

export const editFile = (filename, currentContent, editRequest, originalPrompt) =>
  API.post("/generate/edit", {
    filename,
    currentContent,
    editRequest,
    originalPrompt,
  });

export default API;