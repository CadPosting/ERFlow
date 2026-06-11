import { getVenue } from '../data/venues/index.js'
import { routeTicket } from './routingEngine.js'

const STORAGE_KEY = 'erflow.tickets.v1'

export const TICKET_STATUSES = ['new', 'acknowledged', 'in_progress', 'resolved']

// Forward-only lifecycle; resolved is terminal.
const VALID_TRANSITIONS = {
  new: ['acknowledged'],
  acknowledged: ['in_progress', 'resolved'],
  in_progress: ['resolved'],
  resolved: [],
}

function makeTicketId(now) {
  const d = new Date(now)
  const yymmdd = [d.getFullYear() % 100, d.getMonth() + 1, d.getDate()]
    .map((n) => String(n).padStart(2, '0'))
    .join('')
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ER-${yymmdd}-${suffix}`
}

// All public methods are async so a fetch()-based REST implementation can
// replace this module without touching callers. `storage` is injectable for
// tests (any object with getItem/setItem/removeItem).
export function createTicketStore(storage = window.localStorage) {
  const listeners = new Set()
  let cache = load()

  function load() {
    try {
      return JSON.parse(storage.getItem(STORAGE_KEY)) ?? []
    } catch {
      return []
    }
  }

  function persist(tickets) {
    cache = tickets
    storage.setItem(STORAGE_KEY, JSON.stringify(tickets))
    emit()
  }

  function emit() {
    listeners.forEach((listener) => listener())
  }

  // The 'storage' event only fires in OTHER tabs; same-tab updates flow
  // through emit(). Both paths funnel into the same listener set.
  function onStorageEvent(event) {
    if (event.key !== STORAGE_KEY && event.key !== null) return
    cache = load()
    emit()
  }

  return {
    async list() {
      return [...cache].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },

    async get(id) {
      return cache.find((t) => t.id === id) ?? null
    },

    async create(draft) {
      const venue = getVenue(draft.venueId)
      const now = new Date().toISOString()
      const { severity, routing } = routeTicket(venue, draft)

      const ticket = {
        id: makeTicketId(now),
        venueId: venue.id,
        createdAt: now,
        updatedAt: now,
        categoryId: draft.categoryId,
        subcategoryId: draft.subcategoryId ?? null,
        severity,
        reportedSeverity: draft.severity,
        location: draft.location ?? { area: null, detail: '' },
        description: draft.description ?? '',
        reporter: draft.reporter ?? { name: '', contact: '' },
        language: draft.language ?? 'en',
        kioskId: draft.kioskId ?? 'kiosk-1',
        routing,
        status: 'new',
        acknowledgedAt: null,
        resolvedAt: null,
        history: [{ at: now, type: 'created', from: null, to: 'new' }],
      }

      persist([...cache, ticket])
      return ticket
    },

    async setStatus(id, status) {
      const ticket = cache.find((t) => t.id === id)
      if (!ticket) throw new Error(`Unknown ticket: ${id}`)
      if (!VALID_TRANSITIONS[ticket.status].includes(status)) {
        throw new Error(`Invalid transition: ${ticket.status} -> ${status}`)
      }

      const now = new Date().toISOString()
      const updated = {
        ...ticket,
        status,
        updatedAt: now,
        acknowledgedAt: status === 'acknowledged' ? now : ticket.acknowledgedAt,
        resolvedAt: status === 'resolved' ? now : ticket.resolvedAt,
        history: [...ticket.history, { at: now, type: 'status', from: ticket.status, to: status }],
      }

      persist(cache.map((t) => (t.id === id ? updated : t)))
      return updated
    },

    async seed(tickets) {
      persist(tickets)
    },

    async clearAll() {
      storage.removeItem(STORAGE_KEY)
      cache = []
      emit()
    },

    subscribe(listener) {
      if (listeners.size === 0 && typeof window !== 'undefined') {
        window.addEventListener('storage', onStorageEvent)
      }
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0 && typeof window !== 'undefined') {
          window.removeEventListener('storage', onStorageEvent)
        }
      }
    },

    getSnapshot() {
      return cache
    },
  }
}

const defaultStore = typeof window !== 'undefined' ? createTicketStore() : null

export default defaultStore
