import { cn } from '../lib/cn'
import { Icon } from './Icon'

const TONES = {
  neutral: 'ui-badge-neutral',
  accent:  'ui-badge-accent',
  ok:      'ui-badge-ok',
  warn:    'ui-badge-warn',
  danger:  'ui-badge-danger',
}

export function Badge({ tone = 'neutral', dot = false, icon, className, children, ...rest }) {
  return (
    <span className={cn('ui-badge', TONES[tone], dot && 'ui-badge-dot', className)} {...rest}>
      {icon && <Icon as={icon} size="sm" />}
      {children}
    </span>
  )
}
