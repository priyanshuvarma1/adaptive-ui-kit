import { cn } from '../lib/cn'
import { initials, avatarColor } from '../lib/placeholder'

const SIZES = { sm: 'ui-avatar-sm', md: '', lg: 'ui-avatar-lg', xl: 'ui-avatar-xl' }

export function Avatar({ name = '?', src, size = 'md', className, ...rest }) {
  return (
    <span
      className={cn('ui-avatar', SIZES[size], className)}
      style={!src ? { background: avatarColor(name), color: '#fff' } : undefined}
      title={name}
      {...rest}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials(name)}
    </span>
  )
}

export function AvatarStack({ people = [], max = 4, size = 'sm' }) {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  return (
    <div className="ui-avatar-stack flex items-center">
      {shown.map((p) => (
        <Avatar key={p.name ?? p} name={p.name ?? p} size={size} />
      ))}
      {extra > 0 && (
        <span className={cn('ui-avatar bg-surface-3 text-ink-3', SIZES[size])}>+{extra}</span>
      )}
    </div>
  )
}
