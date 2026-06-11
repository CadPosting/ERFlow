import { useEffect } from 'react'
import { useTickets } from '../hooks/useTickets.js'
import ticketStore from '../services/ticketStore.js'
import { buildSeedTickets } from '../services/seed.js'
import { useVenue } from '../hooks/useVenue.js'
import { useLanguage } from '../i18n/context.js'
import { getCategory } from '../data/venues/index.js'
import { getSeverity, severities } from '../data/severities.js'
import { getLanguage } from '../i18n/strings.js'
import { countBy, avgAckMinutes, avgResolveMinutes, slaComplianceRate, dailyTrend } from '../services/analytics.js'
import { downloadCsv } from '../services/csv.js'
import BarChart from '../components/charts/BarChart.jsx'
import StatCard from '../components/charts/StatCard.jsx'
import '../styles/analytics.css'
import '../styles/print.css'

function formatMinutes(minutes) {
  if (minutes === null) return '—'
  if (minutes < 60) return `${minutes.toFixed(1)} min`
  return `${(minutes / 60).toFixed(1)} h`
}

function Analytics() {
  const venue = useVenue()
  const { t } = useLanguage()
  const all = useTickets()
  const tickets = all.filter((ticket) => ticket.venueId === venue.id)

  // Same first-visit behavior as the dashboard: an empty store gets demo data.
  useEffect(() => {
    if (ticketStore.getSnapshot().length === 0) {
      ticketStore.seed(buildSeedTickets())
    }
  }, [])

  const byCategory = countBy(tickets, (ticket) => ticket.categoryId).map((row) => ({
    ...row,
    label: getCategory(venue, row.key) ? t(getCategory(venue, row.key).labelKey) : row.key,
  }))

  const byseverityOrder = severities.map((s) => s.id)
  const bySeverity = countBy(tickets, (ticket) => ticket.severity)
    .sort((a, b) => byseverityOrder.indexOf(a.key) - byseverityOrder.indexOf(b.key))
    .map((row) => ({
      ...row,
      label: t(getSeverity(row.key)?.labelKey),
      color: getSeverity(row.key)?.color,
    }))

  const byLanguage = countBy(tickets, (ticket) => ticket.language).map((row) => ({
    ...row,
    label: getLanguage(row.key).label,
  }))

  const trend = dailyTrend(tickets)
  const sla = slaComplianceRate(tickets)
  const open = tickets.filter((ticket) => ticket.status !== 'resolved').length

  return (
    <main className="container analytics">
      <header className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p className="dashboard-venue">
            {venue.icon} {t(venue.nameKey)} · {tickets.length} tickets
          </p>
        </div>
        <div className="dashboard-tools analytics-tools">
          <button type="button" className="btn btn-outline" onClick={() => downloadCsv(tickets)}>
            Export CSV
          </button>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Print report
          </button>
        </div>
      </header>

      <section className="stat-grid">
        <StatCard label="Open tickets" value={open} />
        <StatCard label="Avg time to acknowledge" value={formatMinutes(avgAckMinutes(tickets))} />
        <StatCard label="Avg time to resolve" value={formatMinutes(avgResolveMinutes(tickets))} />
        <StatCard
          label="Acknowledged within SLA"
          value={sla === null ? '—' : `${Math.round(sla * 100)}%`}
        />
      </section>

      <section className="chart-grid">
        <div className="chart-card glass-card">
          <h2>Tickets by category</h2>
          <BarChart items={byCategory} />
        </div>
        <div className="chart-card glass-card">
          <h2>Tickets by severity</h2>
          <BarChart items={bySeverity} />
        </div>
        <div className="chart-card glass-card">
          <h2>Last 7 days</h2>
          <BarChart items={trend} orientation="vertical" />
        </div>
        <div className="chart-card glass-card">
          <h2>Kiosk language usage</h2>
          <BarChart items={byLanguage} />
        </div>
      </section>
    </main>
  )
}

export default Analytics
