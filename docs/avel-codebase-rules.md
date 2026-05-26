# Avel LLC — Codebase Rules
## Landing Page: avelco.dev

> This is not a suggestion document. Every rule here is enforced on every build session. No exceptions without explicit founder approval.
>
> **Scope:** This file governs the public landing page at `avelco.dev` only. The command center at `/app/*` uses a two-mode (dark + light) token system defined in `avel-brand-and-web-guide.md` and patterned in `avel-component-cheatsheet.md`. The landing page is **dark only** — the tokens below resolve to the dark-mode hex values.

---

## Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | No Pages Router. App Router only. |
| Styling | Tailwind CSS | Utility classes only. No custom CSS files unless absolutely necessary. |
| Animation | Framer Motion | All motion lives here. No CSS keyframes. No setTimeout hacks. |
| Fonts | Clash Display + Inter | Loaded via Fontshare and Google Fonts. No other fonts. |
| Language | TypeScript | Strict mode on. No `any` types. |
| Deployment | Vercel | Connected to avelco.dev domain. |

---

## File Structure

```
/app
  layout.tsx          ← fonts, metadata, global wrapper
  page.tsx            ← imports sections in order, nothing else
/components
  /sections
    Hero.tsx
    Problem.tsx
    Services.tsx
    HowItWorks.tsx
    CTA.tsx
    Footer.tsx
  /ui
    Button.tsx
    Card.tsx
    SectionWrapper.tsx
    AnimatedText.tsx
/content
  copy.ts             ← ALL copy lives here. No strings inside components.
/styles
  globals.css         ← Tailwind base only. Nothing else.
/public
  /brand
    logo-stacked.png
    logo-horizontal.png
    logo-icon.png
    favicon.ico
    og-image.jpg
```

---

## Design Tokens

These values are the source of truth. Never hardcode a value that isn't listed here.

```ts
// tokens.ts — landing page (dark only)
// Command center uses CSS variables per avel-brand-and-web-guide.md
export const tokens = {
  colors: {
    bg: "#1A1D23",            // page base — softened dark, not OLED black
    surface: "#393E46",       // cards, secondary panels
    surfaceMuted: "#2A2E36",  // sunken sections, subtle fills
    surfaceElevated: "#4A5058", // overlays
    border: "#4A5058",        // neutral hairline (NOT accent-tinted)
    borderStrong: "#5E6670",  // input focus, emphasis dividers
    accent: "#0092CA",        // single accent — 10% of page maximum
    accentHover: "#00A8E6",   // hover state on accent
    accentSoft: "#0092CA1A",  // 10% accent fill
    focusRing: "#0092CA99",   // 60% accent for focus indicator
    text: "#EEEEEE",          // headlines, primary copy
    textMuted: "#A0A8B0",     // body, secondary
    textSubtle: "#6E7681",    // captions, hints, placeholders
  },
  fontSize: {
    display: "clamp(48px, 8vw, 96px)",
    h2: "clamp(32px, 5vw, 56px)",
    h3: "24px",
    body: "16px",
    small: "14px",
  },
  spacing: {
    sectionY: "120px",      // desktop
    sectionYMobile: "64px", // mobile
    maxWidth: "1200px",
    gutter: "24px",
  },
  radius: {
    card: "16px",
    button: "9999px", // pill — all buttons are rounded-full
    input: "10px",
  },
  animation: {
    fadeUp: { opacity: 0, y: 20 },
    fadeUpEnd: { opacity: 1, y: 0 },
    duration: 0.5,
    easing: [0.25, 0.1, 0.25, 1],
    stagger: 0.1,
    hover: 0.15,
  },
}
```

---

## Component Rules

### General
- No component exceeds 150 lines. Split into subcomponents if it grows beyond that.
- No inline styles. Tailwind classes or token references only.
- No `!important`. If you need it, the structure is wrong.
- Class names describe purpose, not appearance.
- Every component is typed with explicit TypeScript interfaces.
- No hardcoded copy inside components. All strings come from `/content/copy.ts`.

### Section Components
- Each section is self-contained. No section imports styles from another section.
- Every section is wrapped in `<SectionWrapper>` which handles padding, max-width, and centering.
- Sections are imported and ordered only in `page.tsx`. Never nest sections inside each other.

### The Button Component
- One button style on landing: filled accent background, white text, **pill shape (`rounded-full`)**.
- No ghost buttons on the landing page (dark background only — ghost reads weak).
- One CTA per section. Never two competing actions in the same section.
- Always includes hover state and focus state.

