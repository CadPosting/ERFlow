import { useState } from 'react'

const A11Y_KEY = 'erflow.a11y'

const defaults = { largeText: false, highContrast: false, readAloud: false }

function load() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(A11Y_KEY)) }
  } catch {
    return { ...defaults }
  }
}

// Kiosk accessibility preferences, persisted per device so a kiosk keeps its
// configuration between visitors.
export function useAccessibility() {
  const [prefs, setPrefs] = useState(load)

  function toggle(key) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem(A11Y_KEY, JSON.stringify(next))
      return next
    })
  }

  return { ...prefs, toggle }
}
