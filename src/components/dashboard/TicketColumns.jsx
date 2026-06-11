import TicketCard from './TicketCard.jsx'

const COLUMNS = [
  { status: 'new', label: 'New' },
  { status: 'acknowledged', label: 'Acknowledged' },
  { status: 'in_progress', label: 'In progress' },
  { status: 'resolved', label: 'Resolved' },
]

function sortForBoard(a, b) {
  if (a.routing.priority !== b.routing.priority) return a.routing.priority - b.routing.priority
  return b.createdAt.localeCompare(a.createdAt)
}

function TicketColumns({ venue, tickets, showResolved, now, onSetStatus }) {
  const columns = COLUMNS.filter((c) => showResolved || c.status !== 'resolved')

  return (
    <div className={`ticket-columns columns-${columns.length}`}>
      {columns.map((column) => {
        const items = tickets.filter((ticket) => ticket.status === column.status).sort(sortForBoard)
        return (
          <section key={column.status} className="ticket-column" aria-label={column.label}>
            <h2 className="column-title">
              {column.label} <span className="column-count">{items.length}</span>
            </h2>
            <div className="column-cards">
              {items.map((ticket) => (
                <TicketCard key={ticket.id} venue={venue} ticket={ticket} now={now} onSetStatus={onSetStatus} />
              ))}
              {items.length === 0 && <p className="column-empty">No tickets</p>}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default TicketColumns
