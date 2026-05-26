# Avel Frontend Skills — Coverage, Gaps, Recommendations

> The frontend is what users see, touch, and judge Avel by. The backend earns trust quietly; the frontend earns it loudly.
> This doc maps modern frontend territory, grades our coverage, identifies gaps, and locks recommendations.
> Internal document. Last updated: May 24, 2026.

---

## TL;DR

Five frontend skills cover a 16-territory frontend system. Coverage is strong on craft (components, accessibility, performance) but has gaps on cross-cutting concerns (SEO, i18n, analytics, browser compat) and one important seam: client-side auth pattern.

**Decision:** Keep the 5-skill roster. Strengthen existing skills, add Phase Zero ADR items for architecture-level decisions, and formalize the auth pattern handoff between Gate (backend) and Pulse (frontend).

**Skills affected:** Pulse (expands to own SEO, error boundaries, analytics instrumentation, client auth implementation), Forge (Atlas merge documented), Swift (browser compatibility added), Echo (unchanged), North (slightly strengthened sign-off).

---

## The Full Frontend Territory in 2026

A modern production frontend has 16 distinct concerns:

1. **Design system & tokens** — colors, type, spacing, motion, foundational layer
2. **Component library** — reusable primitives, documented, accessible by default
3. **Page implementation** — routes, layouts, navigation
4. **State management** — local, lifted, global, server-state
5. **Data fetching** — loading, error, empty states, caching, refetch
6. **Forms & validation** — schemas, client + server validation alignment
7. **Routing & navigation** — route definitions, guards, transitions
8. **Authentication on the client** — token storage, auth context, protected routes
9. **Accessibility (WCAG)** — semantic markup, keyboard nav, screen readers, contrast
10. **Performance (Core Web Vitals)** — LCP, CLS, INP, bundle size
11. **SEO & meta** — meta tags, structured data, sitemap, robots
12. **Internationalization** — locale handling, RTL support, date/number formatting
13. **Error boundaries & resilience** — graceful degradation, retry mechanisms
14. **Browser compatibility** — target browser matrix, polyfills, fallbacks
15. **Analytics & tracking** — event instrumentation, consent management
16. **Asset management** — images, fonts, icons, static files

Every Avel client project touches at least 10 of these. Marketing sites touch nearly all 16.

---

## Current Frontend Roster

After Atlas merged into Forge:

| Skill | Role | Wave |
|---|---|---|
| **North** | Frontend LEAD | 2 |
| **Forge** | Component & Design — tokens + component library | 2 |
| **Pulse** | UI — pages, state, data fetching, forms | 2 |
| **Echo** | Accessibility | 2 |
| **Swift** | Performance | 2 |

---

## Coverage Map

| Territory | Current owner | Grade | Notes |
|---|---|---|---|
| Design system & tokens | Forge | **A** | Strong — Atlas merge works |
| Component library | Forge | **A** | Core competency |
| Page implementation | Pulse | **A** | Clear ownership |
| State management | Pulse | **A−** | Inside Pulse but easy to under-emphasize |
| Data fetching | Pulse | **A−** | Pulse covers it but loading/error/empty are easy to skip |
| Forms & validation | Pulse | **B+** | Owned but the client/server alignment with Relay is a handoff point |
| Routing & navigation | Pulse | **B** | Inside Pulse. Route guards specifically cross to Gate's auth model. |
| Auth on the client | **Seam** | **C** | Pulse "consumes auth state" but who designs the client-side pattern? |
| Accessibility | Echo | **A** | Strong fit |
| Performance | Swift | **A** | Strong fit |
| SEO & meta | **Gap** | **D** | Nobody owns it. Marketing sites need it. |
| Internationalization | **Gap** | **D** | For most projects irrelevant; when needed, no owner. |
| Error boundaries & resilience | Pulse | **C** | Inside Pulse but easy to skip. No explicit DoD coverage. |
| Browser compatibility | Loosely Swift | **C** | Not explicitly owned. Build config affects it. |
| Analytics & tracking | **Gap** | **D** | Beacon monitors backend. Nobody handles frontend event instrumentation. |
| Asset management | Forge / Swift split | **B−** | Forge owns icons, Swift owns image/font optimization. Unclear seam. |

