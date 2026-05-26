# Avel Future Architecture

> The roadmap beyond v1. Captures architectural decisions made for the future before context gets lost.
> This document is a placeholder for later detailed breakdown — not a build spec.
> Internal document. Last updated: May 24, 2026.

---

## TL;DR

Three architectural additions planned for after Avel's first 3-6 client sprints:

1. **Loadout system** — agents become modular. Default skills always loaded. Specialized "packs" load based on sprint type.
2. **Three agentic upgrades** — persistent agent memory, inter-agent messaging, self-adaptation.
3. **Build sequence** — none of this gets built before revenue. Sequencing matters more than ambition.

This doc captures the concepts. Detailed specs come later, after the framework has been used on real sprints and the actual needs surface.

---

## Why This Doc Exists

Two reasons to capture this now:

1. **Context preservation.** These ideas emerged from real architectural conversations. Without writing them down, they get lost when we close chats.
2. **Anti-temptation.** Knowing these features are *planned for later* keeps us from trying to build them now. Sprint Zero and first paying clients come first.

This doc is intentionally light. Full specs get written when the features are about to be built — informed by real sprint experience, not pre-launch theorizing.

---

# Part 1: The Loadout System

## The Concept

Right now agents are static. Each agent has a fixed scope, fixed standards, fixed reference material. When a sprint needs capability that doesn't fit any agent perfectly, the choice is:

- Stretch an existing agent (adds scope, dilutes focus)
- Add a new agent (adds roster size, more handoffs)
- Skip the capability (project suffers)

**Loadouts collapse this trade-off.** An agent isn't a fixed thing — it's a base capability plus optional specialized packs that load when needed.

Think video game character class + loadout. Same character. Different missions, different kit.

---

## How It Works

Each agent skill gets a new structure:

```
agent-name/
├── SKILL.md                    # core skill — default capability, always loaded
├── references/                 # baseline reference material
└── packs/                      # optional loadouts
    ├── pack-name-1/
    │   ├── PACK.md            # describes what this pack adds
    │   └── references/         # specialized references
    ├── pack-name-2/
    └── ...
```

When Helm activates an agent, the dispatch includes a **loadout manifest**:

```markdown
## Loadout for this sprint

Agent: Ghost
Default: loaded
Additional packs:
- realtime
- motion
```

The agent loads core SKILL.md plus the specified pack PACK.md files. Other packs stay dormant.

---

## What Becomes a Pack

A pack is a self-contained capability bundle. It includes:

- A PACK.md describing what the pack adds
- Reference files specific to the pack
- Optional scripts the pack provides
- A "when to load this pack" trigger description

Packs are written once, reused across sprints. The knowledge bank's exemplars and patterns are natural pack candidates — patterns can be packaged AS packs.

### Example pack candidates per agent (illustrative, not committed)

**Ghost (UI) packs:**
- `forms-deep` — complex forms, multi-step, file upload, rich text
- `realtime` — WebSocket integration, optimistic updates, live collaboration
- `motion` — animation patterns, microinteractions, transitions
- `i18n` — internationalization, RTL support, locale routing
- `seo` — meta tags, structured data, sitemap
- `analytics` — event instrumentation, consent management

**Fantem (Component & Design) packs:**
- `dark-mode` — theming system
- `icon-system` — custom icon library setup
- `brand-system` — client-existing brand integration

**Leia (Performance) packs:**
- `browser-matrix` — legacy browser support
- `edge-caching` — CDN configuration
- `asset-pipeline` — image/font optimization at scale

**Nemi (Accessibility) packs:**
- `aaa-compliance` — beyond WCAG AA
- `screen-reader-deep` — extensive AT testing

**Axis (Data Visualization) packs:**
- `realtime-data` — streaming charts, live metrics
- `ai-confidence` — visualization for AI scores, embeddings, model outputs
- `d3-custom` — when standard libraries aren't enough

**Strat (State / Data Layer) packs:**
- `optimistic-ui` — instant UI feedback patterns
- `offline-first` — PWA, sync logic
- `multi-tenant` — workspace/org state isolation

Backend and Q&D agents get their own packs. Specifics deferred to detailed spec later.

---

## Sprint Type Templates

