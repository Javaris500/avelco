# Avel Agent System — Concepts

> Internal reference. Not for clients. Captures the agent roster, standards model, design library, knowledge bank, and templates that extend Agent Dispatch into Avel's house style.

---

## 1. The Agents — Named

Three teams under one Sprint LEAD. Twenty agents total. Names are concept-words, not literal labels.

### Sprint LEAD

| Codename | Name |
|---|---|
| SPRINT LEAD | **Helm** |

Helm sits above the teams. Plans, dispatches, grades, signs off every wave, owns client interface and knowledge bank curation. Renamed from v1's ORCHESTRATOR — same job.

### Team 1 — Frontend (Wave 2)

| Codename | Name | Function |
|---|---|---|
| FRONTEND LEAD | **North** | Coordinates the team, signs off Wave 2 |
| DESIGN | **Atlas** | Tokens, component specs, visual direction |
| COMPONENT | **Forge** | Reusable component library |
| UI | **Pulse** | Routes, features, state, data fetching |
| ACCESSIBILITY | **Echo** | WCAG 2.1 AA audit and remediation |
| PERFORMANCE | **Swift** | Core Web Vitals audit and optimization |

### Team 2 — Backend (Wave 3)

| Codename | Name | Function |
|---|---|---|
| BACKEND LEAD | **Anchor** | Coordinates the team, signs off Wave 3 |
| DATABASE | **Vault** | Schema, migrations, indexing |
| AUTH | **Gate** | Authentication and authorization |
| API | **Relay** | Handlers, routes, services, middleware |
| INTEGRATION | **Bridge** | Third-party service connections |
| DATA | **Core** | Models, repositories, data access layer |
| SERVICES | **Engine** | Workers, background jobs |

### Team 3 — Quality & Deployment (Wave 4)

| Codename | Name | Function |
|---|---|---|
| QUALITY LEAD | **Verdict** | Coordinates, owns ship/no-ship decision |
| QA | **Proof** | E2E test suite — blocks ship on critical failure |
| SECURITY | **Warden** | OWASP Top 10 audit — blocks ship on critical finding |
| DEVOPS | **Launch** | CI/CD pipeline, deployment execution |
| MONITOR | **Beacon** | Error tracking, uptime, dashboards |
| ROLLBACK | **Refuge** | Tested rollback plan with recovery steps |

### Cross-Team Advisors (preserved from v1)

- **LEAD** — merge authority across team branches
- **RED TEAM** — adversarial review, primary input to Warden
- **INFRA** — infrastructure-as-code support to Launch

---

## 2. Standards — Four Layers

Every agent reads four layers of standards before doing any work. Each layer extends the one above. A stricter layer always wins.

### Layer 1 — Universal

File: `standards/universal.md`

Read by every agent on every sprint. Non-negotiable.

Covers: code quality (naming, file structure, documentation), security (secrets, input validation, auth, rate limiting, output encoding), delivery (README, env docs, migrations, monitoring, rollback), communication (within framework, with client), tone.

Hard gates that apply universally:
- No sprint complete without passing QA report from Proof
- No sprint complete without passing Security report from Warden
- No sprint complete without monitoring live (Beacon)
- No sprint complete without tested rollback (Refuge)

### Layer 2 — Team

Files: `standards/team-frontend.md`, `standards/team-backend.md`, `standards/team-quality-deployment.md`

Read by every member of that team.

Frontend covers: design system usage, WCAG 2.1 AA targets, Core Web Vitals targets (LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms), state management rules, component documentation format, Wave 2 activation order.

Backend covers: API design (REST conventions, status codes, response shape), database (UUIDs, timestamptz, snake_case, reversible migrations, indexes on FKs), authentication (argon2id, JWT or session not both, short-lived tokens), authorization (default deny), integration discipline (timeouts, retries, circuit breakers), background jobs (idempotency).

Quality & Deployment covers: testing scope, OWASP Top 10 categories, deployment (blue-green, canary, health checks), monitoring requirements, rollback testing, the four hard gates.

### Layer 3 — Personal

Files: `standards/agents/{name}.md` — one per agent, 20 files

Read by that specific agent.

Each file specifies: identity, what the agent owns, what the agent never does, specific standards, handoff format, block conditions if any.

### Layer 4 — Project Overrides

File: `docs/agent-dispatch/project-overrides.md` in the client repo

Read by every agent on this specific sprint.

For project-specific deviations from Layers 1-3. Every override needs a justification. Project overrides cannot loosen universal security or delivery standards — only adjust naming, framework conventions, stack choices.

### How Agents Load Standards

At activation, every agent reads in this order:
1. `standards/universal.md`
2. `standards/team-{their-team}.md`
3. `standards/agents/{their-name}.md`
4. Their team charter
5. `core/methodology.md` (execution traces)
6. Relevant exemplars from the knowledge bank
7. Relevant patterns from the knowledge bank
8. Their own learning log
9. Project context file (`CLAUDE.md` or equivalent)
10. `docs/agent-dispatch/project-overrides.md`
11. Their sprint-specific task doc

The activation template enforces this order.

---

## 3. Design Library

Repo: `github.com/avelcore/avel-design-system` (to be created)

A separate, versioned repository. Imported into every client project as a baseline. Forge starts every component sprint by extending it.

### What it contains

