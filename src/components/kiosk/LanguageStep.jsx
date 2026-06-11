import { languages } from '../../i18n/strings.js'
import BigButton from './BigButton.jsx'

// First screen: welcome + language pick in one tap. Titles are shown in
// every language since the visitor hasn't chosen one yet.
function LanguageStep({ onPick }) {
  return (
    <div className="kiosk-step">
      <h1 className="kiosk-title">
        Welcome · Bienvenido · Bienvenue · <bdi>مرحبًا</bdi>
      </h1>
      <p className="kiosk-subtitle">
        Choose your language · Elija su idioma · Choisissez votre langue · <bdi>اختر لغتك</bdi>
      </p>
      <div className="kiosk-options">
        {languages.map((language) => (
          <BigButton key={language.id} icon="🌐" label={language.label} onClick={() => onPick(language.id)} />
        ))}
      </div>
    </div>
  )
}

export default LanguageStep
