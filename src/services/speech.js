// Thin Web Speech API wrapper. Progressive enhancement: callers should hide
// the read-aloud toggle when isSupported() is false.
export function isSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text, speechLang = 'en-US') {
  if (!isSupported() || !text) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = speechLang
  utterance.rate = 0.95
  window.speechSynthesis.speak(utterance)
}

export function stop() {
  if (isSupported()) window.speechSynthesis.cancel()
}
