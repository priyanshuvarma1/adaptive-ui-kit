import { Bell, Search, Settings, LogOut, User, LifeBuoy, Plus } from 'lucide-react'
import { cn } from '../lib/cn'
import { Icon } from './Icon'
import { Button } from './Button'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { Popover, MenuItem, MenuSeparator } from './Popover'
import { Input } from './Form'

export function Navbar({ brand = 'Aperture', links = [], current, onNavigate, onBurger, burgerOpen }) {
  return (
    <header className="ui-navbar">
      <div className="ui-shell flex w-full items-center gap-[0.6rem]">

        {/* Hamburger — visible below the `lg` breakpoint */}
        <Burger open={burgerOpen} onClick={onBurger} className="lg:hidden" />

        {/* Brand: mark scales in rem, wordmark in the type scale */}
        <a href="#" className="flex flex-none items-center gap-[0.5rem]">
          <span className="ui-brand-mark bg-accent text-ink-invert">A</span>
          <span className="text-base font-semibold tracking-tight">{brand}</span>
          <Badge tone="accent" className="hidden sm:inline-flex">v2.4</Badge>
        </a>

        {/* Primary nav */}
        <nav className="ml-[0.75rem] hidden items-center gap-[0.15rem] lg:flex">
          {links.map((l) => (
            <a key={l.id} href="#" className="ui-navlink"
               aria-current={current === l.id ? 'page' : undefined}
               onClick={(e) => { e.preventDefault(); onNavigate?.(l.id) }}>
              <Icon as={l.icon} size="sm" />
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Search — collapses to an icon button on narrow viewports */}
        <div className="hidden w-[min(16rem,260px)] xl:block 2xl:w-[min(20rem,320px)]">
          <Input icon={Search} placeholder="Search…  ⌘K" aria-label="Search" />
        </div>
        <Button variant="ghost" size="sm" iconOnly icon={Search} className="xl:hidden" aria-label="Search" />

        <Button variant="primary" size="sm" icon={Plus} className="hidden md:inline-flex">New</Button>

        <Popover
          trigger={
            <span className="relative inline-flex">
              <Button variant="ghost" size="sm" iconOnly icon={Bell} aria-label="Notifications" />
              <span className="absolute right-[0.4rem] top-[0.4rem] h-[0.4rem] w-[0.4rem] rounded-full bg-danger" />
            </span>
          }
          className="w-[20rem]"
        >
          <p className="px-[0.6rem] py-[0.4rem] ui-eyebrow">Notifications</p>
          <MenuItem icon={User}>3 new members joined</MenuItem>
          <MenuItem icon={LifeBuoy}>Ticket #4821 needs triage</MenuItem>
          <MenuItem icon={Settings}>Build pipeline finished</MenuItem>
        </Popover>

        <Popover
          trigger={<button className="rounded-full focus-visible:outline-none"><Avatar name="Priya Nair" /></button>}
          className="w-[13rem]"
        >
          <div className="px-[0.6rem] py-[0.45rem]">
            <p className="text-sm font-medium text-ink">Priya Nair</p>
            <p className="ui-hint truncate">priya@aperture.io</p>
          </div>
          <MenuSeparator />
          <MenuItem icon={User}>Profile</MenuItem>
          <MenuItem icon={Settings}>Settings</MenuItem>
          <MenuSeparator />
          <MenuItem icon={LogOut} danger>Sign out</MenuItem>
        </Popover>
      </div>
    </header>
  )
}

export function Burger({ open, onClick, className }) {
  return (
    <button className={cn('ui-burger', className)} data-open={open} onClick={onClick}
            aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
      <span className="ui-burger-box">
        <span className="ui-burger-bar" /><span className="ui-burger-bar" /><span className="ui-burger-bar" />
      </span>
    </button>
  )
}
