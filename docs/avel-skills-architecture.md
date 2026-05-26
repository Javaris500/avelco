# Avel Agent Dispatch — Skills Architecture

> The next phase. Converting Agent Dispatch from a 159-file markdown spec into a deployable Claude Skills bundle.
> No CLI yet. Just Skills, done right.
> Internal document. Last updated: May 24, 2026.

---

## TL;DR

We're replacing the 159-file Markdown spec with a **20-skill bundle** that installs once on the founder's machine and works in any Claude environment — claude.ai, Claude Code, the API.

Each skill is a folder with a SKILL.md (the gateway) and progressive references (loaded only when needed). Each agent is one skill. The standards layer and the knowledge bank become their own skills.

The agent roster contracted from 23 to **18 named agents + 2 supporting skills** through merges. Names lock here. Build approach: **full 20 at once**, structured carefully so every skill is built on the same template.

End-state file count: ~80–100 files in the global install, ~5 per client repo. Down from 159.

---

## Why This Pivot

The 159-file spec works as documentation. It does not work as a deployable system. Three problems:

1. **You can't drop 159 files into every client repo.** Bloats the project, duplicates the framework, drifts across projects.
2. **The agents aren't real.** They're paste-into-Claude prompts. No enforcement, no progressive loading, no automatic triggering.
3. **Maintenance debt.** Updating a standard means hand-editing dozens of files. Adding a pattern means hand-editing dozens more.

Skills solve all three. One global install. Automatic triggering by description matching. Progressive disclosure means we pay context cost only for what's actively used. Updates propagate cleanly because each concept lives in one place.

---

## The Eight Principles Driving This Design

These come from researching how Skills actually work in 2026, not from theory.

### 1. The description is the trigger, not documentation

Skills are model-invoked. Claude reads your prompt, scans every skill description, decides which to load. The description field in YAML frontmatter is the deciding factor.

Vague descriptions cause undertrigger. Aggressive, specific descriptions with task verbs ("Use when planning a sprint", "Use when auditing accessibility") fire reliably.

**For Avel:** Every agent's description carries that agent's job in the language we use about sprints. We treat the descriptions as the most important sentences in the whole bundle.

### 2. Progressive disclosure — three levels, strict budgets

Skills load in three stages:

- **Level 1 (always loaded):** YAML metadata — name + description (~20 tokens per skill)
- **Level 2 (loaded on trigger):** SKILL.md body — target ~150 lines, max ~500
- **Level 3 (loaded on demand):** references/ files and scripts/ scripts — only when the SKILL.md tells Claude to read them

This means every SKILL.md is a *gateway*, not a manual. Depth lives in references.

**For Avel:** Each agent's current 60–400 lines of content compresses to a ~100–150 line SKILL.md. The rest pushes to references/, loaded only when relevant.

### 3. Skills don't call each other — Claude orchestrates between them

Skills can't invoke other skills directly. Claude reads outputs and decides what to load next.

**For Avel:** Helm doesn't "activate" Pulse. Helm produces a structured dispatch document. Claude reads it and the dispatch's content triggers Pulse's description-matching. The handoff format is as important as the agents themselves.

### 4. One concern per skill — kill the kitchen sink

Skills that cover too many concerns (utilities.md, general-helpers/) don't trigger reliably and pollute context when they do.

**For Avel:** Each agent is its own skill. No meta-orchestrator. Helm IS the orchestrator agent — the orchestration logic lives in Helm's skill, not in a separate one.

### 5. Each skill must be self-contained

Skills inherit nothing. Claude can load multiple at once, but each one stands alone. We can't assume `avel-standards` is "always loaded" — it might not be.

**For Avel:** Each agent skill self-contains its absolute essentials. References to the standards skill and knowledge bank skill are explicit ("if this work involves X, the avel-standards skill covers Y"). Critical rules duplicate inline where omission would cause real damage.

### 6. Scripts are deterministic leverage — use sparingly

Skills can bundle executable scripts (Python, bash) that Claude runs without loading source into context. Scripts excel where determinism beats prompting.

**For Avel:** Three to five scripts in v1, in skills where determinism matters:
- `helm/scripts/generate-activation.py` — composes activation prompts from templates
- `helm/scripts/grade-sprint.py` — applies the five-dimension rubric to completion reports
- `verdict/scripts/check-gates.py` — verifies all five gates pass before sign-off

Everywhere else, prompting is fine. Scripts aren't a feature — they're a tool used where they pay off.

### 7. Test triggers, test behavior, test composition

The single most common failure mode: the skill exists but never fires because Claude doesn't match the prompt to the description. Test every skill on:

- **5 prompts that should trigger it** (positive tests)
- **5 prompts that should NOT trigger it** (negative tests)
- **Behavior tests:** when triggered, does the output match expected shape?
- **Composition tests:** does the next agent in the sequence pick up correctly?

For 20 skills, that's 100+ test prompts. Non-negotiable.

### 8. The descriptions encode WHEN NOT to trigger as much as when to

Specialists fire too eagerly otherwise. Pulse shouldn't trigger on "build a button"; that work belongs inside Helm's sprint flow.

