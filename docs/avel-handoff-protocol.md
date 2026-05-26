# Avel Handoff Protocol

> How agents communicate, hand off work, surface cross-team issues, and refuse bad dispatches.
> Skills can't call each other. Every transition happens through documents. This is the document specification.
> Internal document. Last updated: May 24, 2026.

---

## TL;DR

Four document types travel between agents:

1. **Dispatch** — authorization to start work (LEAD → agent)
2. **Completion Report** — evidence of work done (agent → LEAD)
3. **Flag** — cross-team signal (any agent → Helm or affected LEAD)
4. **Rejection** — refusal of a dispatch (agent → sender)

Three-step handshake on every dispatch: **issued → accepted/rejected → completed.**

Sequential numbering with letter suffixes for parallel work. All documents are parseable. All carry status. The audit trail is permanent.

---

## Why Handoffs Need This Much Structure

Three forces make handoffs the highest-risk part of the system:

1. **Skills can't invoke each other.** Every transition between agents is a document Claude reads and pattern-matches. The document IS the API.

2. **18 agents across 4 waves.** With parallel work possible inside waves, the handoff count per sprint is 20+. Without a protocol, things get lost.

3. **Solo execution today, contractors tomorrow.** A protocol designed for solo use must also work when two humans are running parallel waves. Loose conventions break at the seams.

The protocol below is the minimum viable structure that handles all three.

---

## The Four Document Types

### 1. Dispatch

A dispatch authorizes an agent to start work. Issued by Helm or a team LEAD. Read by the receiving agent before any work begins.

**Lives at:** `.avel/sprint-current/dispatches/{NNN}-{from}-to-{to}.md`

**Lifecycle:**
- `pending-activation` — issued, waiting for receiving agent to read
- `active` — receiving agent has accepted and is working
- `completed` — receiving agent has finished and produced a completion report
- `rejected` — receiving agent refused; sender must resolve and reissue
- `superseded` — replaced by a revision dispatch

**Frontmatter:**
```yaml
---
dispatch_id: 002
dispatch_type: agent-activation
from_agent: helm
to_agent: north
sprint: dashboard-rebuild
wave: 2
status: pending-activation
created: 2026-06-15T10:30:00Z
time_budget_hours: 12
refs:
  - trace-001
  - trace-003
  - phase-zero-summary-2026-06-14
supersedes: null
---
```

**Body structure:**

```markdown
# Dispatch 002: Helm → North

## Activation Message

[One paragraph in Helm's voice. Direct, brief, specific.]

"North, you're now leading Wave 2 for dashboard-rebuild. The sprint plan
is in .avel/sprint-current.md. The frontend execution traces are at
.avel/sprint-current/wave-2-traces.md. Begin by reading those, then
activate Forge with the component specs."

## Required Context

The receiving agent MUST read all of the following before starting work:

- `.avel/project.md`
- `.avel/overrides.md`
- `.avel/sprint-current.md`
- `.avel/sprint-current/wave-2-traces.md`
- avel-standards skill (auto-loaded)
- north skill (this skill loading itself)

## Inputs

- API contract requirements: [path or inline]
- Design tokens decision: [path or inline]
- Component library inventory needed: [yes — full inventory at Wave 2 close]
- Auth pattern: per Phase Zero ADR at `.avel/decisions/adr-002-auth-pattern.md`

## Expected Output

- Wave 2 completion report at `.avel/sprint-current/completions/{NNN}-north-wave-2.md`
- API contract document at `.avel/sprint-current/api-contract.md`
- Component library inventory at `.avel/sprint-current/components-built.md`
- Accessibility report at `.avel/sprint-current/accessibility-report.md`
- Performance report at `.avel/sprint-current/performance-report.md`

## Sequence

After completing this activation, hand off to:
- Next agent: anchor
- Via dispatch: numbered next in sequence

## Constraints

- WCAG 2.1 AA required (no exceptions for this client)
- Core Web Vitals targets: LCP ≤ 2.0s (tighter than default — client requirement)
- Component library: use avel-design-system v3.2.0 (locked in Phase Zero)
- Time budget: 12 hours of work (estimate, not commitment)

## Blocking Conditions

If any of these are true, do NOT proceed. Raise as a flag:

- Design tokens decision is incomplete or contradictory
- API contract requirements unclear
- Phase Zero auth ADR not finalized

## Self-Test Prompts

Before starting, the receiving agent should be able to answer:

1. What's the first agent you'll activate, and with what inputs?
2. What's the most likely point of failure in this wave?
3. What does Wave 2 success look like, in one sentence?

If you can't answer these, raise for clarification before accepting.

## Escape Hatch Instructions

- If a component spec is ambiguous, defer to Atlas-pattern defaults from
  knowledge bank, document the deviation in the completion report
- If accessibility audit reveals 5+ critical findings, pause and flag — do
  not push through with cosmetic remediation

---

## Handshake

(Filled in by receiving agent as work progresses)

### Acceptance

[Appended by receiving agent after reading dispatch]
Status: active
Accepted by: north
Accepted at: 2026-06-15T10:45:00Z
Note: Beginning with Forge activation for token decisions.

### Completion

[Appended by receiving agent at end of work]
Status: completed
Completed by: north
Completed at: 2026-06-18T16:20:00Z
Completion report: .avel/sprint-current/completions/004-north-wave-2.md
```

