import { useLanguage } from '../../i18n/context.js'
import { routeTicket } from '../../services/routingEngine.js'
import { getCategory, getSubcategory, getDepartment } from '../../data/venues/index.js'
import { getSeverity } from '../../data/severities.js'

function ConfirmStep({ venue, draft, onSend, sending }) {
  const { t } = useLanguage()

  const { severity, routing } = routeTicket(venue, draft)
  const category = getCategory(venue, draft.categoryId)
  const subcategory = getSubcategory(venue, draft.categoryId, draft.subcategoryId)
  const location = venue.locations.find((l) => l.id === draft.location.area)
  const department = getDepartment(venue, routing.department)
  const escalation = routing.escalateTo ? getDepartment(venue, routing.escalateTo) : null

  return (
    <div className="kiosk-step">
      <h1 className="kiosk-title">{t('kiosk.confirm')}</h1>

      <dl className="kiosk-summary glass-card">
        <div>
          <dt>{t('kiosk.summary.category')}</dt>
          <dd>
            {category && t(category.labelKey)}
            {subcategory && <> — {t(subcategory.labelKey)}</>}
          </dd>
        </div>
        <div>
          <dt>{t('kiosk.summary.location')}</dt>
          <dd>{location ? t(location.labelKey) : '—'}</dd>
        </div>
        <div>
          <dt>{t('kiosk.summary.severity')}</dt>
          <dd style={{ color: getSeverity(severity)?.color }}>{t(getSeverity(severity)?.labelKey)}</dd>
        </div>
      </dl>

      <p className="kiosk-route-preview">
        {t('kiosk.willAlert')}: <strong>{department ? t(department.nameKey) : routing.department}</strong>
        {' — '}{t('kiosk.priority')} {routing.priority}
      </p>
      {escalation && (
        <p className="kiosk-escalation-note">
          ⚠ {t('kiosk.externalNote')} <strong>{t(escalation.nameKey)}</strong>
        </p>
      )}

      <button type="button" className="kiosk-next btn btn-primary" onClick={onSend} disabled={sending}>
        {t('kiosk.send')}
      </button>
    </div>
  )
}

export default ConfirmStep
