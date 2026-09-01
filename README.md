# Adaptive UI Kit

A React + Vite + Tailwind v4 component library designed so one set of components
looks deliberate at **1280×720, 1366×768, 1600×900, 1920×1080, 2560×1440 and
3840×2160** — and at every width in between — without per-resolution CSS.

```bash
npm install
npm run dev        # http://localhost:5173
npm run measure    # headless measurement sweep across 10 resolutions
npm run build
```

---

> **Onboarding a developer?** Start with
> [`docs/CSS-SCALING-GUIDE.md`](docs/CSS-SCALING-GUIDE.md) — the rules, the
> reasoning, the traps, and a review checklist.

## The principle

> Not every dimension should respond to viewport size in the same way.

Scaling one multiplier across every dimension is the obvious fix and the wrong
one: it turns a 4K screen into a 1080p screen viewed through a magnifying glass.
This system splits the response into four tiers.

```
                          VIEWPORT
                             │
              ┌──────────────┴──────────────┐
          UI SCALE                      LAYOUT SPACE
         --ui-base                   clamp() · vw · min()
              │                             │
      ┌───────┴───────┐             gutters · sections
  rem tokens      --ui-ctl          containers · grids
  type · gaps     (damped +
  icon em          capped)
      │               │                     │
   scalable      constrained              fluid
```

| Tier | Token(s) | Behaviour | Governs |
|---|---|---|---|
| **1 · Foundation** | type ratios, colors | Invariant | The design system's identity |
| **2 · Scale-coupled** | `--ui-base` → all `rem` | 1.31× FHD→4K | Typography, gaps, padding, inline icons |
| **3 · Control** | `--ui-ctl` | 1.23× FHD→4K, caps at 22px | Buttons, inputs, rows, navbar, tabs, avatars |
| **4 · Fluid layout** | `--gutter`, `--section-y`, `--layout-gap`, `--shell-max` | 1.8–2.6× FHD→4K | Page rhythm, gutters, container width |
| **5 · Constrained** | `min(<rem>, <px>)` | Scales, then stops | Radii, icon tiles, modal/drawer widths, hairlines |

The result: **text grows 1.31×, chrome grows 1.23×, whitespace grows 1.9×.**
A 4K screen gets more air and more content, not bigger buttons.

---

## What changed from the naive version, and why

The first revision scaled `--ui-base` 15px → 16 → 19.5 → **26px**. Everything was
a `rem` multiple of it, so *everything* grew 1.63× — measured, not estimated:

| | 1366 | 1920 | 2560 | 3840 | 4K÷FHD |
|---|---|---|---|---|---|
| body text | 12.5 | 14.0 | 17.1 | 22.8 | 1.63× |
| `text-xs` | **11.1** | 12.5 | 15.2 | 20.3 | 1.63× |
| button height | 31.8 | 35.5 | 42.8 | **56.4** | 1.59× |
| input height | 35.0 | 39.0 | 47.1 | **62.1** | 1.59× |
| navbar height | 49.9 | 56.0 | 68.3 | **91.0** | 1.63× |
| table row | 39.8 | 44.7 | 54.5 | **72.7** | 1.63× |
| radius-lg | 12.5 | 14.0 | 17.1 | **22.8** | 1.63× |

Seven concrete defects:

1. **One multiplier drove everything** — no separation between "how big is the
   text" and "how tall is a control".
2. **HD was too small for the wrong reason.** A `max-height: 800px` rule shrank
   *type* (11.1px labels) when the real constraint is vertical *rhythm* — and it
   collided with the width ladder, two rules fighting over one variable.
3. **Visible jumps at real widths.** 1920→2560 stepped 22%; 2560→3840 stepped
   33%. 2048, 2880 and 3200 all sat mid-band and got the *low* value, so 2880
   rendered identically to 2304.
4. **No ceilings.** Radii, icon tiles and shadows scaled linearly, forever.
5. **`--shell-max` was declared in 7 places**, and resolved identically at 1280
   and 1366 — the small end didn't adapt at all.
6. **Mixed scaling systems inside one expression.** `.ui-card-pad` was
   `clamp(0.9rem, 0.6rem + 0.6vw, 1.35rem)` — viewport-driven *and* root-driven,
   for a component internal. The `vw` term was dead weight above ~1900px.
7. **`--prose-max: 46rem`** described line length indirectly. `ch` *is* the
   measure.

### After

