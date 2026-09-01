import { useEffect, useState } from 'react'

/**
 * Reads the screen class that scale.css decided on (--screen-class) plus the
 * resolved root font size. Handy for debugging the scale ladder and for the
 * rare component that needs to branch in JS rather than CSS.
 */
export function useScreenClass() {
/**
 * Custom properties are NOT computed to lengths — getPropertyValue('--ui-ctl')
 * returns the literal token `min(calc(0.75rem + 4px), 22px)`, which parseFloat
 * turns into NaN. The only way to read a resolved value is to let layout do it:
 * apply the var to a real element and measure the box.
 */
function resolveLength(varName) {
  const el = document.createElement('div')
  el.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;height:var(${varName})`
  document.body.appendChild(el)
  const px = el.getBoundingClientRect().height
  el.remove()
  return px
}

  const read = () => {
    if (typeof window === 'undefined') return { cls: 'base', root: 16, ctl: 16, w: 0, h: 0, dpr: 1 }
    const cs = getComputedStyle(document.documentElement)
    return {
      cls: (cs.getPropertyValue('--screen-class') || '"base"').trim().replace(/"/g, ''),
      root: parseFloat(cs.fontSize),
      ctl: resolveLength('--ui-ctl'),
      w: window.innerWidth,
      h: window.innerHeight,
      dpr: window.devicePixelRatio || 1,
    }
  }

  const [state, setState] = useState(read)

  useEffect(() => {
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setState(read()))
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', onResize) }
  }, [])

  return state
}

export const SCREEN_LABEL = {
  sm: 'Mobile', md: 'Tablet · 768–1279', hd: 'HD · 1280–1599', 'hd+': 'HD+ · 1600–1727',
  fhd: 'Full HD · 1728–2303', '2k': '2K / QHD · 2304–3455', '4k': '4K / UHD · 3456+',
  '5k+': '5K+', base: 'base',
}
