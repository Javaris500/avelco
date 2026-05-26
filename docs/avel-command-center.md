# Avel Command Center — Specification

> The web application that runs Avel. Lives at `avelco.dev` with public routes for the world and `/app/*` routes for internal operations.
> Six agents run the command center. Two communicate via chat (Mira and Zo). Four work behind the scenes (Della, Uno, Raven, Plye).
> This is the build spec. Sprint Zero produces this. Avel ships its own command center before shipping client work.
> Internal document. Last updated: May 26, 2026.

---

## TL;DR

**What gets built:** A Next.js web application at `avelco.dev` that serves both Avel's public site AND the command center (behind auth). Six AI agents power the command center. Three Postgres databases (Business State, Knowledge Bank, Research Store) hold all context.

**Why this matters:** This is Avel's operating system. Without it, you're running a multi-agent dev firm on Notion and email. With it, you have an integrated platform that handles client intake, sprint orchestration, knowledge management, business operations, and the two chat agents you talk to daily.

**Timeline:** ~12 weeks of focused build. Phase 1 usable at week 4 (basic CRM + Mira chat). Full system live by week 12.

**Sprint Zero:** Building the command center IS Sprint Zero. You dogfood the framework on yourself. The command center becomes Avel's first portfolio piece — built for itself, then sold to clients afterward.

---

## Architecture Overview

### Single domain, two surfaces

```
avelco.dev/                       → Public landing page
avelco.dev/contact                → Inquiry form (writes to Business State)
avelco.dev/case-studies/*         → Public case studies
avelco.dev/api/*                  → Backend endpoints (public + private)

avelco.dev/app                    → Command center home (auth required)
avelco.dev/app/chat               → Mira/Zo chat interface
avelco.dev/app/clients            → Client CRM (Uno)
avelco.dev/app/sprints            → Sprint dashboard (Raven)
avelco.dev/app/loadouts           → Loadout management (Plye)
avelco.dev/app/research           → Research history (Zo)
avelco.dev/app/finance            → Invoicing, contracts, expenses (Della)
avelco.dev/app/settings           → Configuration
```

Public site sees marketing routes. Anyone hitting `/app/*` without auth gets bounced. From the visitor's perspective, `avelco.dev` is Avel's website. From the founder's perspective, `avelco.dev/app` is Avel's operating system.

### Single Next.js application

One codebase, one deployment, one database connection pool. Public routes are server-rendered with aggressive caching; command center routes are dynamic.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15+ (App Router) | Server components, server actions, Claude Code support |
| Database | Postgres via Neon | Managed, generous free tier, branching for staging |
| ORM | Prisma | Mature, type-safe queries, generated client, great migration story |
| Vector store | Postgres + pgvector | Same database, no separate service to manage |
| Auth | Clerk | Free tier covers Avel for years, drop-in Next.js integration |
| UI | Tailwind + shadcn/ui | Fast, customizable, matches design library principles |
| Hosting | Vercel | Solo-friendly, integrated CDN, fast deploys |
| AI | Anthropic SDK (Claude) | Direct API integration for agent runtime |
| Background jobs | Postgres-based queue | No new infra; Inngest is premature for a solo founder. Revisit when load justifies it. |
| Transactional email | Resend | Simple, reliable, good deliverability |
| File storage | Vercel Blob or Cloudflare R2 | For attachments, documents, exports |
| Monitoring | Sentry | Error tracking from day one |
| Analytics | Vercel Analytics | Native to Vercel, lightweight, no extra service to operate |

---

## Database Architecture — Three Stores

All three stores live in Postgres. Different schemas, different access patterns, unified hosting.

### Store 1: Business State

The source of truth for Avel's business operations. Relational, structured, queryable.

**Tables:**

- `clients` — companies and individuals Avel works with (active, past, prospects, leads)
- `contacts` — individual people at client orgs (multiple per client)
- `sprints` — engagements (active, completed, planned, aborted)
- `sprint_briefs` — signed scope documents per sprint
- `contracts` — MSAs, SOWs, NDAs and their status
- `invoices` — billing records
- `payments` — payment tracking
- `communications` — email and call logs (timestamped)
- `tasks` — operational tasks (not sprint-level)
- `leads` — inbound inquiries before they become clients
- `deadlines` — anything time-sensitive (filings, renewals, follow-ups)
- `metrics_snapshots` — historical metrics for reporting (weekly cash position, pipeline value, etc.)