**Four real gaps:** SEO/meta, internationalization, analytics/tracking, browser compatibility. Plus the **client-side auth pattern** seam.

---

## Eight Principles For Frontend Skills

These differ from backend principles. Frontend is about perception, motion, and the human in front of the screen.

### 1. Frontend skills must be optimistic by default

Backend assumes hostile input. Frontend assumes the backend works most of the time. The skill set is about graceful presentation, not paranoid verification. The first line of every frontend SKILL.md sets this tone: build for the happy path first, then handle failures with care.

This is not the same as ignoring failure — it's about default mindset. Pulse renders the page assuming data exists; the empty state is the fallback, not the focus.

### 2. Every frontend handoff includes a perception checkpoint

Backend handoffs verify security and contracts. Frontend handoffs verify *perception* — what the user actually sees and feels.

- Atlas (now Forge) → Forge handoff (internal): tokens applied consistently
- Forge → Pulse handoff: components render correctly in isolation
- Pulse → Echo handoff: every interactive element keyboard-reachable
- Echo → Swift handoff: accessibility fixes don't regress performance
- Swift → North handoff: performance targets met on deployed build

Each handoff includes verification that the perception layer holds.

### 3. Frontend skills produce a contract with the backend

Frontend produces an API contract document that Backend implements. This is the inverse of what most teams do — usually backend defines, frontend consumes. Avel inverts this because Frontend is built first (Wave 2), Backend second (Wave 3). The contract is Frontend's output, Backend's input.

This means:

- Pulse documents every API call it expects, with payload shapes and auth expectations
- Forge documents component behavior that depends on data shape
- North signs off the contract document as part of Wave 2 close

If the contract changes during Wave 3, it's a backend-team-discovered constraint that triggers a change request back to Pulse.

### 4. Self-verification is mostly visual but must be measurable

Frontend self-verification: does it render, does it work, does it look right.

But "looks right" is subjective. Measurable verification includes:
- Lighthouse score on deployed build (Swift)
- WCAG audit report from axe-core + manual (Echo)
- Visual regression diff if applicable (Pulse, with Percy/Chromatic)
- Bundle size delta (Swift)
- Bundle composition (Swift — no duplicate dependencies)

Frontend leans on screenshots and recordings in completion reports more than backend does.

### 5. Frontend skills must consider the user's reality

Slow network. Old phone. Bright sunlight on a tiny screen. Color blindness. Screen reader. RTL language. Frontend skills can never assume a controlled environment.

Every frontend skill's Common Failure Modes section includes user-reality scenarios.

### 6. The order of construction can be more parallel than backend

Backend has strict dependency order. Frontend allows more parallelism:

- Forge can build components while Pulse builds page scaffolding (with placeholder components)
- Echo and Swift can audit in parallel after Pulse completes

North decides what runs in parallel. Default is sequential; parallel is a judgment call when territories don't overlap.

### 7. Frontend skills produce assets for analytics

Backend produces observability hooks (logs, metrics). Frontend produces *analytics events* — user-visible interactions, conversion funnels, feature usage. These are different concerns; Pulse instruments them.

Every frontend skill's Definition of Done includes: identified analytics events emitted at key interaction points (if analytics is in scope for the sprint).

### 8. The design system is the source of truth

The Avel design library is a separate repo. Every frontend sprint pins a version. Forge starts from the library. New primitives are proposed back to the library, not invented in-project.

This deserves emphasis: drift between the design library and individual projects kills consistency over time. Forge enforces the discipline.

---

## Recommendations — How To Close The Gaps

### A. Pulse expands to own four cross-cutting concerns

**Problem:** SEO, error boundaries, analytics instrumentation, and client-side auth implementation all live in Pulse's territory but aren't explicitly called out.

**Solution:** Pulse's Definition of Done makes these explicit. Each has its own checklist section.

**Added to Pulse's Definition of Done:**

