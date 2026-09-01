import { cn } from '../lib/cn'

export function Card({ hover = false, className, children, ...rest }) {
  return (
    <div className={cn('ui-card', hover && 'ui-card-hover', className)} {...rest}>{children}</div>
  )
}

Card.Media = function CardMedia({ src, alt = '', ratio = '16/10', className }) {
  return (
    <div className={cn('ui-media', className)} style={{ aspectRatio: ratio }}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  )
}

Card.Head = function CardHead({ className, children }) {
  return <div className={cn('ui-card-head', className)}>{children}</div>
}
Card.Body = function CardBody({ className, children }) {
  return <div className={cn('ui-card-body', className)}>{children}</div>
}
Card.Foot = function CardFoot({ className, children }) {
  return <div className={cn('ui-card-foot', className)}>{children}</div>
}