---

### 2. Completion Report

A completion report is evidence of work done. Produced by every agent at the end of every activation. Read by the LEAD before the next dispatch is authorized.

**Lives at:** `.avel/sprint-current/completions/{NNN}-{agent}-{wave-or-task}.md`

**Lifecycle:**
- `draft` — agent is writing it
- `submitted` — agent declared done; awaiting LEAD review
- `accepted` — LEAD reviewed and approved
- `returned` — LEAD identified gaps; agent must address

**Frontmatter:**
```yaml
---
completion_id: 004
agent: north
sprint: dashboard-rebuild
wave: 2
dispatch_ref: 002
status: submitted
submitted_at: 2026-06-18T16:20:00Z
time_actual_hours: 14.5
time_budget_hours: 12
overrun_reason: "Auth pattern ADR required mid-wave revision adding ~2h"
---
```

**Body structure:**

```markdown
# Completion 004: North — Wave 2 Frontend

## Summary

[One paragraph. What got done. Plain English.]

Wave 2 complete. Five agents activated and signed off. Dashboard UI
implemented end-to-end with mocked API responses. Component library
extended with two new primitives (UserCard, MetricTile). WCAG 2.1 AA
audit passed with one documented exception. Core Web Vitals met all
targets on staging build.

## Agent Outcomes

| Agent | Status | Notes |
|---|---|---|
| Forge | COMPLETE | Tokens + 2 new primitives, design library version pinned |
| Pulse | COMPLETE | All routes, forms, states implemented |
| Echo | COMPLETE | WCAG AA: PASS with 1 exception (documented) |
| Swift | COMPLETE | All Core Web Vitals targets met |

## Definition of Done — Verification

[Checklist from the agent's SKILL.md, every box checked or explicitly N/A]

- [x] All routes implemented and renderable
- [x] Component library inventory documented at [path]
- [x] WCAG 2.1 AA report: PASS or PASS WITH DOCUMENTED EXCEPTIONS
- [x] Core Web Vitals: LCP 1.8s, CLS 0.04, INP 142ms
- [x] API contract produced at [path]
- [x] Auth context implementation matches Phase Zero ADR
- [x] SEO meta tags on public pages (N/A — internal dashboard)
- [x] Error boundaries on every route
- [x] Analytics events instrumented per project taxonomy

## Self-Verification Output

[Actual output of verification scripts and checks, not paraphrase]

```
$ npm run lint
✓ No errors, no warnings

$ npm run test
✓ 47 tests passing

$ npx playwright test
✓ 23 E2E scenarios passing against staging