**Schema design principles:**

- snake_case columns (per Avel standards)
- UUID primary keys
- `created_at`, `updated_at`, `deleted_at` on every table
- Soft delete default
- Foreign keys indexed

**Access:**

- Mira reads heavily for chat queries about business state
- Uno writes client and sprint records
- Della writes invoices, payments, contracts
- Raven reads sprint state for monitoring
- Public site reads aggregate stats (sprint count, etc.) via cached queries

### Store 2: Knowledge Bank

Accumulated learnings across all Avel sprints. Patterns, anti-patterns, decisions, exemplars. Vector-indexed for semantic search.

**Tables:**

- `patterns` — solutions that worked
- `anti_patterns` — approaches that failed
- `decisions` — ADRs
- `exemplars` — code samples embodying Avel style
- `retrospectives` — per-sprint retros
- `agent_logs` — per-agent learning logs (Helm's log, Pulse's log, etc.)
- `embeddings` — vector representations of all the above for semantic search

**Schema design:**

- Each entry has structured fields (title, summary, content, severity, applicability) and vector embedding
- Tagged by agent, sprint, framework version, category
- Status field: draft, canonical, deprecated

**Access:**

- All sprint agents read heavily during activations
- Helm writes after sprint close (curated additions from retro)
- Plye reads to determine pack availability
- Zo reads as part of cross-source research
- Eventually: self-adaptation lets agents propose entries (held for future)

### Store 3: Research Store

What Zo has researched. Web sources, technical references, prospect intelligence, industry data. Vector-indexed.

**Tables:**

- `research_entries` — what was researched, when, key findings
- `sources` — URLs, articles, documents with metadata
- `citations` — link between findings and sources
- `prospect_intel` — gathered intelligence on specific companies
- `technical_references` — cached technical documentation findings
- `embeddings` — vector representations for retrieval

**Schema design:**

- Currency tags — when retrieved, how often source changes, freshness score
- Source attribution always present
- Confidence indicators (single source vs. corroborated)

**Access:**

- Zo writes and reads
- Mira reads via Zo (asks Zo to find something, Zo retrieves)
- Sprint agents don't access directly — they go through Zo if needed

---

## The Six Command Center Agents

### Chat Agents (you talk to these)

#### Mira — Strategic Partner

**Role:** Outreach, content, HR strategy, business thinking, communication, strategic decisions.

**Capabilities:**
- Drafts outreach messages in your voice
- Maintains warm network tracking ("you haven't talked to X in 60 days")
- Suggests follow-up timing and content
- Drafts content for Twitter/LinkedIn/case studies
- Helps think through strategic decisions (pricing, hiring, contracts)
- Drafts client communications when needed
- Reads Business State to know what's happening
- Reads Knowledge Bank for strategic patterns
- Asks Zo to research when she needs information

**Interface:** Chat window with toggle to Zo. Persistent conversation history.

**Voice:** Strategic, direct, considers tradeoffs. Mira pushes back when needed. Mira is a thinking partner, not an executor.

#### Zo — Research Agent

**Role:** Top-tier research. Searches across web, knowledge bank, client docs, technical references. Synthesizes information. Cites sources.

**Capabilities:**
- Web search with multi-source comparison
- Prospect research before outreach (company background, recent news, key people)
- Technical research (best practices, library comparisons, security advisories)
- Pattern research (has anyone solved this kind of problem before)
- Saves findings to Research Store automatically
- Builds personal research history
- Knows when to flag conflicting sources
- Knows when to say "I don't know" or "sources disagree"
- Provides citations for every research-derived answer

**Interface:** Chat window with toggle to Mira. Persistent conversation history per agent. Research history viewable separately.

**Voice:** Analytical, evidence-based, careful with claims. Zo distinguishes opinion from fact. Zo doesn't editorialize.

### Background Agents (you don't chat with these — they appear in dashboards and notifications)

#### Della — Operational Execution

**Role:** Invoicing, contracts, vendor management, paperwork, tracking.

**Capabilities:**
- Generates invoices on sprint milestones (50% upfront, 50% on delivery)
- Tracks payment status across all clients
- Prepares contract documents (MSA, SOW, NDA from templates)
- Manages vendor subscriptions ("you're paying for X, do you still use it?")
- Compliance reminders and deadline tracking (taxes, filings, renewals)
- Contractor payment processing (when applicable)
- Metrics calculation and weekly reporting
- Expense tracking and categorization

