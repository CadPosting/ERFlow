import { useEffect, useState } from 'react'
import { useTickets } from '../hooks/useTickets.js'
import { useVenue } from '../hooks/useVenue.js'
import { useLanguage } from '../i18n/context.js'
import ticketStore from '../services/ticketStore.js'
import { buildSeedTickets } from '../services/seed.js'
import FilterBar from '../components/dashboard/FilterBar.jsx'
import TicketColumns from '../components/dashboard/TicketColumns.jsx'
import '../styles/dashboard.css'

function Dashboard() {
  const venue = useVenue()
  const { t } = useLanguage()
  const tickets = useTickets()
  const [filters, setFilters] = useState({ department: 'all', severity: 'all', showResolved: false })

  // Re-evaluate relative times and overdue badges twice a minute.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(interval)
  }, [])

  // First visit with an empty store: load the demo dataset so the board has
  // something to show.
  useEffect(() => {
    if (ticketStore.getSnapshot().length === 0) {
      ticketStore.seed(buildSeedTickets())
    }
  }, [])

  const visible = tickets.filter(
    (ticket) =>
      ticket.venueId === venue.id &&
      (filters.department === 'all' || ticket.routing.department === filters.department) &&
      (filters.severity === 'all' || ticket.severity === filters.severity),
  )

  async function setStatus(id, status) {
    await ticketStore.setStatus(id, status)
  }

  return (
    <main className="container dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Staff Dashboard</h1>
          <p className="dashboard-venue">
            {venue.icon} {t(venue.nameKey)} · live board
          </p>
        </div>
        <div className="dashboard-tools">
          <button type="button" className="btn btn-outline" onClick={() => ticketStore.seed(buildSeedTickets())}>
            Load demo data
          </button>
          <button type="button" className="btn btn-outline" onClick={() => ticketStore.clearAll()}>
            Clear all
          </button>
        </div>
      </header>

      <FilterBar venue={venue} filters={filters} onChange={setFilters} />
      <TicketColumns
        venue={venue}
        tickets={visible}
        showResolved={filters.showResolved}
        now={now}
        onSetStatus={setStatus}
      />
    </main>
  )
}

export default Dashboard