$ python ~/.avel/skills/swift/scripts/run-lighthouse.py https://staging.example.com
Performance: 96
Accessibility: 100
Best Practices: 100
SEO: 100
LCP: 1.8s
CLS: 0.04
INP: 142ms
```

## What Got Built

- Dashboard route (`/dashboard`) with widget grid
- User profile route (`/profile`) with edit form
- Settings route (`/settings`) with section navigation
- Two new components: UserCard, MetricTile
- Auth context with session refresh logic
- Error boundaries at app and route level
- Analytics instrumentation on 7 key user actions

## What Did Not Get Built

[Anything in scope that didn't ship, with reason]

- Real-time updates on dashboard widgets (deferred — see flag 001)

## Knowledge Bank Candidates

[Things from this work that should be considered for the bank]

- [ ] **Pattern:** MetricTile with sparkline composition
- [ ] **Anti-pattern:** useState for server-fetched data — Pulse caught this early
- [ ] **ADR candidate:** Component memoization strategy (decided ad-hoc; document for next sprint)

## Open Issues / Carry-Forward

- Real-time dashboard updates (flag 001, deferred to v2)
- Analytics consent banner copy needs client review

## Handoff Package

[What goes to the next wave]

For Anchor (Wave 3 Backend):
- API contract: `.avel/sprint-current/api-contract.md`
- Auth pattern: `.avel/decisions/adr-002-auth-pattern.md`
- Component data shape requirements: `.avel/sprint-current/data-shapes.md`

---

## LEAD Sign-Off

[Filled in by LEAD reviewing this completion]

Status: accepted
Reviewed by: helm
Reviewed at: 2026-06-18T17:00:00Z
Next dispatch: 005-helm-to-anchor

Notes: Clean wave. Auth pattern adjustment surfaced and absorbed well.
Carry-forward items recorded.
```

---

### 3. Flag

A flag is a cross-team or cross-wave signal that something needs attention. Any agent can raise one. Helm decides routing and resolution.

**Lives at:** `.avel/sprint-current/flags/{NNN}-{from}-{topic}.md`

**Lifecycle:**
- `open` — raised, awaiting review
- `acknowledged` — Helm or LEAD has seen it; routing decided
- `in-progress` — being addressed
- `resolved` — closed with resolution
- `deferred` — pushed to carry-forward for next sprint

**Frontmatter:**
```yaml
---
flag_id: 001
flag_type: cross-team-issue
raised_by: pulse
raised_at: 2026-06-15T14:30:00Z
affects: backend-team (anchor)
severity: high
status: open
sprint: dashboard-rebuild
wave: 2
---
```

**Severity levels:**

| Level | Definition | Response time |
|---|---|---|
| **critical** | Blocks current wave from continuing | Helm reviews within 1 hour |
| **high** | Affects another team's work plan | Helm reviews within 4 hours |
| **medium** | Surfaces for visibility, doesn't change plans | Helm reviews at next wave close |
| **low** | Informational, may inform future sprints | Surfaces in retrospective |

**Body structure:**

```markdown
# Flag 001: API contract requires unsupported feature

## What

The dashboard requires real-time widget updates. The API contract specifies
polling every 30 seconds. The client during demo asked "can these update
live?" Polling fallback works but the UX feels stale.

WebSocket support is not in current scope. Adding it expands Wave 3 by
~8 hours and requires a deployment infrastructure change (sticky sessions
or pub/sub broker).

## Impact

**Wave 2:** Can complete with polling fallback. UX is degraded but
functional.

**Wave 3:** Anchor needs to decide — add WebSocket support (scope change,
client decision needed) or accept polling for v1.

**Wave 4:** Beacon's monitoring needs to account for WebSocket connection
metrics if added.

## Recommendation

Raise change request to client:
- Polling for v1.0 (ships in current sprint)
- WebSocket for v1.1 (next sprint or follow-on engagement)

This keeps current sprint on time and gives client a clear upgrade path.

## Resolution

[Filled in by Helm or affecting LEAD when resolved]

Status: resolved
Resolved by: helm
Resolved at: 2026-06-15T16:00:00Z
Decision: Polling for v1. Change request CR-003 raised to client for
WebSocket support in next sprint. Pulse continues with polling
implementation. Wave 3 plan unchanged.
```

---

### 4. Rejection

A rejection is the refusal of a dispatch. Rare but necessary. Written by the receiving agent when they cannot accept the dispatch as written.

**Lives at:** the same dispatch document, in a `## Rejection` section appended below `## Handshake`.

**Updates dispatch status to:** `rejected`

**Frontmatter on the original dispatch updates to:**
```yaml
status: rejected
rejected_at: 2026-06-15T11:15:00Z
rejected_by: north
```

**Rejection section structure:**