Picking packs per agent per sprint is decision overhead. Sprint type templates collapse this — Helm picks a template, the template suggests the loadout.

### Templates planned

- **AI-Feature SaaS** — Axis with `ai-confidence` + `realtime-data`, Strat with `optimistic-ui`, Ghost with `realtime`
- **Marketing Site** — Ghost with `seo` + `analytics`, deprioritize Strat, Leia with `edge-caching`
- **Internal Tool** — Ghost with `forms-deep`, deprioritize Axis, lighter Wave 4
- **Legacy Migration** — heavier Backend, Strat with `optimistic-ui`, Leia with `browser-matrix`
- **Real-Time Collaboration** — Ghost with `realtime` + `motion`, Strat with `optimistic-ui` + `offline-first`

Each template is a starting point. Helm adjusts per project specifics.

---

## What This Solves

1. **Roster bloat.** We were tempted to add agents for every capability. Packs let us add capability without agents.
2. **Project variance.** Every project is different. Loadouts make the agent set adaptive instead of one-size-fits-all.
3. **Knowledge reuse.** Patterns from past sprints become packs. The knowledge bank's exemplars get packaged for direct reuse, not just reference.
4. **Contractor scaling.** When you hire help, packs are the unit of knowledge transfer. "Here's the realtime pack — that's how Avel does real-time."
5. **The "I feel limited" problem.** Static agents force binary choices. Loadouts make the system dynamic.

---

## Risks To Flag

1. **Complexity creep.** If we end up with 50 packs across 18 agents, we're back to the file-bloat problem. Pack discipline matters — each pack must earn its existence.
2. **Decision overhead in Phase Zero.** Helm now picks packs every sprint. Templates mitigate but don't eliminate this.
3. **Skills platform support.** Skills technically support this through references and progressive disclosure. If Anthropic ever changes how skills load, packs would need adaptation.

---

## When To Build

**Not before Sprint 5.**

Reasons:
- We need real sprints to know which packs are actually needed
- Pre-building packs based on theory means writing things that don't get used
- The first 3-5 sprints reveal the real specialization needs

After Sprint 5, the patterns that recurred across sprints become the first pack candidates. The patterns that came up once stay as one-off references.

Build cadence: write packs as sprints surface needs, not on a release schedule.

---

# Part 2: The Three Agentic Upgrades

## What These Are

The current Avel system is agentic in architecture but partially agentic in execution. Three upgrades close that gap meaningfully without trying to make the system fully autonomous overnight.

These are the three agentic capabilities to prioritize:

1. **Persistent agent memory**
2. **Inter-agent messaging**
3. **Self-adaptation**

Three other agentic capabilities (autonomous orchestration, tool integration, advanced multi-step reasoning) are not part of this prioritization. Some get absorbed by the command center work. Others are deferred until evidence shows they're needed.

---

## Upgrade 1: Persistent Agent Memory

### What it means

Each agent has its own vector store of past activations. When an agent activates, relevant memories from prior sprints get pulled into context automatically.

Example: Pulse activates on sprint 12. Pulse's memory contains relevant context from sprints 1-11 — what worked, what didn't, client patterns that recurred. The system retrieves the top N most relevant memories based on the current task and injects them into the activation prompt.

### What this enables

- Agents get genuinely better over time without manual curation
- Less burden on Helm to assemble the right context per activation
- Pattern recognition happens at the agent level continuously, not just at retrospective time
- The knowledge bank stops being the only memory layer

### What's required

- A vector store (Pinecone, Weaviate, or local options like Chroma)
- An embedding pipeline — every completion report, every flag, every dispatch gets embedded and stored, tagged by agent
- A retrieval step at activation — top N relevant memories pulled into context
- Infrastructure to host this — lives in the command center

### Implementation notes

The integration with Claude Skills is the tricky part. Either:

- Bundle vector DB calls into agent-specific scripts that run at activation
- Have the command center inject relevant memories into dispatches before they reach the agent

The second approach is cleaner architecturally. Memory becomes the command center's job, not the agent's job.

### Realistic effort

Medium. Existing tools handle most of it. The hard part is curation — what gets stored, what gets discarded, how memories age out.

---

## Upgrade 2: Inter-Agent Messaging

### What it means

Agents communicate directly through a defined message bus, not just through documents. Real-time cross-team coordination without LEAD mediation.

