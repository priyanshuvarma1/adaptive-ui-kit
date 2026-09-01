import { Monitor, Ruler, Layers, Gauge } from 'lucide-react'
import { Card } from '../components/Card'
import { Badge } from '../components/Badge'
import { IconTile } from '../components/Icon'
import { useScreenClass, SCREEN_LABEL } from '../lib/useScreenClass'

/* Sampled from the piecewise-fluid curve. Intermediate widths interpolate:
   1440 -> 15.81 · 2048 -> 16.33 · 2880 -> 18.50 · 3440 -> 19.96            */
const LADDER = [
  { cls: 'md',  name: 'Tablet · 1024',        root: '15.50', ctl: '15.6' },
  { cls: 'hd',  name: 'HD · 1366×768',        root: '15.78', ctl: '15.8' },
  { cls: 'hd+', name: 'HD+ · 1600×900',       root: '15.88', ctl: '15.9' },
  { cls: 'fhd', name: 'Full HD · 1920×1080',  root: '16.00', ctl: '16.0' },
  { cls: '2k',  name: '2K / QHD · 2560×1440', root: '17.67', ctl: '17.3' },
  { cls: '4k',  name: '4K / UHD · 3840×2160', root: '21.00', ctl: '19.8' },
]

const PRINCIPLES = [
  { icon: Ruler,   title: 'Type scales — 1.31x, not 1.63x',
    body: 'One continuous curve drives --ui-base. Text grows enough to stay comfortable at higher pixel density; it does not chase constant physical size.' },
  { icon: Gauge,   title: 'Controls scale less, then stop',
    body: 'A second unit, --ui-ctl, grows at 75% of the type rate and hard-caps at 22px. Buttons, inputs, rows and the navbar tighten around the text instead of inflating.' },
  { icon: Layers,  title: 'Layout is viewport-driven',
    body: 'Gutters, section rhythm and grid gaps use clamp() and vw. Extra 4K space becomes whitespace and extra columns — never bigger controls.' },
  { icon: Monitor, title: 'Ceilings where they matter',
    body: 'Radii, icon tiles, navbar height, drawer and modal widths are min(rem, px): they scale normally, then refuse to keep going.' },
]

export function Hero() {
  const { cls, root } = useScreenClass()

  return (
    <section className="ui-section">
      <div className="grid items-start gap-[var(--layout-gap)] lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Badge tone="accent" dot>React · Vite · Tailwind v4</Badge>
          <h1 className="ui-h1 ui-prose mt-[0.7rem]">
            HD comfortable. FHD balanced. 2K spacious. 4K premium. Not 2× bigger.
          </h1>
          <p className="ui-lead mt-[0.8rem]">
            Scaling one multiplier across every dimension is the obvious fix and the wrong one — it turns
            a 4K screen into a 1080p screen viewed through a magnifying glass. This kit splits scale from
            layout from constraint, so text breathes while chrome stays tight.
          </p>

          <div className="mt-[1.25rem] grid gap-[0.8rem] sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="flex gap-[0.7rem]">
                <IconTile as={p.icon} tone="accent" />
                <div>
                  <p className="text-sm font-semibold text-ink">{p.title}</p>
                  <p className="ui-hint mt-[0.15rem]">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="ui-card-pad">
          <div className="mb-[0.8rem] flex items-center justify-between">
            <p className="ui-eyebrow">Scale curve · sampled</p>
            <Badge tone="ok" dot>live: {SCREEN_LABEL[cls] ?? cls}</Badge>
          </div>

          <table className="ui-table ui-table-compact">
            <thead>
              <tr><th>Class</th><th>Screen</th>
                  <th className="ui-table-num">1rem</th>
                  <th className="ui-table-num">ctl</th></tr>
            </thead>
            <tbody>
              {LADDER.map((r) => (
                <tr key={r.cls} className={r.cls === cls ? 'ui-row-active' : undefined}>
                  <td><code className="ui-kbd">{r.cls}</code></td>
                  <td className="text-ink">{r.name}</td>
                  <td className="ui-table-num font-medium text-ink">{r.root}</td>
                  <td className="ui-table-num font-mono text-xs">{r.ctl}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="ui-hint mt-[0.8rem]">
            Right now <code className="ui-kbd">1rem = {root.toFixed(2)}px</code>. The curve is
            continuous, so 1440, 2048, 2880 and 3440 all interpolate — no snapping. Hit{' '}
            <strong className="text-ink">Preview</strong> in the toolbar to render this page inside a real
            3840px viewport.
          </p>
        </Card>
      </div>
    </section>
  )
}
