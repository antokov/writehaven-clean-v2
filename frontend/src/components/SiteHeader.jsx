// src/components/SiteHeader.jsx
import { Link } from 'react-router-dom'
import logoUrl from '../assets/logo.png'   // <— Pfad von components → assets

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/app" aria-label="Zum Dashboard">
        <span className="brand-icon natural">
          <img className="brand-logo" src={logoUrl} alt="Writehaven" />
        </span>
      </Link>

      <div className="header-actions">
        <button className="btn ghost" type="button">Feedback</button>
      </div>
    </header>
  )
}
