import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2, Download, Filter } from 'lucide-react'
import { Section } from './Section'
import { Table } from '../components/Table'
import { Badge } from '../components/Badge'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { Progress, Tabs } from '../components/Misc'
import { Popover, MenuItem, MenuSeparator } from '../components/Popover'
import { Input } from '../components/Form'
import { CUSTOMERS, STATUS_TONE, STATUS_LABEL, inr } from '../data/dummy'

const columns = [
  {
    key: 'name', header: 'Customer', width: '22%',
    render: (r) => (
      <div className="flex items-center gap-[0.6rem]">
        <Avatar name={r.name} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{r.name}</p>
          <p className="ui-hint truncate">{r.email}</p>
        </div>
      </div>
    ),
  },
  { key: 'id', header: 'Account', width: '10%',
    render: (r) => <span className="font-mono text-xs text-ink-3">{r.id}</span> },
  { key: 'plan', header: 'Plan', width: '10%',
    render: (r) => <Badge tone={r.plan === 'Enterprise' ? 'accent' : 'neutral'}>{r.plan}</Badge> },
  { key: 'status', header: 'Status', width: '10%',
    render: (r) => <Badge tone={STATUS_TONE[r.status]} dot>{STATUS_LABEL[r.status]}</Badge> },
  { key: 'region', header: 'Region', width: '11%' },
  { key: 'seats', header: 'Seats', align: 'right', width: '8%' },
  { key: 'mrr', header: 'MRR', align: 'right', width: '11%',
    render: (r) => <span className="font-medium text-ink">{inr(r.mrr)}</span> },
  {
    key: 'usage', header: 'Usage', width: '13%',
    render: (r) => (
      <div className="flex items-center gap-[0.5rem]">
        <Progress value={r.usage} tone={r.usage > 85 ? 'warn' : 'accent'} className="w-[4.5rem]" />
        <span className="ui-hint tabular-nums">{r.usage}%</span>
      </div>
    ),
  },
  {
    key: 'actions', header: '', width: '5%', sortable: false,
    render: () => (
      <Popover trigger={<Button variant="ghost" size="xs" iconOnly icon={MoreHorizontal} aria-label="Row actions" />}>
        <MenuItem icon={Pencil}>Edit customer</MenuItem>
        <MenuItem icon={Download}>Export invoices</MenuItem>
        <MenuSeparator />
        <MenuItem icon={Trash2} danger>Remove</MenuItem>
      </Popover>
    ),
  },
]

export function DataTable() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('all')

  const rows = CUSTOMERS.filter((c) => {
    const matchTab = tab === 'all' || c.status === tab
    const matchQ = !q || (c.name + c.email + c.id + c.region).toLowerCase().includes(q.toLowerCase())
    return matchTab && matchQ
  })

  return (
    <Section
      id="tables"
      eyebrow="05 · Data"
      title="A table that scales instead of shrinking"
      lead="Row height is driven by the control scale, not the type scale, so rows grow 1.27x from FHD to 4K while the text in them grows 1.31x. A 4K panel shows MORE rows than FHD — not the same rows stretched."
      aside={
        <div className="flex flex-wrap items-center gap-[0.5rem]">
          <Input icon={Filter} placeholder="Filter customers…" value={q}
                 onChange={(e) => setQ(e.target.value)} className="w-[min(14rem,230px)]" />
          <Button variant="secondary" size="sm" icon={Download}>Export</Button>
        </div>
      }
    >
      <div className="mb-[0.8rem] flex flex-wrap items-center justify-between gap-[0.6rem]">
        <Tabs value={tab} onChange={setTab}
              items={[{ id: 'all', label: 'All' }, { id: 'active', label: 'Active' },
                      { id: 'trialing', label: 'Trialing' }, { id: 'past_due', label: 'Past due' },
                      { id: 'paused', label: 'Paused' }]} />
        <span className="ui-hint tabular-nums">{rows.length} of {CUSTOMERS.length} accounts</span>
      </div>

      <Table columns={columns} rows={rows} maxBody="min(32rem, 54vh)" caption="Customer accounts" />

      <p className="ui-hint mt-[0.7rem]">
        Column widths are percentages, the scroll body is capped at{' '}
        <code className="ui-kbd">min(32rem, 54vh)</code> — bounded by the UI scale <em>and</em> the real
        screen height — and numbers use <code className="ui-kbd">tabular-nums</code> so digit columns stay
        aligned at any root size.
      </p>
    </Section>
  )
}
