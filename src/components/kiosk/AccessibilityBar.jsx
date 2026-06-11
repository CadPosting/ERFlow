import { useLanguage } from '../../i18n/context.js'
import { isSupported as speechSupported } from '../../services/speech.js'

function Toggle({ active, onClick, icon, label }) {
  return (
    <button type="button" className={`a11y-toggle ${active ? 'active' : ''}`} onClick={onClick} aria-pressed={active}>
      <span aria-hidden="true">{icon}</span> {label}
    </button>
  )
}

function AccessibilityBar({ a11y, onChangeLanguage }) {
  const { t } = useLanguage()

  return (
    <div className="a11y-bar">
      {speechSupported() && (
        <Toggle active={a11y.readAloud} onClick={() => a11y.toggle('readAloud')} icon="🔊" label={t('kiosk.readAloud')} />
      )}
      <Toggle active={a11y.largeText} onClick={() => a11y.toggle('largeText')} icon="🔍" label={t('kiosk.largeText')} />
      <Toggle active={a11y.highContrast} onClick={() => a11y.toggle('highContrast')} icon="◐" label={t('kiosk.highContrast')} />
      {onChangeLanguage && (
        <Toggle active={false} onClick={onChangeLanguage} icon="🌐" label={t('kiosk.language')} />
      )}
    </div>
  )
}

export default AccessibilityBar
