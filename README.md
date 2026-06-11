# ERFlow — Emergency Response Flow Management

Walk-up kiosks for public-service venues — hospitals, police stations, government
service buildings, embassies. Anyone can report a problem through a guided,
touch-friendly flow in their own language; ERFlow classifies it, generates a
ticket, and routes it to the right department at the right priority — reducing
staff workload on intake and getting urgent issues seen faster.

See [PLAN.md](./PLAN.md) for the full project plan: problem statement,
architecture, data model, routing rules, and roadmap.

## Features (MVP)

- **Kiosk intake wizard** (`/kiosk`) — language picker (EN/ES/FR/AR incl. RTL),
  guided category → details → urgency flow, routing preview, big-print ticket
  number, idle auto-reset. Accessibility bar: read-aloud (Web Speech), large
  text, high contrast; ≥88px touch targets; keyboard navigable.
- **Routing engine** — venue-specific rules-as-data: category + severity →
  department, priority, SLA, escalation. Severity floors (e.g. chest pain is
  always critical). Unit-tested.
- **Staff dashboard** (`/dashboard`) — live status board (new → acknowledged →
  in progress → resolved), department/severity filters, overdue SLA badges,
  external-escalation banners. Updates live across browser tabs.
- **Analytics** (`/analytics`) — volume by category/severity/language,
  response-time stats, 7-day trend, CSV export, printable report.
- **Venue profiles** — hospital (flagship demo), police station, government
  services office, embassy. Switch on the home page or with `?venue=police`.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm test          # run the unit tests (routing engine + ticket store)
npm run lint      # eslint
npm run build     # production build
```

Open the dev server URL, pick a demo venue, then try **Kiosk Mode** in one tab
and the **Staff Dashboard** in another — tickets appear live.

## Architecture notes

Frontend-only prototype: persistence is `localStorage` behind
`src/services/ticketStore.js`, an async-signature data service designed so a
real REST backend can replace it without touching the UI. The routing engine
(`src/services/routingEngine.js`) is pure and venue rules live as data in
`src/data/venues/`. See PLAN.md for the post-MVP roadmap (real backend, auth,
notifications, kiosk hardware).
