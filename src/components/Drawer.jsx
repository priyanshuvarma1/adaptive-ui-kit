import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/cn'
import { Icon } from './Icon'
import { Burger } from './Navbar'

/** Off-canvas navigation opened by the hamburger. Width in rem, capped by vw. */
export function Drawer({ open, onClose, groups = [], current, onNavigate, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <>
      <div className="ui-scrim" onClick={onClose} />
      <aside className="ui-drawer" aria-label="Main navigation">
        <div className="flex h-[var(--nav-h)] flex-none items-center gap-[0.5rem] border-b border-line px-[0.9rem]">
          <Burger open onClick={onClose} />
          <span className="text-base font-semibold tracking-tight">Aperture</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-[0.7rem]">
          {groups.map((g) => (
            <div key={g.label} className="mb-[1rem]">
              <p className="ui-eyebrow px-[0.6rem] pb-[0.4rem]">{g.label}</p>
              <ul className="flex flex-col gap-[0.1rem]">
                {g.items.map((it) => (
                  <li key={it.id}>
                    <a href="#" className={cn('ui-navlink w-full justify-start')}
                       aria-current={current === it.id ? 'page' : undefined}
                       onClick={(e) => { e.preventDefault(); onNavigate?.(it.id); onClose?.() }}>
                      <Icon as={it.icon} size="sm" />
                      <span className="flex-1">{it.label}</span>
                      {it.badge && (
                        <span className="ui-badge ui-badge-accent">{it.badge}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {footer && <div className="flex-none border-t border-line p-[0.9rem]">{footer}</div>}
      </aside>
    </>,
    document.body,
  )
}
