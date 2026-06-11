// Ordered severity levels shared by all venues. Rank drives comparisons in
// the routing engine; kioskPromptKey/labelKey resolve through i18n strings.
export const severities = [
  { id: 'low', rank: 0, labelKey: 'severity.low', kioskPromptKey: 'severity.low.prompt', color: '#22c55e' },
  { id: 'medium', rank: 1, labelKey: 'severity.medium', kioskPromptKey: 'severity.medium.prompt', color: '#eab308' },
  { id: 'high', rank: 2, labelKey: 'severity.high', kioskPromptKey: 'severity.high.prompt', color: '#f97316' },
  { id: 'critical', rank: 3, labelKey: 'severity.critical', kioskPromptKey: 'severity.critical.prompt', color: '#ef4444' },
]

export const severityIds = severities.map((s) => s.id)

export function getSeverity(id) {
  return severities.find((s) => s.id === id) ?? null
}
