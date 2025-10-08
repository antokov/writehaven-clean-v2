import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProjectView from './pages/ProjectView.jsx'
import './styles.css'
import './layout-2col.css'
import './projectview.css'

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