```markdown
### SEO & meta (if applicable — marketing sites, public-facing pages)

- [ ] Every page has unique title and description meta tags
- [ ] Open Graph tags present on shareable pages
- [ ] Twitter Card tags present where relevant
- [ ] Structured data (JSON-LD) for content that benefits (articles, products, events)
- [ ] sitemap.xml generated and accessible
- [ ] robots.txt present and correct
- [ ] Canonical URLs set
- [ ] No `noindex` on pages that should be indexed (production check)

### Error boundaries & resilience

- [ ] Top-level error boundary catches uncaught errors
- [ ] Route-level error boundaries for major sections
- [ ] Every async operation has loading state, error state, retry mechanism
- [ ] Network failures show recoverable error UI, not infinite spinners
- [ ] Form submission failures preserve user input

### Analytics & tracking (if in scope)

- [ ] Key user actions instrumented with event tracking
- [ ] Event naming follows the project's taxonomy (documented in ADR)
- [ ] Consent banner implemented if required (GDPR/CCPA)
- [ ] No tracking before consent where required
- [ ] PII excluded from event properties

### Client-side authentication

- [ ] Auth pattern follows the Phase Zero auth ADR
- [ ] Tokens stored per the chosen pattern (httpOnly cookie / localStorage / etc.)
- [ ] Auth context provides typed access to user state
- [ ] Protected routes use route guards that match Gate's middleware
- [ ] Token refresh flow implemented if applicable
- [ ] Logout clears all client-side auth state
```

**Pulse references expand:**

```
pulse/
├── SKILL.md                              # ~150 lines
└── references/
    ├── routing-patterns.md
    ├── state-patterns.md                 # local, lifted, global, server-state
    ├── data-fetching-patterns.md         # TanStack Query, SWR — loading/error/empty
    ├── form-patterns.md                  # react-hook-form + Zod, validation alignment
    ├── seo-patterns.md                   # NEW — meta, OG, structured data
    ├── error-boundary-patterns.md        # NEW — graceful degradation
    ├── analytics-instrumentation.md      # NEW — event taxonomy, consent
    ├── client-auth-patterns.md           # NEW — implements Phase Zero auth ADR
    └── log.md
```

### B. Client-side auth pattern becomes a Phase Zero ADR

**Problem:** The client-side auth pattern is a seam between Gate (backend) and Pulse (frontend). Currently neither owns the pattern decision.

**Solution:** Phase Zero auth ADR is jointly designed by Helm with input from Gate's principles and Pulse's principles. Documented before Wave 2 starts.

**New ADR template item in Phase Zero:**

```markdown
## ADR: Authentication Pattern

- Auth method: [session cookie / JWT / OAuth-first / passkeys]
- Client storage: [httpOnly cookie / localStorage / sessionStorage / memory only]
- Token refresh: [silent refresh / refresh on 401 / no refresh — short sessions]
- Auth context shape: [typed user object — define fields]
- Protected route pattern: [HOC / wrapper component / middleware / route config]
- Logout behavior: [clear cookie / clear storage / revoke server-side / all of the above]
- CSRF protection: [SameSite cookie / CSRF token / not needed because JWT]
```

Pulse's `client-auth-patterns.md` reference is filled in from this ADR. Gate's `auth-method-decisions.md` ADR aligns. Single source of truth.

**Why not a new skill?** Auth is one architecture decision, not an ongoing role. The decision lives in Phase Zero; implementation is split between Gate and Pulse following the ADR.

### C. SEO becomes a Pulse responsibility, gated by project type

**Problem:** Not every project needs SEO. Marketing sites, blogs, product pages: yes. Internal tools, admin dashboards: no. Without scoping, either Pulse spends effort where it doesn't matter or skips it where it does.

**Solution:** Phase Zero classifies the project. If SEO matters, Pulse owns it explicitly. If not, the SEO Definition of Done items are marked N/A in the sprint plan.

**Added to Phase Zero intake:**

```markdown
## SEO scope

- [ ] Public-facing pages exist
- [ ] Search visibility matters for business
- [ ] Social sharing matters

If any checked: Pulse owns SEO per `seo-patterns.md`. If none checked: SEO marked N/A for this sprint.
```

### D. Internationalization handled as an explicit override

**Problem:** Most Avel projects are single-language. When i18n matters, it changes everything — component design, layout direction, date/number formatting, translation pipeline.

**Solution:** Phase Zero classifies i18n scope. If i18n is in scope, scope expands significantly and the sprint may bump tier.

**Added to Phase Zero intake:**

