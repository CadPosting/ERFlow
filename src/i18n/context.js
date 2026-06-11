import { createContext, useContext } from 'react'
import { translate, getLanguage } from './strings.js'

export const LanguageContext = createContext(null)

// Usable outside the provider (e.g. the dashboard, which is staff-facing and
// English-only): falls back to English.
export function useLanguage() {
  return (
    useContext(LanguageContext) ?? {
      lang: 'en',
      setLang: () => {},
      dir: 'ltr',
      speechLang: getLanguage('en').speechLang,
      t: (key) => translate('en', key),
    }
  )
}