| | 1280 | 1366 | 1600 | 1920 | 2560 | 3840 | 4K÷FHD |
|---|---|---|---|---|---|---|---|
| `--ui-base` | 15.8 | 15.8 | 15.9 | 16.0 | 17.7 | 21.0 | **1.31×** |
| `--ui-ctl` | 15.8 | 15.8 | 15.9 | 16.0 | 17.3 | 19.8 | **1.23×** |
| body text | 13.8 | 13.8 | 13.9 | 14.0 | 15.5 | 18.4 | 1.31× |
| `text-2xs` | 11.8 | 11.8 | 11.9 | 12.0 | 13.3 | 15.8 | 1.31× |
| button height | 35.6 | 35.6 | 35.8 | 36.0 | 38.8 | **44.7** | 1.24× |
| input height | 37.9 | 38.0 | 38.2 | 38.4 | 41.4 | **47.4** | 1.23× |
| navbar height | 41.8 | 44.9 | 53.7 | 54.4 | 58.6 | **66.0** | 1.21× |
| table row | 35.6 | 35.7 | 35.8 | 36.1 | 39.4 | **46.2** | 1.28× |
| radius-lg | 13.8 | 13.8 | 13.9 | 14.0 | 15.5 | **17.0** | 1.21× |
| drawer width | 315 | 316 | 318 | 320 | 353 | **400** | 1.25× |
| modal width | 519 | 520 | 524 | 544 | 601 | **700** | 1.29× |
| shell width | 1229 | 1311 | 1536 | 1843 | 2168 | 2552 | — |
| gutter | 26 | 28 | 31 | 36 | 47 | **68** | 1.88× |
| section rhythm | 29 | 31 | 37 | 46 | 62 | **84** | 1.84× |
| prose measure | 535 | 537 | 540 | 545 | 601 | 714 | constant **68ch** |

Reproduce any row with `npm run measure`.

---

## Tier 1 — what stays `rem`

The type scale, all normal spacing, component gaps and inline icon sizing.

```css
--text-2xs: 0.75rem;    --text-base: 1rem;     --text-2xl: 1.75rem;
--text-xs:  0.8125rem;  --text-lg:   1.125rem; --text-3xl: 2.25rem;
--text-sm:  0.875rem;   --text-xl:   1.375rem; --text-4xl: 2.875rem;
```

**No token here ever gets its own `clamp()`.** That is the whole point: these
ratios are invariant, and only the root they multiply changes. Give each token
its own curve and the scale's internal proportions drift — `text-2xl` ends up
1.6× its base while `text-sm` is at 1.2×, and you are hand-tuning per screen
again.

The bottom two rungs were lifted (`0.6875 → 0.75`, `0.78125 → 0.8125`) because
at HD they rendered at 11.1px and 12.5px, which is where legibility actually
breaks. The *ratios* to `--text-base` are what matter and they are preserved.

### The curve

Four continuous segments — each clamp's minimum equals the previous segment's
maximum, so the value is continuous across the entire range:

```css
@media (min-width:  768px) { --ui-base: clamp(15.25px, 14.5px  + 0.09766vw,  15.75px) }
@media (min-width: 1280px) { --ui-base: clamp(15.75px, 15.25px + 0.0390625vw, 16px)   }
@media (min-width: 1728px) { --ui-base: clamp(16px,    11px    + 0.260417vw,  21px)   }
@media (min-width: 3456px) { --ui-base: clamp(21px,    12px    + 0.234375vw,  24px)   }
```

`scale.css` contains 16 media queries in total, and that count is the whole
responsive surface of the library: **5** drive the curve, **3** only set
`--screen-class` for the debug HUD, **6** serve the optional stepped mode, and
**2** are `prefers-reduced-motion` and `print`. `components.css` contains **zero** —
no component carries a media query of its own.

Intermediate widths interpolate rather than snap:
`1440 → 15.81` · `2048 → 16.33` · `2880 → 18.50` · `3200 → 19.33` · `3440 → 19.96`.

4K is **1.31×** FHD, not 1.63×. Text grows enough to stay comfortable at higher
pixel density; it does not chase constant *physical* size, because someone
running a 4K panel natively chose density on purpose.

## Tier 2 — what gets damped

```css
--ui-ctl: min(calc(0.75rem + 4px), 22px);
```

