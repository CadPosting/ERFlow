import { minutesBetween } from './format.js'

// Pure aggregations over Ticket[]; the Analytics page maps ids to labels.

export function countBy(tickets, keyFn) {
  const counts = new Map()
  for (const ticket of tickets) {
    const key = keyFn(ticket)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
}

function average(values) {
  if (values.length === 0) return null
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

// Minutes from creation to acknowledgement, averaged over acknowledged tickets.
export function avgAckMinutes(tickets) {
  return average(
    tickets.filter((t) => t.acknowledgedAt).map((t) => minutesBetween(t.createdAt, t.acknowledgedAt)),
  )
}

export function avgResolveMinutes(tickets) {
  return average(
    tickets.filter((t) => t.resolvedAt).map((t) => minutesBetween(t.createdAt, t.resolvedAt)),
  )
}

export function slaComplianceRate(tickets) {
  const acknowledged = tickets.filter((t) => t.acknowledgedAt)
  if (acknowledged.length === 0) return null
  const within = acknowledged.filter(
    (t) => minutesBetween(t.createdAt, t.acknowledgedAt) <= t.routing.slaMinutes,
  )
  return within.length / acknowledged.length
}

// Ticket counts per calendar day for the last `days` days, oldest first.
export function dailyTrend(tickets, days = 7, now = Date.now()) {
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now - i * 24 * 3600_000)
    const key = day.toISOString().slice(0, 10)
    const count = tickets.filter((t) => t.createdAt.slice(0, 10) === key).length
    result.push({ key, label: day.toLocaleDateString(undefined, { weekday: 'short' }), count })
  }
  return result
}