**For Avel:** Specialist descriptions include gating language: "Use ONLY when activated by [LEAD] as part of [Wave N]. For ad-hoc requests, defer to Helm's intake first."

This is what gives the team its hierarchy in a flat skill system.

---

## The Revised Roster — 18 Agents

The original spec had 23 (20 named agents + 3 advisors). After analyzing which would trigger reliably as skills and which had real-world handoff overhead, we collapsed to **18 named agents plus 2 supporting skills (`avel-standards`, `avel-knowledge`)** = **20 skills total**.

### Command

| Skill | Role | Notes |
|---|---|---|
| **Helm** | Sprint LEAD | Phase Zero, planning, dispatch, grading, sprint close. The orchestrator. |

### Frontend Team (Wave 2)

| Skill | Role | Notes |
|---|---|---|
| **North** | Frontend LEAD | Coordinates the team, signs off Wave 2 |
| **Forge** | Component & Design | *Atlas merged in.* Tokens, specs, reusable component library |
| **Pulse** | UI | Routes, pages, features, state, data fetching |
| **Echo** | Accessibility | WCAG 2.1 AA audit, ship-blocking on critical fails |
| **Swift** | Performance | Core Web Vitals measurement and optimization |

### Backend Team (Wave 3)

| Skill | Role | Notes |
|---|---|---|
| **Anchor** | Backend LEAD | Coordinates the team, signs off Wave 3 |
| **Vault** | Data | *Core merged in.* Schema, migrations, indexes, models, repositories |
| **Gate** | Auth | Authentication, authorization, password handling |
| **Relay** | Services | *Engine merged in.* API handlers + background jobs |
| **Bridge** | Integration | Third-party APIs with retry, circuit breaker, webhook verification |

### Quality & Deployment Team (Wave 4)

| Skill | Role | Notes |
|---|---|---|
| **Verdict** | Quality LEAD | Owns ship/no-ship decision |
| **Proof** | QA | E2E test suite, ship-blocking on critical fails |
| **Warden** | Security | OWASP audit, ship-blocking on critical findings |
| **Launch** | DevOps & Recovery | *Refuge + Infra merged in.* CI/CD, deploy, rollback, IaC |
| **Beacon** | Monitor | Error tracking, uptime, performance, alerts |

### Cross-Team Advisors

| Skill | Role | Notes |
|---|---|---|
| **Red Team** | Adversarial review | Supports Warden; blocks merge separately from ship gate |
| **Lead** | Merge authority | Reviews and merges agent branches into integration |

### Supporting Skills

| Skill | Role | Notes |
|---|---|---|
| **avel-standards** | Universal rules | Always-on; layer 1 standards every agent reads |
| **avel-knowledge** | Knowledge bank | Patterns, anti-patterns, ADRs, exemplars — loaded when relevant |

**Total: 20 skills.** Roster locks here. Names will be customized to founder's preference but role definitions are fixed.

### What changed from 23 to 18 agents

- **Atlas → Forge.** Design tokens and components are written by the same person in practice. The handoff was contrived.
- **Core → Vault.** Schema and models mirror each other; splitting them created an artificial seam.
- **Engine → Relay.** HTTP services and background jobs share the same patterns; Relay handles both.
- **Refuge → Launch.** Deploy and rollback are inverse operations of the same domain.
- **Infra → Launch.** Infrastructure-as-code is part of DevOps' job.

The methodology is identical. Fewer handoffs because adjacent jobs collapsed into one role.

---

## The Architecture — Option C, Refined

Hybrid composition. No meta-orchestrator (the original Option C had one — we dropped it). Helm IS the orchestrator agent.

