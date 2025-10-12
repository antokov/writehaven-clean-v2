// frontend/src/api.js
import axios from "axios";

/**
 * Zentrale Axios-Instanz:
 * - Alle Aufrufe gehen automatisch auf /api/…
 * - Content-Type JSON
 */
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
