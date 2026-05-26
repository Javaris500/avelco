# Avel Agent Dispatch — Current Status

> Build state, decisions made, decisions pending, and what's next.
> Internal document. Last updated: May 24, 2026.

---

## TL;DR

We've designed a multi-agent development framework for Avel ("Agent Dispatch" — internal name only). The v1 markdown spec is complete: 159 files defining 20 named agents across 3 teams, 4-layer standards system, knowledge bank, Phase Zero intake, and 5-phase sprint workflow.

**The spec is too heavy as-is.** Next phase is converting it into a deployable Skills bundle + CLI tool that lives globally on the machine and drops a tiny adapter into each client repo.

**Nothing has shipped to a client yet.** Pre-launch state. The framework exists; the business operations and customer pipeline do not.

---

## What's Built

### The v1 Spec — Complete

A working markdown specification of Agent Dispatch. Zipped at `/mnt/user-data/outputs/agent-dispatch.zip` from the last build session. 159 files. ~1.2MB. Contents:

**Core architecture**
- README (the spine)
- Three formal teams: Frontend, Backend, Quality & Deployment
- 20 named agents + 3 cross-team advisors (Infra, Red Team, Lead)
- 5-phase workflow: Phase Zero → Wave 1 → Wave 2 → Wave 3 → Wave 4 → Sprint Close

**The agent roster**

| Team | Members |
|---|---|
| Command | **Helm** (Sprint LEAD) |
| Frontend | **North** (LEAD), Atlas, Forge, Pulse, Echo, Swift |
| Backend | **Anchor** (LEAD), Vault, Gate, Relay, Bridge, Core, Engine |
| Quality & Deployment | **Verdict** (LEAD), Proof, Warden, Launch, Beacon, Refuge |
| Cross-team | Infra (supports Launch), Red Team (supports Warden), Lead (merge authority) |

**Four-layer standards**
- Layer 1: Universal (every agent, every sprint)
- Layer 2: Team (Frontend / Backend / Quality & Deployment)
- Layer 3: Personal (one per agent, 20 files)
- Layer 4: Project overrides (in each client repo)

**Knowledge bank scaffolded**
- Patterns, anti-patterns, decision records, exemplars, agent learning logs, retrospectives
- Three seed exemplars: API handler, React component, database schema
- 20 empty per-agent log files (consistent header structure)
- Curated mode for first 6 months — Helm reviews every entry before canonical

**Phase Zero — client intake**
- 4-step process: discovery call → architecture decision → repo bootstrap → handoff to Wave 1
- Sprint brief template, ADR template, change-request protocol
- Billing gate (50% upfront before Wave 1 begins)

**Templates and runtime**
- 25 templates (sprint brief, activation prompt, wave/sprint reports, knowledge bank entries, etc.)
- Pipeline gates: QA, Security, Deployment, Monitoring, Rollback
- Five-dimension grading rubric: Completeness 30%, Correctness 25%, Mission 20%, Territory 15%, Convention 10%

**Execution methodology**
- Preserved unchanged from original `robertohluna/agent-dispatch` fork (MIT)
- Every chain: Vector → Signal → Hypothesis → Fix site → Verify
- One chain end-to-end before the next. P0 → P1 → P2 → P3 priority.

---

## What's Decided

### Architecture decisions made

- **[CONFIRMED]** Option A — full restructure into three teams (not layered)
- **[CONFIRMED]** ORCHESTRATOR renamed to "Helm" (Sprint LEAD)
- **[CONFIRMED]** Execution-trace methodology preserved untouched
- **[CONFIRMED]** Phase Zero added as new pre-Wave-1 phase
- **[CONFIRMED]** Curated knowledge bank for first 6 months
- **[CONFIRMED]** Four-layer standards model
- **[CONFIRMED]** Six-component knowledge bank (patterns, anti-patterns, ADRs, exemplars, agent logs, retros)

### Brand and positioning

- Public name: **Avel** (Avel LLC, Austin TX, launching June 2026)
- Tagline: "Built with intent."
- Positioning: "No noise. Just product."
- Founder: Javaris Tavel (solo)
- Website: avelco.dev (six sections — Hero, Problem, Services, How It Works, CTA, Footer)

### Brand rules

- Agent Dispatch is **never** named publicly
- Clients see "our proprietary build system" only
- Agent names never appear in client communication
- Avoid agency language: deliverables, bandwidth, synergy, agile, sprint (publicly)
- Short sentences. Outcomes first.

### Pricing tiers

