# Avel System — Concept Brief

For handwritten notes. Concepts captured with brief context.

---

## Business

**What:** Avel LLC. Solo founder Javaris Tavel. Austin TX. Launch June 2026.
**Model:** Productized build firm. Fixed-price sprints — not hourly, not retainer.
**Tagline:** Built with intent.
**Positioning:** No noise. Just product.
**Domain:** avelco.dev
**Email:** javaris@avelco.dev
**Funding:** Bootstrap. Revenue-funded growth. No VC. No grants at launch.

**Sprint tiers (internal only — never on website):**

Pricing stays off the public site. Forces prospects into discovery calls where pricing is quoted to scope.

- **Starter** — ~1 week, focused feature or audit
- **Standard** — ~2 weeks, full feature build
- **Enterprise** — 3-6 weeks, major build or migration

**Billing:** 50% upfront on signed brief. 50% on delivery. Non-negotiable — protects cash flow.

---

## Brand Voice

The voice that runs through every Avel output, internal and external. Distinctive from agency-speak.

- Short sentences — long sentences are a smell
- Outcomes before mechanics — what shipped, not how
- Active voice — "Leonora built the schema" not "the schema was built"
- No agency language — no deliverables, bandwidth, synergy, partner with you
- No filler — cut essentially, basically, going forward
- Confident, not arrogant
- Plain English over jargon

---

## The System — Three Layers

**Layer 1: Agent Dispatch Framework** — sprint execution system (18 agents + 2 supporting skills). The methodology that runs each client engagement.

**Layer 2: Skills Bundle** — how the framework deploys as Claude Skills. The technical artifact that makes the framework real.

**Layer 3: Command Center** — web app at avelco.dev/app. The operating system for Avel-the-business with its own 6 agents.

Internal IP. Never named publicly. To clients: "our proprietary build system."

---

## Sprint Structure — 5 Phases

Every client sprint follows this exact sequence. No skipping phases.

```
Phase 0  — Intake (Helm runs discovery, produces sprint brief)
Wave 1   — Planning (Helm analyzes, writes execution traces)
Wave 2   — Frontend (Zero coordinates team)
Wave 3   — Backend (Atlas coordinates team)
Wave 4   — Quality & Deployment (Verdict coordinates team)
Close    — Helm reviews, grades, delivers
```

Phase 0 catches 80% of sprint risk. Skip it and sprints fail.

---

## Five Hard Gates (Block Ship)

Wave 4 enforces these. Any gate failing blocks the sprint from shipping. No exceptions.

1. **QA — Proof.** Full test suite passes, including E2E against staging.
2. **Security — Warden.** OWASP audit clean, no critical vulnerabilities.
3. **Deployment — Launch.** Production deploy verified, health checks pass.
4. **Monitoring — Beacon.** Live with a tested alert that actually fires.
5. **Rollback — Launch.** Procedure tested in staging, documented, ready.

---

## Grading Rubric

Each agent's work scored at sprint close. Composite score informs framework evolution.

- **Completeness 30%** — did the agent finish what was assigned
- **Correctness 25%** — does it actually work
- **Mission alignment 20%** — does it serve the sprint goal
- **Territory discipline 15%** — did the agent stay in their lane
- **Convention match 10%** — does it follow Avel standards

---

## Full Agent Roster — 24 Total

### Sprint Lead (1)
- **Helm** — Sprint LEAD, runs Phase Zero, dispatches teams, owns sprint close

### Frontend Team (8) — Wave 2
- **Zero** — Frontend LEAD, coordinates team, signs off, owns API contract handoff
- **Fantem** — Component & Design, tokens, design system, reusable components
- **Ghost** — UI, routes, pages, layouts, basic state, basic forms
- **Leon** — Content & Copy, all user-facing text including microcopy
- **Nemi** — Accessibility + Motion + Animation, WCAG audit, transitions, animations
- **Leia** — Performance, Core Web Vitals, bundle optimization, browser compat
- **Axis** — Data Visualization, charts, dashboards, metric displays
- **Strat** — State / Data Layer, global state, server-state caching, data flows

### Backend Team (5) — Wave 3
- **Atlas** — Backend LEAD, coordinates, performance gate, contract review
- **Leonora** — Data, schema, migrations, models, queries, caching, search
- **Gat** — Auth, authentication, authorization, sessions, MFA, multi-tenant
- **Kel** — Services, API handlers, jobs, real-time, file uploads
- **Dunn** — Integration, third-party services, webhooks, retry/circuit breaker