```markdown
---

## Rejection

Status: rejected
Rejected by: north
Rejected at: 2026-06-15T11:15:00Z

### Reason

[Specific, factual. What's missing or wrong about the dispatch.]

Design tokens decision is referenced as "see project ADRs" but the Phase
Zero ADR on tokens has not been finalized — the ADR file exists but is
marked status: draft, not accepted. Forge cannot start without finalized
tokens, and starting with placeholder tokens means rework when the real
decision lands.

### What's Needed To Reissue

- Finalize ADR on design tokens (currently draft at .avel/decisions/adr-001-tokens.md)
- Confirm component library version pin (3.2.0 vs latest 3.4.0)
- Clarify whether dark mode is in scope for this sprint

### Recommendation

Helm completes the ADR (10-min decision), confirms version pin, addresses
dark mode scope. Then reissue dispatch as 002a.
```

The sender must address the rejection, then issue a revision dispatch (`002a`) that supersedes the original (`002`).

---

## Sequential Numbering — The Numbering Convention

Every document type has its own sequential number within a sprint. Numbers don't reset across waves.

```
.avel/sprint-current/
├── dispatches/
│   ├── 001-helm-to-helm-phase-zero-close.md     # Phase Zero handoff to Wave 1
│   ├── 002-helm-to-north-wave-2.md
│   ├── 003-north-to-forge-tokens-and-components.md
│   ├── 004-north-to-pulse-routes-and-features.md
│   ├── 005-north-to-echo-accessibility-audit.md
│   ├── 005a-north-to-swift-performance-audit.md  # parallel with echo
│   └── 006-helm-to-anchor-wave-3.md
├── completions/
│   ├── 001-helm-phase-zero-summary.md
│   ├── 002-forge-tokens-components.md
│   ├── 003-pulse-routes-features.md
│   └── ...
├── flags/
│   ├── 001-pulse-api-contract-realtime.md
│   └── 002-warden-dependency-vulnerability.md
└── rejections/
    └── (none — rejections live inside the rejected dispatch)
```

### Why sequential numbering matters

- **Read in order.** Numbered files in a directory display in execution order. You can read 001 through 010 and see the sprint unfold.
- **Reference unambiguously.** "Dispatch 003 was blocked by Flag 001" is precise. No date confusion.
- **Tooling-ready.** Future CLI or dashboard parses these easily.
- **Grep-friendly.** `ls dispatches/ | head -5` shows the first five activations.

### Parallel work — letter suffixes

When Helm or a LEAD authorizes parallel agent activation, the parallel dispatches get the same number with letter suffixes:

```
005-north-to-echo-accessibility-audit.md
005a-north-to-swift-performance-audit.md
```

Both are "round 005" of dispatches. The LEAD waits for both to return completion reports before issuing 006.

### Revisions

Revisions to a dispatch get letter suffixes too, but on the *next available number* if the original is rejected:

- Original dispatch: `002-helm-to-north-wave-2.md` → rejected
- Revision: `002a-helm-to-north-wave-2-revision.md` → supersedes 002

The original stays in the directory marked rejected. The revision is the active document.

---

## The Three-Step Handshake

Every dispatch follows the same handshake. The handshake is written *inside the dispatch document itself*, not in separate files.

### Step 1: Dispatch issued

Helm or LEAD writes the dispatch file. Frontmatter status: `pending-activation`. The dispatch sits in `.avel/sprint-current/dispatches/` waiting to be read.

### Step 2: Acceptance or rejection

Receiving agent reads the dispatch. Within their first response, they update the dispatch document:

**Acceptance — one line appended:**

```markdown
## Handshake

### Acceptance
Status: active
Accepted by: north
Accepted at: 2026-06-15T10:45:00Z
Note: Beginning with Forge activation for token decisions.
```

The dispatch's frontmatter status updates to `active`.

**Rejection — full rejection section appended (see Rejection above).**

The dispatch's frontmatter status updates to `rejected`.

### Step 3: Completion

Receiving agent finishes work. Writes a separate completion report. Then appends to the dispatch:

```markdown
### Completion
Status: completed
Completed by: north
Completed at: 2026-06-18T16:20:00Z
Completion report: .avel/sprint-current/completions/004-north-wave-2.md
```

