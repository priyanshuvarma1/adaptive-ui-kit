import { cn } from '../lib/cn'
import { Icon } from './Icon'

export function Field({ label, hint, error, htmlFor, className, children }) {
  return (
    <div className={cn('ui-field', className)}>
      {label && <label className="ui-label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {error ? <span className="ui-hint text-danger">{error}</span>
             : hint && <span className="ui-hint">{hint}</span>}
    </div>
  )
}

export function Input({ size = 'md', icon, className, ...rest }) {
  if (!icon) return <input className={cn('ui-input', size === 'lg' && 'ui-input-lg', className)} {...rest} />
  return (
    <div className="relative">
      <Icon as={icon} className="pointer-events-none absolute left-[0.7rem] top-1/2 -translate-y-1/2 text-ink-3" />
      <input className={cn('ui-input pl-[2.2rem]', size === 'lg' && 'ui-input-lg pl-[2.6rem]', className)} {...rest} />
    </div>
  )
}

export function Select({ className, children, ...rest }) {
  return (
    <div className="relative">
      <select className={cn('ui-input appearance-none pr-[2rem]', className)} {...rest}>{children}</select>
      <svg viewBox="0 0 24 24" aria-hidden="true"
           className="pointer-events-none absolute right-[0.6rem] top-1/2 h-[1em] w-[1em] -translate-y-1/2 text-ink-3"
           fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m6 9 6 6 6-6" /></svg>
    </div>
  )
}

export function Textarea({ rows = 4, className, ...rest }) {
  return <textarea rows={rows} className={cn('ui-input resize-y', className)} {...rest} />
}

export function Switch({ checked = false, onChange, label, id }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-[0.6rem]">
      <button
        id={id} type="button" role="switch" aria-checked={checked}
        data-on={checked} className="ui-switch"
        onClick={() => onChange?.(!checked)}
      />
      {label && <span className="text-sm text-ink-2">{label}</span>}
    </label>
  )
}