### Quality & Deployment Team (5) — Wave 4
- **Verdict** — Quality LEAD, ship decision, incident response coordination
- **Proof** — QA, testing across all dimensions, ship-blocking gate
- **Warden** — Security, OWASP audit, dependency scan, compliance auditing
- **Launch** — DevOps & Recovery, CI/CD, deploy, rollback, IaC, capacity planning
- **Beacon** — Monitor, errors, uptime, performance, logs, data retention

### Cross-Team Advisors (2)
- **Red Team** — Adversarial review, supports Warden on critical security
- **Lead** — Merge authority for integration branch

### Supporting Skills (2)
- **avel-standards** — Universal rules layer applied across all agents
- **avel-knowledge** — Knowledge bank for patterns, anti-patterns, ADRs

### Command Center Agents (6) — Run Avel-the-business
- **Mira** — Strategic partner (chat) — outreach, content, HR strategy, business thinking
- **Zo** — Research agent (chat) — top-tier research, knowledge retrieval, web search
- **Della** — Operational execution — invoicing, contracts, vendor management, paperwork
- **Uno** — Client operations — CRM, Phase Zero intake, per-client lifecycle
- **Raven** — System watcher — monitors active sprints, surfaces alerts
- **Plye** — Loadout & configuration — manages skill packs, sprint templates, settings

Chat interface: Mira and Zo (toggle). Background: Della, Uno, Raven, Plye.

---

## Four-Layer Standards System

Standards cascade from broad to specific. Higher layer wins conflicts.

1. **Universal** — applies to all agents (avel-standards skill)
2. **Team** — applies within frontend/backend/Q&D teams
3. **Personal** — per-agent rules baked into each SKILL.md
4. **Project** — per-client overrides in .avel/overrides.md

---

## Handoff Protocol — 4 Document Types

Skills can't invoke each other. Documents are the API between agents.

1. **Dispatch** — authorization to start work (LEAD → agent)
2. **Completion Report** — evidence of work done (agent → LEAD)
3. **Flag** — cross-team signal mid-sprint (any agent → Helm)
4. **Rejection** — refusal of a dispatch (agent → sender)

**Three-step handshake:** dispatch issued → accepted or rejected → completed

**Sequential numbering** within a sprint. Letter suffixes for parallel work (005a, 005b).

**Flag severity (response time):**
- **Critical** — blocks current wave (1 hour response)
- **High** — affects another team (4 hour response)
- **Medium** — surfaces for visibility (next wave close)
- **Low** — informational (retrospective)

---

## Git Principles

Disciplined git is the audit trail. Solo founder can't track multiple agents without it.

- **Branch per wave, not per agent.** 4 branches per sprint + integration.
- **Commit format:** `{type}({agent}): {summary}` with Sprint/Wave/Refs metadata
- **Commit author:** always the founder; attribution lives in commit message
- **Wave merges:** `--no-ff` merge commits preserve wave-close moments
- **Sprint close:** merge to main + sprint tag + release tag
- **Tags:** sprint close, release (semver), Phase Zero close
- **.avel/ directory:** committed (except scratch, cache, tmp)

---

## Voice Ownership

Each agent writes with a distinct voice. Outputs feel different per agent. This is what makes the system feel alive instead of monotone.

**Universal voice rules (apply to all agents):**
- Short sentences, outcomes first
- No agency language, no filler
- Active voice, plain English
- No emojis, no exclamation marks unless surprising

**Per-agent voice examples:**

- **Helm** — direct, strategic, calm under load. One-paragraph activation messages.
- **LEADs (Zero, Atlas, Verdict)** — brief, technical, no fluff. Senior engineer voice.
- **Fantem** — engineer-precise. Component docs read like API documentation.
- **Warden** — adversarial. Reports describe attack paths, not just symptoms.
- **Red Team** — tight, factual, no theatrics. Quietly devastating findings.

---

## Command Center

The web app that runs Avel. Sprint Zero builds this. Once live, replaces Notion/spreadsheets/scattered tools.

**Domain:** avelco.dev (single domain — public site + auth-gated app)
- Public routes: marketing, contact form, public case studies
- `/app/*` routes: command center (auth required, only founder access initially)

