import {
  Home, Search, Bell, Settings, User, Trash2, Download, Upload, Star, Heart,
  Check, ChevronRight, Filter, Share2, Copy, Lock, Globe, Zap, Cloud, Code2,
  Calendar, Mail, Phone, MapPin, Camera, Play, Pause, RefreshCw, Plus, Minus,
} from 'lucide-react'
import { Section } from './Section'
import { Icon, IconTile } from '../components/Icon'
import { Card } from '../components/Card'

const ICONS = [
  Home, Search, Bell, Settings, User, Trash2, Download, Upload, Star, Heart,
  Check, ChevronRight, Filter, Share2, Copy, Lock, Globe, Zap, Cloud, Code2,
  Calendar, Mail, Phone, MapPin, Camera, Play, Pause, RefreshCw, Plus, Minus,
]

const TYPE = [
  ['Display', 'ui-h1', 'The quick brown fox'],
  ['Heading', 'ui-h2', 'The quick brown fox jumps'],
  ['Subhead', 'ui-h3', 'The quick brown fox jumps over'],
  ['Body',    'text-sm text-ink-2', 'The quick brown fox jumps over the lazy dog near the riverbank at dusk.'],
  ['Caption', 'text-xs text-ink-3', 'The quick brown fox jumps over the lazy dog near the riverbank at dusk.'],
  ['Micro',   'text-2xs text-ink-3', 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG'],
]

export function Foundations() {
  return (
    <Section
      id="foundations"
      eyebrow="01 · Foundations"
      title="Type & icons that hold their proportions"
      lead="Every size below is a rem multiple of one root value. Move the root and the whole system moves with it — no per-breakpoint font-size overrides anywhere."
    >
      <div className="grid gap-[var(--layout-gap)] lg:grid-cols-[1.15fr_1fr]">
        <Card className="ui-card-pad">
          <p className="ui-eyebrow mb-[0.8rem]">Type scale</p>
          <div className="divide-y divide-line">
            {TYPE.map(([name, cls, text]) => (
              <div key={name} className="flex items-baseline gap-[1rem] py-[0.7rem]">
                <span className="w-[4.5rem] flex-none text-2xs font-medium text-ink-3">{name}</span>
                <p className={cls}>{text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="ui-card-pad">
          <p className="ui-eyebrow mb-[0.8rem]">Icon sizing (em-based)</p>

          <div className="mb-[1rem] flex flex-wrap items-center gap-[1rem] rounded-[var(--radius-md)] bg-surface-2 p-[0.9rem]">
            {[['text-xs', 'xs'], ['text-sm', 'sm'], ['text-base', 'base'], ['text-xl', 'xl'], ['text-2xl', '2xl']].map(
              ([cls, label]) => (
                <span key={label} className={`inline-flex items-center gap-[0.4em] ${cls} text-ink-2`}>
                  <Icon as={Star} />
                  {label}
                </span>
              ))}
          </div>
          <p className="ui-hint mb-[1rem]">
            One <code className="ui-kbd">.ui-icon</code> class. It reads <code className="ui-kbd">1.15em</code>,
            so it tracks whatever text it sits beside — and stroke width steps down as it grows.
          </p>

          <div className="mb-[1rem] flex flex-wrap gap-[0.5rem]">
            {['accent', 'ok', 'warn', 'danger', 'neutral'].map((tone) => (
              <IconTile key={tone} as={Zap} tone={tone} />
            ))}
          </div>

          <div className="grid gap-[0.4rem] text-ink-2 [grid-template-columns:repeat(auto-fit,minmax(2.1rem,1fr))]">
            {ICONS.map((I, i) => (
              <span key={i} className="grid aspect-square place-items-center rounded-[var(--radius-sm)]
                                       bg-surface-2 text-[min(0.95rem,18px)] hover:bg-surface-3 hover:text-accent">
                <Icon as={I} />
              </span>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  )
}
