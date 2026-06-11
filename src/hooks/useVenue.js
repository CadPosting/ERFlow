import { useSearchParams } from 'react-router-dom'
import { getVenue, DEFAULT_VENUE_ID } from '../data/venues/index.js'

const VENUE_KEY = 'erflow.venue'

// Venue resolution: explicit ?venue= param wins and is persisted (a deployed
// kiosk boots to its venue URL once); otherwise the persisted choice; else
// the default. All app modes share the same resolution.
export function useVenue() {
  const [searchParams] = useSearchParams()
  const fromUrl = searchParams.get('venue')

  if (fromUrl && getVenue(fromUrl).id === fromUrl) {
    localStorage.setItem(VENUE_KEY, fromUrl)
    return getVenue(fromUrl)
  }

  return getVenue(localStorage.getItem(VENUE_KEY) ?? DEFAULT_VENUE_ID)
}

export function setStoredVenue(id) {
  localStorage.setItem(VENUE_KEY, id)
}
