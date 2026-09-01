import {
  LayoutDashboard, Users, CreditCard, BarChart3, Settings, FileText,
  Boxes, LifeBuoy, Shield, Zap,
} from 'lucide-react'
import { cover } from '../lib/placeholder'

export const NAV_LINKS = [
  { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'billing',   label: 'Billing',   icon: CreditCard },
  { id: 'reports',   label: 'Reports',   icon: BarChart3 },
]

export const NAV_GROUPS = [
  { label: 'Workspace', items: [
    { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users, badge: '128' },
    { id: 'billing',   label: 'Billing',   icon: CreditCard },
    { id: 'reports',   label: 'Reports',   icon: BarChart3 },
  ]},
  { label: 'Build', items: [
    { id: 'catalog',   label: 'Catalog',   icon: Boxes },
    { id: 'docs',      label: 'Documents', icon: FileText },
    { id: 'security',  label: 'Security',  icon: Shield, badge: '2' },
  ]},
  { label: 'Account', items: [
    { id: 'settings',  label: 'Settings',  icon: Settings },
    { id: 'support',   label: 'Support',   icon: LifeBuoy },
  ]},
]

export const STATS = [
  { label: 'Monthly revenue', value: '₹48.2L', delta: '+12.4%', tone: 'ok',     footer: 'vs. last month', icon: CreditCard },
  { label: 'Active accounts', value: '3,914',  delta: '+318',   tone: 'ok',     footer: '30-day rolling', icon: Users },
  { label: 'Churn rate',      value: '1.8%',   delta: '+0.3%',  tone: 'danger', footer: 'watch list',     icon: Zap },
  { label: 'Avg. resolution', value: '4h 12m', delta: '−22m',   tone: 'ok',     footer: 'support tickets',icon: LifeBuoy },
]

const NAMES = [
  'Priya Nair', 'Arjun Mehta', 'Sana Kulkarni', 'Devendra Rao', 'Ivy Chen',
  'Marcus Hall', 'Fatima Sheikh', 'Tobias Berg', 'Neha Kapoor', 'Liam O\'Brien',
  'Rhea Sharma', 'Oscar Lund',
]
const PLANS = ['Starter', 'Growth', 'Scale', 'Enterprise']
const STATUS = ['active', 'trialing', 'past_due', 'paused']
const REGIONS = ['Mumbai', 'Bengaluru', 'Berlin', 'Singapore', 'Austin', 'Toronto']

export const CUSTOMERS = Array.from({ length: 28 }, (_, i) => ({
  id: `CUS-${4100 + i}`,
  name: NAMES[i % NAMES.length],
  email: `${NAMES[i % NAMES.length].split(' ')[0].toLowerCase()}${i}@example.com`,
  plan: PLANS[(i * 3) % PLANS.length],
  status: STATUS[(i * 5) % STATUS.length],
  region: REGIONS[(i * 7) % REGIONS.length],
  seats: 3 + ((i * 11) % 240),
  mrr: 1200 + ((i * 8419) % 96000),
  usage: (i * 13) % 100,
  since: `${2019 + (i % 6)}-0${1 + (i % 9)}-1${i % 9}`,
}))

export const ARTICLES = [
  { id: 'a1', tag: 'Engineering', title: 'One scale ladder, four resolutions',
    body: 'Why a single fluid root font-size beats a folder of per-breakpoint overrides — and how to keep icons optically consistent while it moves.',
    author: 'Priya Nair', read: '6 min', img: cover('scale-ladder') },
  { id: 'a2', tag: 'Design', title: 'Density is a product decision',
    body: 'Compact, comfortable and spacious are not three stylesheets. They are one multiplier applied at the root of the cascade.',
    author: 'Arjun Mehta', read: '4 min', img: cover('density') },
  { id: 'a3', tag: 'Platform', title: 'Tables that survive a 4K panel',
    body: 'Fixed pixel row heights turn a data grid into a postage stamp at 3840px. Cap the body in rem instead and let it breathe.',
    author: 'Ivy Chen', read: '8 min', img: cover('tables-4k') },
]

export const PRICING = [
  { id: 'starter', name: 'Starter', price: '₹0', per: 'forever', highlight: false,
    features: ['1 workspace', '5 members', 'Community support', '7-day history'] },
  { id: 'growth', name: 'Growth', price: '₹2,400', per: 'per month', highlight: true,
    features: ['Unlimited workspaces', '50 members', 'Priority support', '1-year history', 'SSO & SCIM'] },
  { id: 'scale', name: 'Scale', price: '₹9,900', per: 'per month', highlight: false,
    features: ['Everything in Growth', 'Unlimited members', 'Dedicated CSM', 'Audit log export', '99.99% SLA'] },
]

export const FAQ = [
  { title: 'Do I need to re-tune CSS for every screen size?',
    body: 'No. Components are authored in rem; scale.css retunes the root font size per screen class, so every size, gap, radius and icon moves together.' },
  { title: 'What happens on a 4K panel with 150% OS scaling?',
    body: 'The browser reports 2560 CSS pixels, so the kit lands in the 2K band — which is the correct visual density for that setup. The ladder keys off CSS pixels on purpose.' },
  { title: 'Can I keep using plain Tailwind utilities?',
    body: 'Yes. Tailwind v4 spacing and type utilities are already rem-based, so p-4 and text-sm scale with the ladder. Only avoid arbitrary px values.' },
  { title: 'How do I drop this into an existing project?',
    body: 'Copy src/styles into your app and import index.css. The component classes are framework-agnostic — the React files are just thin wrappers.' },
]

export const ACTIVITY = [
  { id: 1, who: 'Sana Kulkarni', what: 'approved the Q3 billing migration', when: '12m ago', tone: 'ok' },
  { id: 2, who: 'Marcus Hall',   what: 'flagged 2 accounts for review',      when: '48m ago', tone: 'warn' },
  { id: 3, who: 'Neha Kapoor',   what: 'invited 6 members to Scale',         when: '3h ago',  tone: 'accent' },
  { id: 4, who: 'Tobias Berg',   what: 'rotated the production API key',     when: '1d ago',  tone: 'danger' },
]

export const STATUS_TONE = { active: 'ok', trialing: 'accent', past_due: 'danger', paused: 'neutral' }
export const STATUS_LABEL = { active: 'Active', trialing: 'Trialing', past_due: 'Past due', paused: 'Paused' }

export const inr = (n) => '₹' + n.toLocaleString('en-IN')
