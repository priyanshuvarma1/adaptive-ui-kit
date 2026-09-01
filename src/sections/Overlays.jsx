import { useState } from 'react'
import { AlertTriangle, PanelLeft, Bell, MessageSquare, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Section } from './Section'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { Popover, MenuItem, MenuSeparator, Tooltip } from '../components/Popover'
import { Toast } from '../components/Misc'
import { Field, Input, Select } from '../components/Form'
import { IconTile } from '../components/Icon'

export function Overlays({ onOpenDrawer }) {
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(false)

  return (
    <Section
      id="overlays"
      eyebrow="06 · Overlays"
      title="Modals, menus, tooltips and toasts"
      lead="Overlay widths are three-way clamped: min(34rem, 700px, 100vw − 2 gutters). The rem term holds visual proportion, the px term stops a 5K screen producing a 900px dialog, and the vw term guarantees it fits."
    >
      <div className="ui-grid [--col-min:15rem]">
        <OverlayCard title="Dialog" body="Scrim, focus ring, Escape to close, body scroll lock."
                     action={<Button variant="primary" size="sm" onClick={() => setModal('form')}>Open dialog</Button>} />
        <OverlayCard title="Confirm" body="Destructive variant with a danger-toned action."
                     action={<Button variant="danger" size="sm" icon={AlertTriangle}
                                     onClick={() => setModal('confirm')}>Delete account</Button>} />
        <OverlayCard title="Menu & tooltip" body="Anchored popover, rem min-width, click-outside to dismiss."
          action={
            <div className="flex items-center gap-[0.5rem]">
              <Popover align="start" trigger={<Button variant="secondary" size="sm" icon={MoreHorizontal}>Menu</Button>}>
                <MenuItem icon={Pencil}>Edit</MenuItem>
                <MenuItem icon={MessageSquare}>Comment</MenuItem>
                <MenuSeparator />
                <MenuItem icon={Trash2} danger>Delete</MenuItem>
              </Popover>
              <Tooltip label="Tooltips scale too">
                <Button variant="ghost" size="sm" iconOnly icon={Bell} aria-label="Hover me" />
              </Tooltip>
            </div>
          } />
        <OverlayCard title="Drawer & toast" body="Off-canvas nav plus a corner toast, both rem-offset."
          action={
            <div className="flex flex-wrap items-center gap-[0.5rem]">
              <Button variant="secondary" size="sm" icon={PanelLeft} onClick={onOpenDrawer}>Drawer</Button>
              <Button variant="secondary" size="sm" onClick={() => setToast(true)}>Toast</Button>
            </div>
          } />
      </div>

      <Modal
        open={modal === 'form'} onClose={() => setModal(null)}
        title="Invite teammates" description="They'll get an email with a join link that expires in 7 days."
        footer={<>
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={() => { setModal(null); setToast(true) }}>Send invites</Button>
        </>}
      >
        <div className="grid gap-[0.85rem] pb-[0.4rem] sm:grid-cols-2">
          <Field label="Email addresses" htmlFor="m1" className="sm:col-span-2"
                 hint="Comma-separated. Up to 25 at a time.">
            <Input id="m1" placeholder="ada@company.com, grace@company.com" />
          </Field>
          <Field label="Role" htmlFor="m2">
            <Select id="m2"><option>Member</option><option>Admin</option><option>Billing</option></Select>
          </Field>
          <Field label="Workspace" htmlFor="m3">
            <Select id="m3"><option>Platform</option><option>Growth</option><option>Support</option></Select>
          </Field>
        </div>
      </Modal>

      <Modal
        open={modal === 'confirm'} onClose={() => setModal(null)} size="sm"
        title="Delete this account?" description="This removes 128 seats and cancels the subscription immediately."
        footer={<>
          <Button variant="ghost" onClick={() => setModal(null)}>Keep account</Button>
          <Button variant="danger" onClick={() => setModal(null)}>Delete permanently</Button>
        </>}
      >
        <div className="mb-[0.4rem] flex items-start gap-[0.7rem] rounded-[var(--radius-md)]
                        bg-danger-soft p-[0.8rem]">
          <IconTile as={AlertTriangle} tone="danger" />
          <p className="text-sm text-ink-2">
            Invoices and audit history are retained for 90 days, then permanently purged.
          </p>
        </div>
      </Modal>

      <Toast open={toast} onClose={() => setToast(false)}
             title="Invites sent" body="4 teammates will receive a join link shortly." />
    </Section>
  )
}

function OverlayCard({ title, body, action }) {
  return (
    <Card className="ui-card-pad flex flex-col gap-[0.5rem]">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="flex-1 text-xs text-ink-2">{body}</p>
      <div className="pt-[0.3rem]">{action}</div>
    </Card>
  )
}
