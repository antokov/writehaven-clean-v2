import { useAuth } from '../context/AuthContext'
import { User, Mail, Calendar } from 'lucide-react'
import './Settings.css'

export default function Settings() {
  const { user } = useAuth()

  const formatDate = (dateString) => {
    if (!dateString) return 'Unbekannt'
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Einstellungen</h1>

        <div className="settings-section">
          <h2 className="section-title">Benutzerprofil</h2>

          <div className="settings-card">
            <div className="settings-item">
              <div className="settings-item-icon">
                <User size={20} />
              </div>
              <div className="settings-item-content">
                <div className="settings-item-label">Name</div>
                <div className="settings-item-value">{user?.name || 'Nicht angegeben'}</div>
              </div>
            </div>

            <div className="settings-divider" />

            <div className="settings-item">
              <div className="settings-item-icon">
                <Mail size={20} />
              </div>
              <div className="settings-item-content">
                <div className="settings-item-label">E-Mail</div>
                <div className="settings-item-value">{user?.email || 'Nicht angegeben'}</div>
              </div>
            </div>

            <div className="settings-divider" />

            <div className="settings-item">
              <div className="settings-item-icon">
                <Calendar size={20} />
              </div>
              <div className="settings-item-content">
                <div className="settings-item-label">Konto erstellt</div>
                <div className="settings-item-value">{formatDate(user?.created_at)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">Account-Informationen</h2>
          <div className="settings-card">
            <div className="settings-info">
              <p>Benutzer-ID: <strong>{user?.id}</strong></p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-note">
            Weitere Einstellungen und Profil-Bearbeitung werden in einer zukünftigen Version verfügbar sein.
          </div>
        </div>
      </div>
    </div>
  )
}
