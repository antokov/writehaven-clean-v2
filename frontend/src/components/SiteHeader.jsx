import React from 'react'
import { Link } from 'react-router-dom'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="Writehaven Home">
        <span className="brand-icon" aria-hidden="true">
          {/* kleines Feder-Icon (inline SVG), ersetzbar durch <img src="/logo.svg" /> */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 4a1 1 0 0 0-1.41 0l-2.34 2.34 2.41 2.41L22 6.41A1 1 0 0 0 21 4zM15.85 6.56l-9.7 9.7a2 2 0 0 0-.5.86l-1 3.07a.75.75 0 0 0 .94.94l3.07-1c.33-.11.63-.3.86-.53l9.7-9.7-2.37-2.34z"></path>
          </svg>
        </span>
        <span className="brand-name">Writehaven</span>
      </Link>

      <div className="header-actions">
        {/* Platz für Buttons (Profil, Settings, etc.) */}
      </div>
    </header>
  )
}