```
~/.claude/skills/                        # global install location
│
├── avel-standards/                      # Layer 1 standards — fires on any Avel work
│   ├── SKILL.md                         # ~80 lines: the gateway
│   └── references/
│       ├── code-quality.md
│       ├── security.md
│       ├── delivery.md
│       └── communication.md
│
├── avel-knowledge/                      # Knowledge bank — fires when patterns needed
│   ├── SKILL.md                         # ~100 lines: when to look up what
│   └── references/
│       ├── patterns/
│       │   ├── README.md
│       │   └── (entries accumulate)
│       ├── anti-patterns/
│       ├── decisions/                   # ADRs
│       └── exemplars/
│           ├── api-handler.md
│           ├── react-component.md
│           └── database-schema.md
│
├── helm/                                # Sprint LEAD — the orchestrator
│   ├── SKILL.md                         # ~150 lines: phase zero + planning + dispatch
│   ├── references/
│   │   ├── methodology.md               # execution traces
│   │   ├── phase-zero-playbook.md
│   │   ├── workflow.md                  # five-phase lifecycle
│   │   ├── teams.md                     # team charters in one file
│   │   ├── grading-rubric.md
│   │   ├── client-voice.md
│   │   └── log.md                       # Helm's learning log
│   └── scripts/
│       ├── generate-activation.py
│       └── grade-sprint.py
│
├── north/                               # Frontend LEAD
│   ├── SKILL.md                         # ~100 lines
│   └── references/
│       ├── team-frontend.md
│       └── log.md
│
├── forge/                               # Component & Design (Atlas merged)
│   ├── SKILL.md                         # ~120 lines
│   └── references/
│       ├── design-tokens.md
│       ├── component-patterns.md
│       └── log.md
│
├── pulse/                               # UI
│   ├── SKILL.md
│   └── references/
│       └── log.md
│
├── echo/                                # Accessibility
│   ├── SKILL.md
│   └── references/
│       ├── wcag-checklist.md
│       └── log.md
│
├── swift/                               # Performance
│   ├── SKILL.md
│   └── references/
│       ├── web-vitals-targets.md
│       └── log.md
│
├── anchor/                              # Backend LEAD
├── vault/                               # Data (Core merged)
│   ├── SKILL.md
│   └── references/
│       ├── schema-patterns.md
│       └── log.md
│
├── gate/                                # Auth
├── relay/                               # Services (Engine merged)
│   ├── SKILL.md
│   └── references/
│       ├── api-patterns.md
│       ├── job-patterns.md
│       └── log.md
│
├── bridge/                              # Integration
│
├── verdict/                             # Quality LEAD
│   ├── SKILL.md
│   ├── references/
│   │   ├── team-quality-deployment.md
│   │   └── log.md
│   └── scripts/
│       └── check-gates.py
│
├── proof/                               # QA
├── warden/                              # Security
├── launch/                              # DevOps & Recovery (Refuge + Infra merged)
│   ├── SKILL.md
│   └── references/
│       ├── deploy-patterns.md
│       ├── rollback-runbook-template.md
│       ├── iac-patterns.md
│       └── log.md
│
├── beacon/                              # Monitor
├── red-team/                            # Adversarial review
└── lead/                                # Merge authority
```

### Per-skill file count

- Most agent skills: **3–5 files** (SKILL.md + 1–3 references + log)
- LEADs and complex agents (Helm, Forge, Vault, Relay, Launch): **5–8 files**
- avel-standards: **5 files**
- avel-knowledge: variable (~10 to start, grows over time)

**Total: ~80–100 files in the global install.** Half the 159 mess.

---

## The Universal Skill Template

Every agent skill follows this structure. Consistency matters for maintainability and for Claude's pattern-matching.

```yaml
---
name: [agent-name]
description: |
  [The trigger sentence. Specific task verbs. The agent's job in the language of sprints.
  Include "Use when..." and "Do not trigger on..." gating language.]
license: MIT
---

# [Agent Name] — [Role]

> [One-sentence purpose. What this agent exists to do.]

## Team & Wave

- Team: [Frontend / Backend / Q&D / Command / Cross-team]
- Wave: [N or "as needed"]
- LEAD: [name of the LEAD this agent reports to, or "self" for LEADs]
- Activates from: [who triggers this agent — usually the LEAD or Helm]
- Activates to: [who this agent hands off to]

## When To Use This Skill

[3–5 lines on triggering conditions. What user prompts or sprint-state should fire this skill.
Match the description but expanded.]

## When NOT To Use This Skill

[Gating language. What's outside this agent's territory. What should defer to Helm's intake.]

## Avel Context

[2–3 lines. Reference avel-standards skill. Reference avel-knowledge skill.
"You are an agent in Avel's Agent Dispatch system. Always consult avel-standards for
universal rules. Look up relevant patterns in avel-knowledge before starting work."]

## Standards Read Order

[Numbered list of what this agent reads before doing work. The 9-layer activation sequence
abbreviated for skill format.]

## Territory

Owns:
- [files this agent creates/modifies]

Reviews (read-only):
- [files this agent reads but doesn't modify]

## What This Agent Does

[Concrete responsibilities. Bulleted. Outcomes.]

## What This Agent Does NOT Do

[Explicit boundaries. Crossing them is a process violation.]

## Inputs

[What this agent receives at activation.]

## Outputs

[What this agent produces. Clean handoff shape.]

## Handoff

[Who receives the output and in what form.]

## References

- See `references/log.md` for accumulated learnings
- See `references/[other relevant files]` for [deep dives]
- See avel-knowledge skill for patterns and exemplars
- See avel-standards skill for universal rules

## Scripts

[If any. What they do, when to run them.]
```

Every skill uses this. Same shape, different content. Faster to build. Faster for Claude to pattern-match. Faster for the founder to navigate.

---

## Priority Improvements Built Into Every Skill

The template above is the structural baseline. Four additional layers raise every skill from "works" to "reliable in production." All four are non-negotiable and apply to every skill in the bundle.

### 1. Definition of Done — explicit completion checklist

Every SKILL.md ends with a `## Definition of Done` section. Concrete, verifiable, machine-readable checkboxes. Not "high quality work" — actual gates.

Without this, Claude decides when work is done. With this, the skill itself decides.

**Example for Pulse:**

```markdown
## Definition of Done

Pulse is complete only when ALL of these are true:

- [ ] Every route in the sprint plan renders without console errors
- [ ] Every form submits without runtime errors
- [ ] Loading state implemented for every async data fetch
- [ ] Error state implemented for every async data fetch
- [ ] Empty state implemented for every list-rendering view
- [ ] Client-side validation matches the API contract
- [ ] Submit buttons disable during in-flight submissions
- [ ] Successful submissions produce visible confirmation
- [ ] No `any` types without justifying comment
- [ ] No `useState` holding server-fetched data (use data fetching library instead)

If any item is unchecked, the agent is NOT done. Return to work, do not hand off.
```