One line. It equals `1rem` exactly at FHD, grows at ~75% of the type rate above
that, and hard-caps at 22px for 5K/6K. Everything with a *click target or a row
height* is built from it — button and input padding, table row padding, tab
height, switch geometry, avatar size, panel header height, popover padding.

Because the label inside a button still comes from the type scale, chrome
**tightens around the text** as the screen grows. That asymmetry is what reads
as "premium" rather than "zoomed".

## Tier 3 — what is fluid

```css
--gutter:     clamp(1rem, 0.4rem + 1.55vw, 4rem);
--layout-gap: clamp(0.85rem, 0.45rem + 0.85vw, 2rem);
--section-y:  min(clamp(1.5rem, 0.6rem + 2.1vw, 4rem), 4.6vh);
--shell-max:  min(96vw, calc(1400px + 30vw), 2800px);
```

`vw` appears **only** in this tier. No component internal uses it.

`--section-y` answers to both axes: the `vw` term sets the ideal, the `vh` term
takes over only when height is scarce. That single expression replaced two
`max-height` media queries which produced a visible 16% jump between 1600×900
and 1920×1080. `--nav-h` uses the same trick:
`min(calc(3.4 * var(--ui-ctl)), 66px, 6.6vh)` → 47px at 720-tall, 54px at
1080-tall, 66px at 2160-tall.

`--shell-max` is deliberately kinked: below ~2120px the viewport governs (96vw),
above it growth drops to 30vw, so a 4K screen gains **margin** rather than line
length. At 3840 the shell is 2552px with 644px of breathing room per side.

## Tier 4 — what gets a ceiling

`min(<rem>, <px>)` is the entire pattern — scale normally, then refuse to keep
going.

```css
--radius-lg: min(0.875rem, 17px);   --icon-tile: min(calc(2.5*var(--ui-ctl)), 50px);
--radius-xl: min(1.25rem,  24px);   --drawer-w:  min(20rem, 400px, 86vw);
--nav-h:     min(calc(3.4*var(--ui-ctl)), 66px, 6.6vh);
--modal-md:  min(34rem, 700px, calc(100vw - 2 * var(--gutter)));
```

Modal widths are three-way clamped on purpose: the **rem** term holds visual
proportion, the **px** term stops a 5K screen producing a 900px dialog, the
**vw** term guarantees it fits.

Inline icons need no ceiling — `.ui-icon` is `1.15em`, so it inherits whatever
constraint already applies to the text beside it. Only *decorative standalone*
icons (`.ui-icon-tile`) get an absolute cap.

---

## Breakpoints change layout, not size

Three, and they exist to restructure:

```
md   768px   stacked          → two column
lg  1024px   hamburger        → persistent nav
xl  1280px   secondary columns appear
```

The former `--breakpoint-2k` / `--breakpoint-4k` were **removed**. With
`auto-fit` grids the column count follows available space on its own, and having
those names in scope invites exactly the per-resolution hacks this system exists
to avoid.

Inside a media query `rem` is always 16px — it ignores the scaled root — so
layout breakpoints never drift as the UI scales. Size and layout are independent
knobs.

### Extra space becomes columns, not bigger cards

```css
.ui-grid {
  --col-min: 18rem;                 /* rem: the drop threshold scales too */
  grid-template-columns: repeat(auto-fit, minmax(min(var(--col-min), 100%), 1fr));
}
```

Cap the **container** (`.ui-content`, 84rem) rather than the track. Because the
cap is in `rem`, a card column occupies the same ~27rem at 1366 and at 3840 —
identical proportion, different absolute size — and the surplus 4K width becomes
margin. Setting a fixed `--col-max` instead is a trap: it fits fewer tracks than
you expect and orphans the last item onto its own row.

---

## Scale modes

**Default is the fluid curve** — continuous at every intermediate width.

```html
<html data-scale="stepped">   <!-- one value per band: 15.25 / 15.75 / 16 / 17.75 / 21 / 24 -->
```

Stepped tracks the fluid curve within 0.15px at every anchor resolution, so both
modes are visually equivalent where it counts; stepped is there when QA needs
reproducible numbers rather than a function of viewport width.

```html
<html data-density="compact">    <!-- 0.93 · root 19.5 at 4K -->
<html data-density="comfortable"><!-- 1.00 · root 21.0 at 4K -->
<html data-density="spacious">   <!-- 1.08 · root 22.7 at 4K -->
```

Density multiplies the root, so all four tiers inherit it. Fluid layout tokens
are deliberately *unaffected* — density is a UI concern, not a page-layout one.

