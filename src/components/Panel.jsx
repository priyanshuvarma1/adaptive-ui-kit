import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/cn'
import { Icon } from './Icon'

export function Panel({ title, subtitle, actions, className, children }) {
  return (
    <section className={cn('ui-panel', className)}>
      {(title || actions) && (
        <header className="ui-panel-head">
          <div className="min-w-0">
            {title && <h3 className="truncate text-sm font-semibold text-ink">{title}</h3>}
            {subtitle && <p className="ui-hint truncate">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-none items-center gap-[0.35rem]">{actions}</div>}
        </header>
      )}
      <div className="ui-panel-body">{children}</div>
    </section>
  )
}

export function Accordion({ items = [], defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="ui-panel divide-y divide-line">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.title}>
            <button
              className="flex w-full items-center justify-between gap-[0.75rem] px-[1.1rem] py-[0.8rem] text-left hover:bg-surface-2"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="text-sm font-medium text-ink">{item.title}</span>
              <Icon as={ChevronDown} size="sm"
                    className={cn('text-ink-3 transition-transform duration-200', isOpen && 'rotate-180')} />
            </button>
            <div className="grid transition-[grid-template-rows] duration-200 ease-[var(--ease-out-soft)]"
                 style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
              <div className="overflow-hidden">
                <p className="px-[1.1rem] pb-[0.95rem] text-sm text-ink-2">{item.body}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
