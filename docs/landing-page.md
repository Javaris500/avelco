# Avel — Landing Page Copy

Source of truth for the **avelco.dev** public landing page. Dark mode only.

---

## Locked decisions

- Hero direction: **A** (against the agency norm)
- Pricing display: **"From $X"** with floors — Starter $4,000, Standard $10,000, Enterprise $25,000
- Universal CTA verb: **Book a call**
- **8 sections:** Hero → Problem → Services → How It Works → The System → FAQ → CTA → Footer
- Brand: dark only, accent `#0092CA` ≤10% of any page, off-white `#EEEEEE` text on `#1A1D23` base
- No portfolio, no testimonials, no client logos, no "trusted by" strip — Avel is new and we don't fake proof
- Per `avel-brand-and-web-guide.md`: 60/30/10 color rule, WCAG 2.1 AA floor, motion serves reading

---

## Section 1 — Hero

**Headline:**
Most software firms sell time. We sell finished products.

**Subhead:**
Fixed scope. Fixed price. Shipped in weeks, not quarters.

**CTA button:**
Book a call →

**Notes:**
- Full viewport, slow radial gradient background per brand guide
- Headline reveals left to right, 80ms per word
- Subhead fades in after headline completes
- No hero image — the words are the visual

---

## Section 2 — Problem

**Section headline:**
You're in one of two spots.

**Layout:** Two columns, left and right.

### Left column — *For SaaS founders shipping AI*

- Your competitors just shipped AI.
- Your roadmap is three quarters behind.
- Your best engineer is already maxed.
- Every contractor wants a retainer for work that should take two weeks.

### Right column — *For owners running 2–5 businesses*

- You manage three businesses from six different spreadsheets.
- One process is bleeding money every month. You already know which one.
- You spend more time running it than growing it.
- Every "all-in-one platform" wants $40k upfront and a six-month rollout.

**Notes:**
- No CTA in this section. Relief comes in Section 3.
- Columns stack on mobile, SaaS lane first.

---

## Section 3 — Services

**Section headline:**
Three sprints. One outcome: shipped.

**Layout:** Three cards, dark surface, 1px neutral border, accent border-glow on hover, 4px lift on hover.

### Card 1 — Starter

- **Duration:** ~1 week
- **Claim:** Ship one feature. End to end. In a week.
- **For:** One well-scoped feature, in production. For validating a hypothesis before a bigger build.
- **Price:** From $4,000
- **CTA:** Book a call →

### Card 2 — Standard

- **Duration:** ~2 weeks
- **Claim:** An MVP, an AI feature, or a working internal tool — built and shipped.
- **For:** Real software, not a prototype. Production-ready in two weeks.
- **Price:** From $10,000
- **CTA:** Book a call →

### Card 3 — Enterprise

- **Duration:** 3–6 weeks
- **Claim:** A full system. Multi-feature, integrated, shipped.
- **For:** Replacing a stitched-together mess — spreadsheets, contractors, half-built tools — with one product that runs.
- **Price:** From $25,000
- **CTA:** Book a call →

**Notes:**
- Cards stagger entrance 100ms apart left to right
- Billing displayed as part of How It Works (Step 02), not on the cards — keeps cards clean

---

## Section 4 — How It Works

**Section headline:**
How we ship.

**Layout:** Three steps, large accent-color numerals, under 60 words total.

**01. Scope the sprint.**
Pick a tier. We lock scope and price in a 30-minute call.

**02. We build.**
You don't manage contractors, run standups, or chase status. 50% upfront, 50% on delivery.

**03. Ship.**
Production code, full handoff, ready to run.

**Notes:**
- Step numerals: `#0092CA`, oversized (~96px+)
- Step 02 plants the billing detail — only place on the page it lives

---

## Section 5 — The System

**Section headline:**
The system.

**Body line (sits under headline):**
Avel runs on a proprietary build system. It's the reason scope is fixed, prices don't move, and the same quality ships every time.

**Layout:** Three pillars in a row beneath the body.

### Pillar 1 — Plan-first.

Every build starts with a written plan — scope, dependencies, decisions, exit criteria. No code until the plan is locked.

*Why it matters:* scope doesn't drift if the plan is signed off.

### Pillar 2 — Multi-pass review.

Every part of the codebase passes through separate review processes — security, performance, integration — before it ships.

*Why it matters:* catches the mistakes that pile up in single-developer builds.

### Pillar 3 — Documented as built.

Each project ships with a written record: architecture decisions, what runs where, how to operate it. No tribal knowledge handed off in a Loom video.

*Why it matters:* you actually own the software when we're done.

**Closing line (sits below the pillars):**
You hire a build firm. You get the system.

**Notes:**
- Zero references to the internal 24-agent system. "Proprietary build system" + concrete outcomes only.
- This section replaces case studies / client logos as proof of capability.

---

## Section 6 — FAQ

**Section headline:**
Before you book.

**Q. You're a new firm. Why no portfolio?**
Avel is new. The system behind it isn't. The infrastructure was built before the doors opened — the proof ships in production for our first clients. If "established firm with logos" is your filter, we're not the fit yet.

**Q. What if my project doesn't fit a tier?**
Most do — you'd be surprised how much ships in one or two focused weeks. If yours genuinely doesn't, we scope a custom build using the same fixed-price structure. Never hourly.

**Q. What if you miss the deadline?**
Deadlines are part of the contract. If we miss, you stop paying until we ship. No extensions, no excuses.

**Q. What if I want to change something mid-build?**
Small adjustments inside the locked scope are part of the process. Changes that expand scope go in the next sprint, at the next sprint's price. This is what prevents the "two-month project that takes a year" problem.

**Q. Who owns the code?**
You do. Full handoff at delivery — repo, infrastructure, documentation. We don't keep keys.

**Q. Do you offer ongoing support or retainers?**
No. Avel ships products and hands them off. If you need more work later, book another sprint.

---

## Section 7 — CTA

**Headline:**
Pick a sprint. Book the call.

**Button:**
Book a call →

**Trust line:**
30 minutes. We scope, you decide. No retainers, no surprises.

**Notes:**
- Background steps lighter than the preceding section per brand guide
- Single focal point — button gets a slight pulse on hover, nothing more

---

## Section 8 — Footer

```
avel

How it works  ·  Services  ·  FAQ  ·  Book a call

Built with intent.

© 2026 Avel LLC  ·  Privacy  ·  Terms
```

**Notes:**
- Wordmark only — A mark already lives in the navbar
- No email, no socials — booking call is the only contact surface
- Privacy + Terms must exist as real pages before launch

---

## Implementation checklist

- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Booking call destination (Cal.com or equivalent — TBD)
- [ ] Open Graph image (1200×630, dark bg, wordmark + tagline)
- [ ] Favicon (32×32, 64×64) — A mark only
- [ ] Horizontal nav lockup (A mark + wordmark, baseline aligned)
- [ ] Light-mode logo variants (command center only — not needed for landing)

---

## Motion summary (from brand guide)

- Hero: headline reveals left-to-right, 80ms per word
- All sections: elements fade and rise on scroll (start 20px below, opacity 0)
- Service cards: stagger entrance 100ms apart
- Background: slow radial gradient shift over 8–12 seconds, continuous
- Hover states: 0ms delay, 150ms transition, subtle (border brightens, 4px lift)
- `prefers-reduced-motion`: respected everywhere — no exceptions