Example: Mid-sprint, Pulse discovers a state shape problem that affects Strat. Today Pulse writes a flag, Helm reads it, Helm decides routing. With messaging, Pulse sends a message directly to Strat through the bus. Strat sees it in their next activation. Atlas (the command center orchestrator) logs the exchange and surfaces it to Helm for awareness.

### What this enables

- Faster cross-team resolution mid-sprint
- Less blocking on LEADs for coordination
- Genuine parallel work, not just parallel execution of separate tasks
- The system feels alive instead of procedural

### What's required

- A message bus — could be as simple as pub/sub Redis, or as sophisticated as an MCP server architecture
- Agent runtime that can produce AND consume messages
- Protocol definitions — what messages can be sent, who can receive what
- The command center mediates routing, enforces protocol, logs everything

### Implementation notes

This is real software engineering. Skills as a deployment surface don't natively support this in 2026. The command center hosts the message bus and acts as the runtime — agents send messages to the command center, command center routes them, agents receive on next activation.

Future possibility: if MCP server architecture matures, the message bus becomes an MCP layer. For now, custom implementation.

### Realistic effort

Heavy. This is the biggest of the three. But the payoff is the largest because it's what makes the system feel agentic in execution, not just in design.

---

## Upgrade 3: Self-Adaptation

### What it means

Agents propose improvements to their own SKILL.md based on observations during work. Approved proposals update the SKILL.md for future activations. The system learns at the speed of execution, not the speed of retrospectives.

Example: Pulse finishes a sprint and notices: "I kept hitting issue X with empty states. Recommend adding this section to my Common Failure Modes." The proposal goes to the command center. Command center surfaces it to the founder. Founder approves or rejects or edits. Approved changes update Pulse's SKILL.md with version tracking.

### What this enables

- Standards evolve continuously, not just at retrospectives
- Each agent gets sharper without you manually editing
- The knowledge bank gets contributions from inside the work, not just from human curation
- The system genuinely learns

### What's required

- A proposal protocol — what an agent can suggest, what it can't
- A gatekeeper — the command center receives proposals, routes to the founder
- Versioning of SKILL.md files so changes are auditable
- Rollback mechanism if a self-adaptation degrades performance
- Approval workflow

### Implementation notes

The mechanics are straightforward. The governance is what matters. Most of the work is preventing bad changes, not enabling good ones.

Boundaries to design:
- Agents can propose Common Failure Modes additions
- Agents can propose Definition of Done refinements
- Agents can propose new exemplars or patterns
- Agents cannot change their core role description
- Agents cannot change their team or wave assignment
- Agents cannot weaken gates (safety property)

### Realistic effort

Medium. The mechanics are simple. The governance design matters more than the code.

---

## How The Three Compose

These aren't independent features. They reinforce each other:

- **Memory + Messaging:** Agents remember past conversations with other agents, not just past activations of themselves
- **Memory + Self-Adaptation:** Agents propose changes informed by their own historical patterns
- **Messaging + Self-Adaptation:** Agents discuss proposed changes with related agents before formal submission

The full system is more than the sum of parts. Build them in order to maximize compounding effects.

---

# Part 3: Build Sequence

## The Critical Principle

**None of this gets built before revenue.**

The temptation will be strong. The architecture is exciting. The features are interesting. But Avel doesn't have customers yet. Building this infrastructure pre-revenue is the wrong work.

The first 6 months are about clients, not architecture.

---

## The Sequence

### Phase A: Months 1-6 — Pre-Architecture

What happens:

- Sprint Zero on a personal project (dogfood the framework)
- First 3-5 paying client sprints
- Manual orchestration (you do what Atlas would eventually do)
- Pack patterns emerge organically from real work
- Memory needs become clear by feeling the pain of not having it
- Self-adaptation candidates surface in retrospectives

What does NOT happen:

- Building any of this future architecture
- Designing the command center
- Writing detailed pack specs
- Building agent memory infrastructure

**The first 6 months ARE the spec for what comes after.** Manual work reveals real patterns. Pre-building based on theory means building wrong things.

### Phase B: Months 6-12 — Documented Manual Patterns

By month 6, you have 5+ completed sprints. Things you noticed yourself doing repeatedly become explicit patterns. Things you wished existed get listed.

