import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { Tabs } from './Misc'

const DEVICES = [
  { id: 'wxga', label: '1280×720',  w: 1280, h: 720 },
  { id: 'hd',   label: '1366×768',  w: 1366, h: 768 },
  { id: 'hdp',  label: '1600×900',  w: 1600, h: 900 },
  { id: 'fhd',  label: '1920×1080', w: 1920, h: 1080 },
  { id: 'qhd',  label: '2560×1440', w: 2560, h: 1440 },
  { id: 'uwq',  label: '3440×1440', w: 3440, h: 1440 },
  { id: 'uhd',  label: '3840×2160', w: 3840, h: 2160 },
]

/**
 * Renders the live app inside an iframe pinned to a real device width, then
 * scales the whole frame down to fit. This is how you check 4K without a 4K
 * monitor: the iframe genuinely reports 3840 CSS px, so scale.css picks the
 * 4K rung for real — it is not a zoom trick applied afterwards.
 */
export function ScreenSimulator({ onClose }) {
  const [device, setDevice] = useState('uhd')
  const [scale, setScale] = useState(0.35)
  const boxRef = useRef(null)
  const dev = DEVICES.find((d) => d.id === device)

  useEffect(() => {
    const fit = () => {
      const el = boxRef.current
      if (!el) return
      const pad = 32
      setScale(Math.min((el.clientWidth - pad) / dev.w, (el.clientHeight - pad) / dev.h, 1))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [dev])

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-canvas">
      <header className="flex flex-none items-center gap-[0.75rem] border-b border-line px-[1rem] py-[0.6rem]">
        <span className="text-sm font-semibold">Resolution preview</span>
        <Tabs items={DEVICES.map((d) => ({ id: d.id, label: d.label }))}
              value={device} onChange={setDevice} />
        <span className="ui-hint font-mono tabular-nums">
          {dev.w}×{dev.h} shown at {(scale * 100).toFixed(0)}%
        </span>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" icon={X} onClick={onClose}>Close</Button>
      </header>

      <div ref={boxRef} className="grid flex-1 place-items-center overflow-hidden bg-surface-2 p-[1rem]">
        <div style={{ width: dev.w * scale, height: dev.h * scale }}>
          <iframe
            key={device}
            title={dev.label}
            src={`${window.location.pathname}?embed=1`}
            style={{
              width: dev.w, height: dev.h,
              transform: `scale(${scale})`, transformOrigin: 'top left',
              border: 0, borderRadius: 8, background: 'var(--color-canvas)',
              boxShadow: '0 20px 60px rgb(0 0 0 / .35)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
