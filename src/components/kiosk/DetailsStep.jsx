import { useLanguage } from '../../i18n/context.js'
import BigButton from './BigButton.jsx'

// Location pick (required) plus optional free text and name. Submitting is a
// single Next tap once a location is selected.
function DetailsStep({ venue, draft, onChange, onNext }) {
  const { t } = useLanguage()

  return (
    <div className="kiosk-step">
      <h1 className="kiosk-title">{t('kiosk.where')}</h1>
      <div className="kiosk-options kiosk-options-compact">
        {venue.locations.map((location) => (
          <BigButton
            key={location.id}
            label={t(location.labelKey)}
            selected={draft.location.area === location.id}
            onClick={() => onChange({ location: { ...draft.location, area: location.id } })}
          />
        ))}
      </div>

      <h2 className="kiosk-title-secondary">{t('kiosk.moreDetails')}</h2>
      <textarea
        className="kiosk-textarea"
        rows={2}
        placeholder={t('kiosk.descriptionPlaceholder')}
        value={draft.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />
      <input
        className="kiosk-input"
        type="text"
        placeholder={t('kiosk.namePlaceholder')}
        value={draft.reporter.name}
        onChange={(e) => onChange({ reporter: { ...draft.reporter, name: e.target.value } })}
      />

      <button type="button" className="kiosk-next btn btn-primary" disabled={!draft.location.area} onClick={onNext}>
        {t('kiosk.next')}
      </button>
    </div>
  )
}

export default DetailsStep
