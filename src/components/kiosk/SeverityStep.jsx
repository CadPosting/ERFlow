import { severities } from '../../data/severities.js'
import { useLanguage } from '../../i18n/context.js'
import BigButton from './BigButton.jsx'

function SeverityStep({ onPick }) {
  const { t } = useLanguage()

  return (
    <div className="kiosk-step">
      <h1 className="kiosk-title">{t('kiosk.howUrgent')}</h1>
      <div className="kiosk-options">
        {severities.map((severity) => (
          <BigButton
            key={severity.id}
            color={severity.color}
            label={t(severity.labelKey)}
            sublabel={t(severity.kioskPromptKey)}
            onClick={() => onPick(severity.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default SeverityStep
