import React from 'react'
import { useTranslation } from 'react-i18next'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const currentLang = i18n.language || 'en'

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        className={`lang-btn ${currentLang === 'de' ? 'active' : ''}`}
        onClick={() => changeLanguage('de')}
        aria-label="Zu Deutsch wechseln"
      >
        DE
      </button>
    </div>
  )
}