What happens:

- Document the manual orchestration patterns you've been using
- List the packs that would have helped most (based on real sprints, not theory)
- Identify the 3-5 highest-value memory contexts (what you keep re-explaining to Claude)
- Note where inter-agent messaging would have saved real time
- Track which standards changed mid-sprint (self-adaptation candidates)

This documentation becomes the spec for Phase C.

### Phase C: Months 12-18 — Loadout System First

The loadout system gets built first because:

- It's the lowest-risk addition (additive to existing skills)
- It doesn't require runtime infrastructure
- It works inside the existing Claude Skills framework
- It pays off immediately in sprint efficiency

Build order:

1. Write the pack format specification
2. Implement 5 packs based on documented needs from Phase B
3. Build sprint type templates from real sprint experience
4. Update Phase Zero to include loadout selection
5. Test on 2-3 sprints before expanding

After Phase C, you should have 10-15 packs that genuinely earn their existence and a working sprint-type template system.

### Phase D: Year 2 — Memory and Messaging

Persistent memory and inter-agent messaging require runtime infrastructure. This is where the command center starts becoming real.

Build order:

1. Vector store infrastructure (memory backbone)
2. Embedding pipeline (storing past activations)
3. Retrieval integration (injecting memories into activations)
4. Message bus infrastructure (Redis-backed initially)
5. Inter-agent protocol definitions
6. Integration with Claude Skills (or custom runtime on top of Claude API)

This is real engineering work. Could be 3-6 months of focused build. Avel runs commercial sprints throughout to fund it.

### Phase E: Year 2+ — Self-Adaptation

Self-adaptation comes last because it requires governance that only experienced operation can inform. By the time we get here, we know what's safe to let agents propose and what isn't.

Build order:

1. Proposal protocol definition
2. Versioning system for SKILL.md files
3. Approval workflow (initially manual, possibly with assisted review)
4. Rollback mechanism
5. Boundary enforcement (what agents can/cannot propose)

---

## Why This Sequence

Each phase informs the next. Memory benefits from the patterns surfaced by loadouts. Messaging benefits from the memory layer. Self-adaptation benefits from all of the above.

Building in this order means each phase has informed design instead of speculative design.

---

## What This Doc Doesn't Cover

Held for later, not in scope here:

- **The command center detailed spec** — comes after Phase A reveals real needs
- **The orchestrator agent specification** — depends on command center decisions
- **Specific pack contents** — written when packs are built, not pre-built
- **Runtime infrastructure choices** — Pinecone vs Chroma, Redis vs custom, etc.
- **API design for inter-agent messaging** — engineering decisions for later
- **Pricing implications** — does the loaded system change tier pricing?

These all get covered in their own docs when they're about to be built.

---

# Part 4: Why This Matters

This document captures architectural ambition without giving in to the temptation to build it.

The Avel framework today is intentionally simpler than what it could become. That's the right call. A solo founder with no clients does not need the most sophisticated multi-agent system on the planet. A solo founder with no clients needs clients.

But the framework today is also intentionally *extensible* — designed so that loadouts, memory, messaging, and self-adaptation can be added without breaking what exists. The skills structure supports it. The handoff protocol supports it. The git principles support it.

When the time comes to add these capabilities, the framework will be ready.

For now: ship Sprint Zero. Get first client. Run real sprints. Let the manual experience reveal what to build next.

---

## Status

| Concept | Status |
|---|---|
| Loadout system | Designed, not built. Build after Sprint 5. |
| Persistent memory | Designed, not built. Build in Year 2. |
| Inter-agent messaging | Designed, not built. Build in Year 2. |
| Self-adaptation | Designed, not built. Build after messaging works. |
| Sprint type templates | Designed, not built. Build alongside loadouts. |
| Detailed pack content | Not designed. Write when sprints surface needs. |
| Runtime infrastructure | Not designed. Decide when building Phase D. |

This doc gets revisited at month 6 and again at month 12. By then, real sprint experience will inform real specs.

---

## One Last Note

If you find yourself rereading this doc and wanting to start building any of it before Sprint 5, stop. The framework is ready for clients. The clients are not yet ready for the framework. Get clients first. Everything else compounds from there.
