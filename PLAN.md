# ERFlow — Emergency Response Flow Management

## Problem Statement

Public-service venues — hospitals, police stations, government service buildings, embassies — handle a constant stream of walk-in problems: medical concerns, safety incidents, facility hazards, requests for help. Today that stream funnels through overloaded front desks and triage staff. People wait in the wrong line, struggle with language barriers, give incomplete information, and urgent issues sit unnoticed behind routine ones. Staff burn time on intake and dispatch instead of response. In a field this sensitive, the intake-and-routing problem is real, costly, and largely unaddressed.

## Vision

ERFlow puts a walk-up kiosk at the entrance of a venue. Anyone can use it: a guided, touch-friendly flow in their own language helps them identify their problem in plain words. The system classifies the issue, generates a ticket/report, and routes it to the right department at the right priority — instantly. Staff see a live board of incoming tickets sorted by urgency, with escalation flags when something needs outside help (EMS, code team, 911 dispatch). Managers see analytics on volume, categories, and response times.

The result: less human workload on intake, faster response to urgent problems, and a more accessible public service — especially for people who can't easily explain their problem at a counter.

## Users

| Persona | Need |
|---|---|
| **Member of the public** at the kiosk — including limited-English speakers, elderly users, people with low vision or motor difficulties | Report a problem or ask for help quickly, in their own language, without reading dense forms |
| **Department responder** (triage nurse, security officer, facilities tech, service counter) | See incoming tickets for their department, ranked by priority, and work them through a clear lifecycle |
| **Operations manager** | Understand volume, categories, response times; export reports; tune routing |

## MVP Scope

| Feature | In MVP |
|---|---|
| Kiosk intake wizard (language → category → details → severity → confirm → ticket) | ✅ |
| Ticket routing engine (category + severity → department, priority, SLA, escalation) | ✅ |
| Staff dashboard (live board, filters, status lifecycle, overdue flags) | ✅ |
| Reports & analytics (counts, response times, trend, CSV export, print view) | ✅ |
| Venue profiles (hospital flagship; police, government office, embassy) | ✅ |
| i18n (EN/ES/FR/AR incl. RTL) + accessibility suite (read-aloud, large text, high contrast) | ✅ |
| Real backend, auth, notifications, kiosk hardware | Roadmap (below) |

## Architecture

Frontend-only prototype. All persistence sits behind one async data-service module so a real backend swaps in later without touching the UI.

```
┌─────────┐  ┌────────────┐  ┌────────────┐
│  Kiosk   │  │ Dashboard  │  │ Analytics  │   pages (React Router)
└────┬────┘  └─────┬──────┘  └─────┬──────┘
     │             │               │
     └──────── hooks: useTickets / useVenue / useAccessibility ────────
                   │
            ┌──────▼───────┐      ┌────────────────┐
            │ ticketStore  │◄─────│ routingEngine   │  pure core (tested)
            │ (async API)  │      │ venue rules data│
            └──────┬───────┘      └────────────────┘
                   │  ◄── THE SEAM: swap for fetch()-based REST client later
            ┌──────▼───────┐
            │ localStorage │  + storage events for cross-tab live updates
            └──────────────┘
```

- **`src/services/ticketStore.js`** — factory `createTicketStore(storage)`; async `list/get/create/setStatus/seed/clearAll`, sync `getSnapshot()`, and `subscribe()` unifying a same-tab emitter with the cross-tab `storage` event. Single key `erflow.tickets.v1`.
- **`src/services/routingEngine.js`** — pure functions, no React/window imports: `routeTicket`, `applySeverityFloor`, `isOverdue`, `severityRank`. Unit-tested with Vitest.
- **`src/data/venues/`** — per-venue profiles (categories, departments, locations, routing rules) as data, not code. Kiosks boot to their venue via `?venue=` URL param; hospital is the default.

## Data Model

**Severity** (ordered): `low < medium < high < critical`, each with plain-language kiosk copy ("It can wait" … "Life-threatening — I need help NOW"). Categories may declare a `minSeverityFloor` — e.g., chest pain is always treated as critical no matter what the reporter picks.

**Ticket**

