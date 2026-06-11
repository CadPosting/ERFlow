import { describe, it, expect } from 'vitest'
import { severityRank, applySeverityFloor, routeTicket, isOverdue } from '../routingEngine.js'
import { getVenue, venues } from '../../data/venues/index.js'

const hospital = getVenue('hospital')
const police = getVenue('police')

describe('severityRank', () => {
  it('orders severities low < medium < high < critical', () => {
    expect(severityRank('low')).toBeLessThan(severityRank('medium'))
    expect(severityRank('medium')).toBeLessThan(severityRank('high'))
    expect(severityRank('high')).toBeLessThan(severityRank('critical'))
  })

  it('throws on unknown severity', () => {
    expect(() => severityRank('bogus')).toThrow(/Unknown severity/)
  })
})

describe('applySeverityFloor', () => {
  it('floors chest pain to critical regardless of reported severity', () => {
    const severity = applySeverityFloor(hospital, {
      categoryId: 'medical-concern',
      subcategoryId: 'chest-pain',
      severity: 'low',
    })
    expect(severity).toBe('critical')
  })

  it('keeps the reported severity when it exceeds the floor', () => {
    const severity = applySeverityFloor(hospital, {
      categoryId: 'safety-security',
      subcategoryId: 'suspicious-item', // floor: high
      severity: 'critical',
    })
    expect(severity).toBe('critical')
  })

  it('leaves severity unchanged without a floor', () => {
    const severity = applySeverityFloor(hospital, {
      categoryId: 'assistance',
      subcategoryId: 'wayfinding',
      severity: 'low',
    })
    expect(severity).toBe('low')
  })
})

describe('routeTicket', () => {
  it('routes critical medical to triage P1 with code-team escalation', () => {
    const { severity, routing } = routeTicket(hospital, {
      categoryId: 'medical-concern',
      subcategoryId: 'person-collapsed',
      severity: 'medium', // floored to critical
    })
    expect(severity).toBe('critical')
    expect(routing).toMatchObject({
      department: 'triage',
      priority: 1,
      slaMinutes: 2,
      escalateTo: 'code-team',
    })
  })

  it('respects rule order: low-severity medical hits the general medical rule', () => {
    const { routing } = routeTicket(hospital, {
      categoryId: 'medical-concern',
      subcategoryId: 'worsening-symptoms',
      severity: 'low',
    })
    expect(routing.ruleId).toBe('medical-any')
    expect(routing.priority).toBe(2)
    expect(routing.escalateTo).toBeNull()
  })

  it('matches subcategory-specific rules before category rules', () => {
    const { routing } = routeTicket(hospital, {
      categoryId: 'facility-issue',
      subcategoryId: 'spill-hazard',
      severity: 'low',
    })
    expect(routing.ruleId).toBe('facility-spill')
    expect(routing.slaMinutes).toBe(15)
  })

  it('falls back to the catch-all for unknown combinations', () => {
    const { routing } = routeTicket(hospital, {
      categoryId: 'not-a-category',
      subcategoryId: null,
      severity: 'low',
    })
    expect(routing.ruleId).toBe('fallback')
    expect(routing.department).toBe('patientservices')
  })

  it('routes per venue: theft routes to security at hospital, front desk at police', () => {
    const atHospital = routeTicket(hospital, {
      categoryId: 'safety-security',
      subcategoryId: 'theft',
      severity: 'low',
    })
    const atPolice = routeTicket(police, {
      categoryId: 'file-report',
      subcategoryId: 'theft',
      severity: 'low',
    })
    expect(atHospital.routing.department).toBe('security')
    expect(atPolice.routing.department).toBe('frontdesk')
  })

  it('every venue has a catch-all fallback', () => {
    for (const venue of venues) {
      const { routing } = routeTicket(venue, {
        categoryId: 'nonexistent',
        subcategoryId: null,
        severity: 'low',
      })
      expect(routing.department).toBeTruthy()
    }
  })
})

describe('isOverdue', () => {
  const base = {
    status: 'new',
    createdAt: new Date('2026-06-11T10:00:00Z').toISOString(),
    routing: { slaMinutes: 10 },
  }
  const at = (minutes) => new Date('2026-06-11T10:00:00Z').getTime() + minutes * 60_000

  it('is not overdue within the SLA window', () => {
    expect(isOverdue(base, at(5))).toBe(false)
  })

  it('is overdue once the SLA passes without acknowledgement', () => {
    expect(isOverdue(base, at(11))).toBe(true)
  })

  it('is never overdue after acknowledgement', () => {
    expect(isOverdue({ ...base, status: 'acknowledged' }, at(60))).toBe(false)
    expect(isOverdue({ ...base, status: 'resolved' }, at(60))).toBe(false)
  })
})
