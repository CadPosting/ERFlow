import { severities } from '../data/severities.js'
import { getCategory, getSubcategory } from '../data/venues/index.js'

const rankById = new Map(severities.map((s) => [s.id, s.rank]))

export function severityRank(severityId) {
  const rank = rankById.get(severityId)
  if (rank === undefined) throw new Error(`Unknown severity: ${severityId}`)
  return rank
}

function maxSeverity(a, b) {
  return severityRank(a) >= severityRank(b) ? a : b
}

// Category and subcategory may each declare a minSeverityFloor (e.g. chest
// pain is always critical, whatever the reporter picked). Returns the
// effective severity for routing.
export function applySeverityFloor(venue, { categoryId, subcategoryId, severity }) {
  let effective = severity
  const category = getCategory(venue, categoryId)
  if (category?.minSeverityFloor) effective = maxSeverity(effective, category.minSeverityFloor)
  const subcategory = getSubcategory(venue, categoryId, subcategoryId)
  if (subcategory?.minSeverityFloor) effective = maxSeverity(effective, subcategory.minSeverityFloor)
  return effective
}

function ruleMatches(rule, draft) {
  const { categoryId, subcategoryId, minSeverity } = rule.match
  if (categoryId !== undefined && categoryId !== draft.categoryId) return false
  if (subcategoryId !== undefined && subcategoryId !== draft.subcategoryId) return false
  if (minSeverity !== undefined && severityRank(draft.severity) < severityRank(minSeverity)) return false
  return true
}

// First-match-wins over the venue's ordered rule list. Severity floors are
// applied before matching, and the floored severity is returned so the
// ticket records what was actually used.
export function routeTicket(venue, { categoryId, subcategoryId, severity }) {
  const effectiveSeverity = applySeverityFloor(venue, { categoryId, subcategoryId, severity })
  const draft = { categoryId, subcategoryId, severity: effectiveSeverity }

  const rule = venue.routingRules.find((r) => ruleMatches(r, draft))
  if (!rule) {
    throw new Error(`Venue "${venue.id}" routing rules have no catch-all fallback`)
  }

  return {
    severity: effectiveSeverity,
    routing: { ...rule.route, ruleId: rule.id },
  }
}

// A ticket is overdue when it has not been acknowledged within its SLA.
export function isOverdue(ticket, now = Date.now()) {
  if (ticket.status !== 'new') return false
  const deadline = new Date(ticket.createdAt).getTime() + ticket.routing.slaMinutes * 60_000
  return now > deadline
}