```js
{
  id: 'ER-260611-K3F9',            // human-readable, shown big on the kiosk
  venueId, createdAt, updatedAt,
  categoryId, subcategoryId, severity,
  location: { area, detail },       // area from the venue's preset list
  description,                      // optional free text
  reporter: { name, contact },      // optional — anonymous allowed
  language,                         // language used at the kiosk
  routing: { department, priority,  // 1 (highest) – 4
             slaMinutes, escalateTo },
  status: 'new',                    // new → acknowledged → in_progress → resolved
  acknowledgedAt, resolvedAt,
  history: [{ at, type, from, to }],
}
```

**Routing rules** — ordered array per venue, first-match-wins, mandatory catch-all last. Hospital examples:

| Category | Min severity | → Department | Priority | SLA | Escalate |
|---|---|---|---|---|---|
| medical-concern / person-collapsed | (floored critical) | triage | 1 | 2 min | code-team |
| medical-concern | high | triage | 1 | 3 min | code-team |
| medical-concern | any | triage | 2 | 10 min | — |
| safety-security | high | security | 1 | 3 min | dispatch-911 |
| safety-security | any | security | 2 | 10 min | — |
| facility-issue / spill-hazard | any | facilities | 2 | 15 min | — |
| facility-issue | any | facilities | 3 | 60 min | — |
| assistance | any | patient services | 3 | 20 min | — |
| *fallback* | any | patient services | 3 | 30 min | — |

External escalation targets (EMS, code team, 911 dispatch) are flagged `external: true` and render as an action banner on the dashboard — the prototype can't page anyone, so it tells staff who to call.

## Venue Profiles

- **Hospital** (flagship demo): triage, security, facilities, patient services. Categories: medical concern, safety & security, facility issue, assistance (wayfinding, wheelchair help, interpreter needed, billing/records, lost item).
- **Police station**: dispatch, front desk, records, victim services. Categories: emergency now, file a report, records & permits, victim support, facility issue.
- **Government services office**: service counter, case officers, facilities, security. Categories: service request, document help, complaint/feedback, accessibility help, facility issue.
- **Embassy**: consular, security, front desk. Categories: citizen emergency, passport & visa, appointments, general inquiry.

## Accessibility & i18n Principles

Serving the general public makes accessibility a core requirement, not polish:

- **Language first**: the kiosk's first screen is a language picker (EN, ES, FR, AR at launch — Arabic exercises right-to-left layout); switchable at any step; the ticket records the language used so responders know.
- **Read-aloud**: each step's prompt can be spoken via the Web Speech API (feature-detected, clearly toggleable).
- **Large text & high contrast** modes, persisted per kiosk.
- **Touch targets ≥ 88px**, simple iconography, plain-language copy at a low reading level.
- **Keyboard/switch navigable** end-to-end; `aria-live` announcements for step changes and ticket creation.
- **Anonymous reporting allowed** — name/contact are optional.

## Verification Checklist

Automated: `npm run lint`, `npm run build`, `npm test` (Vitest: routing engine + ticket store).

Manual walkthrough:

1. Load demo data from the home page.
2. `/kiosk` (hospital): pick Arabic → layout flips RTL; toggle read-aloud.
3. Report chest pain → severity floors to critical; confirm screen previews "Triage — Priority 1" with code-team escalation.
4. Ticket ID screen shows; kiosk auto-resets after idle.
5. `/dashboard`: ticket is at the top with escalation banner. Open a second tab — create another kiosk ticket and watch it appear in both.
6. Advance new → acknowledged → in progress → resolved; history records timestamps.
7. Leave a ticket unacknowledged past its SLA → overdue badge appears.
8. `?venue=police` → taxonomy and routing change accordingly.
9. `/analytics`: numbers match the board; CSV downloads; print preview is legible.
10. Large-text and high-contrast modes render correctly; complete the kiosk flow keyboard-only.

## Roadmap Beyond MVP

1. **Real backend** (Node + Postgres, or a managed BaaS) behind the existing ticketStore seam; migrate to **TypeScript** at the same time, when shared API types make it pay off.
2. **Auth & roles** — department responders, managers, kiosk device identities.
3. **Notifications** — push/SMS/pager dispatch to departments; server-side escalation timers (SLA breaches escalate automatically, not just badge).
4. **Kiosk hardware** — lockdown browser/kiosk mode, offline queue with sync, device heartbeat monitoring, printed ticket slips.
5. **More languages** + professional translation review; voice input for the description step.
6. **Multi-venue tenancy & admin** — rule editor UI so each venue tunes categories/routing without code.
7. **Audit & compliance** — immutable event log, exportable incident reports for regulators.
