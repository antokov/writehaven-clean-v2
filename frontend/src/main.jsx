import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Landing from './pages/Landing.jsx'               // Landing Page
import Login from './pages/Login.jsx'                   // Login/Register Page
import Dashboard from './pages/Dashboard.jsx'
import UserSettings from './pages/UserSettings.jsx'
import ProjectLayout from './pages/ProjectLayout.jsx'
import ProjectView from './pages/ProjectView.jsx'
import Characters from './pages/Characters.jsx'
import World from './pages/World.jsx'
import BookExport from './pages/BookExport.jsx'
import ProjectSettings from './pages/ProjectSettings.jsx'

import './styles/styles.css'
import './styles/layout-2col.css'
import './styles/projectview.css'
import './styles/header.css'
import './styles/topnav.css'
import './styles/dashboard.css'
import "./styles/characters.css";
import "./styles/bookexport.css";
import './styles/landing.css';

import axios from 'axios'
import './i18n' // Initialize i18n

// API Base URL Configuration
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
function joinUrl(base, path){ if(!base) return path; const p=('/'+String(path||'')).replace(/\/{2,}/g,'/'); return base+p }
axios.interceptors.request.use(cfg=>{
  const url = cfg.url || ''
  if(/^https?:\/\//i.test(url)) return cfg
  const startsWithApi = url.startsWith('/api') || url.startsWith('api')
  if(API_BASE && startsWithApi){ cfg.url = joinUrl(API_BASE, url.replace(/^\/?api/, '/api')) }
  return cfg
})

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page als Startseite */}
          <Route path="/" element={<Landing />} />

          {/* Login/Register Page */}
          <Route path="/login" element={<Login />} />

          {/* Protected App Routes */}
          <Route path="/app" element={<ProtectedRoute><App /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<UserSettings />} />
            {/* Projekt-Layout mit Tabs + Unterseiten */}
            <Route path="project/:id" element={<ProjectLayout />}>
              <Route index element={<ProjectView />} />        {/* Schreiben */}
              <Route path="characters" element={<Characters />} />
              <Route path="world" element={<World />} />
              <Route path="export" element={<BookExport />} />
              <Route path="settings" element={<ProjectSettings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