**Example for Vault:**

```markdown
## Definition of Done

Vault is complete only when ALL of these are true:

- [ ] Every table has comments on table and notable columns
- [ ] Every column is NOT NULL unless nullability is justified inline
- [ ] Every foreign key has a corresponding index
- [ ] Every migration is reversible (down migration written)
- [ ] No `SELECT *` in any committed code
- [ ] All queries are parameterized (no string concatenation with user input)
- [ ] Soft delete (`deleted_at`) implemented unless hard delete is documented in ADR
- [ ] Schema diagram or DDL listing produced
- [ ] All migrations tested against a clean database AND an existing database
```

This is what makes skills reliable. The agent can't hand off broken work because the agent's own skill refuses to declare done.

### 2. Self-verification before handoff

Every skill includes a `## Self-Verification` section that runs *before* declaring done. Not testing in the QA sense — the agent proving its own work works.

**Example for Vault:**

```markdown
## Self-Verification

Before declaring complete:

1. Run all migrations against a fresh test database. Output: success or specific failure per migration.
2. Run all migrations against a database with the previous schema applied. Output: success or specific failure.
3. Run the down migration for each. Verify the schema returns to the previous state.
4. Run a sample query against each new table. Verify the expected columns return.
5. Include the verification output in the completion report — actual command output, not paraphrase.

If any verification step fails, do NOT declare done. Fix the issue and re-verify.
```

**Example for Bridge:**

```markdown
## Self-Verification

Before declaring complete, for each integration:

1. Make a successful test call to the third-party service. Output the response.
2. Make a deliberately failing test call (bad auth, malformed payload). Verify the error handling produces a structured error, not a crash.
3. If the integration has webhooks: send a test webhook with a valid signature. Verify it processes.
4. Send a test webhook with an INVALID signature. Verify it rejects with 401.
5. Verify the API key is read from the secrets manager, not from code or env file.
6. Include all output in the completion report.

If any verification step fails, do NOT declare done.
```

This eliminates whole categories of "looked done but wasn't" bugs.

### 3. Strict dispatch document contract

Skills can't invoke each other — handoffs happen through documents Claude reads. For 18 agents and 4 waves to compose reliably, the dispatch format is a strict template, not free-form prose. Same fields, same order, every time.

This is the contract between skills. Treat it like an API.

**The canonical dispatch document format:**

```markdown
---
dispatch_type: agent-activation
from_agent: helm
to_agent: north
sprint: dashboard-rebuild-2026-q2
wave: 2
status: pending-activation
created: 2026-06-15T10:30:00Z
---

# Activation: North

## Required Context

The receiving agent MUST read all of the following before starting work:

- `.avel/project.md`
- `.avel/overrides.md`
- `.avel/sprint-current.md`
- `.avel/sprint-current/wave-2-traces.md`
- avel-standards skill (auto-loaded)
- north skill (this skill loading itself)

## Inputs

[Specific files, data, decisions the receiving agent needs. Bulleted.]

- API contract requirements: [path or inline]
- Design tokens decision: [path or inline]
- Component library inventory needed: [yes/no, scope]

## Expected Output

[What the receiving agent must produce. Specific deliverables.]

- Wave 2 completion report at `.avel/sprint-current/wave-2-completion.md`
- API contract document at `.avel/sprint-current/api-contract.md`
- Component library inventory at `.avel/sprint-current/components-built.md`
- Accessibility report at `.avel/sprint-current/accessibility-report.md`
- Performance report at `.avel/sprint-current/performance-report.md`

## Sequence

After completing this activation, hand off to:

- Next agent: anchor
- Via dispatch: `.avel/sprint-current/dispatch-to-anchor.md`

## Constraints

[Standards layers, project overrides, hard requirements.]

- WCAG 2.1 AA required (no exceptions for this client)
- Core Web Vitals targets: LCP ≤ 2.0s (tighter than default — client requirement)
- Component library: use avel-design-system v3.2.0 (locked in Phase Zero)

## Blocking Conditions

If any of these are true, do NOT proceed. Escalate to Helm:

- [...]
```

Every handoff in the system uses this format. Helm → North, North → Forge, Forge → Pulse, all the way through Wave 4 and back to Helm at sprint close. The structure stays identical; the contents vary.

**Why this matters:**

- Inspectable: every handoff is a document you can read and audit.
- Composable: Claude pattern-matches the dispatch format reliably across sessions.
- Recoverable: if a sprint stalls, you read the last dispatch and know exactly where to resume.
- Testable: composition tests verify dispatch documents produce correct next-agent activations.

### 4. Common Failure Modes section per skill

Each skill includes a `## Common Failure Modes` section with 3–5 known patterns that have failed before. Acts as both pre-flight checklist and self-audit before declaring done.

**Example for Pulse:**

