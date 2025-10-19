import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import de from './locales/de.json'

const resources = {
  en: { translation: en },
  de: { translation: de }
}

// Lade gespeicherte Sprache aus localStorage oder verwende Englisch als Standard
const savedLanguage = localStorage.getItem('language')
const initialLanguage = savedLanguage && (savedLanguage === 'en' || savedLanguage === 'de')
  ? savedLanguage
  : 'en'

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage, // Use saved language or default to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes
    }
  })

export default i18n
