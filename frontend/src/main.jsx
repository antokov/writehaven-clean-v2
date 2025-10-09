import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProjectView from './pages/ProjectView.jsx'
import './styles.css'
import './layout-2col.css'
import './projectview.css'

import axios from "axios";

// Wenn VITE_API_BASE_URL gesetzt ist, leite /api/... ans Backend um.
// In Dev (ohne ENV) bleibt /api/... für den Vite-Proxy bestehen.
const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
axios.interceptors.request.use((cfg) => {
  if (API_BASE && cfg.url?.startsWith("/api")) {
    cfg.url = API_BASE + cfg.url; // z.B. https://.../api/projects
  }
  return cfg;
});


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Dashboard />} />
        <Route path="project/:id" element={<ProjectView />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
