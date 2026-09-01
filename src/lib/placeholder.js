/**
 * Deterministic, offline SVG placeholders as data-URIs.
 * No network, no binary assets — the demo works on a plane.
 */
const HUES = [268, 200, 152, 28, 340, 92, 250, 12]

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function cover(seed, w = 800, h = 500) {
  const n = hash(seed)
  const a = HUES[n % HUES.length]
  const b = HUES[(n >> 3) % HUES.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${a} 62% 52%)"/><stop offset="1" stop-color="hsl(${b} 58% 34%)"/>
</linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<g fill="none" stroke="rgba(255,255,255,.20)" stroke-width="${Math.max(1, w / 400)}">
<circle cx="${w * 0.22}" cy="${h * 0.28}" r="${h * 0.34}"/>
<circle cx="${w * 0.78}" cy="${h * 0.72}" r="${h * 0.46}"/>
<path d="M0 ${h * 0.78} Q ${w * 0.35} ${h * 0.5} ${w} ${h * 0.86}"/>
</g></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function initials(name) {
  return name.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

export function avatarColor(name) {
  return `hsl(${HUES[hash(name) % HUES.length]} 55% 45%)`
}