```markdown
## Common Failure Modes — Watch For These

### Forgetting empty states
*Symptom:* Lists with zero items render blank with no message.
*Catch:* For every list-rendering component, verify there's an explicit empty state with helpful copy.

### useState for server data
*Symptom:* `const [users, setUsers] = useState([])` plus a `useEffect` that fetches.
*Catch:* Server data uses a data-fetching library (TanStack Query, SWR). Local state is for UI state only.

### Submit buttons that stay enabled during submission
*Symptom:* User double-clicks submit, two requests fire, duplicate records created.
*Catch:* Every form button checks `isSubmitting` state and disables.

### Loading states that block forever on error
*Symptom:* Fetch fails silently, spinner spins indefinitely.
*Catch:* Every loading state has a paired error state with a retry mechanism.

### Inline styles for static values
*Symptom:* `style={{ marginTop: 16 }}` instead of Tailwind utility.
*Catch:* Inline styles only for dynamic values (animation transforms, prop-derived colors).
```

**Example for Warden:**

```markdown
## Common Failure Modes — Watch For These

### Trusting "exploitation requires specific knowledge"
*Symptom:* Critical finding downgraded because the attack requires insider knowledge.
*Catch:* Severity is based on impact, not exploitation difficulty. Critical stays critical.

### Skipping git history scan
*Symptom:* Secret was committed three months ago, removed two months ago, still in history.
*Catch:* Always scan full git history, not just current tree.

### Accepting "we'll fix it post-launch" for criticals
*Symptom:* Pressure to ship before security findings are addressed.
*Catch:* Block stands. Wave 4 does not close with critical findings open.

### Missing rate limiting on auth endpoints
*Symptom:* Login endpoint has same rate limit as data endpoints (or none).
*Catch:* Auth endpoints get stricter limits than data endpoints — verify explicitly.
```

This section grows over time. After each sprint's retrospective, Helm proposes new failure modes for each agent's section. The bank accumulates judgment.

---

## How These Four Compose

Together, the four improvements form a quality cascade per agent:

1. **Common Failure Modes** — checked before starting work (pre-flight)
2. **Self-Verification** — run after work, before declaring done (verification)
3. **Definition of Done** — explicit checklist that must be satisfied (gate)
4. **Strict Dispatch Document** — produced as output to trigger the next agent (handoff)

Every agent activates → reads failure modes → does work → runs self-verification → confirms Definition of Done → produces strict dispatch → hands off.

The skill template gets four new mandatory sections inserted. Updated structure:

```yaml
---
name: [agent-name]
description: |
  [trigger sentence]
license: MIT
---

# [Agent Name] — [Role]

> [Purpose]

## Team & Wave
## When To Use This Skill
## When NOT To Use This Skill
## Avel Context
## Standards Read Order
## Territory
## What This Agent Does
## What This Agent Does NOT Do
## Common Failure Modes — Watch For These   ← NEW
## Inputs
## Outputs
## Definition of Done                        ← NEW
## Self-Verification                         ← NEW
## Handoff                                   ← UPDATED — references strict dispatch format
## Voice                                     ← NEW
## References
## Scripts
```

Five new mandatory sections per skill. Adds maybe 35–55 lines per SKILL.md. Worth every line.

---

## Voice Ownership Per Skill

Avel's brand voice is "Built with intent. No noise. Just product." That voice lives externally — on the website, in client comms, in pitches. Internally, the agents also have voice. Each agent's output should sound like *that agent*, not like a generic AI.

This matters because: every artifact the system produces — dispatches, completion reports, knowledge bank entries — gets read by you (and eventually contractors and clients in sanitized form). If everything sounds identical, the system feels dead. If each agent has a recognizable voice, the system feels alive.

### Universal voice rules — apply to all agents

These belong in `avel-standards` and are reinforced in every agent skill:

- Short sentences. Long sentences are a smell.
- Outcomes before mechanics. "The dashboard loads in under a second" before "we optimized image loading."
- No agency language. No "deliverables," "bandwidth," "synergy," "going forward."
- No filler. Cut "essentially," "basically," "in order to," "the fact that."
- Plain English. If a term needs explaining, use a different term.
- Active voice. "Vault built the schema" not "the schema was built."
- Concrete over abstract. "Pulse implemented the dashboard route" not "Pulse worked on UI implementation."
- No exclamation points unless something is genuinely surprising.
- No corporate cheerleading. No "great job," no "let's crush this."

### Per-agent voice notes

Each agent skill includes a brief `## Voice` section that specifies tone within the universal rules.

**Helm — direct, strategic, calm under load**

Helm reads situations and makes calls. Helm's voice in dispatches is decisive: "Wave 2 begins. North leads. Forge starts with tokens."

In client comms, Helm is warm but never deferential. "Here's what we're shipping. Here's what's next. Let me know if you have questions."

In retrospectives, Helm is honest about what didn't work without flagellating any agent. "The auth flow took twice as long as planned. The root cause was an ambiguous Phase Zero ADR. The ADR template now requires a CSRF strategy."

**North, Anchor, Verdict — LEADs share a tone: brief, technical, no fluff**

LEAD completion reports read like senior engineer PR reviews. Tight, specific, no padding.

Verdict's sign-offs are one sentence when clean. Verdict's blocks are a list: what failed, who fixes it, what the gate requires.

**Forge — engineer-precise**

