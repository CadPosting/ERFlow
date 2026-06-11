import { useEffect, useReducer, useCallback } from 'react'
import { Link } from 'react-router-dom'
import LanguageProvider from '../i18n/LanguageProvider.jsx'
import { useLanguage } from '../i18n/context.js'
import { useVenue } from '../hooks/useVenue.js'
import { useAccessibility } from '../hooks/useAccessibility.js'
import ticketStore from '../services/ticketStore.js'
import { speak, stop as stopSpeech } from '../services/speech.js'
import LanguageStep from '../components/kiosk/LanguageStep.jsx'
import CategoryStep from '../components/kiosk/CategoryStep.jsx'
import DetailsStep from '../components/kiosk/DetailsStep.jsx'
import SeverityStep from '../components/kiosk/SeverityStep.jsx'
import ConfirmStep from '../components/kiosk/ConfirmStep.jsx'
import TicketCreated from '../components/kiosk/TicketCreated.jsx'
import AccessibilityBar from '../components/kiosk/AccessibilityBar.jsx'
import WizardProgress from '../components/kiosk/WizardProgress.jsx'
import '../styles/kiosk.css'

const initialState = {
  step: 'language',
  sending: false,
  ticket: null,
  draft: {
    categoryId: null,
    subcategoryId: null,
    location: { area: null, detail: '' },
    description: '',
    reporter: { name: '', contact: '' },
    severity: null,
  },
}

const PREVIOUS_STEP = {
  category: 'language',
  subcategory: 'category',
  details: 'subcategory',
  severity: 'details',
  confirm: 'severity',
}

function reducer(state, action) {
  switch (action.type) {
    case 'pick-category':
      return { ...state, step: 'subcategory', draft: { ...state.draft, categoryId: action.id, subcategoryId: null } }
    case 'pick-subcategory':
      return { ...state, step: 'details', draft: { ...state.draft, subcategoryId: action.id } }
    case 'update-draft':
      return { ...state, draft: { ...state.draft, ...action.patch } }
    case 'details-done':
      return { ...state, step: 'severity' }
    case 'pick-severity':
      return { ...state, step: 'confirm', draft: { ...state.draft, severity: action.id } }
    case 'language-picked':
      return { ...state, step: 'category' }
    case 'goto-language':
      return { ...state, step: 'language' }
    case 'back': {
      const previous = PREVIOUS_STEP[state.step]
      return previous ? { ...state, step: previous } : state
    }
    case 'sending':
      return { ...state, sending: true }
    case 'sent':
      return { ...state, step: 'done', sending: false, ticket: action.ticket }
    case 'reset':
      return initialState
    default:
      return state
  }
}

const STEP_TITLE_KEYS = {
  category: 'kiosk.whatProblem',
  subcategory: 'kiosk.whichBest',
  details: 'kiosk.where',
  severity: 'kiosk.howUrgent',
  confirm: 'kiosk.confirm',
  done: 'kiosk.ticketCreated',
}

function KioskInner() {
  const venue = useVenue()
  const a11y = useAccessibility()
  const { lang, setLang, dir, speechLang, t } = useLanguage()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { step, draft, ticket, sending } = state

  // Read each step's prompt aloud when the toggle is on.
  useEffect(() => {
    if (!a11y.readAloud) return
    const titleKey = STEP_TITLE_KEYS[step]
    if (titleKey) speak(t(titleKey), speechLang)
    return stopSpeech
  }, [step, a11y.readAloud, t, speechLang])

  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  async function send() {
    dispatch({ type: 'sending' })
    const created = await ticketStore.create({ ...draft, venueId: venue.id, language: lang })
    dispatch({ type: 'sent', ticket: created })
  }

  return (
    <div
      className={`kiosk ${a11y.largeText ? 'kiosk-large-text' : ''} ${a11y.highContrast ? 'kiosk-high-contrast' : ''}`}
      dir={dir}
      lang={lang}
    >
      <header className="kiosk-header">
        <div className="kiosk-venue">
          <span aria-hidden="true">{venue.icon}</span> {t(venue.nameKey)}
        </div>
        <WizardProgress step={step} />
        <AccessibilityBar a11y={a11y} onChangeLanguage={step !== 'language' ? () => dispatch({ type: 'goto-language' }) : null} />
      </header>

      <main className="kiosk-main">
        {step === 'language' && (
          <LanguageStep
            onPick={(id) => {
              setLang(id)
              dispatch({ type: 'language-picked' })
            }}
          />
        )}
        {step === 'category' && (
          <CategoryStep venue={venue} mode="category" onPick={(id) => dispatch({ type: 'pick-category', id })} />
        )}
        {step === 'subcategory' && (
          <CategoryStep
            venue={venue}
            mode="subcategory"
            categoryId={draft.categoryId}
            onPick={(id) => dispatch({ type: 'pick-subcategory', id })}
          />
        )}
        {step === 'details' && (
          <DetailsStep
            venue={venue}
            draft={draft}
            onChange={(patch) => dispatch({ type: 'update-draft', patch })}
            onNext={() => dispatch({ type: 'details-done' })}
          />
        )}
        {step === 'severity' && <SeverityStep onPick={(id) => dispatch({ type: 'pick-severity', id })} />}
        {step === 'confirm' && <ConfirmStep venue={venue} draft={draft} onSend={send} sending={sending} />}
        {step === 'done' && <TicketCreated ticket={ticket} onReset={reset} />}
      </main>

      <footer className="kiosk-footer">
        {PREVIOUS_STEP[step] && (
          <button type="button" className="kiosk-nav-btn" onClick={() => dispatch({ type: 'back' })}>
            ← {t('kiosk.back')}
          </button>
        )}
        {step !== 'language' && step !== 'done' && (
          <button type="button" className="kiosk-nav-btn" onClick={reset}>
            ⟲ {t('kiosk.startOver')}
          </button>
        )}
        <Link to="/" className="kiosk-exit" aria-label="Exit kiosk">
          ERFlow
        </Link>
      </footer>
    </div>
  )
}

function Kiosk() {
  return (
    <LanguageProvider>
      <KioskInner />
    </LanguageProvider>
  )
}

export default Kiosk
