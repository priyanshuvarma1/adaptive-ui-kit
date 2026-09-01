================================================================================
 CSS SCALING GUIDE — how this design system works and how to add to it
 Read this before you write any CSS in this repo.
================================================================================

CONTENTS
  0.  The 30-second version
  1.  The problem we are solving
  2.  The mental model: four tiers
  3.  The CSS features we use, explained
  4.  SEGREGATION — which tier does a value belong to?
  5.  CAUTIONS — the traps, and why each one bites
  6.  Worked example: adding a new component correctly
  7.  Code-review checklist
  8.  Cheat sheet


================================================================================
0. THE 30-SECOND VERSION
================================================================================

We support 1280x720 through 3840x2160 with ONE stylesheet. We do that by
refusing to treat all dimensions the same way:

    TEXT      grows 1.31x from Full HD to 4K   (rem, driven by --ui-base)
    CONTROLS  grow  1.23x and then stop        (--ui-ctl, capped at 22px)
    WHITESPACE grows 1.9x                      (clamp() + vw)
    RADII, tiles, modal widths — scale, then hit a hard px ceiling

The single most important sentence in this document:

    >>> Not every dimension should respond to viewport size the same way. <<<

If you scale everything by one number, a 4K monitor just becomes a 1080p
monitor viewed through a magnifying glass. That is the mistake this system
exists to prevent.


================================================================================
1. THE PROBLEM WE ARE SOLVING
================================================================================

1.1  Why a fixed pixel UI breaks
---------------------------------
A 24" 1080p monitor is about 92 pixels per inch.
A 32" 4K monitor is about 137 pixels per inch.

The same `font-size: 14px` is physically ~35% smaller on the 4K screen. Same
for a 1px border, a 32px button, a 16px icon. Everything shrinks optically.

The usual "fix" is a folder of media queries redefining font sizes per
breakpoint. That has to be rewritten for every new project, and it drifts.

1.2  Why "just scale everything" is also wrong
-----------------------------------------------
Our FIRST attempt set the root font size to 15px / 16px / 19.5px / 26px for
HD / FHD / 2K / 4K, and made every token a `rem` multiple of it.

We measured the result (numbers are real, from tools/measure.sh):

                  1366     1920     2560     3840     4K vs FHD
    body text     12.5     14.0     17.1     22.8       1.63x
    text-xs       11.1     12.5     15.2     20.3       1.63x
    button        31.8     35.5     42.8     56.4       1.59x
    input         35.0     39.0     47.1     62.1       1.59x
    navbar        49.9     56.0     68.3     91.0       1.63x
    table row     39.8     44.7     54.5     72.7       1.63x
    radius        12.5     14.0     17.1     22.8       1.63x

A 91px tall navigation bar. A 56px tall button. A 23px corner radius. On a 4K
screen those do not look "designed for 4K" — they look like a screenshot that
somebody zoomed in on.

And at the small end, `text-xs` rendered at 11.1px, which is where readability
actually breaks.

1.3  The insight
-----------------
Different dimensions exist for different reasons:

  * TEXT SIZE is governed by READING COMFORT. Higher pixel density means
    text can be a little physically smaller and still be crisp, so text should
    grow — but sub-linearly.

  * CONTROL SIZE (button height, row height, navbar height) is governed by
    POINTER PRECISION and INFORMATION DENSITY. A mouse cursor is the same size
    on every monitor. A 36px button is comfortable at 1080p and comfortable at
    4K. It should grow barely at all.

  * WHITESPACE is governed by AVAILABLE SPACE. This is the one thing that
    SHOULD grow generously — a big screen should feel airy.

  * RADII / DECORATION have no reason to grow past a point. A 23px corner
    radius just looks like a different design.

So we give each of those its own response curve. That is the entire system.


