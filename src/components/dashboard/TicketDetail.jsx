import { formatDateTime } from '../../services/format.js'
import { getSeverity } from '../../data/severities.js'
import { useLanguage } from '../../i18n/context.js'

const EVENT_LABELS = {
  created: 'Reported at kiosk',
  acknowledged: 'Acknowledged',
  in_progress: 'Work started',
  resolved: 'Resolved',
}

function TicketDetail({ ticket }) {
  const { t } = useLanguage()

  return (
    <div className="ticket-detail">
      {ticket.description && (
        <p className="ticket-description">“{ticket.description}”</p>
      )}
      <dl className="ticket-detail-grid">
        {ticket.reporter.name && (
          <div><dt>Reporter</dt><dd>{ticket.reporter.name}</dd></div>
        )}
        <div><dt>Reported severity</dt><dd>{t(getSeverity(ticket.reportedSeverity)?.labelKey)}</dd></div>
        <div><dt>SLA</dt><dd>{ticket.routing.slaMinutes} min to acknowledge</dd></div>
        <div><dt>Kiosk</dt><dd>{ticket.kioskId}</dd></div>
      </dl>

      <ol className="ticket-history">
        {ticket.history.map((event, i) => (
          <li key={i}>
            <span className="history-time">{formatDateTime(event.at)}</span>
            <span>{EVENT_LABELS[event.to] ?? event.to}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default TicketDetail