The dispatch's frontmatter status updates to `completed`.

### Why a single document, not three files

The handshake belongs with the dispatch because it's *about* the dispatch. Splitting it into separate files fragments the audit trail. One file, one lifecycle, fully self-contained.

---

## Time Budgets

Every dispatch includes a `time_budget_hours` estimate. Every completion includes `time_actual_hours`.

**The point is signal, not commitment.** If a wave estimated at 12 hours takes 11, that's normal variation. If it takes 24, something happened that's worth recording.

**Completion reports require an `overrun_reason` field if actual >= 1.5× budget.** Forces a brief explanation. Examples:

```yaml
time_actual_hours: 14.5
time_budget_hours: 12
overrun_reason: null  # within tolerance
```

```yaml
time_actual_hours: 22
time_budget_hours: 12
overrun_reason: "Auth pattern ADR required mid-wave revision adding ~6h. Phase Zero ADR was insufficient on CSRF strategy."
```

Over time, these accumulate into knowledge bank patterns: "Auth-pattern decisions are consistently underestimated by 50%."

---

## How Documents Flow Through A Sprint

Concrete example. The full sprint dashboard-rebuild:

### Phase Zero (Helm only)

```
dispatches/001-helm-to-helm-phase-zero-close.md   (status: completed)
completions/001-helm-phase-zero-summary.md
```

Phase Zero is Helm dispatching to Helm — formally, the close of Phase Zero authorizes Wave 1. Same handshake structure.

### Wave 1 (Helm planning)

```
dispatches/002-helm-to-helm-wave-1-planning.md    (status: completed)
completions/002-helm-wave-1-plan.md
```

Wave 1 is also Helm dispatching to Helm. Wave 1's output is the sprint plan and execution traces.

### Wave 2 (Frontend)

Wave 2 starts when Helm dispatches to North:

```
dispatches/
├── 003-helm-to-north-wave-2.md                   (status: completed)
└── (North then dispatches the frontend team)

dispatches/
├── 004-north-to-forge.md                         (status: completed)
├── 005-north-to-pulse.md                         (status: completed)
├── 006-north-to-echo.md                          (status: completed)
└── 006a-north-to-swift.md                        (status: completed, parallel with echo)

completions/
├── 003-north-wave-2-summary.md                   (reads 004-006a completions)
├── 004-forge-tokens-and-components.md
├── 005-pulse-routes-and-features.md
├── 006-echo-accessibility-audit.md
└── 006a-swift-performance-audit.md

flags/
└── 001-pulse-api-contract-realtime.md            (resolved)
```

### Waves 3 and 4 follow the same pattern

### Sprint close

```
dispatches/
└── 020-verdict-to-helm-sprint-ready-to-close.md  (status: completed)

completions/
├── 020-verdict-sprint-ship-decision.md
└── 021-helm-sprint-close.md
```

The full sprint produces ~20-30 dispatches, ~20-30 completions, and a small number of flags (typically 3-8 per sprint).

---

## What Each Voice Sounds Like In A Document

The Voice section in each agent's SKILL.md governs how their text reads. Reminders specific to handoff documents:

### Helm in dispatches

Direct. Strategic. One paragraph activation messages.

> "North, you're now leading Wave 2 for dashboard-rebuild. Sprint plan is in `.avel/sprint-current.md`. Frontend traces at `.avel/sprint-current/wave-2-traces.md`. Begin with Forge for token decisions."

Not:

> "Hello North, I'm pleased to announce that we are now ready to begin Wave 2 of our sprint. As Frontend LEAD, you'll be responsible for coordinating the team..."

### LEADs (North, Anchor, Verdict) in dispatches

Brief. Specific. Sound like a senior engineer giving direction.

> "Forge — tokens first, then UserCard and MetricTile components. Design library v3.2.0. Both components need keyboard support. Ship to Pulse when done."

### Specialists in completion reports

Evidentiary. Numbers and output, not adjectives.

Pulse:
> "All 7 routes render. All 4 forms submit. Loading/error/empty states verified on every async call. Test output below."

Not:
> "I successfully implemented all the required routes and forms with comprehensive state management."

Warden in completion reports:
> "OWASP audit: PASS. Zero critical findings. Two medium findings documented in security report at [path]. Dependency scan: clean of criticals."

