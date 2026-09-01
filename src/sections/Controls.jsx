import { useState } from 'react'
import { Download, Trash2, Plus, ChevronRight, Mail, Search, Sparkles } from 'lucide-react'
import { Section, Row } from './Section'
import { Card } from '../components/Card'
import { Button, ButtonGroup } from '../components/Button'
import { Badge } from '../components/Badge'
import { Avatar, AvatarStack } from '../components/Avatar'
import { Field, Input, Select, Textarea, Switch } from '../components/Form'
import { Tabs, Progress } from '../components/Misc'
import { Tooltip } from '../components/Popover'
import { CUSTOMERS } from '../data/dummy'

export function Controls() {
  const [tab, setTab] = useState('all')
  const [on, setOn] = useState(true)
  const [on2, setOn2] = useState(false)

  return (
    <Section
      id="controls"
      eyebrow="02 · Controls"
      title="Buttons, inputs and status"
      lead="Padding is expressed as a ratio of the font size, so a button never turns into a stamp on 4K or a slab on a 1366 laptop."
    >
      <div className="ui-grid [--col-min:26rem]">
        <Card className="ui-card-pad divide-y divide-line">
          <Row label="Variants">
            <Button variant="primary" icon={Plus}>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost" icon={Download}>Ghost</Button>
            <Button variant="danger" icon={Trash2}>Delete</Button>
            <Button variant="link" iconEnd={ChevronRight}>Learn more</Button>
          </Row>

          <Row label="Sizes">
            {['xs', 'sm', 'md', 'lg', 'xl'].map((s) => (
              <Button key={s} size={s} variant="secondary" icon={Sparkles}>{s.toUpperCase()}</Button>
            ))}
          </Row>

          <Row label="Icon only">
            {['xs', 'sm', 'md', 'lg'].map((s) => (
              <Tooltip key={s} label={`Size ${s}`}>
                <Button size={s} variant="secondary" iconOnly icon={Mail} aria-label="Mail" />
              </Tooltip>
            ))}
            <ButtonGroup>
              <Button variant="secondary" size="sm">Day</Button>
              <Button variant="secondary" size="sm">Week</Button>
              <Button variant="secondary" size="sm">Month</Button>
            </ButtonGroup>
          </Row>

          <Row label="States">
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="secondary" full className="max-w-[12rem]">Full width</Button>
          </Row>

          <Row label="Badges">
            <Badge tone="ok" dot>Active</Badge>
            <Badge tone="accent">Trialing</Badge>
            <Badge tone="warn" dot>Degraded</Badge>
            <Badge tone="danger">Past due</Badge>
            <Badge tone="neutral">Draft</Badge>
          </Row>

          <Row label="Avatars">
            <Avatar name="Priya Nair" size="sm" />
            <Avatar name="Arjun Mehta" />
            <Avatar name="Ivy Chen" size="lg" />
            <Avatar name="Tobias Berg" size="xl" />
            <AvatarStack people={CUSTOMERS.slice(0, 7)} max={4} size="md" />
          </Row>

          <Row label="Tabs">
            <Tabs value={tab} onChange={setTab}
                  items={[{ id: 'all', label: 'All' }, { id: 'active', label: 'Active' },
                          { id: 'trial', label: 'Trialing' }, { id: 'churn', label: 'Churn risk' }]} />
          </Row>
        </Card>

        <Card className="ui-card-pad">
          <p className="ui-eyebrow mb-[1rem]">Form controls</p>
          <div className="grid gap-[0.9rem] sm:grid-cols-2">
            <Field label="Full name" htmlFor="f1">
              <Input id="f1" defaultValue="Priya Nair" />
            </Field>
            <Field label="Work email" htmlFor="f2" hint="We never share this.">
              <Input id="f2" icon={Mail} type="email" placeholder="you@company.com" />
            </Field>
            <Field label="Plan" htmlFor="f3">
              <Select id="f3" defaultValue="Growth">
                <option>Starter</option><option>Growth</option>
                <option>Scale</option><option>Enterprise</option>
              </Select>
            </Field>
            <Field label="Seats" htmlFor="f4" error="Exceeds your plan limit.">
              <Input id="f4" type="number" defaultValue={72} />
            </Field>
            <Field label="Search" htmlFor="f5" className="sm:col-span-2">
              <Input id="f5" icon={Search} size="lg" placeholder="Search customers, invoices, docs…" />
            </Field>
            <Field label="Notes" htmlFor="f6" className="sm:col-span-2">
              <Textarea id="f6" defaultValue="Migrating from the legacy billing pipeline in Q3." />
            </Field>
          </div>

          <hr className="ui-divider my-[1.1rem]" />

          <div className="flex flex-col gap-[0.7rem]">
            <Switch id="s1" checked={on}  onChange={setOn}  label="Email me weekly usage summaries" />
            <Switch id="s2" checked={on2} onChange={setOn2} label="Enforce SSO for all members" />
          </div>

          <hr className="ui-divider my-[1.1rem]" />

          <p className="ui-eyebrow mb-[0.6rem]">Progress</p>
          <div className="flex flex-col gap-[0.7rem]">
            {[['Seats used', 68, 'accent'], ['API quota', 91, 'warn'], ['Storage', 34, 'ok']].map(
              ([label, v, tone]) => (
                <div key={label}>
                  <div className="mb-[0.3rem] flex justify-between text-xs text-ink-2">
                    <span>{label}</span><span className="tabular-nums">{v}%</span>
                  </div>
                  <Progress value={v} tone={tone} />
                </div>
              ))}
          </div>
        </Card>
      </div>
    </Section>
  )
}
