import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, X, Inbox } from 'lucide-react'
import { cn } from '../lib/cn'
import { Icon } from './Icon'
import { Button } from './Button'

export function Tabs({ items = [], value, onChange, className }) {
  return (
    <div role="tablist" className={cn('ui-tabs', className)}>
      {items.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} className="ui-tab"
                onClick={() => onChange?.(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function Progress({ value = 0, tone = 'accent', className }) {
  const color = { accent: 'var(--color-accent)', ok: 'var(--color-ok)',
                  warn: 'var(--color-warn)', danger: 'var(--color-danger)' }[tone]
  return (
    <div className={cn('ui-progress', className)} role="progressbar" aria-valuenow={value}>
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} />
    </div>
  )
}

export function Stat({ label, value, delta, tone = 'ok', icon, footer }) {
  return (
    <div className="ui-card ui-card-pad">
      <div className="flex items-start justify-between gap-[0.75rem]">
        <div className="min-w-0">
          <p className="ui-eyebrow">{label}</p>
          <p className="mt-[0.3rem] text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        </div>
        {icon}
      </div>
      {(delta || footer) && (
        <div className="mt-[0.7rem] flex items-center gap-[0.5rem]">
          {delta && (
            <span className={cn('text-xs font-semibold tabular-nums',
                                tone === 'ok' ? 'text-ok' : tone === 'danger' ? 'text-danger' : 'text-ink-2')}>
              {delta}
            </span>
          )}
          {footer && <span className="ui-hint truncate">{footer}</span>}
        </div>
      )}
    </div>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('ui-skeleton', className)} />
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="flex flex-col items-center gap-[0.6rem] px-[1rem] py-[2.5rem] text-center">
      <span className="ui-icon-tile bg-surface-3 text-ink-3 h-[3rem] w-[3rem] text-[1.25rem]">
        <Icon as={Inbox} size="lg" />
      </span>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="ui-prose text-sm text-ink-2">{body}</p>
      {action}
    </div>
  )
}

/** Toast stack — fixed to the corner, offsets in rem so it scales with the UI. */
export function Toast({ open, onClose, title, body, tone = 'ok' }) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => onClose?.(), 4200)
    return () => clearTimeout(t)
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed bottom-[1.25rem] right-[1.25rem] z-[70] w-[22rem] max-w-[calc(100vw-2rem)]">
      <div className="ui-card ui-card-pad flex items-start gap-[0.7rem] shadow-[var(--shadow-lg)]">
        <Icon as={CheckCircle2} size="lg"
              className={tone === 'ok' ? 'text-ok' : 'text-accent'} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="ui-hint">{body}</p>
        </div>
        <Button variant="ghost" size="xs" iconOnly icon={X} onClick={onClose} aria-label="Dismiss" />
      </div>
    </div>,
    document.body,
  )
}

export function useToast() {
  const [toast, setToast] = useState(null)
  return [toast, setToast]
}
