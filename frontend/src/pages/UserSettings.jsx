import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Calendar, Globe } from 'lucide-react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import '../styles/UserSettings.css'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' }
]

export default function UserSettings() {
  const { user, updateUser } = useAuth()
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState('en')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState(null)

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
      // Aktualisiere den User im Context und localStorage
      updateUser({ language: newLanguage })
      // Ändere auch die i18n Sprache sofort
      i18n.changeLanguage(newLanguage)
      setLastSavedAt(new Date())
    } catch (error) {
      console.error('Error saving language:', error)
      // Bei Fehler zurücksetzen
      setLanguage(user?.language || 'en')
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return t('settings.notSpecified')
    const locale = i18n.language === 'de' ? 'de-DE' : 'en-US'
    return new Intl.DateTimeFormat(locale, {
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
        <h1 className="settings-title">{t('settings.title')}</h1>

        <div className="settings-section">
          <h2 className="section-title">{t('settings.userProfile')}</h2>

          <div className="settings-card">
            <div className="settings-item">
              <div className="settings-item-icon">
                <User size={20} />
              </div>
              <div className="settings-item-content">
                <div className="settings-item-label">{t('auth.name')}</div>
                <div className="settings-item-value">{user?.name || t('settings.notSpecified')}</div>
              </div>
            </div>

            <div className="settings-divider" />

            <div className="settings-item">
              <div className="settings-item-icon">
                <Mail size={20} />
              </div>
              <div className="settings-item-content">
                <div className="settings-item-label">{t('auth.email')}</div>
                <div className="settings-item-value">{user?.email || t('settings.notSpecified')}</div>
              </div>
            </div>

            <div className="settings-divider" />

            <div className="settings-item">
              <div className="settings-item-icon">
                <Calendar size={20} />
              </div>
              <div className="settings-item-content">
                <div className="settings-item-label">{t('settings.accountCreated')}</div>
                <div className="settings-item-value">{formatDate(user?.created_at)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">
            {t('settings.preferences')}
            {lastSavedAt && (
              <span className="save-indicator">
                {t('common.saved', { time: lastSavedAt.toLocaleTimeString() })}
              </span>
            )}
          </h2>
          <div className="settings-card">
            <div className="settings-item">
              <div className="settings-item-icon">
                <Globe size={20} />
              </div>
              <div className="settings-item-content">
                <div className="settings-item-label">{t('common.language')}</div>
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
          <h2 className="section-title">{t('settings.accountInfo')}</h2>
          <div className="settings-card">
            <div className="settings-info">
              <p>{t('settings.userId')}: <strong>{user?.id}</strong></p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-note">
            {t('settings.moreSettingsSoon')}
          </div>
        </div>
      </div>
    </div>
  )
}