```tsx
// Button.tsx — the only button style on landing
<button className="bg-[#0092CA] text-white px-6 py-3 rounded-full
  transition-all duration-150 hover:bg-[#00A8E6]
  focus:outline-none focus:ring-2 focus:ring-[#0092CA99] focus:ring-offset-2
  focus:ring-offset-[#1A1D23]">
  {label}
</button>
```

### The Card Component
- 1px border using `border` token — neutral gray, NOT accent-tinted (`#4A5058`).
- 16px border radius.
- Background uses `surface` token (`#393E46`) — solid surface, not a transparency overlay.
- On hover: translateY -4px, border shifts to `accentSoft` border tone (`#0092CA40`).
- Transition: 150ms.

---

## Animation Rules

- All motion via Framer Motion. No exceptions.
- Fade-in on scroll: opacity 0→1, translateY 20px→0, duration 0.5s, ease-out.
- Stagger between siblings: 0.1s delay increments.
- Hover transitions: 150ms. Never slower.
- Only the hero headline animates on page load. Everything else triggers on scroll.
- Never animate layout properties: no animating width, height, margin, or padding.
- Use `useReducedMotion()` hook — respect user accessibility preferences.

```tsx
// Standard scroll-triggered fade-up
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

// Staggered container
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}
```

---

## Copy Rules

- All copy lives in `/content/copy.ts`. Every string. Every word.
- Copy is never written inside a component.
- Copy is never invented as a placeholder. If copy isn't provided, the component renders nothing and flags it.
- Placeholder text is never `Lorem ipsum`. If needed during build, use `[COPY NEEDED: section name]`.

```ts
// copy.ts structure
export const copy = {
  hero: {
    headline: "",
    subhead: "",
    cta: "",
  },
  problem: {
    saas: {
      heading: "",
      points: [],
    },
    operator: {
      heading: "",
      points: [],
    },
  },
  services: [],
  howItWorks: [],
  cta: {
    headline: "",
    subhead: "",
    button: "",
    trust: "",
  },
  footer: {
    tagline: "",
    links: [],
    legal: "",
  },
}
```

---

## What Claude Must Never Do

- Never add a section that was not specified by the founder.
- Never change a color value, even by 1%. The token map in `avel-brand-and-web-guide.md` is the source of truth — this file mirrors the dark-mode subset.
- Never use a font other than Clash Display or Inter.
- Never write real-sounding placeholder copy inside a component.
- Never add animations beyond what is documented here.
- Never introduce a new dependency without flagging it first and getting approval.
- Never use `any` in TypeScript.
- Never leave `console.log` statements in code.
- Never use `!important` in styles.
- Never build desktop-first. Mobile styles are written first, desktop overrides second.
- Never combine two sections into one component for convenience.

---

## What Claude Must Always Do

- Read this file at the start of every build session.
- Confirm which section is being built before writing code.
- Ask for copy before building any text-bearing component.
- Write mobile styles first.
- Include hover and focus states on every interactive element.
- Test that every component renders correctly at 390px width.
- Reference `/content/copy.ts` for all strings.
- Keep components under 150 lines.
- Use the token file for all color, spacing, and animation values.

---

## Section Build Order

Build in this order. Do not skip ahead.

1. `SectionWrapper.tsx` — the base wrapper every section uses
2. `Button.tsx` — the only CTA component
3. `Card.tsx` — the only card component
4. `Hero.tsx` — first visible section
5. `Problem.tsx` — two-column pain section
6. `Services.tsx` — three-tier pricing cards
7. `HowItWorks.tsx` — three-step process
8. `CTA.tsx` — the close
9. `Footer.tsx` — functional only

---

## Performance Rules

- No image without explicit width and height attributes.
- All images use `next/image` — never a raw `<img>` tag.
- No third-party scripts loaded synchronously.
- Fonts loaded with `display: swap`.
- Lighthouse score target: 90+ on mobile before launch.

---

## Git Rules

- One commit per section completed.
- Commit message format: `feat: build [SectionName] component`
- No committing broken code to main.
- Branch per feature: `feature/hero`, `feature/services`, etc.
- Merge to main only when section is complete and tested on mobile.

---

## Launch Checklist

- [ ] All copy approved by founder
- [ ] All four logo variations in `/public/brand/`
- [ ] Favicon renders correctly at 32x32
- [ ] OG image renders correctly when shared on LinkedIn and Twitter
- [ ] Mobile tested at 390px on real device
- [ ] Lighthouse mobile score 90+
- [ ] avelco.dev domain connected and SSL active
- [ ] No console errors in production build
- [ ] All interactive elements have hover and focus states
- [ ] `console.log` statements removed
