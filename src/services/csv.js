const COLUMNS = [
  ['id', (t) => t.id],
  ['created_at', (t) => t.createdAt],
  ['venue', (t) => t.venueId],
  ['category', (t) => t.categoryId],
  ['subcategory', (t) => t.subcategoryId ?? ''],
  ['severity', (t) => t.severity],
  ['reported_severity', (t) => t.reportedSeverity],
  ['location', (t) => t.location.area ?? ''],
  ['description', (t) => t.description],
  ['language', (t) => t.language],
  ['department', (t) => t.routing.department],
  ['priority', (t) => t.routing.priority],
  ['sla_minutes', (t) => t.routing.slaMinutes],
  ['status', (t) => t.status],
  ['acknowledged_at', (t) => t.acknowledgedAt ?? ''],
  ['resolved_at', (t) => t.resolvedAt ?? ''],
]

function escapeCell(value) {
  const s = String(value)
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
}

export function ticketsToCsv(tickets) {
  const header = COLUMNS.map(([name]) => name).join(',')
  const rows = tickets.map((ticket) => COLUMNS.map(([, get]) => escapeCell(get(ticket))).join(','))
  return [header, ...rows].join('\n')
}

export function downloadCsv(tickets, filename = 'erflow-tickets.csv') {
  const blob = new Blob([ticketsToCsv(tickets)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
