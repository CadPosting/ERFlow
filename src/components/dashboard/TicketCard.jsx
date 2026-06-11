import { useState } from 'react'
import { useLanguage } from '../../i18n/context.js'
import { getCategory, getSubcategory, getDepartment } from '../../data/venues/index.js'
import { getSeverity } from '../../data/severities.js'
import { getLanguage } from '../../i18n/strings.js'
import { isOverdue } from '../../services/routingEngine.js'
import { timeAgo } from '../../services/format.js'
import TicketDetail from './TicketDetail.jsx'

const NEXT_ACTION = {
  new: { status: 'acknowledged', label: 'Acknowledge' },
  acknowledged: { status: 'in_progress', label: 'Start work' },
  in_progress: { status: 'resolved', label: 'Resolve' },
}

function TicketCard({ venue, ticket, now, onSetStatus }) {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)

  const category = getCategory(venue, ticket.categoryId)
  const subcategory = getSubcategory(venue, ticket.categoryId, ticket.subcategoryId)
  const department = getDepartment(venue, ticket.routing.department)
  const escalation = ticket.routing.escalateTo ? getDepartment(venue, ticket.routing.escalateTo) : null
  const severity = getSeverity(ticket.severity)
  const location = venue.locations.find((l) => l.id === ticket.location.area)
  const overdue = isOverdue(ticket, now)
  const action = NEXT_ACTION[ticket.status]

  return (
    <article className={`ticket-card glass-card priority-${ticket.routing.priority} ${overdue ? 'overdue' : ''}`}>
      <header className="ticket-card-top">
        <span className="ticket-id">{ticket.id}</span>
        <span className="ticket-badges">
          {overdue && <span className="badge badge-overdue">OVERDUE</span>}
          <span className="badge badge-priority">P{ticket.routing.priority}</span>
          <span className="badge" style={{ background: severity?.color }}>{t(severity?.labelKey)}</span>
        </span>
      </header>

      <p className="ticket-title">
        {category ? t(category.labelKey) : ticket.categoryId}
        {subcategory && <> — {t(subcategory.labelKey)}</>}
      </p>

      <p className="ticket-meta">
        {location ? t(location.labelKey) : '—'} · {timeAgo(ticket.createdAt, now)}
        {' · '}{department ? t(department.nameKey) : ticket.routing.department}
        {ticket.language !== 'en' && <> · 🌐 {getLanguage(ticket.language).label}</>}
      </p>

      {escalation && ticket.status !== 'resolved' && (
        <p className="ticket-escalation">⚠ Call {t(escalation.nameKey)} now</p>
      )}

      <footer className="ticket-card-actions">
        <button type="button" className="ticket-link" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Hide details' : 'Details'}
        </button>
        {action && (
          <button type="button" className="btn btn-primary ticket-action" onClick={() => onSetStatus(ticket.id, action.status)}>
            {action.label}
          </button>
        )}
      </footer>

      {expanded && <TicketDetail venue={venue} ticket={ticket} />}
    </article>
  )
}

export default TicketCard
