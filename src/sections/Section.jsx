import { cn } from '../lib/cn'

export function Section({ id, eyebrow, title, lead, aside, className, children }) {
  return (
    <section id={id} className={cn('ui-section', className)}>
      <div className="mb-[var(--layout-gap)] flex flex-wrap items-end justify-between gap-[1rem]">
        <div>
          {eyebrow && <p className="ui-eyebrow">{eyebrow}</p>}
          <h2 className="ui-h2 ui-prose mt-[0.3rem]">{title}</h2>
          {lead && <p className="ui-lead mt-[0.5rem]">{lead}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}

export function Row({ label, className, children }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-[0.6rem] py-[0.7rem]', className)}>
      {label && <span className="w-[7rem] flex-none text-xs font-medium text-ink-3">{label}</span>}
      {children}
    </div>
  )
}
