import axios from "axios";
import apiConfig from "../config/apiConfig";

const API = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: 12000,
});

API.interceptors.request.use((config) => {
  const plan = localStorage.getItem("extensio_subscription_tier") || "Free";
  config.headers["x-subscription-tier"] = plan;
  return config;
});

export const generateExtension = (prompt) =>
  API.post("/generate", { prompt }, { timeout: 120000 });

export const editFile = (files, targetFilename, editRequest, originalPrompt) =>
  API.post("/edit", {
    files,
    targetFile: targetFilename,
    editRequest,
    originalPrompt,
  });

export const getSubscriptionStatus = () => API.get("/subscription/status");

export const saveManualEdit = (files) =>
  API.post("/edit/save", { files });

export default API;