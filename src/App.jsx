import { useState } from 'react'
import { Github, Ruler } from 'lucide-react'
import { Navbar } from './components/Navbar'
import { Drawer } from './components/Drawer'
import { ScaleHUD } from './components/ScaleHUD'
import { ScreenSimulator } from './components/ScreenSimulator'
import { Button } from './components/Button'
import { usePrefs } from './lib/usePrefs'
import { NAV_LINKS, NAV_GROUPS } from './data/dummy'

import { Hero } from './sections/Hero'
import { Foundations } from './sections/Foundations'
import { Controls } from './sections/Controls'
import { Surfaces } from './sections/Surfaces'
import { DataTable } from './sections/DataTable'
import { Overlays } from './sections/Overlays'

const EMBED = new URLSearchParams(window.location.search).has('embed')

export default function App() {
  const [prefs, setPrefs] = usePrefs()
  const [drawer, setDrawer] = useState(false)
  const [sim, setSim] = useState(false)
  const [page, setPage] = useState('overview')

  return (
    <div className="min-h-dvh">
      <Navbar
        links={NAV_LINKS} current={page} onNavigate={setPage}
        burgerOpen={drawer} onBurger={() => setDrawer(true)}
      />

      <Drawer
        open={drawer} onClose={() => setDrawer(false)}
        groups={NAV_GROUPS} current={page} onNavigate={setPage}
        footer={<Button variant="secondary" size="sm" full icon={Ruler}>Scale settings</Button>}
      />

      <main className="ui-shell pb-[6rem]">
        <Hero />
        <hr className="ui-divider" />
        <Foundations />
        <hr className="ui-divider" />
        <Controls />
        <hr className="ui-divider" />
        <Surfaces />
        <hr className="ui-divider" />
        <DataTable />
        <hr className="ui-divider" />
        <Overlays onOpenDrawer={() => setDrawer(true)} />
      </main>

      <footer className="border-t border-line py-[calc(var(--section-y)*0.5)]">
        <div className="ui-shell flex flex-wrap items-center justify-between gap-[0.75rem]">
          <p className="ui-hint">
            Adaptive UI Kit — copy <code className="ui-kbd">src/styles</code> into any project and import it.
          </p>
          <Button variant="ghost" size="sm" icon={Github}>Source</Button>
        </div>
      </footer>

      {!EMBED && (
        <>
          <ScaleHUD prefs={prefs} setPrefs={setPrefs}
                    simOpen={sim} onToggleSim={() => setSim((s) => !s)} />
          {sim && <ScreenSimulator onClose={() => setSim(false)} />}
        </>
      )}
    </div>
  )
}