| Tier | Price | Activates |
|---|---|---|
| Starter | $7,500 | Helm + min 4 agents + Verdict + Proof |
| Standard | $15,000 | Helm + relevant team LEADs + 8-10 agents + full Q&D except Performance |
| Enterprise | $25K–$50K | Helm + all three LEADs + all 20 agents |

---

## Honest Grade On What We Have

### Strengths

- **Architecture is real.** Twenty agents with one job each. Three teams with hard handoffs. Five phases with gates. Not vapor.
- **Names carry function.** Helm steers, Vault holds, Verdict decides, Refuge is the way back. You'll remember whose turn it is at 11pm.
- **Standards stack is genuinely good.** Four layers, more-specific overrides more-general, but only with documentation. Most playbooks are aspirational. This has enforcement.
- **Hard gates are non-negotiable.** QA, Security, Monitoring, tested Rollback. Verdict can't sign off without all five.
- **Phase Zero is the smartest addition.** Original framework assumed a codebase already existed — that's the gap most "AI dev firm" plays fall into.

### Weaknesses

- **Too heavy.** 159 markdown files for a solo founder pre-launch is a lot. Risk: tending the framework instead of executing sprints.
- **Curation bottleneck.** You're Helm AND operator AND knowledge bank curator. Three roles, one calendar.
- **Agents aren't real yet.** Markdown that gets pasted into AI tools. No enforcement layer outside discipline.
- **Phase Zero gate is brittle.** "No work without 50% upfront" — founders break their own rules for the first big client.
- **Repo distribution problem.** Can't drop 159 files into every client repo. Need installed-once vs per-project separation.

### Overall grade

- Architecture: **A−**
- Documentation: **A**
- Operational readiness: **C+** (heavy for current scale, missing wrapper around sprints)
- Founder-fit: **B** (matches taste; risk that it matches the imagined Avel, not day-1 Avel)

---

## Gaps Identified — Not Yet Addressed

### Missing protocols

- **Sprint abort protocol** — what happens when a sprint goes truly sideways (mid-sprint architectural discovery, ghosted client, irrecoverable gate failure)
- **Solo founder succession** — written doc for client recovery if Avel is unreachable 5+ days
- **Scope creep with no formal change request** — when client refuses to formalize verbal changes
- **Post-launch retainer** — what happens to clients in week 2+ after delivery

### Missing operations

- **Contract templates** — SOW, engagement agreement, NDA, liability boundaries, data handling
- **Customer pipeline** — avelco.dev is six sections; there's no acquisition engine
- **Capacity math** — tiers set but not pressure-tested against actual founder hours
- **Command center** — Phase Zero assumes Helm has a place to do the work; right now that's "your head + scattered tools"
- **Failure-mode playbooks** for production-down weekends, repeated gate failures, etc.

### Missing technical infrastructure

- **Skills deployment** — agents are markdown, not deployable artifacts
- **CLI tooling** — no taskmaster, no commands, no scripts
- **State management** — no canonical sprint-state tracking
- **Update mechanism** — no way to propagate framework improvements across projects
- **Multi-sprint orchestration** — design assumes one active sprint per repo
- **Knowledge bank versioning** — global bank could leak client-specific lessons

---

## Where We're Going Next

### The Pivot — From Markdown To Deployable System

**Three-part separation we're moving toward:**

**1. Global install (`~/.avel/`)**

Lives once on the founder's machine. Used by every project.

- The Skills bundle (Helm, North, Pulse, etc. as actual Claude Skills)
- Framework reference docs (universal standards, team charters, methodology)
- Knowledge bank (patterns, anti-patterns, exemplars, ADRs, agent logs)
- `avel` CLI tool — the taskmaster
- Scripts for sprint scaffolding, activation prompt generation, grading

**2. Per-project (`.avel/` in client repo, ~5 files)**

- `project.md` — project context
- `overrides.md` — Layer 4 standards
- `sprint-current.md` — active sprint plan
- `sprints/` — historical sprint plans
- `decisions/` — project-specific ADRs

**3. Business operations (Notion / Linear / Stripe — not in any repo)**

- Sprint briefs, change requests, completion reports, billing, client comms

---

### Skills Bundle Architecture (Decided)

Hybrid: **22 skills total**

