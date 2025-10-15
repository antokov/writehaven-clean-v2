import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Calendar, Globe } from 'lucide-react'
import axios from 'axios'
import './UserSettings.css'

const LANGUAGES = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' }
]

export default function UserSettings() {
  const { user } = useAuth()
  const [language, setLanguage] = useState('de')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user?.language) {
      setLanguage(user.language)
    }
  }, [user])

  const handleLanguageChange = async (newLanguage) => {
    setLanguage(newLanguage)
    setIsSaving(true)

    try {
      await axios.put('/api/auth/update-language', { language: newLanguage })
    } catch (error) {
      console.error('Fehler beim Speichern der Sprache:', error)
    } finally {
      setIsSaving(false)
    }
  }

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
          <h2 className="section-title">Präferenzen</h2>
          <div className="settings-card">
            <div className="settings-item">
              <div className="settings-item-icon">
                <Globe size={20} />
              </div>
              <div className="settings-item-content">
                <div className="settings-item-label">Sprache</div>
                <select
                  className="settings-select"
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  disabled={isSaving}
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
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
