import { getVenue } from '../data/venues/index.js'
import { routeTicket } from './routingEngine.js'

// Deterministic PRNG so the demo dataset is stable across reloads.
function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LANGUAGES = ['en', 'en', 'en', 'es', 'es', 'fr', 'ar']

const DESCRIPTIONS = {
  'medical-concern': ['My father is having trouble breathing', 'I cut my hand in the parking lot', 'Feeling much worse since this morning', ''],
  'safety-security': ['A man is shouting at the staff near reception', 'My bag was taken from the waiting area', ''],
  'facility-issue': ['Water all over the floor near the elevators', 'The ticket machine is not working', ''],
  assistance: ['I cannot find the radiology department', 'My mother needs a wheelchair from the car', 'I need help reading these forms', ''],
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)]
}

// ~30 hospital tickets spread over the last 7 days, most of them resolved,
// a few recent ones still open so the dashboard has live work to show.
export function buildSeedTickets(now = Date.now()) {
  const rand = mulberry32(42)
  const venue = getVenue('hospital')
  const tickets = []

  for (let i = 0; i < 30; i++) {
    const category = pick(rand, venue.categories)
    const subcategory = pick(rand, category.subcategories)
    const reportedSeverity = pick(rand, ['low', 'low', 'medium', 'medium', 'medium', 'high', 'critical'])

    // Newest tickets last few hours; the rest spread across the week.
    const ageMs = i < 5
      ? rand() * 3 * 3600_000
      : (rand() * 6.5 + 0.2) * 24 * 3600_000
    const createdMs = now - ageMs
    const createdAt = new Date(createdMs).toISOString()

    const draft = { categoryId: category.id, subcategoryId: subcategory.id, severity: reportedSeverity }
    const { severity, routing } = routeTicket(venue, draft)

    const ticket = {
      id: `ER-SEED-${String(i + 1).padStart(3, '0')}`,
      venueId: venue.id,
      createdAt,
      updatedAt: createdAt,
      categoryId: category.id,
      subcategoryId: subcategory.id,
      severity,
      reportedSeverity,
      location: { area: pick(rand, venue.locations).id, detail: '' },
      description: pick(rand, DESCRIPTIONS[category.id] ?? ['']),
      reporter: { name: '', contact: '' },
      language: pick(rand, LANGUAGES),
      kioskId: 'kiosk-1',
      routing,
      status: 'new',
      acknowledgedAt: null,
      resolvedAt: null,
      history: [{ at: createdAt, type: 'created', from: null, to: 'new' }],
    }

    // Older tickets progress through the lifecycle; recent ones stay open.
    const isOld = i >= 5
    if (isOld || rand() < 0.5) {
      const ackMs = createdMs + (rand() * routing.slaMinutes + 1) * 60_000
      advance(ticket, 'acknowledged', ackMs)
      ticket.acknowledgedAt = new Date(ackMs).toISOString()

      if (isOld) {
        const startMs = ackMs + rand() * 20 * 60_000
        advance(ticket, 'in_progress', startMs)
        const resolveMs = startMs + (rand() * 90 + 5) * 60_000
        advance(ticket, 'resolved', resolveMs)
        ticket.resolvedAt = new Date(resolveMs).toISOString()
      }
    }

    tickets.push(ticket)
  }

  return tickets
}

function advance(ticket, status, atMs) {
  const at = new Date(atMs).toISOString()
  ticket.history.push({ at, type: 'status', from: ticket.status, to: status })
  ticket.status = status
  ticket.updatedAt = at
}
