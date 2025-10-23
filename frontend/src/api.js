// frontend/src/api.js
import axios from "axios";

/**
 * Zentrale Axios-Instanz:
 * - Verwendet VITE_API_BASE_URL aus Environment oder /api als Fallback
 * - Content-Type JSON
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const baseURL = API_BASE ? `${API_BASE}/api` : '/api';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
