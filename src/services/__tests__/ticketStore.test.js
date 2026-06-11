import { describe, it, expect, beforeEach } from 'vitest'
import { createTicketStore } from '../ticketStore.js'
import { buildSeedTickets } from '../seed.js'

function memoryStorage() {
  const map = new Map()
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, v),
    removeItem: (k) => map.delete(k),
  }
}

describe('ticketStore', () => {
  let storage
  let store

  beforeEach(() => {
    storage = memoryStorage()
    store = createTicketStore(storage)
  })

  const draft = {
    venueId: 'hospital',
    categoryId: 'medical-concern',
    subcategoryId: 'chest-pain',
    severity: 'low',
    location: { area: 'main-lobby', detail: '' },
    language: 'es',
  }

  it('creates a routed ticket with id, history, and floored severity', async () => {
    const ticket = await store.create(draft)

    expect(ticket.id).toMatch(/^ER-\d{6}-[A-Z0-9]{4}$/)
    expect(ticket.severity).toBe('critical')
    expect(ticket.reportedSeverity).toBe('low')
    expect(ticket.routing.department).toBe('triage')
    expect(ticket.status).toBe('new')
    expect(ticket.language).toBe('es')
    expect(ticket.history).toHaveLength(1)
    expect(ticket.history[0]).toMatchObject({ type: 'created', to: 'new' })
  })

  it('persists tickets and reloads them in a fresh store instance', async () => {
    const ticket = await store.create(draft)
    const reloaded = createTicketStore(storage)
    expect(await reloaded.get(ticket.id)).toMatchObject({ id: ticket.id })
  })

  it('lists newest first', async () => {
    await store.seed(buildSeedTickets())
    const list = await store.list()
    for (let i = 1; i < list.length; i++) {
      expect(list[i - 1].createdAt >= list[i].createdAt).toBe(true)
    }
  })

  it('walks the lifecycle and stamps timestamps', async () => {
    const ticket = await store.create(draft)

    const acked = await store.setStatus(ticket.id, 'acknowledged')
    expect(acked.acknowledgedAt).toBeTruthy()

    await store.setStatus(ticket.id, 'in_progress')
    const resolved = await store.setStatus(ticket.id, 'resolved')
    expect(resolved.resolvedAt).toBeTruthy()
    expect(resolved.history.map((h) => h.to)).toEqual(['new', 'acknowledged', 'in_progress', 'resolved'])
  })

  it('rejects invalid transitions', async () => {
    const ticket = await store.create(draft)
    await expect(store.setStatus(ticket.id, 'resolved')).rejects.toThrow(/Invalid transition/)
    await expect(store.setStatus('ER-NOPE-0000', 'acknowledged')).rejects.toThrow(/Unknown ticket/)
  })

  it('notifies subscribers on mutations and supports unsubscribe', async () => {
    let calls = 0
    const unsubscribe = store.subscribe(() => calls++)

    await store.create(draft)
    expect(calls).toBe(1)

    unsubscribe()
    await store.create(draft)
    expect(calls).toBe(1)
  })

  it('clearAll empties the store', async () => {
    await store.create(draft)
    await store.clearAll()
    expect(await store.list()).toEqual([])
    expect(store.getSnapshot()).toEqual([])
  })
})

describe('buildSeedTickets', () => {
  it('is deterministic and produces a mixed-status week of data', () => {
    const now = Date.now()
    const a = buildSeedTickets(now)
    const b = buildSeedTickets(now)
    expect(a).toEqual(b)
    expect(a).toHaveLength(30)

    const statuses = new Set(a.map((t) => t.status))
    expect(statuses.has('resolved')).toBe(true)
    expect(statuses.has('new') || statuses.has('acknowledged')).toBe(true)
  })
})