**Interface:** Dashboards under `/app/finance`. Sends weekly summary emails to Mira (who can surface to you in chat).

#### Uno — Client Operations

**Role:** CRM, Phase Zero intake, individual client lifecycle.

**Capabilities:**
- Receives inbound leads from the contact form
- Creates client and lead records in Business State
- Manages Phase Zero workflow (intake call notes, sprint brief generation)
- Tracks individual client lifecycle (lead → discovery → signed brief → active sprint → completion)
- Commits Phase Zero outputs to client repos (sprint brief, project context, ADRs)
- Triggers Helm activation when a sprint is ready to start
- Maintains per-client communication history

**Interface:** Dashboards under `/app/clients`. Notification emails when new leads arrive.

#### Raven — System Watcher

**Role:** Monitors all active sprints. Surfaces alerts. Tracks agent activity across all teams.

**Capabilities:**
- Watches dispatch documents in client repos for status changes
- Detects stalled waves (no commits in N days)
- Surfaces flags raised mid-sprint
- Tracks time budgets vs actuals across sprints
- Compares current sprint patterns to past sprints (alerts on anomalies)
- Generates daily standup summary across all active engagements

**Interface:** Dashboards under `/app/sprints`. Notifications when blocking issues surface.

#### Plye — Loadout & Configuration

**Role:** Manages agent packs, sprint type templates, system settings.

**Capabilities:**
- Maintains the catalog of available skill packs per agent
- Applies sprint type templates (AI-feature SaaS, marketing site, internal tool, etc.)
- Generates loadout manifests for each sprint
- Commits loadout configuration to client repos
- Tracks which packs were used in which sprints (informs pack evolution)
- Manages agent system settings (default versions, framework version, etc.)

**Interface:** Configuration screens under `/app/loadouts`. Mostly run during Phase Zero handoff.

---

## How Agents Compose

```
Inbound Inquiry Flow:
  Visitor fills contact form
    ↓
  POST /api/lead writes to Business State (leads table)
    ↓
  Resend email notification sent to you
    ↓
  Uno creates lead record, surfaces to you in dashboard
    ↓
  Mira (when you next chat) surfaces lead as priority
    ↓
  You respond (manually or with Mira's draft)
    ↓
  If qualified → Phase Zero discovery call scheduled


Phase Zero Flow:
  Discovery call happens
    ↓
  You input notes (or Uno transcribes if integrated with calendar/recording)
    ↓
  Uno generates sprint brief draft from notes
    ↓
  Mira reviews for strategic fit, suggests edits
    ↓
  You finalize brief
    ↓
  Della prepares invoice (50% upfront)
    ↓
  Client signs brief, pays deposit
    ↓
  Uno commits brief, ADRs, project context to client repo
  Plye commits loadout manifest based on sprint type
    ↓
  Helm becomes activatable
    ↓
  You activate Helm (Wave 1 begins)


Sprint Execution Flow:
  Helm dispatches Wave 2 (Frontend)
    ↓
  Zero coordinates frontend team
    ↓
  Agents commit work to client repo
    ↓
  Raven detects commits, updates dashboard
    ↓
  Knowledge Bank queried by agents for relevant patterns
    ↓
  Wave 2 completes, Zero signs off
    ↓
  Helm dispatches Wave 3, etc.


Sprint Close Flow:
  Verdict signs off
    ↓
  Helm produces retrospective
    ↓
  Knowledge Bank updated from retro (curated by you)
    ↓
  Della generates final invoice (50%)
    ↓
  Mira drafts case study for review
    ↓
  Uno updates client record (completed sprint, follow-up scheduled)
```

---

## Inquiry Routing — Specific Detail

You wanted inquiries to route to the back-end with email notification. Here's how it works concretely.

### The contact form

Public route at `avelco.dev/contact`. Fields:

- Name
- Company
- Email
- Phone (optional)
- Project type (radio): AI feature add / Internal tool / SaaS MVP / Other
- Timeline (radio): ASAP / Within 1 month / 1-3 months / Just exploring
- Budget range (radio): Starter / Standard / Enterprise / Not sure
- What you're trying to build (textarea)
- How did you hear about us (dropdown)

### Submission flow