Forge's component documentation reads like API documentation. Usage examples are minimal and runnable. Forge does not editorialize about design choices unless asked.

**Pulse — implementation-focused**

Pulse describes what works and how. Completion reports include screenshots or screen recordings linked where helpful. Pulse does not hedge ("might work," "should be fine") — Pulse verifies and reports the result.

**Echo — specific, evidentiary**

Echo identifies issues with WCAG criterion number, location, and remediation. No vague "improve accessibility." Either it's compliant or there's a specific gap.

**Swift — numerical**

Every claim Swift makes has a number. Every optimization has a measurement. "LCP improved from 3.2s to 2.1s by preloading the hero font and converting the hero image to AVIF."

**Vault — schema-precise**

Every column has a reason. Every index has a query that uses it. Vault doesn't suggest schema decisions; Vault makes them and documents the rationale.

**Gate — strict, security-precise**

Gate's auth documentation reads like a spec, not a guide. No "consider using bcrypt" — "use Argon2id with current cost factor, fall back to bcrypt only when a runtime constraint prevents Argon2id."

**Relay — endpoint-precise**

API docs read like contracts, not tutorials. Endpoints, payloads, status codes, error shapes. No marketing.

**Bridge — defensive**

Integration documentation describes failure modes prominently. Every external call's failure handling is documented before its happy path.

**Proof — evidentiary**

Reports show output, not claims. Screenshots, logs, timing. "47 tests pass against staging at https://staging.example.com" not "the test suite passes."

**Warden — adversarial**

Reports describe attack paths, not just symptoms. "The /api/users/{id} endpoint allows IDOR — any authenticated user can read any other user's profile by changing the URL parameter. Attack: token from user A, request to /api/users/{B}, returns user B's data."

**Launch — procedural**

Deployment docs are step-by-step, copy-pasteable. No prose explaining what each step does — the steps are the documentation.

**Beacon — operational**

Documentation reads like an on-call runbook. Alert thresholds, response paths, escalation contacts.

**Red Team — tight, factual, no theatrics**

Red Team's findings are quietly devastating. No "OMG critical vulnerability!!" — "User input from `name` field reaches `eval()` in /admin/preview without sanitization. RCE for any admin user. Reproducer at lines 47-52 of admin-preview.ts."

**Lead — final**

Lead's merge decisions are one line. "Merged at sha 4a2b1c. Wave 2 review complete." When Lead blocks, it's specific: "Blocked: 3 commits missing Sprint metadata. See [list]. Fix and re-request."

### Where voice lives in each skill

Each agent's SKILL.md has a `## Voice` section near the bottom, ~5-10 lines, that captures the agent's tone in one paragraph plus 2-3 example outputs. This is reference, not constraint — agents internalize the voice through pattern matching.

The universal rules live in `avel-standards/references/voice-guide.md` and are loaded by every agent activation.

### Why this matters operationally

A dispatch that sounds like Helm: "Wave 2 begins. North leads."

A dispatch that sounds like an AI assistant: "I've now initiated Wave 2 of the sprint. The Frontend team, led by North, will commence the implementation work."

The first one is what we ship. The second is what we cut. Every artifact gets the first treatment.

---

## Description Strategy

Critical. The single biggest determinant of whether skills work.

### Pushy descriptions — the LEADs

These should fire aggressively because they orchestrate everything else.

**Helm example:**
> Use whenever the user mentions starting a new client engagement, says "new sprint", "kick off a project", "plan a build", describes a software project for a client, mentions Avel client work, mentions Phase Zero or intake, asks about sprint planning, or anything resembling an engagement kickoff. Helm runs intake, plans the sprint, dispatches teams, grades agents, and closes with the client. Always trigger this for sprint orchestration tasks. Do not defer to other Avel agents until Helm has run planning.

**North example:**
> Use when the user says "start frontend", "kick off the UI work", "begin Wave 2", "activate the frontend team", or when Helm has dispatched Wave 2. North coordinates the Frontend team through Wave 2: activates Forge, Pulse, Echo, Swift in sequence and signs off. Use whenever a sprint is moving into frontend implementation.

### Gated descriptions — the specialists

These fire only inside an active sprint, gated by the LEAD's activation.

**Pulse example:**
> Use ONLY when activated by North as part of Wave 2 frontend work, or when the user explicitly says "activate Pulse" or "use the UI agent". Pulse implements features — routes, pages, state, data fetching — using existing components. Do NOT trigger on ad-hoc "build a button" or "make a form" requests outside an active sprint — those go through Helm's intake first.

**Refuge-merged-into-Launch example for the rollback portion:**
> ...handles deployment, monitoring of deploy health, AND rollback planning. Use when deploying, when planning recovery from deploy failures, when the user asks "what's the rollback plan", or during Wave 4 deployment work...

### Always-on descriptions — the supporting skills

These fire whenever any Avel work is happening.

**avel-standards example:**
> Use whenever doing any Avel build work — sprint planning, frontend, backend, deployment, security review, or any agent-dispatch task. Loads universal rules every Avel agent on every sprint follows: code quality, security, delivery requirements, communication. Always consult before producing any code or documentation for Avel client work.

