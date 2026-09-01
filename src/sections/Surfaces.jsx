import { Check, ArrowRight, MoreHorizontal, Pencil, Trash2, Share2 } from 'lucide-react'
import { Section } from './Section'
import { Card } from '../components/Card'
import { Panel, Accordion } from '../components/Panel'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { Avatar } from '../components/Avatar'
import { Icon, IconTile } from '../components/Icon'
import { Stat, Skeleton, EmptyState } from '../components/Misc'
import { Popover, MenuItem, MenuSeparator } from '../components/Popover'
import { STATS, ARTICLES, PRICING, FAQ, ACTIVITY } from '../data/dummy'
import { cn } from '../lib/cn'

export function Surfaces() {
  return (
    <>
      <Section
        id="cards"
        eyebrow="03 · Cards"
        title="Cards, stats and media"
        lead="Image blocks use aspect-ratio rather than fixed heights, so a card grid keeps its rhythm from 1366 all the way to 3840."
      >
        {/* Stat row — auto-fit: 1 col on mobile, 2 on tablet, 4 from 1100px up.
            No breakpoint list; the column count follows available space.      */}
        <div className="ui-grid mb-[var(--layout-gap)] [--col-min:14rem]">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} icon={<IconTile as={s.icon} tone="accent" />} />
          ))}
        </div>

        {/* Media cards. ui-content caps the ROW at 84rem (rem, so it is the same
            visual width at every resolution); auto-fit then decides the column
            count. Surplus 4K space becomes margin, not 790px-wide cards.      */}
        <div className="ui-grid ui-content [--col-min:19rem]">
          {ARTICLES.map((a) => (
            <Card key={a.id} hover className="flex flex-col">
              <Card.Media src={a.img} alt="" ratio="16/9" />
              <Card.Body className="flex flex-1 flex-col">
                <div className="mb-[0.5rem] flex items-center gap-[0.5rem]">
                  <Badge tone="accent">{a.tag}</Badge>
                  <span className="ui-hint">{a.read} read</span>
                </div>
                <h3 className="ui-h3 mb-[0.4rem]">{a.title}</h3>
                <p className="flex-1 text-sm text-ink-2">{a.body}</p>
                <div className="mt-[0.9rem] flex items-center gap-[0.5rem]">
                  <Avatar name={a.author} size="sm" />
                  <span className="text-xs text-ink-2">{a.author}</span>
                  <div className="flex-1" />
                  <Button variant="link" size="sm" iconEnd={ArrowRight}>Read</Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Pricing cards */}
        <div className="ui-grid ui-content mt-[var(--layout-gap)] [--col-min:16rem]">
          {PRICING.map((p) => (
            <Card key={p.id}
                  className={cn('flex flex-col', p.highlight && 'ui-ring-accent')}>
              <Card.Body className="flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="ui-h3">{p.name}</h3>
                  {p.highlight && <Badge tone="accent">Most popular</Badge>}
                </div>
                <p className="mt-[0.7rem] flex items-baseline gap-[0.35rem]">
                  <span className="text-3xl font-semibold tracking-tight tabular-nums">{p.price}</span>
                  <span className="ui-hint">{p.per}</span>
                </p>
                <ul className="mt-[1rem] flex flex-1 flex-col gap-[0.5rem]">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-[0.5rem] text-sm text-ink-2">
                      <Icon as={Check} size="sm" className="mt-[0.25em] text-ok" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card.Body>
              <Card.Foot>
                <Button variant={p.highlight ? 'primary' : 'secondary'} full>
                  Choose {p.name}
                </Button>
              </Card.Foot>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="panels"
        eyebrow="04 · Panels"
        title="Panels, lists and empty states"
        lead="Panel chrome — header height, divider weight, list row padding — is all rem, so nothing collapses into a hairline on a high-density panel."
      >
        <div className="ui-grid [--col-min:20rem]">
          <Panel
            title="Recent activity"
            subtitle="Last 24 hours across the workspace"
            actions={
              <Popover trigger={<Button variant="ghost" size="sm" iconOnly icon={MoreHorizontal} aria-label="More" />}>
                <MenuItem icon={Pencil}>Rename</MenuItem>
                <MenuItem icon={Share2}>Share</MenuItem>
                <MenuSeparator />
                <MenuItem icon={Trash2} danger>Delete</MenuItem>
              </Popover>
            }
          >
            <ul className="flex flex-col">
              {ACTIVITY.map((a, i) => (
                <li key={a.id} className={cn('flex items-start gap-[0.7rem] py-[0.7rem]',
                                             i > 0 && 'border-t border-line')}>
                  <Avatar name={a.who} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-2">
                      <span className="font-medium text-ink">{a.who}</span> {a.what}
                    </p>
                    <p className="ui-hint">{a.when}</p>
                  </div>
                  <Badge tone={a.tone} dot />
                </li>
              ))}
            </ul>
          </Panel>

          <div>
            <p className="ui-eyebrow mb-[0.5rem]">Frequently asked</p>
            <Accordion items={FAQ} />
          </div>

          <div className="flex flex-col gap-[var(--layout-gap)]">
            <Panel title="Loading state">
              <div className="flex flex-col gap-[0.6rem]">
                <div className="flex items-center gap-[0.6rem]">
                  <Skeleton className="h-[2rem] w-[2rem] rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-[0.35rem] h-[0.7rem] w-[60%]" />
                    <Skeleton className="h-[0.6rem] w-[35%]" />
                  </div>
                </div>
                <Skeleton className="h-[6rem] w-full" />
                <Skeleton className="h-[0.7rem] w-[85%]" />
                <Skeleton className="h-[0.7rem] w-[70%]" />
              </div>
            </Panel>

            <Panel title="No results">
              <EmptyState
                title="Nothing in this view yet"
                body="Empty states are laid out in rem too, so the icon, heading and body keep their relationship at every resolution."
                action={<Button variant="primary" size="sm">Create the first record</Button>}
              />
            </Panel>
          </div>
        </div>
      </Section>
    </>
  )
}
