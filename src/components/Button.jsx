import { cn } from '../lib/cn'
import { Icon } from './Icon'

const VARIANTS = {
  primary:   'ui-btn-primary',
  secondary: 'ui-btn-secondary',
  ghost:     'ui-btn-ghost',
  danger:    'ui-btn-danger',
  link:      'ui-btn-link',
}
const SIZES = { xs: 'ui-btn-xs', sm: 'ui-btn-sm', md: '', lg: 'ui-btn-lg', xl: 'ui-btn-xl' }

export function Button({
  as: Tag = 'button',
  variant = 'secondary',
  size = 'md',
  icon,
  iconEnd,
  iconOnly = false,
  full = false,
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={cn('ui-btn', VARIANTS[variant], SIZES[size],
        iconOnly && 'ui-btn-icon', full && 'w-full', className)}
      {...rest}
    >
      {icon && <Icon as={icon} size={size === 'xl' ? 'lg' : 'md'} />}
      {!iconOnly && children}
      {iconEnd && <Icon as={iconEnd} size="md" />}
    </Tag>
  )
}

/** Segmented group — buttons visually welded together. */
export function ButtonGroup({ className, children }) {
  return (
    <div className={cn(
      'inline-flex [&>*]:rounded-none',
      '[&>*:first-child]:rounded-l-[var(--radius-md)]',
      '[&>*:last-child]:rounded-r-[var(--radius-md)]',
      '[&>*+*]:-ml-[var(--hairline)]',
      className,
    )}>
      {children}
    </div>
  )
}
