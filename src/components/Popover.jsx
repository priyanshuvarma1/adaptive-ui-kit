import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn'
import { Icon } from './Icon'

/** Click-to-open popover anchored under its trigger. Widths are in rem. */
export function Popover({ trigger, align = 'end', className, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div ref={ref} className="relative inline-flex">
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open && (
        <div className={cn('ui-popover top-[calc(100%+0.35rem)]',
                           align === 'end' ? 'right-0' : 'left-0', className)}
             onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  )
}

export function MenuItem({ icon, danger, children, ...rest }) {
  return (
    <button className={cn('ui-menuitem', danger && 'text-danger hover:text-danger')} {...rest}>
      {icon && <Icon as={icon} size="sm" />}
      {children}
    </button>
  )
}

export function MenuSeparator() {
  return <hr className="ui-divider my-[0.3rem]" />
}

/** Tooltip on hover/focus — pure CSS positioning, rem-sized. */
export function Tooltip({ label, side = 'top', children }) {
  const pos = {
    top:    'bottom-[calc(100%+0.4rem)] left-1/2 -translate-x-1/2',
    bottom: 'top-[calc(100%+0.4rem)] left-1/2 -translate-x-1/2',
    left:   'right-[calc(100%+0.4rem)] top-1/2 -translate-y-1/2',
    right:  'left-[calc(100%+0.4rem)] top-1/2 -translate-y-1/2',
  }[side]
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span className={cn('ui-tooltip opacity-0 transition-opacity duration-150',
                          'group-hover/tt:opacity-100 group-focus-within/tt:opacity-100', pos)}>
        {label}
      </span>
    </span>
  )
}