- **Design tokens** — colors, spacing (4px base scale), typography, radius, shadows, motion
- **Component primitives** — Button, Input, Textarea, Select, Checkbox, Radio, Switch, Card, Modal, Toast, Table, Tabs, Accordion, Avatar, Badge, Tooltip, Skeleton, Empty State, Error State
- **Patterns** — auth flows, dashboard layouts, settings pages, data tables, forms, file upload, search/filter UI
- **Accessibility baseline** — every component meets WCAG 2.1 AA out of the box
- **Performance defaults** — SVG sprites, image wrapper, font preload

### The agent rule

Forge starts every sprint by importing `avel-design-system`. New primitives only if extending an existing primitive cannot meet the requirement. Every extension documented and contributed back after the sprint.

This is how we stop reinventing buttons across 10 client projects. Variation happens at the project level, not at the foundation.

### Pointer file in framework

`standards/design-library.md` — references the repo, describes when to use vs override, sets the agent rule.

---

## 4. Knowledge Bank

Avel agents don't start from zero. The bank captures accumulated judgment. It grows every sprint.

### Structure

```
knowledge/
├── README.md
├── patterns/           ← solutions that worked
├── anti-patterns/      ← what failed
├── decisions/          ← ADRs
├── exemplars/          ← code that embodies Avel style
└── agents/
    └── {name}-log.md   ← per-agent learning log
```

### What goes in

**Patterns** — solved a real problem, likely to recur. "How we handled Stripe webhook idempotency." "Multi-tenant data isolation for SaaS apps."

**Anti-patterns** — failed in a way others could repeat. "Why we stopped using cookie sessions for SaaS dashboards." Documents the lesson so it isn't repeated.

**Decisions (ADRs)** — non-obvious technical choices and the why. "ADR-001: Postgres over MongoDB for the analytics product category."

**Exemplars** — code samples that *embody* Avel style. Agents pattern-match against these more reliably than against rules. Seeds at launch: `api-handler.md`, `react-component.md`, `database-schema.md`.

**Agent logs** — per-agent. Brief entries on decisions made and outcomes seen. One file per agent: `forge-log.md`, `vault-log.md`, etc. Loaded into that agent's context at activation.

### How it grows

After every sprint retrospective, each agent's completion report includes "knowledge bank candidates." Helm reviews candidates against promotion criteria and selects what enters the bank.

Promotion criteria:
- **Patterns** — solved a real problem, likely to recur, generalizable
- **Anti-patterns** — failure mode others could repeat, lesson generalizable
- **Decisions** — affected architecture, reasoning matters
- **Exemplars** — better than what's in the bank, or covers new territory
- **Agent logs** — non-obvious judgment, reusable

### Curation policy

**Curated bank.** Helm reviews every entry before it enters. Quality over volume. Solo founder, single curator, slow growth, high signal. Switch to self-extending (agents propose, Helm promotes) once there's a contractor or scale demands it.

Reject more than you promote in the first 6 months.

---

## 5. Templates

Templates standardize what agents produce. Each template lives in `templates/` and is referenced from the activation prompt.

### Lifecycle templates

- **`sprint-brief.md`** — client intake. Filled by Helm in Phase Zero. Signed by client before Wave 1.
- **`agent-activation.md`** — universal activation template. Helm generates one per agent per sprint.
- **`wave-completion-report.md`** — end-of-wave report from each team LEAD.
- **`sprint-completion-report.md`** — end-of-sprint report. Verdict + Helm. Triggers final billing.

### Client comms

- **`client-status-update.md`** — plain-English email after each wave. No agent names, no execution traces, outcomes only.
- **`change-request.md`** — mid-sprint scope change intake and decision record.

### Knowledge bank entry formats

- **`pattern.md`** — format for entries in `knowledge/patterns/`
- **`anti-pattern.md`** — format for `knowledge/anti-patterns/`
- **`decision-record.md`** — ADR format
- **`exemplar.md`** — code exemplar format
- **`agent-log-entry.md`** — per-agent learning log entry format
- **`knowledge-bank-update.md`** — what gets extracted from the sprint retro and promoted

### Preserved from v1

`dispatch.md`, `agent.md`, `activation.md`, `completion.md`, `status.md`, `retrospective.md`, `sprint-assessment.md`, `sprint-registry.md`, `preflight-checklist.md`, `post-sprint-checklist.md`, `red-team-findings.md`, `project-claude-md.md`, and `sprint-lead-prompt.md` (renamed from `dispatcher-prompt.md`).

---

## 6. How It All Fits Together

```
Phase Zero  → Helm runs client intake (brief, ADR, repo bootstrap, handoff)
Wave 1      → Helm plans the sprint, writes traces, generates docs
Wave 2      → North activates Atlas → Forge → Pulse → Echo → Swift
Wave 3      → Anchor activates Vault → Gate → Relay → Bridge/Core/Engine
Wave 4      → Verdict activates Proof → Warden → Launch → Beacon → Refuge
Ship        → Helm sends client update, triggers final invoice, closes sprint
```

At every activation, every agent loads: universal standards → team standards → personal standards → team charter → methodology → relevant exemplars → relevant patterns → personal log → project context → project overrides → task doc.

At every sprint close, Helm reviews knowledge bank candidates and promotes what's worth keeping. The bank grows. The next sprint's agents inherit it.

The design library lives outside the framework, in its own repo. Forge imports it. The framework references it through `standards/design-library.md`.

Built with intent.
