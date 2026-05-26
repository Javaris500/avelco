# Avel LLC — Brand & Website Guide

## Brand Color Tokens

Avel uses a **two-mode token system** in the command center (dark + light). The public landing is dark only. Three anchor colors — `#393E46`, `#0092CA`, `#EEEEEE` — fill different semantic roles per mode; intermediate grays are derived.

### Anchors

| Anchor | Dark mode role | Light mode role |
|---|---|---|
| `#393E46` | Surface (cards, sidebar, secondary panels) | Primary text |
| `#0092CA` | Accent | Accent (UI only — body links use `#0078AB`) |
| `#EEEEEE` | Primary text | Surface (cards, panels) |

### Full token map (source of truth for Tailwind config)

Page bases are deliberately **softened** — dark is not pitch black; light is not stark white. Goal: premium, not harsh.

| Token | Purpose | Dark | Light |
|---|---|---|---|
| `bg` | Page base | `#1A1D23` | `#F4F5F7` |
| `surface` | Cards (default elevation) | `#393E46` | `#FFFFFF` |
| `surface-muted` | Sidebar, secondary panels, sunken sections | `#2A2E36` | `#EEEEEE` |
| `surface-elevated` | Modals, popovers, tooltips | `#4A5058` | `#FFFFFF` + shadow |
| `border` | Hairlines, card edges, dividers | `#4A5058` | `#E5E7EB` |
| `border-strong` | Input focus, emphasis dividers | `#5E6670` | `#D1D5DB` |
| `text` | Headlines, primary copy | `#EEEEEE` | `#1A1D23` |
| `text-muted` | Body, secondary copy | `#A0A8B0` | `#393E46` |
| `text-subtle` | Captions, hints, placeholder | `#6E7681` | `#6E7681` |
| `accent` | Buttons, focus, UI icons | `#0092CA` | `#0092CA` |
| `accent-hover` | Hover state on accent | `#00A8E6` | `#0078AB` |
| `accent-soft` | Subtle fills @ 10% alpha | `#0092CA1A` | `#0092CA1A` |
| `accent-text` | Body links, inline accent text | `#0092CA` | `#0078AB` |
| `focus-ring` | Focus indicator | `#0092CA99` | `#0092CA99` |

**Why these bases:**
- **Dark `#1A1D23`** sits ~16 lightness points below `surface` (`#393E46`). Cards still read as visibly lifted, but the page itself feels like a premium dark UI rather than an OLED test screen.
- **Light `#F4F5F7`** is a cool warm-neutral off-white. Cards at pure `#FFFFFF` pop softly above it without glare. `#EEEEEE` keeps an active role as `surface-muted` for sidebars and secondary panels.

### Semantic feedback (same hex in both modes)

| Token | Hex | Used for |
|---|---|---|
| `success` | `#22C55E` | Confirmation, healthy state |
| `warning` | `#F59E0B` | Caution, near-SLA |
| `danger` | `#EF4444` | Errors, breached, critical |
| `info` | `#0092CA` | Equals `accent` — informational badges |

### Card borders — neutral in both modes

- **Dark mode:** `border` token (`#4A5058`). Not accent-tinted in the default state.
- **Light mode:** `border` token (`#E5E7EB`). Accent borders on white read amateur.
- **Active/hover:** card border may shift to `#0092CA40` (accent at 25%) on interactive cards only.

### Rules

- **One accent only.** `#0092CA` is the only chromatic color. Never add a second accent.
- **10% maximum.** Accent appears in 10% or less of any rendered page. Scarcity makes it powerful — more so on light mode where it fatigues fast.
- **Body links in light mode use `#0078AB`** (`accent-text` token), not the full accent. Pure `#0092CA` fails AA contrast on white at body text size.
- **Never use pure black** (`#000000`) or pure white as a page-section background. Dark base is `#1A1D23` (premium dark, not OLED test screen); light base is `#F4F5F7` (warm off-white, not clinical white). Cards in light mode pop to `#FFFFFF`, but the page itself never sits at pure white.

### Mode selection mechanics

- **First visit:** auto-detect via `prefers-color-scheme`. Fall back to **dark** if no preference.
- **Persistence:** cookie via `next-themes`. No flash on load.
- **Switch motion:** instant — zero animation, single repaint.
- **Toggle locations:** command center user menu (bottom of sidebar) + `/app/settings`.
- **Public landing (`avelco.dev/`):** no toggle. Dark only. Landing is marketing — "Built with intent" reads stronger in dark.

### Contrast verified