```markdown
## Internationalization

- [ ] Multiple locales required at launch
- [ ] RTL languages required (Arabic, Hebrew, etc.)
- [ ] Locale-aware date/number/currency formatting required

If any checked: i18n is in scope. Pulse loads `references/i18n-patterns.md`. Forge components are audited for RTL compatibility. Sprint tier may bump.

If none checked: project is single-locale English. i18n marked N/A.
```

`references/i18n-patterns.md` lives in Pulse — covers locale routing, translation library choice (next-intl, react-i18next), RTL layout, locale switching UX.

**Why not a new skill?** i18n is project-scoped. Most projects don't need it. A skill that triggers only when needed is just a reference file with extra ceremony.

### E. Swift expands to own browser compatibility

**Problem:** Browser compatibility loosely sits with Swift (build config) but isn't explicit.

**Solution:** Swift owns browser compatibility verification at Wave 2 close.

**Added to Swift's Definition of Done:**

```markdown
- [ ] Target browser matrix documented in project ADR
- [ ] Build tested against target browsers (manual or BrowserStack)
- [ ] No console errors in target browsers
- [ ] Polyfills included only for documented browser support gaps
- [ ] Bundle does not include polyfills for browsers outside target matrix
```

**Phase Zero adds a browser matrix decision:**

```markdown
## ADR: Browser Support Matrix

- Browsers supported: [list — usually evergreen Chrome/Firefox/Safari/Edge]
- Minimum versions: [Last 2 versions / specific dates]
- Mobile support: [iOS Safari last 2 versions / Android Chrome / both]
- Internet Explorer: [no / IE11 — adds significant scope]
```

### F. Forge gets clearer asset territory

**Problem:** Forge owns icons; Swift owns image and font optimization. The seam is unclear when icons are SVG sprites or icon fonts.

**Solution:** Explicit split documented.

**Forge owns:**
- Icon system (chosen library or custom set)
- Component-level images (illustrations baked into components)
- Brand assets (logo, brand marks)

**Swift owns:**
- Page-level image optimization (responsive images, lazy loading)
- Font loading strategy (preload, font-display, subsetting)
- Bundle-level asset analysis

Forge's `references/icon-system.md` documents the choice (Lucide default, or alternative). Swift's `references/asset-optimization.md` documents the page-level pipeline.

### G. Forms & validation contract with Backend

**Problem:** Pulse implements client-side validation. Relay implements server-side validation. If they drift, bugs ensue.

**Solution:** Validation schemas are shared, not duplicated. The schema is defined once.

**Three options documented in Phase Zero:**

1. **Shared package** — for monorepos, validation schemas live in a `packages/schemas` directory imported by both.
2. **Generated from spec** — schemas generated from OpenAPI spec; both client and server use the generated code.
3. **Copied with marker** — when truly necessary, schema is copied with `// SYNC: shared with src/api/validation/user.ts` comment.

Phase Zero chooses one. Pulse's `form-patterns.md` and Relay's `validation-patterns.md` both reference the same choice.

### H. North's sign-off includes contract review

**Problem:** North coordinates the team but the API contract handoff to Backend is critical and easy to under-verify.

**Solution:** North's Definition of Done explicitly includes API contract review.

**Added to North's Definition of Done:**

```markdown
- [ ] API contract document complete (every endpoint, payload shape, auth expectation)
- [ ] Contract reviewed against sprint plan — every Frontend need maps to a Backend endpoint
- [ ] Validation schema strategy documented (per Phase Zero ADR)
- [ ] Auth pattern document complete (per Phase Zero auth ADR)
- [ ] Component library inventory complete
- [ ] WCAG 2.1 AA report: PASS or PASS WITH DOCUMENTED EXCEPTIONS
- [ ] Core Web Vitals report: targets met or documented exceptions
- [ ] Browser compatibility verified on target matrix
- [ ] SEO checklist complete (or N/A documented)
- [ ] Analytics instrumentation in place (or N/A documented)
```

---

## Two Frontend Verification Scripts Worth Adding

Frontend benefits less from scripts than backend (more visual verification), but two are worth it.

### `swift/scripts/run-lighthouse.py`

**Input:** deployed staging URL, optional throttling config
**Output:** Lighthouse scores (Performance, Accessibility, Best Practices, SEO) with Core Web Vitals breakdown

