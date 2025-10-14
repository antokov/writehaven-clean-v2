// src/components/SiteHeader.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoUrl from '../assets/logo.png'

export default function SiteHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/app" aria-label="Zum Dashboard">
        <span className="brand-icon natural">
          <img className="brand-logo" src={logoUrl} alt="Writehaven" />
        </span>
      </Link>

      <div className="header-actions">
        {user && (
          <span className="user-name" style={{ marginRight: '1rem', color: '#666' }}>
            {user.name}
          </span>
        )}
        <button className="btn ghost" type="button" onClick={handleLogout}>
          Abmelden
        </button>
      </div>
    </header>
  )
}
