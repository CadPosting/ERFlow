import { useSyncExternalStore } from 'react'
import ticketStore from '../services/ticketStore.js'

// Live ticket list: re-renders on same-tab mutations and cross-tab storage
// events, both funneled through ticketStore.subscribe.
export function useTickets() {
  return useSyncExternalStore(ticketStore.subscribe, ticketStore.getSnapshot)
}