**Why:** Lighthouse runs are mechanical and the output is structured. A script ensures every Wave 2 close has a Lighthouse report attached to Swift's completion document.

### `echo/scripts/run-axe.py`

**Input:** deployed staging URL or local build URL
**Output:** axe-core accessibility audit results with violation list, severity, and remediation hints

**Why:** axe-core catches ~40% of accessibility issues automatically. A script ensures Echo runs it on every sprint and the results are recorded.

Both scripts produce JSON output that gets attached to completion reports.

---

## Updated Frontend Skills — Summary

| Skill | Changes |
|---|---|
| **North** | Definition of Done expands to include API contract review, validation strategy verification, auth pattern verification |
| **Forge** | Asset ownership clarified (icons + brand). Atlas merge documented in references. |
| **Pulse** | Expands to own SEO, error boundaries, analytics instrumentation, client-side auth. References split: routing, state, data-fetching, forms, seo, error-boundaries, analytics, client-auth, i18n (when applicable) |
| **Echo** | Unchanged. Adds `run-axe.py` script. |
| **Swift** | Adds browser compatibility ownership. Asset territory clarified. Adds `run-lighthouse.py` script. |

Plus:

- **Phase Zero** adds three new ADRs: Authentication Pattern, Browser Support Matrix, Validation Schema Strategy
- **Phase Zero intake** adds SEO scope and i18n scope decisions
- **avel-standards** adds `references/frontend-dod-template.md` as shared baseline

---

## File Count Impact

Before this restructure: ~5 SKILL.md files + ~5 reference files + 0 scripts = 10 files for frontend.

After: 5 SKILL.md files + 18 reference files + 2 scripts = 25 files for frontend.

Tradeoff: more reference files, but each is focused. Progressive disclosure means Claude loads only the ones relevant to current work. SKILL.md bodies stay under 150 lines each.

---

## Decisions Locked

| Decision | Choice |
|---|---|
| Frontend roster size | 5 skills — keep, don't add |
| Client-side auth pattern | Phase Zero ADR, implementation split between Gate and Pulse |
| SEO ownership | Pulse, gated by Phase Zero scope decision |
| i18n ownership | Pulse, with separate reference loaded only when in scope |
| Browser compatibility | Swift, with Phase Zero browser matrix ADR |
| Asset split | Forge owns icons + brand; Swift owns page assets + fonts |
| Validation schema strategy | Phase Zero ADR — shared package, generated, or sync-comment copy |
| Error boundaries | Pulse, with explicit Definition of Done items |
| Analytics instrumentation | Pulse, gated by Phase Zero scope decision |
| North sign-off scope | Expands to include contract review |
| Frontend-specific DoD template | In `avel-standards/references/` |
| Verification scripts | 2 — `run-lighthouse.py`, `run-axe.py` |

---

## What This Doesn't Cover

Explicitly out of scope for frontend skills:

- **Native mobile development** (iOS/Android) — separate engagement, separate skill set
- **Desktop apps** (Electron, Tauri) — separate engagement
- **Real-time UI patterns** (WebRTC, complex WebSocket) — project overrides when relevant
- **3D/canvas/WebGL** — project overrides when relevant; not standard Avel sprint scope
- **Advanced animations** (Framer Motion choreography, GSAP) — covered as optional polish, not default
- **Email templates** — separate concern; if a sprint includes transactional emails, Pulse owns the templates with an explicit override
- **PWA (Progressive Web App) features** — service workers, offline support, push notifications — project overrides

These are deliberate boundaries. Avel ships excellent standard web frontends; specialty work is opt-in scope.

---

## The Honest Read

The frontend skill set is in better shape than backend. Most gaps are about *clarifying ownership* rather than *missing capability*. Pulse carries a lot, but the work is naturally cohesive — pages, state, forms, SEO, error handling, analytics all touch each other in real implementation.

Two risks to watch:

1. **Pulse becomes a kitchen sink.** Mitigation: aggressive reference splitting + Definition of Done sections gated by scope (SEO/i18n/analytics are conditional, not always required).

2. **The auth pattern seam.** Mitigation: Phase Zero ADR forces an explicit decision before Wave 2 starts. Pulse and Gate both reference the same source.

This frontend skill structure is what Avel ships with.