| Pair | Ratio | Compliance |
|---|---|---|
| `#EEEEEE` on `#1A1D23` (text on dark bg) | ~13:1 | AAA |
| `#EEEEEE` on `#393E46` (text on dark card) | ~10:1 | AAA |
| `#0092CA` on `#1A1D23` (accent on dark bg) | ~4.8:1 | AA body, AA large |
| White on `#0092CA` (button fill) | ~3.8:1 | AA large only — fine for bold button labels |
| `#1A1D23` on `#F4F5F7` (text on light bg) | ~14:1 | AAA |
| `#1A1D23` on `#FFFFFF` (text on light card) | ~16:1 | AAA |
| `#0078AB` on `#F4F5F7` (body link, light) | ~5:1 | AA body |
| `#0078AB` on `#FFFFFF` (body link, light card) | ~5.1:1 | AA body |

---

## Logo Variations — Need 4 Total

| Variation | Status | Use Case |
|---|---|---|
| Full lockup (mark + wordmark, stacked, dark bg) | ✅ Done | Hero, presentations, documents |
| Horizontal version (mark + wordmark side by side) | ❌ Needed | Navbar |
| Icon only (A mark, no wordmark) | ❌ Needed | Favicon, mobile, social profiles |
| Light version (white mark + wordmark, transparent bg) | ❌ Needed | Light backgrounds, documents |

---

## Site Assets

| Asset | Size | Status | Notes |
|---|---|---|---|
| Favicon | 32x32, 64x64 | ❌ Needed | A mark only. Browser tab + bookmarks. |
| OG Image | 1200x630px | ❌ Needed | Logo centered on dark bg + tagline. Shows on LinkedIn, Twitter, iMessage shares. Do not skip. |

---

## Brand Assets

| Asset | Status | Notes |
|---|---|---|
| Email signature graphic | ❌ Needed | Logo + name + title + website |
| Social profile photo | ❌ Needed | Icon mark (A only) |
| LinkedIn banner | ❌ Needed | Brand color + tagline |
| Twitter/X banner | ❌ Needed | Brand color + tagline |

---

## Priority Order

1. Favicon
2. Horizontal nav logo
3. OG image
4. Social profile assets
5. Email signature
6. Light logo variation

---

## Where to Get Variations Made

- **Looka / Brandmark.io** — if original logo was made here, log back in and export all variations
- **Canva** — recreate horizontal lockup and export all versions. Fast and free.
- **Fiverr** — $15–30 for a designer to package all four variations with source files

---

## Website Design Concepts

### Visual Language
- **Background:** `bg` token — `#1A1D23` (dark, default and only on landing) / `#F4F5F7` (light, command center only). Softened on purpose — dark isn't pitch black, light isn't clinical white.
- **Accent:** `#0092CA`. One color only. 10% of the page maximum. Body links in light mode use `#0078AB` for contrast (see Brand Color Tokens above).
- **Headlines:** `text` token — `#EEEEEE` (dark) / `#1A1D23` (light) at 72px–96px on desktop. Big type on dark backgrounds is instantly authoritative. Never go smaller than feels right — timid type reads as timid business.
- **Body:** `text-muted` token — `#A0A8B0` (dark) / `#393E46` (light). Keeps hierarchy without adding a new color.
- **Typography:** One display font, one body font. Recommended: Clash Display or Cabinet Grotesk for headlines, Inter for body. All free at Fontshare.com.
- **Card borders:** 1px `border` token — `#4A5058` (dark) / `#E5E7EB` (light). Neutral in both modes. Cards feel defined without feeling heavy.

### Site Structure — 6 Sections

**1. Hero — Make a claim**
Full viewport. One headline. One subhead. One button. Slow-shifting animated gradient background. No hero image — the words are the visual. Headline makes someone stop within two seconds.

**2. Problem Section — Create tension**
Two columns, one per ICP. Left: SaaS founder pain. Right: business owner pain. Short punchy statements. Make them feel seen before offering anything. Example: "Your roadmap is backed up. Your competitors just shipped AI."

**3. Services — Release the tension**
Dark cards with subtle border. Title, one sentence, price per card. On hover: card lifts, border glows in accent color. Three tiers visible. No walls of text.

**4. How It Works — Build confidence**
Three steps. Step numbers large in accent color. Under 60 words total. Kills the "but how does it actually work" objection.

**5. CTA Section — The close**
Dark to slightly lighter background. One headline. One button. One trust line underneath. Example: "No retainers. No surprises. Just product."

**6. Footer — Functional only**
Logo. Nav links. Legal. One line of brand voice. Nothing extra.

---

