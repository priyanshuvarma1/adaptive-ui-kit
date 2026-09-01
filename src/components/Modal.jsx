import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../lib/cn'
import { Button } from './Button'

const SIZES = { sm: 'ui-modal-sm', md: '', lg: 'ui-modal-lg' }

export function Modal({ open, onClose, title, description, size = 'md', footer, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <>
      <div className="ui-scrim" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className={cn('ui-modal', SIZES[size])}>
        <header className="ui-modal-head">
          <div className="min-w-0">
            <h2 className="ui-h3 font-semibold">{title}</h2>
            {description && <p className="mt-[0.25rem] text-sm text-ink-2">{description}</p>}
          </div>
          <Button variant="ghost" size="sm" iconOnly icon={X} onClick={onClose} aria-label="Close" />
        </header>
        <div className="ui-modal-body">{children}</div>
        <footer className="ui-modal-foot">
          {footer ?? (
            <>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={onClose}>Confirm</Button>
            </>
          )}
        </footer>
      </div>
    </>,
    document.body,
  )
}
