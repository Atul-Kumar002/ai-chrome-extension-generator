import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const generateExtension = (prompt) =>
  API.post("/generate", { prompt });

export const editFile = (files, targetFilename, editRequest, originalPrompt) =>
  API.post("/edit", {
    files,
    targetFile: targetFilename,
    editRequest,
    originalPrompt,
  });

export default API;