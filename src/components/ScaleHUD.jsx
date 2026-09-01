import { Monitor, Moon, Sun, Ruler, ScanLine } from 'lucide-react'
import { cn } from '../lib/cn'
import { Icon } from './Icon'
import { Button } from './Button'
import { useScreenClass, SCREEN_LABEL } from '../lib/useScreenClass'

const DENSITIES = [
  { id: 'compact', label: 'Compact' },
  { id: 'comfortable', label: 'Comfort' },
  { id: 'spacious', label: 'Spacious' },
]

/**
 * Floating dev HUD: shows which rung of the scale ladder is active right now.
 * Delete this file when you copy the kit into a real project.
 */
export function ScaleHUD({ prefs, setPrefs, simOpen, onToggleSim }) {
  const { cls, root, ctl, w, h, dpr } = useScreenClass()

  return (
    <div className="fixed bottom-[1rem] left-1/2 z-[65] -translate-x-1/2">
      <div className="ui-card flex max-w-[calc(100vw-1.5rem)] items-center gap-[0.55rem]
                      rounded-[var(--radius-pill)] px-[0.7rem] py-[0.35rem]
                      shadow-[var(--shadow-lg)] [&>*]:flex-none
                      bg-[color-mix(in_oklab,var(--color-surface)_88%,transparent)] backdrop-blur-[0.6rem]">

        <span className="flex items-center gap-[0.4rem] whitespace-nowrap pl-[0.2rem]">
          <Icon as={Monitor} size="sm" className="text-accent" />
          <span className="text-xs font-semibold text-ink">{SCREEN_LABEL[cls] ?? cls}</span>
        </span>

        <span className="hidden h-[1rem] w-[var(--hairline)] bg-line xl:block" />

        <span className="hidden whitespace-nowrap font-mono text-2xs text-ink-3 tabular-nums xl:inline">
          {w}×{h} · 1rem {root.toFixed(2)} · ctl {ctl.toFixed(1)} · dpr {dpr}
        </span>

        <span className="h-[1rem] w-[var(--hairline)] bg-line" />

        <div className="ui-tabs hidden lg:inline-flex">
          {DENSITIES.map((d) => (
            <button key={d.id} className="ui-tab" aria-selected={prefs.density === d.id}
                    onClick={() => setPrefs({ density: d.id })}>{d.label}</button>
          ))}
        </div>

        <Button
          variant={prefs.scale === 'fluid' ? 'primary' : 'ghost'}
          size="xs" icon={Ruler}
          onClick={() => setPrefs({ scale: prefs.scale === 'fluid' ? 'stepped' : 'fluid' })}
          title="Fluid = continuous curve (default). Stepped = one value per band."
        >
          {prefs.scale === 'fluid' ? 'Fluid' : 'Stepped'}
        </Button>

        <Button variant={simOpen ? 'primary' : 'ghost'} size="xs" icon={ScanLine}
                onClick={onToggleSim} title="Preview at HD / FHD / 2K / 4K">
          Preview
        </Button>

        <Button variant="ghost" size="xs" iconOnly
                icon={prefs.theme === 'dark' ? Sun : Moon}
                onClick={() => setPrefs({ theme: prefs.theme === 'dark' ? 'light' : 'dark' })}
                aria-label="Toggle theme" />
      </div>
    </div>
  )
}
