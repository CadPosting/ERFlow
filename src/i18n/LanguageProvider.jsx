import { useMemo, useState } from 'react'
import { LanguageContext } from './context.js'
import { translate, getLanguage } from './strings.js'

function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  const value = useMemo(() => {
    const language = getLanguage(lang)
    return {
      lang,
      setLang,
      dir: language.dir,
      speechLang: language.speechLang,
      t: (key) => translate(lang, key),
    }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export default LanguageProvider
