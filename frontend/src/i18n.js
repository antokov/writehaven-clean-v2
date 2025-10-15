import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import de from './locales/de.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import it from './locales/it.json'
import pt from './locales/pt.json'

const resources = {
  en: { translation: en },
  de: { translation: de },
  es: { translation: es },
  fr: { translation: fr },
  it: { translation: it },
  pt: { translation: pt }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language is English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes
    }
  })

export default i18n