```
1. Visitor submits form
   ↓
2. POST /api/lead
   ↓
3. Backend:
   a. Validates input (Zod schema)
   b. Spam check (honeypot field, optional rate limit)
   c. Creates record in `leads` table (Business State)
   d. Sends email to you via Resend:
      Subject: "New lead: [Company] — [Project type] [Timeline]"
      Body: All form fields + link to /app/clients/leads/[id]
   e. Returns success to form
   ↓
4. Form shows confirmation:
   "Thanks — we'll be in touch within 24 hours."
   ↓
5. Lead appears in Uno's dashboard under /app/clients/leads
   ↓
6. Mira surfaces lead next time you chat with her
```

### Lead status workflow

Lead → Qualified → Discovery Scheduled → Discovery Completed → Brief Sent → Brief Signed → Active Sprint

Mira and Uno track this state. Mira nudges you on stale leads.

---

## Sync Model — Command Center to Client Repos

The command center is the source of truth for Avel's business state and Avel's knowledge. The client repos are the execution surface.

### What goes from command center to client repos

**Phase Zero outputs:**
- Sprint brief → committed to client repo at `.avel/sprint-current.md`
- Project context → committed to `.avel/project.md`
- Project overrides → committed to `.avel/overrides.md`
- ADRs → committed to `.avel/decisions/`
- Loadout manifest → committed to `.avel/sprint-current/loadout.md`

**Sprint dispatches:**
- Each dispatch document → committed to `.avel/sprint-current/dispatches/`

### What goes from client repos to command center

**Sprint state:**
- Commit history scraped → updates Sprint State in Business State database
- Completion reports parsed → metrics extracted
- Flags raised → surfaced to Raven

**Knowledge contributions:**
- Sprint retrospectives → reviewed → entries added to Knowledge Bank

### Technical implementation

Uses GitHub API (assuming clients keep code on GitHub). Service account or PAT authorized per client. Command center commits programmatically.

Alternative for self-hosted: webhooks back from client's git hosting on push events.

For simplicity at MVP: command center only writes to client repos; sprint state is pulled by polling commits or via webhooks.

---

## Auth Architecture

### Public routes (no auth)

- `/` (landing page)
- `/contact` (inquiry form)
- `/case-studies/*` (public case studies, eventually)
- `/blog/*` (if added later)
- `/api/lead` (public POST endpoint, rate-limited)
- All public assets

### Private routes (auth required)

- `/app/*` — entire command center
- All `/api/*` endpoints except `/api/lead`

### Auth implementation

Clerk, configured with:

- Email + password (primary)
- Optional: passkeys / social providers added later if useful
- Single-tenant (only you, initially) — Clerk handles user/session management
- Session cookies (httpOnly, secure) managed by Clerk middleware
- Default Clerk session lifetime; refresh handled by SDK

When contractors join later, Clerk's organizations feature handles team membership without a re-platforming.

---

## Build Sequence — 12 Weeks

### Phase 1: Foundation (weeks 1-2)

**Goal:** Project scaffolded, deployable, basic schema in place.

- Next.js 15 project created
- Vercel deployment connected
- Domain configured (`avelco.dev`)
- Neon Postgres provisioned with dev/staging/prod branches
- Prisma ORM set up (schema, migrations, generated client)
- Clerk configured (email + password, session cookies)
- Basic landing page (placeholder, just to verify routing works)
- Login page at `/app/login`
- Protected route example at `/app/dashboard`
- CI/CD pipeline (lint, test, build, deploy on push)

**Deliverable:** Deployed empty shell at `avelco.dev`. You can log in. Public routes accessible.

### Phase 2: Mira Chat + Basic CRM (weeks 3-4)

**Goal:** Mira is real. You can chat with her and manage clients.

- Business State schema: clients, contacts, leads, communications, tasks
- CRUD UI for clients and contacts under `/app/clients`
- Lead inbox under `/app/clients/leads`
- Mira chat interface under `/app/chat` (Mira tab only, Zo placeholder)
- Mira backend: Anthropic API integration with Claude
- Mira's tools: query Business State, draft outreach messages, suggest follow-ups
- Mira's system prompt and context loading
- Conversation history persistence
- Email notification via Resend on new leads (testing infrastructure with internal trigger first)

**Deliverable:** Mira is usable. You can manage your CRM and have real conversations about your business.

### Phase 3: Public Landing + Inquiry Flow (weeks 5-6)

**Goal:** The public site is live. Inquiries flow to the backend.

