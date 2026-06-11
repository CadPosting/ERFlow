import { useEffect } from 'react'
import { useLanguage } from '../../i18n/context.js'

const RESET_AFTER_MS = 20_000

function TicketCreated({ ticket, onReset }) {
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(onReset, RESET_AFTER_MS)
    return () => clearTimeout(timer)
  }, [onReset])

  return (
    <div className="kiosk-step kiosk-done" aria-live="assertive">
      <div className="kiosk-done-icon" aria-hidden="true">✅</div>
      <h1 className="kiosk-title">{t('kiosk.ticketCreated')}</h1>
      <p className="kiosk-subtitle">{t('kiosk.helpOnWay')}</p>
      <p className="kiosk-subtitle">{t('kiosk.yourNumber')}:</p>
      <div className="kiosk-ticket-id">{ticket.id}</div>
      <button type="button" className="kiosk-next btn btn-primary" onClick={onReset}>
        {t('kiosk.newReport')}
      </button>
    </div>
  )
}

export default TicketCreated
