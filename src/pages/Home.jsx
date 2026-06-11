import { Link, useNavigate } from 'react-router-dom'
import { venues } from '../data/venues/index.js'
import { useVenue } from '../hooks/useVenue.js'
import { useLanguage } from '../i18n/context.js'

const modes = [
  {
    to: '/kiosk',
    icon: '🖥️',
    title: 'Kiosk Mode',
    text: 'The walk-up experience. Guided, touch-friendly intake in multiple languages with read-aloud and large-text support.',
  },
  {
    to: '/dashboard',
    icon: '📋',
    title: 'Staff Dashboard',
    text: 'Live board of incoming tickets, grouped by status and ranked by priority, with SLA and escalation flags.',
  },
  {
    to: '/analytics',
    icon: '📊',
    title: 'Analytics',
    text: 'Volume by category and severity, response-time stats, trends, CSV export and printable reports.',
  },
]

function Home() {
  const venue = useVenue()
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <main className="container">
      <section className="hero-section">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title">
            The right help, <br />
            <span className="gradient-text">at the right time</span>
          </h1>
          <p className="hero-subtitle">
            ERFlow puts a self-service kiosk at the entrance of hospitals, police
            stations, and public-service buildings. Anyone can report a problem in
            their own language &mdash; ERFlow classifies it and routes a ticket to the
            right team at the right priority, instantly.
          </p>
          <div className="hero-actions">
            <Link to="/kiosk" className="btn btn-primary">Try the Kiosk</Link>
            <Link to="/dashboard" className="btn btn-outline">Open Dashboard</Link>
          </div>
        </div>

        <div className="hero-visual animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card ticket-preview">
            <div className="ticket-preview-header">
              <span className="ticket-preview-id">ER-260611-K3F9</span>
              <span className="ticket-preview-badge">Priority 1</span>
            </div>
            <div className="ticket-preview-body">
              <p className="ticket-preview-title">Medical concern &middot; Chest pain</p>
              <p className="ticket-preview-meta">Main lobby &middot; reported 30s ago &middot; Español</p>
              <p className="ticket-preview-route">→ Routed to <strong>Triage</strong>, escalation: code team</p>
            </div>
          </div>
        </div>
      </section>

      <section className="venue-switcher animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <span className="venue-switcher-label">Demo venue:</span>
        {venues.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`venue-chip ${v.id === venue.id ? 'active' : ''}`}
            onClick={() => navigate(`/?venue=${v.id}`)}
          >
            <span aria-hidden="true">{v.icon}</span> {t(v.nameKey)}
          </button>
        ))}
      </section>

      <section className="features-grid">
        {modes.map((mode, i) => (
          <Link
            key={mode.to}
            to={mode.to}
            className="feature-card glass-card mode-card animate-fade-in"
            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
          >
            <div className="feature-icon">{mode.icon}</div>
            <h3>{mode.title}</h3>
            <p>{mode.text}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default Home