**avel-knowledge example:**
> Use when an Avel agent needs to look up an existing pattern, anti-pattern, decision record, or exemplar before starting work. Reference for accumulated Avel judgment. Load when working on something that has likely been solved before in the Avel knowledge bank.

---

## Handoff Design

Since skills don't call each other, the dispatch handoff format becomes critical.

When Helm finishes planning and needs to activate North, Helm doesn't invoke North. Helm produces a structured output that Claude reads, which then triggers North's description-matching.

### The dispatch document format

Helm produces:

```markdown
## Sprint Dispatch — [Sprint Name]

**Current wave:** Wave 2 starting
**Next agent:** North (Frontend LEAD)

### Activation message for North

[Plain English: "North, you're now leading Wave 2 for [project]. The sprint plan
is in .avel/sprint-current.md. The frontend execution traces are at
.avel/sprint-current/wave-2-traces.md. Begin by reading those, then activate
Forge with the component specs."]

### What North receives

- Sprint plan: .avel/sprint-current.md
- Frontend execution traces: [path]
- API contract requirements: [summary]
- Project overrides: .avel/overrides.md

### What North should produce

- Wave 2 completion report
- API contract document for Backend team
- Component library inventory
- Accessibility and performance reports
```

Claude reads this output, sees "North", matches it to North's skill description, loads North's SKILL.md. The handoff happens through content, not invocation.

### Why this works

This makes the system inspectable. Every handoff is a document you can read. If something goes wrong, you see exactly what was passed and what failed. No hidden state.

---

## Always-On vs Sprint-Only

Three categories:

### Always available

- `avel-standards` — every Avel work session loads these rules
- `avel-knowledge` — pattern lookups can happen anytime
- `helm` — sprint intake can start anytime

These fire on general Avel-related prompts.

### Sprint-only (gated)

All other agents. They fire only when the dispatch flow has reached their wave, OR when the user explicitly invokes them.

This is enforced through description gating language ("Use ONLY when activated by [LEAD]..."). Not perfect — Claude can over-trigger — but consistent enough for solo use where you're orchestrating deliberately.

### How a user invokes a sprint-only agent directly

Pattern: "Activate Pulse for [specific work]." This bypasses the LEAD activation. Useful for solo work on small tasks. Documented in each specialist's SKILL.md so the founder knows the override exists.

---

## Scripts in v1

Three scripts confirmed for v1:

### `helm/scripts/generate-activation.py`

**Input:** agent name, sprint context file, task description
**Output:** the activation prompt with the 9-layer context list assembled

**Why:** Composing activation prompts is deterministic — concatenation of files in a specific order. No reason to ask Claude to do this every time when a script does it in 50 lines of Python.

### `helm/scripts/grade-sprint.py`

**Input:** sprint completion report
**Output:** five-dimension grade per agent (Completeness 30%, Correctness 25%, Mission 20%, Territory 15%, Convention 10%)

**Why:** The grading rubric has fixed weights and pass/partial/fail logic. Deterministic. Better as code than as a prompt.

### `verdict/scripts/check-gates.py`

**Input:** Wave 4 outputs (Proof report, Warden report, Launch log, Beacon dashboards, Refuge test log)
**Output:** PASS / FAIL on each of the five gates with specific blocking conditions

**Why:** Verdict's job is to verify five gates. Each gate has objective pass conditions. A script checks them all and produces a clean go/no-go.

### Scripts NOT in v1

- No CLI orchestrator (deferred)
- No state-tracking script (markdown-first in client repos)
- No knowledge bank curation script (Helm reviews manually for now)
- No client communication scripts (Helm writes those by hand)

Scripts will grow as patterns prove themselves. Three is enough to start.

---

## What Lives Where

The separation problem from the previous status doc gets resolved here:

### Global install (`~/.claude/skills/` or equivalent)

The 20 skills. Updated centrally. Used by every project.

### Per-client repo (`.avel/`, ~5 files)

```
.avel/
├── project.md            # project context — every activation reads this
├── overrides.md          # Layer 4 standards specific to this project
├── sprint-current.md     # the active sprint plan + state
├── sprints/              # historical sprint plans (one file each)
└── decisions/            # project-specific ADRs
```

That's the entire framework footprint inside the client's codebase. Lightweight. Portable.

### Business operations (Notion / Linear / Stripe — not in any repo)

- Sprint briefs (signed by client)
- Change requests
- Wave/sprint completion reports
- Billing milestones
- Client comms

Lives where Avel's business operations live. Not in client repos. Not in the Skills install. Founder's own workspace.

---

## Testing Protocol

Every skill must pass before it ships:

### Trigger tests (10 prompts per skill)

- **5 positive prompts** that should fire this skill. Verify it loads.
- **5 negative prompts** that should NOT fire this skill. Verify it stays quiet.

For 20 skills: 200 trigger tests total.

### Behavior tests (per skill)

When triggered, does the output match the expected shape?

- Helm produces a sprint plan with the right sections?
- Forge produces component code that matches the standards?
- Verdict produces a ship decision with all five gates checked?

### Composition tests (per handoff)

Does the next agent in the sequence pick up correctly?