================================================================================
2. THE MENTAL MODEL: FOUR TIERS
================================================================================

                              VIEWPORT
                                 │
                  ┌──────────────┴──────────────┐
              UI SCALE                     LAYOUT SPACE
             --ui-base                  clamp() · vw · min()
                  │                            │
          ┌───────┴───────┐            gutters · sections
      rem tokens      --ui-ctl         containers · grids
      type · gaps     (damped +
      icon `em`        capped)
          │               │                    │
       scalable      constrained              fluid


  TIER 1 · FOUNDATION      Colour values, and the RATIOS of the type scale.
                           These never change with screen size at all.

  TIER 2 · SCALE-COUPLED   Everything written in `rem`. Driven by --ui-base.
                           Typography, normal spacing, gaps, card padding,
                           and inline icons (which use `em`).

  TIER 3 · CONTROL         Everything derived from --ui-ctl. Buttons, inputs,
                           table rows, navbar, tabs, switches, avatars.
                           Grows SLOWER than Tier 2, then hard-stops.

  TIER 4 · FLUID LAYOUT    Gutters, section rhythm, grid gaps, shell width.
                           Uses clamp()/vw/vh. This is the ONLY tier where
                           `vw` is allowed to appear.

  TIER 5 · CONSTRAINED     Written as min(<rem>, <px>). Scales normally, then
                           refuses to keep going. Radii, icon tiles, modal and
                           drawer widths, hairline borders, scrollbars.