```
agent-dispatch/         ← orchestrator skill (Helm logic + shared references)
├── SKILL.md
├── references/
│   ├── universal-standards.md
│   ├── methodology.md
│   ├── workflow.md
│   └── teams/
├── scripts/            ← real Python scripts
│   ├── activate-agent.py
│   ├── grade-sprint.py
│   └── new-sprint.py
└── assets/templates/

helm/SKILL.md           ← Sprint LEAD skill
north/SKILL.md          ← Frontend LEAD
anchor/SKILL.md         ← Backend LEAD
verdict/SKILL.md        ← Quality LEAD
... (16 specialist skills)

avel-knowledge/         ← knowledge bank skill
├── SKILL.md
└── references/
    ├── patterns/
    ├── anti-patterns/
    ├── decisions/
    └── exemplars/
```

End-state file count: ~40 in global install, ~5 per client repo. Down from 159.

### CLI Commands (Designed)

```
avel init                # bootstrap .avel/ in a new client repo
avel sprint new          # create new sprint, scaffold sprint-current.md
avel intake              # walk through Phase Zero interactively
avel plan                # Helm planning — analyze repo, draft traces
avel dispatch <team>     # activate a wave
avel activate <agent>    # generate activation prompt for an agent
avel status              # show sprint state, wave, open gates
avel wave-complete <n>   # mark wave sign-off, advance
avel grade               # produce sprint assessment
avel close               # sprint close + knowledge bank update
avel knowledge add       # propose new bank entry
avel update              # pull latest framework from versioned source
```

### Two Surfaces

- **Terminal:** `avel <command>` from anywhere
- **Claude Code:** `.claude/commands/avel-*.md` slash-commands as thin wrappers

---

## Open Decisions Before Build

These need answers before the Skills + CLI build starts:

1. **Skills deployment surface for v1** — claude.ai + Claude Code (consumer) OR Claude API (programmatic)? My vote: claude.ai + Claude Code for solo execution. API later when this gets packaged.

2. **CLI language** — Python (fast to write, Anthropic SDK, scripting-native) OR TypeScript (matches Avel stack, typed templates). My vote: Python for v1 because it's glue code.

3. **State source of truth** — markdown-first with parseable state block at top of `sprint-current.md` OR separate `state.json`. My vote: markdown-first for Git transparency.

4. **Description tone for skill triggers** — pushy on Helm + 3 LEADs (high invocation rate), conservative on 16 specialists (LEAD invokes them). Confirm or adjust.

5. **Scripts in orchestrator skill** — yes/no on shipping real Python scripts (activation prompt rendering, sprint scaffolding, grading). My vote: yes — turns the orchestrator into a real tool, not just instructions.

---

## Build Order — Next Sprint Of Work

1. **Decide global install location.** `~/.avel/` recommended.
2. **CLI skeleton in Python** — three commands first: `avel init`, `avel sprint new`, `avel status`. File scaffolding only. No Skills, no Claude integration yet.
3. **Convert framework to Skills format.** 22 skills. Slim during conversion — collapse personal standards + agent definitions into single SKILL.md per agent.
4. **Wire CLI to render activation prompts** from Skills + project state. `avel activate north` produces a complete prompt to paste into Claude Code.
5. **Add Claude Code slash-commands** as thin wrappers over CLI scripts.
6. **Sprint Zero on a personal project** — dogfood the system before any paying client. Find what breaks.

**Realistic time:** 12–20 hours focused work, spread over a week.

---

## What Has Not Been Built (Be Honest)

- ❌ The Skills bundle (next phase)
- ❌ The `avel` CLI (next phase)
- ❌ Claude Code slash-commands (next phase)
- ❌ The command center for running Avel ops (Notion/Linear or custom — undecided)
- ❌ Sprint abort protocol and other failure-mode playbooks
- ❌ Contract templates, SOW, NDA, succession plan
- ❌ Customer acquisition pipeline
- ❌ Sprint Zero (self-dogfooding) execution
- ❌ Any paying client work

---

## The Honest Read

Avel has a strong architectural moat designed. It does not yet have a castle to protect. The framework is real on paper; the business around it is not. Next moves must balance system-building (Skills bundle, CLI) with business reality (Sprint Zero, contract templates, first client outreach).

The temptation is to keep refining the framework. The discipline is to ship a sprint with it.

---

## Reference

- Source repo (forked): `github.com/robertohluna/agent-dispatch` (MIT)
- Target repo (Avel's): `github.com/avelcore/agent-dispatch` (private, to be created)
- Current build artifact: `/mnt/user-data/outputs/agent-dispatch.zip` (159 files, 1.2MB)
- Brand voice rules: short sentences, outcomes first, no agency language, "built with intent"
- Launch target: June 2026