- Landing page sections built per branding (Hero, Problem, Services, How It Works, CTA, Footer)
- Contact form at `/contact`
- `POST /api/lead` endpoint
- Rate limiting on public API
- Email notification on lead submission
- Spam protection (honeypot, optional reCAPTCHA)
- Lead automatically appears in Uno's dashboard (Uno is just the workflow here, no AI yet)

**Deliverable:** Public site is live. Inquiries route correctly. You get email notifications. Leads appear in command center.

### Phase 4: Zo + Research Store (weeks 7-8)

**Goal:** Zo is real. Research is searchable.

- Research Store schema with pgvector
- Embedding pipeline (using OpenAI's text-embedding-3 or similar)
- Zo chat interface (Zo tab in the same chat UI as Mira)
- Zo backend: Anthropic API with web search tool integration
- Zo's tools: web search, save findings, retrieve from Research Store
- Research history under `/app/research`
- Zo can answer questions citing sources

**Deliverable:** Zo is usable. You can ask Zo research questions and Zo builds the Research Store over time.

### Phase 5: Knowledge Bank + Uno Workflow (weeks 9-10)

**Goal:** Phase Zero runs through the command center. Sprint setup is automated.

- Knowledge Bank schema with pgvector
- Seed Knowledge Bank with existing exemplars and patterns from earlier docs
- Uno workflow for Phase Zero intake
- Sprint brief generation (from intake notes)
- Client repo sync via GitHub API (commit Phase Zero outputs)
- Plye configuration UI (manage loadouts, sprint type templates)
- Sprint creation flow under `/app/sprints`

**Deliverable:** A new client can go from inquiry → discovery call → signed brief → activated sprint, all through the command center.

### Phase 6: Background Agents — Della + Raven (weeks 11-12)

**Goal:** Operational and monitoring layers complete. System is feature-complete.

- Della's workflows: invoice generation, payment tracking, contract preparation
- Della integration with Stripe (or similar) for actual invoice delivery
- Della's dashboard under `/app/finance`
- Raven's workflows: sprint state monitoring via GitHub API polling or webhooks
- Raven's dashboard under `/app/sprints` with active sprint cards
- Anomaly detection for stalled waves
- Weekly summary email from Della (via Mira)
- Postgres-based job queue set up for scheduled and triggered background work

**Deliverable:** Full command center live. Six agents operational. Ready to take on first paying client.

---

## What MVP Looks Like at Week 4

End of week 4, you have:

- A login page
- A CRM that tracks clients, contacts, leads, communications
- A working Mira chat that helps you with outreach and business questions
- The ability to manually enter leads and have Mira help you manage them

This is enough to start your **first warm network outreach**. You can run that outreach using Mira while the rest of the system gets built. Don't wait for the full 12 weeks to start finding clients — start using what works at week 4.

---

## Integration Points

### Anthropic API

Used by Mira, Zo (later all command center agents if needed). System prompts loaded from skill files. Tool calling for database queries and external actions.

### GitHub API

Used for client repo sync. Service account with appropriate scopes. Personal Access Token (later: GitHub App for better security).

### Resend

Transactional email. Lead notifications, weekly summaries from Della via Mira, invoice delivery.

### Stripe (or similar)

Invoice delivery and payment tracking. Della integrates here.

### Background job queue (Postgres-based)

Background jobs and scheduled tasks run through a Postgres-backed queue (jobs table + worker process). Raven's polling, Della's recurring tasks, embedding pipeline batches. Inngest is **explicitly deferred** until load justifies introducing a separate service.

### Optional integrations (later)

- Calendar (Google Calendar or Cal.com) for discovery call scheduling
- Slack or Discord for notifications beyond email
- Linear or similar for task management if Avel grows beyond solo
- Notion API if you want bidirectional sync with existing notes

---

## Security Considerations

Single-tenant, single user (initially). Still apply Avel security standards:

- Secrets in environment variables, never in code
- All API endpoints validate input
- Rate limiting on public endpoints
- Auth required on all `/app/*` routes
- HTTPS only (Vercel handles this)
- SQL parameterized via Prisma
- Session cookies httpOnly, secure, sameSite
- API keys for external services rotated quarterly
- Sentry for error tracking (no PII in error reports)
- Database backups via Neon (daily, retained 7 days minimum)

When contractors join: add row-level security or team management. For now: you're the only user, simpler model is fine.

---

## What This Replaces

The command center replaces:

- Notion for client tracking (CRM is built-in)
- Spreadsheets for finance tracking (Della handles)
- Email scattered across inboxes (communications log centralized)
- Manual research collection (Zo's Research Store)
- Ad-hoc agent activation (Uno + Plye automate Phase Zero)
- Calendar reminders for follow-ups (Mira surfaces)
- Manual invoice creation (Della generates)
- Whatever you've been using to track sprints (Raven dashboards)

This is significant infrastructure consolidation. Once it's running, your operational overhead drops dramatically.

---

## What This Doesn't Replace

The command center does NOT replace:

- The sprint execution itself (that's still Claude Code / Cursor / Aider running with the agent skills)
- Your judgment (you still approve every outreach message, every invoice, every commit to a client repo)
- Real client conversations (the command center supports, doesn't replace, the human relationship)
- Manual coding work on the command center itself (you're building this — meta but true)

---

## Future Extensions (held for later)

Not in v1. Planned for later:

- Multi-user support (when you hire contractors)
- Client-facing portal (clients can see their sprint status)
- Mobile app or PWA optimization
- Integration with more tools (Slack, Discord, Calendar)
- Advanced analytics dashboards
- Custom reporting and exports
- Workflow automation builder (more complex than current scripts)
- Self-adaptation upgrade (agents propose improvements to themselves)
- Inter-agent messaging (real-time coordination between sprint agents)
- The command center managing multiple parallel sprints concurrently

These get built when needed. Not before.

---

## Sprint Zero Reframing

This document IS the spec for Sprint Zero. Sprint Zero isn't a personal side project anymore — it's the command center build.

You're the client. Avel is the build firm. You sign a sprint brief with yourself. You run Phase Zero on yourself. You activate Helm (manually, since the command center isn't built yet) and run the sprint to build the command center.

This produces:

- A working command center at `avelco.dev/app`
- The first real case study (built for Avel itself, sanitizable for client viewing)
- Proof that the framework works
- Lessons learned that inform the framework's evolution
- Marketing material (the command center itself becomes a demonstration of what Avel ships)

Sprint Zero target: 12 weeks. Phased delivery so you can start using parts of the system as they ship.

---

## Decisions Locked

| Decision | Choice |
|---|---|
| Domain architecture | Single domain — `avelco.dev` with public routes and `/app/*` for command center |
| Tech stack | Next.js 15 + Postgres (Neon) + Prisma + Clerk + Vercel + Anthropic SDK |
| Database design | Three stores — Business State, Knowledge Bank, Research Store — all in Postgres |
| Vector store | pgvector in same Postgres database |
| Chat interface | Single chat UI with Mira/Zo toggle, persistent history per agent |
| Command center agents | 6 agents — Mira, Zo (chat), Della, Uno, Raven, Plye (background) |
| Sync model | Command center is source of truth; commits to client repos for sprint execution |
| Auth | Clerk, single-tenant initially, expandable to team via Clerk organizations |
| Build sequence | 12 weeks, phased — Foundation → Mira+CRM → Public+Inquiry → Zo+Research → Phase Zero+Knowledge Bank → Background Agents |
| MVP threshold | Week 4 — Mira + CRM usable, start warm outreach with system support |
| Sprint Zero | Building the command center IS Sprint Zero |

---

## Open Questions for Later

These don't block the build but need answers before the relevant phase:

- **Stripe vs Lemon Squeezy vs other for invoicing?** Decide before week 11.
- **GitHub App vs PAT for client repo sync?** Decide before week 9.
- **Embedding model — OpenAI vs open-source?** Decide before week 7.
- **Web search tool for Zo — Anthropic's web_search vs Tavily vs custom?** Decide before week 7.
- **Calendar integration in MVP or v1.1?** Decide before week 6.

---

## The Honest Read

Building the command center IS Avel's first real product. It's also Avel's operating system. The two things are the same thing.

This works because:

1. You dogfood the framework on yourself before any paying client sees it
2. The command center becomes a portfolio piece — Avel built its own internal tool, here's what we shipped
3. You're not building speculative architecture — you're building infrastructure you need
4. The first 12 weeks produce both the system AND a case study AND proof of capability
5. When the first client calls, you have a real product to point to

Risk: 12 weeks of focused building means 12 weeks before the first dollar comes in (unless you can secure a small engagement in parallel using what's built by week 4-6).

Mitigation: Phase Zero work starts in parallel. Use Mira-and-basic-CRM as soon as week 4 to start warm outreach. The first sprint could land while you're still building Phase 5 of the command center.

This is the build. Sprint Zero starts now.