- After Helm dispatches Wave 2, does North's skill fire?
- After North activates Forge, does Forge fire?
- After Forge completes, does Pulse fire next (not Echo)?

For the 18 named agents, this is ~15 composition handoffs to verify.

### Documentation of test results

Each skill ships with a `tests/` directory (not loaded into context — used during development) containing the test prompts and expected outcomes. Future updates re-run these.

---

## Build Approach — Full 20 At Once

Decided: full build, not vertical slice.

**Why:** the founder wants a complete system to launch with, not a partial proof. Risk: redoing skills when the pattern needs adjusting.

**Mitigation:** the universal skill template (defined above) is built and tested on Helm FIRST. Helm is the most complex skill. If the template survives Helm, it survives the other 19. Then we batch-build the 19 in template-shaped batches.

### Build order within the full 20

1. **`avel-standards`** — foundational, reused by every other skill's references
2. **`avel-knowledge`** — scaffolded structure even if seed content is light
3. **`helm`** — most complex, validates the template
4. **Three LEADs in parallel:** North, Anchor, Verdict — share structure, batch them
5. **Frontend specialists:** Forge, Pulse, Echo, Swift
6. **Backend specialists:** Vault, Gate, Relay, Bridge
7. **Q&D specialists:** Proof, Warden, Launch, Beacon
8. **Cross-team advisors:** Red Team, Lead
9. **Test the whole bundle** with the 200+ trigger tests
10. **Mock sprint** end-to-end to verify composition works

### Realistic time

8–12 hours of focused work. Each skill averages 20–40 minutes when the template is set.

---

## Decisions Locked

| Decision | Choice |
|---|---|
| Architecture | Option C, refined — no meta-orchestrator |
| Total skills | 20 (18 agents + 2 supporting) |
| Roster | Locked — Helm, North, Forge, Pulse, Echo, Swift, Anchor, Vault, Gate, Relay, Bridge, Verdict, Proof, Warden, Launch, Beacon, Red Team, Lead + avel-standards + avel-knowledge |
| Build approach | Full 20 at once |
| Skill template | Universal, applied to all 20 |
| Definition of Done | Mandatory per skill — explicit checklist |
| Self-Verification | Mandatory per skill — agent proves own work before declaring done |
| Dispatch document | Strict template contract — same fields, same order, every handoff |
| Common Failure Modes | Mandatory per skill — 3-5 known patterns with catch criteria |
| Voice ownership | Each agent has tone; universal rules in avel-standards; per-agent voice in SKILL.md |
| Scripts in v1 | 3 — generate-activation, grade-sprint, check-gates |
| Description tone | Pushy for LEADs + supporting, gated for specialists |
| Deployment surface | claude.ai + Claude Code (consumer) primary; API later |
| State management | Markdown-first in `.avel/` per project |
| Testing | 200+ trigger tests, behavior tests, composition tests |
| File count target | 80–100 in global install, ~5 per client repo |

---

## Decisions Pending

| Decision | Need by |
|---|---|
| Final names for any agents the founder wants to rename | Before build starts |
| Exact global install path (`~/.claude/skills/`, `~/.avel/skills/`, other) | Before build starts |
| Which client repo will host `.avel/` for first mock sprint | Before testing phase |
| Whether to add `tests/` directory to each skill or external test harness | Before testing phase |

---

## What This Replaces

The current `agent-dispatch.zip` (159 files, 1.2MB) becomes **legacy reference material**. The Skills bundle is the new canonical Avel system.

The legacy zip stays accessible because:
- Some content (examples, the original framework's `core/` files) is useful reference
- Conversion work draws from it
- Some content may not survive the slim-down and we want to be able to reach back

After the Skills bundle is built and verified through a mock sprint, the zip is archived but not actively maintained.

---

## What's NOT In Scope For This Phase

To avoid scope creep:

- ❌ The `avel` CLI — deferred to the next phase after Skills work
- ❌ The command center for running Avel ops — separate decision
- ❌ Customer acquisition pipeline — business work, not framework work
- ❌ Contract templates, SOW, NDA, succession plan — legal/ops, not framework
- ❌ Sprint Zero execution — happens AFTER skills are built and tested
- ❌ Any paying client work — framework first, client work second

---

## The Honest Read

Going from 159 files to 20 well-structured skills is the right move. The discipline this requires — universal template, progressive disclosure budgets, description testing — is what separates skills that work from skills that get ignored.

The risk is still the same as before: spending more time building Avel's framework than running Avel's first sprint. The mitigation is the build budget: 8–12 hours of focused work, then test, then ship to Sprint Zero. If the build sprawls past 20 hours, something's wrong with the template, not with the agents, and we should stop and fix the template.

The Skills bundle, once built, is a deployable asset. Drop it into any Claude environment and Avel works. That's worth the focused effort to get it right.

---

## Reference

- Previous status doc: `avel-status.md` (the 159-file spec status)
- Source repo (forked): `github.com/robertohluna/agent-dispatch` (MIT)
- Target repo (Avel's): `github.com/avelcore/agent-dispatch-skills` (to be created)
- Skills documentation: `platform.claude.com/docs/agents-and-tools/agent-skills`
- Launch target: June 2026