**Tech stack:**
- **Next.js 15** (App Router) — server components, server actions
- **Postgres via Neon** — managed, branching for environments
- **Drizzle ORM** — typed schemas, matches Avel backend standards
- **Better Auth** — modern, self-hosted, no per-user pricing
- **Vercel** — hosting, integrated CDN
- **Anthropic SDK** — Claude API for agents
- **pgvector** — vector store inside Postgres (no separate service)
- **Inngest** — background jobs and scheduled tasks
- **Resend** — transactional email

**Three databases (all Postgres):**

1. **Business State** — clients, sprints, contracts, invoices, communications. Relational, structured. Mira and Uno query this constantly.
2. **Knowledge Bank** — patterns, anti-patterns, ADRs, exemplars. Vector-indexed for semantic search by all sprint agents.
3. **Research Store** — Zo's research findings, citations, prospect intel. Vector-indexed for retrieval.

**Build sequence (12 weeks):**
- **Weeks 1-2:** Foundation (project scaffolded, deployable)
- **Weeks 3-4:** Mira chat + basic CRM (system becomes usable here)
- **Weeks 5-6:** Public landing + inquiry flow
- **Weeks 7-8:** Zo + Research Store
- **Weeks 9-10:** Knowledge Bank + Phase Zero workflow
- **Weeks 11-12:** Background agents (Della, Raven, Plye)

**Sprint Zero:** Building the command center itself. Avel dogfoods the framework on the first real project.

---

## Inquiry Flow

How leads route from contact form to founder's attention.

```
Visitor → avelco.dev/contact
       ↓
   POST /api/lead
       ↓
   Saves to Business State (leads table)
       ↓
   Email notification to founder via Resend
       ↓
   Uno surfaces lead in CRM dashboard
       ↓
   Mira surfaces in next chat conversation
       ↓
   Discovery call scheduled → Phase Zero
```

---

## Sync Model

The integration between command center and client repos. Clear ownership of what lives where.

**Command center** = source of truth for business state and shared knowledge.
**Client repos** = execution surface for sprint code and artifacts.
**Knowledge Bank** = shared learning that informs all sprints.

**Phase Zero outputs commit to client repos:**
- `.avel/sprint-current.md` — sprint brief
- `.avel/project.md` — project context
- `.avel/overrides.md` — project-specific overrides
- `.avel/decisions/` — ADRs
- `.avel/sprint-current/loadout.md` — loadout manifest
- `.avel/sprint-current/dispatches/` — per-agent dispatches

---

## Loadout System (Future — Build After Sprint 5)

Agents become modular. Default kit + optional skill packs based on sprint type. Like video game character class + loadout.

```
agent-name/
├── SKILL.md           # core skill, always loaded
├── references/        # baseline reference material
└── packs/             # optional loadouts
    ├── pack-name-1/
    └── pack-name-2/
```

