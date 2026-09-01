import { useEffect, useState } from 'react'

const KEY = 'ui-kit-prefs'
const DEFAULTS = { theme: 'dark', density: 'comfortable', scale: 'fluid' }

function load() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') } }
  catch { return { ...DEFAULTS } }
}

/** Persists theme / density / scale-mode and mirrors them onto <html>. */
export function usePrefs() {
  const [prefs, setPrefs] = useState(load)

  useEffect(() => {
    const el = document.documentElement
    el.classList.toggle('dark', prefs.theme === 'dark')
    el.dataset.density = prefs.density
    el.dataset.scale = prefs.scale
    try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch { /* private mode */ }
  }, [prefs])

  const set = (patch) => setPrefs((p) => ({ ...p, ...patch }))
  return [prefs, set]
}