---

## Validating changes

`/probe.html` renders one of each component and prints resolved pixel values.
Drive it headlessly:

```bash
npm run dev
npm run measure                                   # 10 resolutions
tools/measure.sh http://localhost:5173/probe.html 2880x1620
tools/measure.sh 'http://localhost:5173/probe.html?scale=stepped&theme=light' 3840x2160
```

Every number in the tables above came from this harness. When you change a
token, re-run it and check the ratio column — if a control starts tracking the
type scale, the tiers have leaked into each other.

There is also a **Preview** button in the app toolbar: it renders the live app in
an iframe pinned to a real 1280 / 1366 / 1600 / 1920 / 2560 / 3440 / 3840
viewport. The iframe genuinely reports those CSS pixels, so the curve resolves
for real rather than being zoomed after the fact.

### A note on OS scaling

A 4K panel at 150% Windows scaling reports **2560 CSS pixels** and lands in the
2K band. That is correct: the curve keys off CSS pixels because that is what
determines apparent size. Only someone running 4K natively — who chose density
deliberately — reaches the 21px rung.

---

## Reusing this

Copy **`src/styles/`** and import it:

```
src/styles/
  index.css        ← import this
  scale.css        ← the 4-tier engine. Zero dependencies, framework-agnostic
  tokens.css       ← @theme colours, type scale, breakpoints
  components.css   ← .ui-btn, .ui-card, .ui-table, .ui-modal, … each tagged
                     with the tier that governs it
```

The `.ui-*` classes are plain CSS and work in Vue, Svelte, Angular or a static
`.html` file; the React files in `src/components/` are thin wrappers. Re-theming
is ~12 variables in `tokens.css`.

Delete `src/components/ScaleHUD.jsx`, `ScreenSimulator.jsx`, `public/probe.html`,
`src/probe.js` and `tools/` in a real project — they are dev instrumentation.

### Rules for adding a component

1. **Text, gaps, padding** → `rem`. It joins Tier 2 automatically.
2. **Anything with a click target or a row height** → multiples of `--ui-ctl`.
3. **Anything the page layout should decide** → `--gutter` / `--layout-gap` /
   `--section-y`, or a `clamp()` with `vw` — and only at layout level.
4. **Anything that would look absurd 1.3× bigger** → `min(<rem>, <px>)`.
5. **Inline icons** → `em`, never `rem`, never `px`.
6. Never put `vw` inside a component internal, and never give an individual type
   token its own `clamp()`.

---

## What's in the box

| Group | Components |
|---|---|
| Navigation | `Navbar`, `Burger`, `Drawer`, `Tabs` |
| Actions | `Button` (5 variants × 5 sizes, icon-only, full-width), `ButtonGroup` |
| Display | `Card` (+ `.Media`/`.Head`/`.Body`/`.Foot`), `Panel`, `Accordion`, `Stat`, `Badge`, `Avatar`, `AvatarStack`, `Progress`, `Skeleton`, `EmptyState` |
| Data | `Table` — sortable, sticky header, `min(rem, vh)` scroll cap, tabular numerals |
| Overlays | `Modal` (3 sizes), `Popover` + `MenuItem`, `Tooltip`, `Toast` |
| Forms | `Field`, `Input` (with icon), `Select`, `Textarea`, `Switch` |
| Icons | `Icon`, `IconTile` — `em`-sized wrappers over `lucide-react` |

Demo data is dummy and offline — images are deterministic SVG data-URIs from
`src/lib/placeholder.js`, so nothing touches the network.

---

## Tailwind v4 gotchas found the hard way

- **`ring-[var(--x)]` silently sets ring *colour*, not width.** An arbitrary ring
  value is parsed as a colour. Use a `box-shadow` class — see `.ui-ring-accent`.
- **Avoid `/opacity` modifiers on themed colours** (`bg-accent-soft/60`). Tailwind
  resolves them at build time into a literal hex from the *light* palette, so they
  never follow the dark theme.
- **Custom properties are token streams, not lengths.**
  `getComputedStyle(el).getPropertyValue('--ui-ctl')` returns the literal
  `min(calc(0.75rem + 4px), 22px)`, and `parseFloat` gives `NaN`. Resolve by
  applying the var to a throwaway element and measuring the box — see
  `resolveLength()` in `src/lib/useScreenClass.js`.
- **Avoid arbitrary px values** (`p-[12px]`). They break out of every tier.