### Motion Principles
- Every element fades and rises on scroll — starts 20px below at opacity 0, settles into place
- Hero headline: words reveal left to right, 80ms apart
- Service cards: stagger entrance 100ms apart left to right
- Background: slow radial gradient shift over 8–12 seconds, never stops, never distracts
- **Rule:** Motion serves reading. Never interrupts it. If an animation makes someone wait, cut it.

---

### What Makes It Innovative
- Copy is specific — real numbers, real outcomes, real buyer language
- Problem section calls out two distinct buyers by name — nobody does this
- No stock imagery — pure type, motion, and geometry
- Transparent pricing signals confidence — most new firms hide it

---

### Being New — How to Handle It
Avel has no case studies yet. No client logos. That's fine. Here's what replaces traditional social proof:

- **Process is proof** — detailed, confident How It Works section
- **Pricing is proof** — transparent tiers signal you know exactly what you're selling
- **Copy is proof** — sharp, specific, zero-filler writing signals clean execution
- **Framework is proof** — "Built on a proprietary build system" without naming it

What the site should NOT have: fake testimonials, placeholder logos, "years of experience" claims, client counts that don't exist.

What it CAN say: *"Avel is new. The system behind it isn't. We built the infrastructure before we opened the doors."*

---

### UI Libraries

**If building in Framer:**
No external library needed. Framer's component and motion system handles everything. Fastest path to the premium aesthetic. Recommended for solo founder launching on a deadline.

**If building in React:**
- **shadcn/ui** — best choice. You own the code. Dark mode first. Zero opinions on style until you apply your tokens. Used by serious builders.
- **Radix UI** — what shadcn is built on. Accessible, headless, pairs with Tailwind.
- **Framer Motion** — non-negotiable for animation in React. This is what makes things feel alive.
- **Aceternity UI** — pre-built animated components for dark premium AI-style sites. Backgrounds, cards, text effects. The shortcut to looking elite fast. Free. Built on Tailwind and Framer Motion. Use as visual reference even in Framer.

---

### Design Principles

**Whitespace is not empty space.**
Every premium site uses more space than feels comfortable. Section padding: 80px–120px minimum. Breathing room signals confidence.

**One focal point per section.**
Each section gets one thing the eye goes to first. Hero: headline. Services: cards. Problem: pain statements. Never compete with yourself within a section.

**Type does the heavy lifting.**
72px–96px headlines on desktop. Most builders go too small — it reads as timid. Big type on dark backgrounds is authoritative.

**60-30-10 rule.**
60% background. 30% text and surface elements. 10% accent color. If teal-cyan appears more than 10% of the page, pull back.

**Hierarchy through size, not color.**
Use scale to show importance. Don't reach for color to differentiate elements. Headline big. Subhead medium. Body small. The eye knows what to read first.

**Borders over backgrounds.**
Cards get a 1px border at 15% accent opacity — not a different background color. Sophisticated dark UI uses borders. Amateur dark UI uses filled backgrounds.

**Never center everything.**
Center-aligned works for short headlines. Body copy always left-aligned. Mixing alignment intentionally creates rhythm. Centering everything makes a page look like a template.

**Hover states must be immediate.**
0ms delay, 150ms transition. Any longer and the site feels sluggish. Subtle: border brightens, card lifts 4px, button shifts 10% lighter. Nothing dramatic.

**Mobile is not an afterthought.**
Buyers check the site on their phone before booking a call. Every font, section, and CTA must work at 390px width. Test it constantly.

---


- **Recommended:** Framer — visual builder, native motion, deploys to custom domain. Same stack Lunivate uses.
- **Alternative:** Next.js + Tailwind + Framer Motion library for full code control
- **3D accent (optional):** Spline.design — embed a subtle interactive object in the hero
- **Fonts:** Fontshare.com — Clash Display and Cabinet Grotesk both free

---

## Notes
- Do not add a second accent color. Ever.
- Background base: `#1A1D23` (dark) / `#F4F5F7` (light). Softened deliberately — dark isn't pitch black, light isn't clinical white. Cards in light mode pop to pure white above the off-white page.
- Accent history: `#0092CA` (current, locked 2026-05-26) ← `#00B4C8` (May) ← `#29ABE2` (initial). Logo may need re-rendering to match the slightly bluer accent — flag during the favicon/horizontal lockup pass.
- Two-mode system locked 2026-05-26: command center supports dark + light with auto-detect, public landing is dark only. See Brand Color Tokens above for the full token map.
- The A mark alone must be recognizable at small sizes — test at 32x32 before finalizing favicon.
- Lunivate (lunivate.com) is a reference site — built on Framer, good motion reference, but copy is weak and generic. Avel's copy will be sharper and more specific.
- Aceternity UI (ui.aceternity.com) is a visual reference for dark animated components regardless of build stack.