(We say "four tiers" informally; Foundation is really tier zero because it
doesn't respond to anything.)


================================================================================
3. THE CSS FEATURES WE USE, EXPLAINED
================================================================================

3.1  `rem` — the scale carrier
-------------------------------
`1rem` = the font-size of the <html> element. Change that ONE value and every
`rem` in the entire stylesheet moves with it.

    :root { font-size: 16px; }
    .box  { padding: 1rem; }      /* = 16px */

    :root { font-size: 21px; }
    .box  { padding: 1rem; }      /* = 21px, no other change needed */

This is why the rule "never author a component in px" matters. A px value is
a value that opted out of the system.

3.2  `em` — the icon carrier
-----------------------------
`1em` = the font-size of THE ELEMENT ITSELF (not the root).

An icon sized in `em` automatically matches whatever text it sits beside:

    .ui-icon { width: 1.15em; height: 1.15em; }

    inside a button   at font-size 14px  ->  icon is 16.1px
    inside a heading  at font-size 28px  ->  icon is 32.2px

ONE class. No size prop, no per-context override, correct at every resolution
because the text it follows is already correct. This is why inline icons need
no ceiling of their own — they inherit whatever constraint the text has.

We also step the stroke width down as the glyph grows, so optical weight stays
constant:

    .ui-icon-sm { width: 1em;    stroke-width: 2.1; }
    .ui-icon    { width: 1.15em; stroke-width: 1.9; }
    .ui-icon-lg { width: 1.4em;  stroke-width: 1.75; }
    .ui-icon-xl { width: 2em;    stroke-width: 1.5; }

3.3  `clamp(MIN, PREFERRED, MAX)`
----------------------------------
The browser uses PREFERRED, but never lets it go below MIN or above MAX.

    --gutter: clamp(1rem, 0.4rem + 1.55vw, 4rem);
              ^^^^^^     ^^^^^^^^^^^^^^^^  ^^^^^
              floor      grows with width  ceiling

HOW TO DERIVE THE MIDDLE TERM — you will need this.

  You want value v1 at width w1, and value v2 at width w2.

      B (the vw coefficient) = 100 * (v2 - v1) / (w2 - w1)
      A (the fixed px part)  = v1 - B * w1 / 100

      result: clamp( v1px , Apx + Bvw , v2px )

  WORKED EXAMPLE — we wanted the root at 16px on 1920 and 21px on 3840:

      B = 100 * (21 - 16) / (3840 - 1920) = 100 * 5 / 1920 = 0.260417
      A = 16 - 0.260417 * 1920 / 100      = 16 - 5.0       = 11

      --ui-base: clamp(16px, 11px + 0.260417vw, 21px);

  CHECK IT at 2560:  11 + 0.260417 * 25.6 = 11 + 6.667 = 17.67px  ✓

Always verify your clamp at both endpoints and one middle point. If the
endpoints don't come out exactly right, your arithmetic is wrong.

3.4  `min()` = CEILING and `max()` = FLOOR  (this trips everyone up)
--------------------------------------------------------------------
    min(0.875rem, 17px)   "use 0.875rem, but NEVER MORE than 17px"  -> ceiling
    max(1px, 0.065rem)    "use 0.065rem, but NEVER LESS than 1px"   -> floor

It feels backwards. The mnemonic: min() picks the SMALLEST of the options, so
it can only ever pull a growing value DOWN. That makes it a cap.

We use min() with three arguments for overlays:

    --modal-md: min(34rem, 700px, calc(100vw - 2 * var(--gutter)));
                    ^^^^^  ^^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                    holds  stops  guarantees it fits on a small
                    visual a 5K   screen no matter what
                    ratio  screen
                           from a
                           900px
                           dialog

Each argument protects against a different failure. That is the pattern.

3.5  Piecewise-continuous curves
---------------------------------
A single clamp() is a straight line. Our scale needs different slopes in
different ranges, so we chain clamps across media queries — and we make each
segment's MIN equal the previous segment's MAX. That makes the curve
continuous: no jumps anywhere.

    @media (min-width: 1280px) { --ui-base: clamp(15.75px, ..., 16px)   }
    @media (min-width: 1728px) { --ui-base: clamp(16px,    ..., 21px)   }
                                              ^^^^
                                   equals the previous MAX -> continuous

If those two numbers disagree, you get a visible snap when the user resizes.

3.6  `vw` and `vh`
-------------------
    1vw = 1% of viewport WIDTH      1vh = 1% of viewport HEIGHT

Powerful and dangerous. `vw` is correct for page-level space (gutters, section
padding, container width) and WRONG for anything inside a component, because a
button has no business changing size when you widen the browser.

We use `vh` in exactly two places, to answer "is the screen short?":

    --nav-h:     min(calc(3.4 * var(--ui-ctl)), 66px, 6.6vh);
    --section-y: min(clamp(1.5rem, 0.6rem + 2.1vw, 4rem), 4.6vh);

On a 720-tall laptop the vh term wins and things tighten. On a 2160-tall
screen it never binds. This replaced two `max-height` media queries that were
producing a visible 16% jump between 1600x900 and 1920x1080.

3.7  `ch` — the reading measure
--------------------------------
`1ch` = the width of the "0" character in the current font.

    --prose-max: 68ch;

That literally means "about 68 characters per line", which is the actual
typographic rule for readable paragraphs. Because `ch` scales with font-size,
it self-corrects: at every resolution the line stays 68 characters, even
though its pixel width goes from 535px to 714px.

Writing `max-width: 46rem` describes the same thing INDIRECTLY and stops being
true the moment you change the font.

3.8  `auto-fit` grids — extra space becomes COLUMNS
----------------------------------------------------
    .ui-grid {
      --col-min: 18rem;
      display: grid;
      gap: var(--layout-gap);
      grid-template-columns: repeat(auto-fit, minmax(min(var(--col-min), 100%), 1fr));
    }

Read it as: "make as many equal columns as will fit, where each is at least
18rem wide."

  * No breakpoint list. The column count follows available space.
  * `--col-min` is in `rem`, so the threshold at which a column is dropped
    scales with the UI instead of being a hardcoded pixel number.
  * `min(var(--col-min), 100%)` is REQUIRED. Without it, on a container
    narrower than 18rem the track overflows horizontally. The `100%` clamps it.
  * `auto-fit` collapses empty tracks so 3 items fill the row.
    (`auto-fill` keeps empty tracks — use it only when you want a ragged edge.)

To stop cards becoming enormous on 4K, cap the CONTAINER, not the track:

    <div class="ui-grid ui-content">      /* ui-content = max-width: 84rem */

Because 84rem is `rem`-based, a card column is the same ~27rem at 1366 and at
3840 — identical proportion, different absolute size — and the leftover 4K
width becomes margin.

3.9  Custom properties (`--x`) and where units resolve
-------------------------------------------------------
    --ui-ctl: min(calc(0.75rem + 4px), 22px);

`rem` inside a custom property is SAFE, because `rem` always means "root font
size" no matter which element consumes the variable.

`em` inside a custom property is DANGEROUS, because `em` resolves against the
element that USES the variable, not the one that declared it. The same
variable then means different things in different places. Don't do it.

3.10  Media queries always measure `rem` as 16px
-------------------------------------------------
This is a spec rule and it is extremely useful:

    @media (min-width: 64rem)   /* ALWAYS 1024px */

Inside a media query, `rem` refers to the INITIAL font size (16px), NOT our
scaled root. So our layout breakpoints never drift when the UI scale moves.

    >>> Size and layout are independent knobs. <<<

3.11  `@layer` — why Tailwind utilities still win
--------------------------------------------------
Our component classes live in `@layer components { ... }`. Tailwind's
utilities live in a later layer. Later layers win regardless of specificity,
so `class="ui-btn p-0"` behaves the way you expect.

3.12  Small but load-bearing details
-------------------------------------
    min-height on controls     padding + line-height alone may not reach the
                               target height for short labels. --ctl-h
                               guarantees it.

    max(1px, 0.065rem)         hairline borders. Never sub-pixel (invisible),
                               never chunky (~1.4px on 4K).

    tabular-nums               fixed-width digits so numeric table columns
                               stay aligned at any font size.

    aspect-ratio: 16/9         image blocks size themselves from their width.
                               NEVER give a media box a fixed pixel height.

    text-wrap: balance         evens out heading line lengths.
    text-wrap: pretty          prevents single-word orphan lines in paragraphs.

    overflow-x: auto           wide tables scroll inside their own container
                               so the PAGE never scrolls sideways.


================================================================================
4. SEGREGATION — WHICH TIER DOES A VALUE BELONG TO?
================================================================================

Ask these questions in order. The first "yes" is your answer.

  Q1. Is it a colour, or a RATIO in the type scale?
      -> TIER 1 FOUNDATION. It does not respond to screen size. Done.

  Q2. Is it a click target, a row height, or chrome height?
      (button, input, table row, navbar, tab, switch, avatar, panel header)
      -> TIER 3 CONTROL. Use multiples of var(--ui-ctl).
         e.g.  padding: calc(0.5 * var(--ui-ctl)) calc(0.9 * var(--ui-ctl));

  Q3. Should the PAGE LAYOUT decide it?
      (page gutter, space between sections, gap between big regions,
       container width)
      -> TIER 4 FLUID. Use --gutter / --layout-gap / --section-y, or write a
         clamp() with vw. Only at layout level, never inside a component.

  Q4. Would it look absurd 1.3x bigger?
      (corner radius, decorative icon tile, modal width, drawer width,
       hairline, scrollbar)
      -> TIER 5 CONSTRAINED. Write min(<rem>, <px>).

  Q5. Is it an icon sitting next to text?
      -> `em`. Use the .ui-icon classes. Never rem, never px.

  Q6. Everything else — text, gaps, card padding, margins.
      -> TIER 2 SCALE-COUPLED. Plain `rem`. It joins the system automatically.

QUICK TABLE

    VALUE                        UNIT / TOKEN                 TIER
    ---------------------------  ---------------------------  ----------
    font-size                    rem (--text-*)               2
    letter-spacing               em                           2
    gap between form fields      rem                          2
    card padding                 --card-pad                   3 (capped)
    button padding / height      --ui-ctl / --ctl-h           3
    input height                 --input-h                    3
    table row padding            --row-py / --row-px          3
    navbar height                --nav-h                      5 (3-way min)
    page gutter                  --gutter                     4
    space between sections       --section-y                  4
    gap between grid cards       --layout-gap                 4
    app container width          --shell-max                  4
    paragraph max width          --prose-max (68ch)           4
    border radius                --radius-*                   5
    border width                 --hairline                   5
    modal / drawer width         --modal-* / --drawer-w       5
    inline icon                  em (.ui-icon)                2
    decorative icon tile         --icon-tile                  5


================================================================================
5. CAUTIONS — THE TRAPS, AND WHY EACH ONE BITES
================================================================================

C1.  DO NOT give every design token its own clamp().
     This is the most common "fluid typography" advice on the internet and it
     is wrong for a design SYSTEM. If --text-sm and --text-2xl each get their
     own curve, their RATIO drifts as the screen changes: at 2560 your heading
     might be 1.6x its base while body text is at 1.2x. The type scale's
     internal proportions are the design. Keep the ratios fixed in `rem` and
     move only the root.

C2.  DO NOT put `vw` inside a component.
     `padding: 0.6vw` on a button means the button changes size when you widen
     the window. That is never what anyone wants. `vw` belongs to page layout.

C3.  min() vs max() direction.
     min() is a CEILING. max() is a FLOOR. Getting this backwards produces a
     value that grows without limit or one that never grows at all, and it is
     easy to miss in review. Say it out loud: "min means never more than".

C4.  DO NOT use `em` inside a custom property.
     It resolves against the consuming element, so the variable silently means
     different things in different places. `rem` is safe; `em` is not.

C5.  Remember `rem` = 16px inside media queries.
     `@media (min-width: 64rem)` is 1024px forever, even when our root is
     21px. This is a FEATURE (layout doesn't drift) but it surprises people
     who assume it tracks the scaled root.

C6.  parseFloat(getComputedStyle(el).getPropertyValue('--ui-ctl')) is NaN.
     Custom properties are stored as token streams, not computed lengths. You
     get back the literal string "min(calc(0.75rem + 4px), 22px)". To read a
     resolved value you must let layout compute it:

         const d = document.createElement('div');
         d.style.cssText = 'position:absolute;visibility:hidden;height:var(--ui-ctl)';
         document.body.appendChild(d);
         const px = d.getBoundingClientRect().height;
         d.remove();

     See resolveLength() in src/lib/useScreenClass.js.

C7.  Tailwind v4: `ring-[var(--ring)]` sets ring COLOUR, not width.
     An arbitrary ring value is parsed as a colour, so the rule compiles to
     `--tw-ring-color: var(--ring)` and you get NO visible ring at all. It
     fails silently. Use a box-shadow class instead — see .ui-ring-accent.

C8.  Tailwind v4: avoid `/opacity` on themed colours.
     `bg-accent-soft/60` is resolved AT BUILD TIME into a literal hex taken
     from the light palette (e.g. #e2ebff99). It will not follow dark mode.
     Use color-mix() or a dedicated token.

C9.  DO NOT write arbitrary pixel values (`p-[12px]`, `h-[40px]`).
     They opt out of every tier and will be wrong on at least one screen.
     Tailwind's own spacing and type utilities are already rem-based.

C10. `minmax(18rem, 1fr)` without `min(..., 100%)` overflows.
     On a container narrower than the minimum, the grid track cannot shrink
     and pushes the page sideways. Always `minmax(min(18rem, 100%), 1fr)`.

C11. Capping a grid TRACK instead of the CONTAINER orphans items.
     We tried `--col-max: 30rem`. Combined with an 84rem container it fits
     only 2 tracks, so the third card wrapped alone onto its own row. Cap the
     container (.ui-content) and leave tracks at `1fr`.

C12. DO NOT shrink type to win vertical space.
     Our first version reduced the root font size on short viewports, which
     produced 11.1px labels on a 1366x768 laptop. Height is the constraint on
     those machines, so tighten VERTICAL RHYTHM (section padding, navbar
     height) and leave text alone. Trading legibility for 30px of height is a
     bad deal.

C13. DO NOT fix a resolution problem with a resolution-specific rule.
     If 2560 looks wrong, the bug is in a token or a tier assignment. Adding
     `@media (min-width: 2560px) { .thing { padding: 18px } }` fixes one
     screenshot and breaks 2304 and 2880. Fix the rule, then re-measure.

C14. DO NOT give anything containing text a fixed height.
     Use min-height. Text reflows; a fixed height clips it at some scale.

C15. Layout breakpoints are for LAYOUT.
     A breakpoint should change structure (sidebar collapses, columns stack),
     never just tweak a size. If you are adding a breakpoint to nudge a
     padding, you have found a token that is in the wrong tier.


================================================================================
6. WORKED EXAMPLE: ADDING A NEW COMPONENT CORRECTLY
================================================================================

Say we need a "toolbar" — a horizontal bar with a title, a search field and
some buttons — sitting above a table.

STEP 1. Classify every dimension BEFORE writing CSS.

    bar height           -> click-target chrome        -> TIER 3, --ui-ctl
    padding inside bar   -> chrome                     -> TIER 3, --ui-ctl
    gap between buttons  -> normal spacing             -> TIER 2, rem
    title font-size      -> type                       -> TIER 2, --text-*
    corner radius        -> decoration                 -> TIER 5, --radius-*
    border               -> decoration                 -> TIER 5, --hairline
    gap to the table     -> space between regions      -> TIER 4, --layout-gap
    search field width   -> would look silly 1.3x      -> TIER 5, min(rem, px)

STEP 2. Write it.

    @layer components {
      .ui-toolbar {
        display: flex;
        align-items: center;
        gap: 0.5rem;                                   /* T2 */
        min-height: calc(2.9 * var(--ui-ctl));         /* T3 */
        padding: calc(0.4 * var(--ui-ctl))             /* T3 */
                 calc(0.7 * var(--ui-ctl));
        background: var(--color-surface);
        border: var(--hairline) solid var(--color-line);  /* T5 */
        border-radius: var(--radius-lg);                  /* T5 */
      }
      .ui-toolbar-title  { font-size: var(--text-sm); font-weight: 600; }  /* T2 */
      .ui-toolbar-search { width: min(16rem, 260px); }                     /* T5 */
      .ui-toolbar-spacer { flex: 1; }
    }

    Note what is NOT there: no px, no vw, no media query.

STEP 3. Measure it, don't eyeball it.

    npm run dev
    npm run measure

    Add your element to public/probe.html and print its height. Then check the
    RATIO column: bar height should grow ~1.2x from 1920 to 3840. If it grows
    1.3x, you accidentally used `rem` where you needed `--ui-ctl`. If it does
    not grow at all, you used px.


================================================================================
7. CODE-REVIEW CHECKLIST
================================================================================

Reject the diff if any of these is true:

    [ ] A raw `px` value appears outside scale.css
        (exceptions: min()/max() ceilings and floors, and 1px hairline floors)
    [ ] `vw` or `vh` appears inside a component rule
    [ ] A new media query was added that changes a SIZE rather than a LAYOUT
    [ ] A single design token was given its own clamp()
    [ ] A control's padding uses `rem` instead of `--ui-ctl`
    [ ] An icon is sized in `rem` or `px` instead of `em`
    [ ] A grid uses `minmax(<rem>, 1fr)` without the `min(..., 100%)` guard
    [ ] Something containing text has a fixed `height`
    [ ] A media box has a pixel height instead of `aspect-ratio`
    [ ] A themed colour uses a `/opacity` modifier
    [ ] A ring width was written as `ring-[var(--x)]`
    [ ] The change was verified by screenshot only, with no measurement

Then run `npm run measure` and confirm the ratio column still reads:

    text ~1.31x   controls ~1.23x   whitespace ~1.9x   radii capped


================================================================================
8. CHEAT SHEET
================================================================================

  TOKENS YOU WILL USE MOST

    var(--ui-ctl)        control unit. Multiply it for any chrome dimension.
    var(--ctl-h)         standard control height (2.25 * ctl)
    var(--input-h)       input height (2.40 * ctl)
    var(--card-pad)      card padding, capped at 26px
    var(--gutter)        page side padding
    var(--layout-gap)    gap between big layout regions
    var(--section-y)     vertical space between page sections
    var(--shell-max)     app container max width
    var(--content-max)   narrower rail for reading/cards (84rem)
    var(--prose-max)     68ch reading measure
    var(--hairline)      border width
    var(--radius-md/lg)  corner radii (capped)
    var(--text-sm) etc.  type scale

  CLASSES

    .ui-shell     page container + gutters
    .ui-content   narrower rail, 84rem, centred
    .ui-prose     68ch measure
    .ui-section   vertical section rhythm
    .ui-grid      auto-fit grid; set --col-min to tune the column threshold
    .ui-icon      em-sized inline icon

  COMMANDS

    npm run dev        dev server (needed for /probe.html)
    npm run measure    headless sweep across 10 resolutions
    npm run build      production build

    tools/measure.sh http://localhost:5173/probe.html 2880x1620
    tools/measure.sh 'http://localhost:5173/probe.html?scale=stepped' 3840x2160
    tools/measure.sh 'http://localhost:5173/probe.html?theme=light' 1366x768

  THE FOUR ANCHOR NUMBERS (memorise these)

    1rem at 1920 = 16.00px      --ui-ctl at 1920 = 16.00px
    1rem at 3840 = 21.00px      --ui-ctl at 3840 = 19.75px

  THE ONE RULE

    Not every dimension should respond to viewport size the same way.

================================================================================
