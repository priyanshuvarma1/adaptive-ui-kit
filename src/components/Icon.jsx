import { cn } from '../lib/cn'

/**
 * Icon — the piece most kits get wrong.
 *
 * Icons are sized in `em`, never px, so they inherit the font-size of whatever
 * they sit next to. A button at --text-sm and a heading at --text-2xl both get
 * an optically correct icon with no per-screen tuning. Stroke width steps down
 * as the glyph grows so the weight stays constant from HD to 4K.
 */
const SIZES = {
  sm: 'ui-icon-sm',
  md: 'ui-icon',
  lg: 'ui-icon-lg',
  xl: 'ui-icon-xl',
}

export function Icon({ as: Glyph, size = 'md', className, ...rest }) {
  if (!Glyph) return null
  return <Glyph aria-hidden="true" className={cn(SIZES[size] || SIZES.md, className)} {...rest} />
}

/** A square tinted tile with an icon centred in it. Scales as one unit. */
export function IconTile({ as: Glyph, tone = 'accent', className, ...rest }) {
  const tones = {
    accent:  'bg-accent-soft text-accent-ink',
    ok:      'bg-ok-soft text-ok',
    warn:    'bg-warn-soft text-warn',
    danger:  'bg-danger-soft text-danger',
    neutral: 'bg-surface-3 text-ink-2',
  }
  return (
    <span className={cn('ui-icon-tile', tones[tone], className)} {...rest}>
      <Icon as={Glyph} size="md" />
    </span>
  )
}