**Sprint type templates** auto-suggest agent loadouts:
- **AI-Feature SaaS** — heavy AI integration packs (likely Avel's niche)
- **Marketing Site** — SEO/analytics packs, lighter backend
- **Internal Tool** — forms-heavy, multi-tenant auth
- **Stripe Integration** — payment-specific packs dominate
- **Legacy Migration** — data migration packs, browser compat

---

## Three Agentic Upgrades (Future — Year 2)

Three capabilities that make the system more agentic over time. Built sequentially.

1. **Persistent agent memory** — vector store per agent. Each activation retrieves relevant past memories.
2. **Inter-agent messaging** — real-time coordination via message bus. Agents talk directly.
3. **Self-adaptation** — agents propose improvements to their own SKILL.md. Founder approves.

Build only after framework is battle-tested with real sprints.

---

## Failure Protocols — 5 Scenarios

Documented before they happen. When something goes wrong, read the protocol, don't improvise.

1. **Sprint abort** — sprint can't complete as scoped. Three paths: reduced scope / reset / pause and refund.
2. **Client ghost** — client stops responding. Day 5 check-in, day 10 formal notice, day 15 suspension.
3. **Gate failure recovery** — Wave 4 blocks ship. Three paths: fix in sprint / descope and ship / abort.
4. **Production incident** — post-deploy failure. P0-P3 severity, response times scale accordingly.
5. **Founder unavailable** — illness or emergency. Trusted contact activates emergency card.

Each protocol covers triggers, immediate actions, communication templates, recovery paths, documentation.

---

## Knowledge Bank — 10 Categories

The accumulated learning across all Avel sprints. Vector-indexed for agent retrieval.

1. **Anti-Vibe-Coding Patterns** — #1 priority. Catches AI-generated code that looks right but isn't.
2. **Frontend Patterns** — by agent (Ghost, Strat, Fantem, etc.)
3. **Backend Patterns** — by agent (Leonora, Gat, Kel, Dunn)
4. **Quality & Deployment Patterns** — Wave 4 patterns
5. **Cross-Cutting Patterns** — apply across teams
6. **Anti-Patterns** — approaches that failed, with postmortems
7. **ADRs** — architectural decision records (Avel-wide + per-project)
8. **Exemplars** — code samples embodying Avel style
9. **Retrospectives** — one per closed sprint
10. **Per-Agent Learning Logs** — each agent's accumulated wisdom

**Seeded with 50+ entries** so agents have something to learn from in Sprint 1. Grows from real sprints.

---

## Anti-Vibe-Coding Patterns (10 Seeded)

The most important seed content. AI-assisted dev produces "vibe code" by default — code that looks right but isn't. These patterns systematically catch it.

- **AVC-001** Schema-handler mismatch — handler returns fields that don't exist in DB
- **AVC-002** Hallucinated library APIs — calling methods that don't exist
- **AVC-003** Made-up environment variables — process.env.X with no .env.example entry
- **AVC-004** Plausible but wrong SQL — queries against nonexistent columns
- **AVC-005** Type assertions hiding bugs — `as User` casts bypassing real checks
- **AVC-006** Off-by-one in pagination — works in tests, breaks in production
- **AVC-007** Promise chains that don't await — silent error drops
- **AVC-008** Mock data leaking to production — placeholder strings shipping live
- **AVC-009** Confident but wrong error handling — swallowed or miscategorized errors
- **AVC-010** Validation bypassed at trust boundaries — webhooks/jobs trusting unsigned input

---

## Integration Standards (Avel-Wide)

Standards locked across all projects. Frontend and Backend implement against the same contracts.

**Error response format:**
```
{ error: { code, message, details?, requestId, timestamp } }
```
Standard error codes (VALIDATION_ERROR, NOT_FOUND, RATE_LIMITED, etc.) consistent across all Avel APIs.

**Pagination format (cursor-based default):**
```
{ items[], nextCursor, hasMore, total? }
```
Cursor-based scales better than offset. Total count is optional (expensive).

**Search results format:**
```
{ results[{item, score, highlights?}], total, facets?, query, took }
```
Handles full-text search, semantic search, and hybrid. Same shape regardless of backend.

**File upload strategy:** Phase Zero ADR per project. Decides direct-to-cloud vs through-backend, storage provider, file constraints, access control, retention.

---

## Skill Template — Mandatory Sections

Every SKILL.md follows this structure. Predictable, maintainable, easier for Claude to pattern-match.

- **Team & Wave** — which team, which wave
- **When To Use / NOT Use** — trigger criteria
- **Avel Context** — how this fits the bigger system
- **Standards Read Order** — which standards apply
- **Territory** — what this agent owns
- **What This Agent Does / Does NOT Do** — explicit scope boundaries
- **Common Failure Modes** — 3-5 known patterns with catch criteria
- **Inputs / Outputs** — what's received, what's produced
- **Definition of Done** — explicit checklist
- **Self-Verification** — how the agent proves their own work
- **Handoff** — dispatch format for next agent
- **Voice** — tone and style for this agent's outputs
- **References / Scripts** — reference materials and tooling

---

## Phase Zero Output

What Helm produces from discovery call to authorized sprint start. Heavy upfront work prevents mid-sprint chaos.

- **Sprint brief** — signed by client, defines scope and price
- **Project context** — `.avel/project.md` with everything the agents need
- **Project overrides** — `.avel/overrides.md` for project-specific deviations
- **ADRs** — architectural decisions in `.avel/decisions/`
- **Compliance scope** — SOC 2, HIPAA, GDPR, CCPA per project requirements
- **Auth pattern ADR** — session vs JWT vs OAuth, token storage, refresh strategy
- **File upload strategy ADR** — when file uploads are in scope
- **Browser support matrix** — target browsers, minimum versions
- **Validation schema strategy** — shared package vs generated vs sync-copy
- **Loadout manifest** — which skill packs activate for each agent

---

## Customer Acquisition

How clients find Avel. Ranked by realistic ROI for a solo founder.

**Channels to use:**
1. **Warm network referrals** — highest conversion, lowest cost, primary channel
2. **Twitter/X build-in-public** — slow compounding, 60-90 day timeline
3. **Specific community engagement** — Indie Hackers, niche Slacks, helpful posts
4. **Productized listings** — defer until case studies exist (Upwork, Fiverr Pro)

**Channels explicitly skipped:**
- Cold email at scale — terrible conversion for high-value work
- Paid ads — burns cash without positioning
- Content marketing — too slow, 12-18 month payoff
- LinkedIn DM outreach — damages reputation
- Conference speaking — slow, expensive, low ROI

---

## Three-Phase Business Plan

How Avel grows from solo bootstrap to diversified revenue.

**Phase 1 (months 1-6):** Find clients
- Pick niche, mine warm network, run first 3-5 paid sprints
- Build first case studies
- File SAM.gov registration in parallel (no active federal pursuit yet)

**Phase 2 (months 6-18):** Scale + open federal door
- 5+ completed sprints, capability statement drafted
- Begin bidding on small federal opportunities ($10K-$50K range)
- Refine pricing based on actual time-to-deliver data

**Phase 3 (year 2+):** Diversify
- Federal contracts as regular channel
- Possible product pivot if framework demand emerges
- First contractor hire if revenue supports

---

## What Avel Is NOT

Clear boundaries that protect the brand and the business model.

- **Not an agency** — different pricing/ops model, agencies bill hourly
- **Not a freelancer** — productized, branded, systematized
- **Not a product company** (yet) — currently pure service
- **Not VC-backed** — bootstrapped by design
- **Not "we build anything"** — needs niche focus

**Work Avel doesn't take:**
- Native mobile (different skill set)
- Blockchain anything
- ML model training as primary deliverable
- Hourly billing
- Long retainers with vague scope

---

## Critical Open Decisions

Highest-impact items still pending. These block other progress.

1. **Niche** — Still pending. Recommended: AI feature additions to existing SaaS.
2. **Sprint Zero start date** — When command center build actually begins
3. **First customer source** — Warm network list not yet written down
4. **Legal templates** — MSA, SOW, NDA need lawyer review before first paying client
5. **Succession plan** — Trusted contact and emergency card not yet identified

---

## Operational Setup

The mundane infrastructure that makes Avel a real business.

**Confirmed:**
- LLC: Avel LLC (Texas)
- Domain: avelco.dev
- Email: javaris@avelco.dev (Google Workspace)
- Logo: bold teal A + AVEL wordmark (primary), Möbius A (icon)

**Pending:**
- SAM.gov registration (for future federal work)
- EIN confirmed
- Business bank account
- Liability insurance (~$500-1000/year)
- QuickBooks or equivalent accounting

---

## Documentation Set — 12 Files

The complete written specification of Avel. Each doc covers one concern.

1. **avel-status.md** — current state and pivots
2. **avel-skills-architecture.md** — Skills bundle structure, voice ownership
3. **avel-backend-skills.md** — backend team deep-dive
4. **avel-frontend-skills.md** — frontend team deep-dive
5. **avel-wave-4-skills.md** — Q&D team deep-dive
6. **avel-git-principles.md** — git workflow
7. **avel-handoff-protocol.md** — agent communication spec
8. **avel-future-architecture.md** — loadouts + agentic upgrades roadmap
9. **avel-command-center.md** — web app and 6 command center agents
10. **avel-failure-protocols.md** — 5 failure mode protocols
11. **avel-knowledge-bank-seed.md** — pre-populated bank content
12. **avel-integration-adrs.md** — Frontend/Backend integration standards

---

## System Grade

Honest assessment across dimensions. Pre-execution baseline.

- **Architecture: A−** — better than most multi-agent frameworks for software dev
- **Deployability: B+** — Skills support most of it, command center fills the gaps
- **Business fit: B** — risk is whether build time competes with finding clients
- **Defensibility: B+** — real moat once built and used
- **Scalability: A−** — designed for growth (loadouts, packs, contractor onboarding)
- **Execution risk: B−** — strong design needs to meet reality

**Overall: A−** — becomes solid A with one completed sprint + command center MVP live.

---

## The Critical Path Forward

What actually matters to ship Avel. Everything else supports these seven steps.

1. **Pick the niche** — unblocks website copy, marketing, customer acquisition
2. **Update avelco.dev** — reflect the chosen niche
3. **Build 1-2 portfolio simulated projects** — Sprint Zero is the command center
4. **Message 20-30 warm network contacts** — primary lead source
5. **Close first paying client** — validates the entire system
6. **Run real sprint, document everything** — produces first case study
7. **Use case study to close next 2-3 clients** — compounding from here