### Flags

Factual. No editorializing. Recommendation is concrete.

Good:
> "Dashboard requires real-time updates. API contract specifies polling. WebSocket not in scope. Recommend: polling for v1, WebSocket as v2 follow-on."

Not:
> "Hey team — found an issue with the dashboard. Real-time updates would be nice but I'm not sure if we have time. What do you think?"

### Rejections

Specific. Factual. No blame.

Good:
> "Cannot accept. Design tokens ADR is in draft status at `.avel/decisions/adr-001-tokens.md`. Component library version pin not specified. Reissue with finalized ADR."

Not:
> "I'd love to start this work but unfortunately the dispatch isn't quite complete. Can we maybe get a few more details before I jump in?"

---

## Solo-Mode Concessions

The full handshake is the canonical protocol. In solo Avel use (one human running the system), some friction can be eased:

### Acceptable solo concessions

- **Acceptance is implicit** when the receiving agent's first commit references the dispatch ID. The git commit itself becomes the acceptance signal. The dispatch's status updates to `active` automatically (in tooling) or with one line of edit.
- **Self-test prompts can be answered mentally** rather than written down for trivial dispatches.
- **Time budgets can be loose estimates** for sprints under 20 hours total.
- **Knowledge bank candidates** in completion reports can be brief one-liners; full pattern docs come later in retrospective.

### What stays mandatory even solo

- **Sequential numbering** — non-negotiable; this is what makes the audit trail work
- **Status frontmatter** — non-negotiable; parseable state matters
- **Rejection protocol** — when something's wrong, write it down; do not silently "fix" the dispatch
- **Flags for cross-team issues** — even talking to yourself, write the flag down
- **Completion reports with verification output** — actual output, not "tests passed"
- **Voice consistency** — every document sounds like the agent that wrote it

The protocol's value is the audit trail. Skipping the protocol erases the audit trail. The concessions above reduce friction without erasing trail.

---

## Decisions Locked

| Decision | Choice |
|---|---|
| Document types | Four — dispatch, completion, flag, rejection |
| Handshake steps | Three — issued, accepted/rejected, completed |
| Numbering | Sequential per sprint, letter suffixes for parallel |
| Storage | `.avel/sprint-current/{dispatches,completions,flags}/` then archived to `.avel/sprints/{name}/` at close |
| Status tracking | YAML frontmatter, parseable |
| Severity levels | Four — critical, high, medium, low |
| Time budgets | Required in dispatches; required overrun explanation if actual ≥ 1.5× budget |
| Rejection mechanism | Appended to dispatch, status updates, revision dispatch supersedes |
| Solo concessions | Documented; don't erase the audit trail |
| Voice in documents | Each agent's voice per SKILL.md; universal rules per `avel-standards` |

---

## What This Doesn't Cover

- **CLI tooling to manage dispatches** — deferred. Initially, dispatches are created by Claude when an agent is activated, then refined by the founder. CLI comes later.
- **Automatic dispatch generation** — Helm produces dispatches from the sprint plan. Eventually, scripts auto-generate skeletons. Manual writing for v1.
- **Cross-sprint dispatches** — dispatches don't carry across sprints. Carry-forward items become inputs to the next sprint's Phase Zero.
- **Multi-repo dispatches** — if a sprint touches multiple repos, dispatches live in the primary repo and reference the others. Multi-repo coordination is Enterprise-tier scope.

---

## The Honest Read

This is the most protocol-heavy part of the entire Avel system. There's no way around it — when skills can't invoke each other, the documents are the API.

The protocol pays off in three ways:

1. **You can pause and resume.** Sprint paused at Wave 2? Read the latest completion. Resume from there. No state loss.
2. **You can audit.** Six months later, why did the sprint shape that way? Read the dispatches in order.
3. **You can scale.** A contractor joins. They read the protocol once, then read recent sprint dispatches to learn the pattern. The protocol is the onboarding doc.

The cost is real: every handoff adds 5-10 minutes of structured writing. For a 20-handoff sprint, that's 2-3 hours of overhead.

That overhead is also the audit trail. The case study library. The knowledge bank's raw material. Avel gets compounding returns from disciplined handoffs that no other agency can match.

This is what "Built with intent" looks like internally.
