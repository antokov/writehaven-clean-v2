import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'

import Dashboard from './pages/Dashboard.jsx'
import ProjectLayout from './pages/ProjectLayout.jsx'   // <— neu
import ProjectView from './pages/ProjectView.jsx'
import Characters from './pages/Characters.jsx'         // <— neu
import World from './pages/World.jsx'                   // <— neu

import './styles.css'
import './layout-2col.css'
import './projectview.css'
import './header.css'
import './topnav.css'
import './dashboard.css'   // <— NEU: Styles für Kacheln & Grid
import "./characters.css";


import axios from 'axios'

// (dein Interceptor bleibt gleich)
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          {/* Projekt-Layout mit Tabs + Unterseiten */}
          <Route path="project/:id" element={<ProjectLayout />}>
            <Route index element={<ProjectView />} />        {/* Schreiben */}
            <Route path="characters" element={<Characters />} />
            <Route path="world" element={<World />} />
            {/* <Route path="preview" element={<Preview />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
