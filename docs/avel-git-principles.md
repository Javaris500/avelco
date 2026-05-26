# Avel Git Principles

> How Avel uses git across every client sprint.
> One workflow, applied consistently. Every agent commits the same way. Every wave branches the same way. Every sprint closes the same way.
> Internal document. Last updated: May 24, 2026.

---

## TL;DR

- **Branch per wave, not per agent.** 4 branches per sprint, not 18.
- **Commit messages carry agent attribution** via prefix; commit author is the founder.
- **Tag every sprint at close.** Tag every production release separately.
- **Worktrees enable parallel work** when sprints scale beyond solo execution.
- **Git history is the audit trail.** Treat it like documentation.

---

## Why Git Discipline Matters For Avel

The agent system produces structured outputs (dispatches, completion reports, deliverables). Git carries the *execution* — what actually got built, when, by which agent, in which wave. Without disciplined git, the agent system has no permanent record of the real work.

Disciplined git also makes the system *recoverable*. A sprint that goes sideways at Wave 3 can roll back to the Wave 2 merge point without losing earlier work. A bug discovered three sprints later can be traced to the exact commit that introduced it, the exact agent who made it, the exact dispatch that authorized it.

This is not bureaucracy. It is how a solo founder running 18 agents avoids losing their mind.

---

## Branch Strategy

### One branch per wave, not per agent

The original framework implied a feature branch per agent. With 18 agents, that's 18 branches per sprint even when only 4-5 activate. Heavy without payoff.

Avel uses **branch per wave**. Multiple agents commit to the same wave branch in sequence. Attribution lives in commit messages, not branch names.

```
main
├── sprint/dashboard-rebuild/wave-1-planning
├── sprint/dashboard-rebuild/wave-2-frontend
├── sprint/dashboard-rebuild/wave-3-backend
├── sprint/dashboard-rebuild/wave-4-quality
└── sprint/dashboard-rebuild/integration
```

When a wave closes, the LEAD merges the wave branch into `sprint/{sprint-name}/integration`. When the sprint closes and Verdict signs off, integration merges to main.

### Why this works

- **4 branches per sprint instead of 18.** Tractable for solo execution.
- **Wave-level revert.** If Wave 3 needs to redo, revert the wave merge. Earlier work stays intact.
- **Sprint-level cleanup.** All sprint branches share a parent prefix. `git branch -D sprint/dashboard-rebuild/*` archives the whole sprint after merge.
- **Easy review.** Integration branch is the one place to scan everything before final merge to main.

### Branch naming convention

Pattern: `sprint/{kebab-case-sprint-name}/{wave-id}`

Examples:
- `sprint/dashboard-rebuild/wave-1-planning`
- `sprint/acme-onboarding/wave-2-frontend`
- `sprint/migrate-stripe/integration`

Reserved branch names:
- `main` — production. Only Verdict-approved sprint integrations merge here.
- `staging` — for projects that maintain a long-lived staging environment
- `sprint/*/integration` — the per-sprint integration branch

Phase Zero work happens on `phase-zero/{sprint-name}` branches that merge to main after operator approval. Wave 1 begins after that merge.

---

## Commit Messages

### Standardized format

Every commit follows this format:

```
{type}({agent}): {summary}

{body if needed}

Sprint: {sprint-name}
Wave: {N}
Refs: {dispatch-id or trace-id}
```

### Type prefixes

Standard Conventional Commits types, applied per Avel context:

| Type | When |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes nor adds — restructuring |
| `docs` | Documentation only |
| `test` | Test additions or fixes |
| `perf` | Performance improvement |
| `style` | Code style only (formatting, no logic change) |
| `chore` | Build, dependencies, config, tooling |
| `dispatch` | Helm's dispatch documents and planning artifacts |
| `verify` | Self-verification output, gate check results |

### Agent attribution

The `{agent}` slot carries the lowercase skill name: `helm`, `north`, `forge`, `pulse`, `echo`, `swift`, `anchor`, `vault`, `gate`, `relay`, `bridge`, `verdict`, `proof`, `warden`, `launch`, `beacon`, `red-team`, `lead`.

When work is operator-driven outside the sprint flow (bug fix, ad-hoc change), use `op` as the attribution:

```
fix(op): correct typo in landing page
```

### Examples

```
feat(forge): add UserCard component with selected/interactive variants

UserCard now supports an onClick handler that makes the whole card
interactive with keyboard support and aria-pressed for selected state.

Sprint: dashboard-rebuild
Wave: 2
Refs: dispatch-north-to-forge-001
```

```
fix(vault): correct down migration for subscriptions table

The down migration was missing the index drop, leaving orphan indexes
on rollback. Added DROP INDEX statements before DROP TABLE.

Sprint: dashboard-rebuild
Wave: 3
Refs: trace-subscription-migration-002
```

```
verify(proof): E2E test suite passes, zero P0/P1 failures

All 47 tests pass against staging deployment. Coverage of core flows
at 94%. Screenshots and videos archived in CI.

Sprint: dashboard-rebuild
Wave: 4
Refs: dispatch-verdict-to-proof-001
```

```
dispatch(helm): activate Wave 2 frontend team

Wave 2 dispatched to North. API contract requirements detailed in
.avel/sprint-current/wave-2-traces.md.

Sprint: dashboard-rebuild
Wave: 2
Refs: phase-zero-summary-2026-06-15
```

### What this enables

- `git log --grep "agent:vault"` — every commit Vault made across all sprints
- `git log --grep "Sprint: dashboard-rebuild"` — full execution of one sprint
- `git log --grep "Refs: dispatch-"` — every commit tied to a dispatch
- Automatic changelog generation from commit history
- Per-agent grading at sprint close uses commit count and quality as one signal

### What this is not

- Not Conventional Commits dogma — we adapt the convention to our needs
- Not enforced by hooks initially — discipline, not tooling, in solo use
- Not a substitute for completion reports — commits log *what changed*, reports log *why and how verified*

---

## Authorship

### Commit author is always the founder

Don't fight git for theatrical agent identity. The commit author at the OS level is the human pushing the work. Attribution to agents lives in the commit message prefix.

```
$ git log --format="%an %s" -1
Javaris Tavel feat(forge): add UserCard component
```

The `feat(forge):` prefix tells the audit trail that Forge did the design and implementation. Javaris committed it.

This matters because:

- It's honest. A human approved every commit.
- It avoids the maintenance overhead of impersonating agents at the git level.
- It keeps git tooling (signing, blame, attribution to GitHub) clean.

### Co-authored-by for collaborative work

When two agents collaborate on a single commit (rare but happens — e.g., Pulse and Forge jointly resolved a component prop interface), use git's `Co-Authored-By` trailer:

```
feat(pulse): wire dashboard route to UserCard component

Sprint: dashboard-rebuild
Wave: 2
Refs: dispatch-north-to-pulse-003

Co-Authored-By: Forge <forge@avel.internal>
```

This is the closest git gets to multi-agent attribution. Don't overuse it.

---

## Tags

### Sprint close tags

Every closed sprint gets tagged. Pattern: `sprint/{sprint-name}/closed-{YYYY-MM-DD}`.

```
sprint/dashboard-rebuild/closed-2026-06-22
sprint/acme-onboarding/closed-2026-07-15
```

Tagged at the integration → main merge commit. Marks the point at which Verdict signed off and the sprint became history.

### Release tags

Production releases use semver: `v1.0.0`, `v1.1.0`, `v1.0.1`.

Tagged at the commit deployed to production. One sprint may produce multiple releases (deploy mid-sprint for a fix, deploy at sprint close for the main feature). One release may span multiple sprints (release notes accumulate across sprints).

```
v1.0.0  ← first production release
v1.1.0  ← second feature release, end of sprint 2
v1.1.1  ← hotfix mid-sprint 3
v1.2.0  ← third feature release, end of sprint 3
```

### Phase Zero tags

When Phase Zero closes for a new sprint, tag the merge to main: `phase-zero/{sprint-name}/closed-{YYYY-MM-DD}`. Marks the point where the sprint plan was approved and Wave 1 began.

### Tag annotations

Use `git tag -a` (annotated tags) for sprint and release tags. Tag messages include the sprint completion summary or release notes.

```
$ git tag -a sprint/dashboard-rebuild/closed-2026-06-22 -m "$(cat sprint-summary.md)"
```

This embeds the sprint summary in the git history. Future audit reads tag messages, sees what shipped.

---

## Merge Strategy

### Within a wave: fast-forward

Multiple agents committing to a wave branch happens in sequence. Fast-forward merges, no merge commits needed. The wave branch's git log reads as a single linear sequence of agent contributions.

```
$ git checkout sprint/dashboard-rebuild/wave-2-frontend
$ git pull --ff-only
```

### Wave to integration: merge commit

When a wave closes, the LEAD merges to integration with an explicit merge commit. The merge commit captures the wave-close moment.

```
$ git checkout sprint/dashboard-rebuild/integration
$ git merge --no-ff sprint/dashboard-rebuild/wave-2-frontend -m "merge(north): Wave 2 frontend closed

Wave 2 complete. WCAG AA pass. Core Web Vitals green.
API contract documented. Component library inventoried.

Sprint: dashboard-rebuild
Wave: 2
Refs: wave-2-completion-report.md"
```

The `--no-ff` flag forces a merge commit even when fast-forward is possible. This preserves the wave-close as a visible moment in history.

### Integration to main: merge commit, then tag

Sprint close. Verdict signs off. Integration merges to main with a merge commit. Then the sprint tag is applied at that merge commit.

```
$ git checkout main
$ git merge --no-ff sprint/dashboard-rebuild/integration -m "merge(verdict): Sprint dashboard-rebuild closed

All gates pass. Deployed to production at v1.1.0.

Sprint: dashboard-rebuild
Refs: sprint-completion-report.md"

$ git tag -a sprint/dashboard-rebuild/closed-2026-06-22 -m "$(cat sprint-summary.md)"
$ git tag -a v1.1.0 -m "$(cat release-notes-1.1.0.md)"

$ git push origin main --tags
```

### Rebase vs merge

Inside a wave, commits are linear (no rebase needed — fast-forward applies). Wave-to-integration and integration-to-main use merge commits. **No rebasing of shared branches.** Once a commit is on a shared branch, it's permanent.

Local cleanup before pushing is fine. Interactive rebase on a personal branch before opening a PR is fine. Rewriting history on shared branches is not fine.

---

## Worktrees For Parallel Work

Git worktrees let you have multiple branches checked out simultaneously in different directories. Solo Avel doesn't need this initially. Designing for it now means the system scales.

### When worktrees become useful

- Running two agents in parallel within a wave (where their territories don't overlap)
- Hot-fixing main while Wave 2 work continues
- Comparing sprint branches side-by-side without stashing
- Eventually: a contractor working in their own worktree without disrupting your active work

### Pattern

```
/Users/javaris/projects/acme-client/        ← main worktree, integration branch
/Users/javaris/projects/acme-client-w2/     ← worktree for sprint/acme/wave-2-frontend
/Users/javaris/projects/acme-client-w3/     ← worktree for sprint/acme/wave-3-backend
```

Each worktree is a real working copy of a different branch. Agents working in different worktrees don't see each other's uncommitted changes.

```
$ git worktree add ../acme-client-w2 sprint/acme/wave-2-frontend
$ git worktree add ../acme-client-w3 sprint/acme/wave-3-backend
```

When wave closes, remove the worktree:

```
$ git worktree remove ../acme-client-w2
```

### Worktrees + Skills

This matters for the Skills bundle. Skills installed globally work the same regardless of which worktree is active. The `.avel/` directory in each worktree carries that worktree's sprint state. Multiple sprints can run in parallel without state collision.

---

## .gitignore Conventions

The `.avel/` directory inside the client repo is **committed**. It's the framework's footprint in the project. Sprint plans, dispatches, completion reports, ADRs — all committed.

What's NOT committed:

```
# .avel/.gitignore
.avel/sprint-current/scratch/      # agent scratch space, ephemeral
.avel/cache/                        # any cached lookups or generated content
.avel/*.tmp                         # any temp file
```

What IS committed:

```
.avel/project.md
.avel/overrides.md
.avel/sprint-current.md
.avel/sprints/                      # historical sprints
.avel/decisions/                    # ADRs
.avel/dispatches/                   # current and historical dispatches
```

The sprint history is part of the codebase's story. It travels with the repo.

---

## Repository Hygiene

### Branch cleanup after sprint close

Once a sprint's integration branch merges to main and the sprint tag is applied, the wave branches are no longer needed for active work. Delete locally; keep tags.

```
$ git branch -D sprint/dashboard-rebuild/wave-1-planning
$ git branch -D sprint/dashboard-rebuild/wave-2-frontend
$ git branch -D sprint/dashboard-rebuild/wave-3-backend
$ git branch -D sprint/dashboard-rebuild/wave-4-quality
$ git branch -D sprint/dashboard-rebuild/integration
$ git push origin --delete sprint/dashboard-rebuild/wave-1-planning
# (repeat for each)
```

Tags persist. History persists. Branches are temporary scaffolding.

### Stale branches policy

A sprint branch older than 30 days that hasn't merged should either:

- Be merged (sprint resumed and completed)
- Be tagged and deleted (sprint aborted, captured for reference)
- Have its status documented in `.avel/sprints/{sprint-name}/aborted.md`

No branch lingers indefinitely without explanation.

### Force-push policy

Never force-push to `main`. Never force-push to `sprint/*/integration`. Never force-push to any shared branch.

Force-push allowed only on:

- Personal pre-push branches (`hotfix/{name}` before opening a PR)
- Phase Zero branches before operator approval (`phase-zero/{sprint-name}` is private to Helm until merged)

When force-push happens, document it. A note in the commit message of the next commit on the force-pushed branch: "Note: previous commit history rewritten — added missing license headers."

---

## Sprint-Level Git Workflow

The full sequence per sprint, with git operations called out.

### Phase Zero

```
$ git checkout main
$ git pull
$ git checkout -b phase-zero/dashboard-rebuild

# Helm runs intake, writes sprint brief, decides architecture, bootstraps repo
$ git commit -m "dispatch(helm): Phase Zero — sprint brief

Sprint: dashboard-rebuild
Refs: phase-zero-intake-2026-06-14"

# Operator approves
$ git checkout main
$ git merge --no-ff phase-zero/dashboard-rebuild
$ git tag -a phase-zero/dashboard-rebuild/closed-2026-06-14 \
    -m "Phase Zero approved. Wave 1 activated."
$ git branch -D phase-zero/dashboard-rebuild
```

### Wave 1 (Planning)

```
$ git checkout -b sprint/dashboard-rebuild/wave-1-planning

# Helm reads codebase, writes execution traces, generates dispatch
$ git commit -m "dispatch(helm): Wave 1 sprint plan and execution traces

Sprint: dashboard-rebuild
Wave: 1"

# Helm dispatches Wave 2
$ git commit -m "dispatch(helm): Wave 2 activation document for North

Sprint: dashboard-rebuild
Wave: 1
Refs: dispatch-helm-to-north-001"

# Wave 1 closes
$ git checkout sprint/dashboard-rebuild/integration
$ git merge --no-ff sprint/dashboard-rebuild/wave-1-planning
```

### Wave 2 (Frontend)

```
$ git checkout -b sprint/dashboard-rebuild/wave-2-frontend

# Agents commit in sequence
$ git commit -m "feat(forge): design tokens for sprint"
$ git commit -m "feat(forge): UserCard component"
$ git commit -m "feat(pulse): dashboard route scaffolding"
$ git commit -m "feat(pulse): wire dashboard to API contract"
$ git commit -m "feat(echo): accessibility remediation — focus management on modal"
$ git commit -m "perf(swift): preload critical fonts, optimize hero image"
$ git commit -m "docs(north): Wave 2 completion report"

# Wave 2 closes
$ git checkout sprint/dashboard-rebuild/integration
$ git merge --no-ff sprint/dashboard-rebuild/wave-2-frontend -m "merge(north): Wave 2 closed"
```

### Waves 3 and 4 follow the same pattern

### Sprint close

```
$ git checkout main
$ git merge --no-ff sprint/dashboard-rebuild/integration -m "merge(verdict): Sprint closed"
$ git tag -a sprint/dashboard-rebuild/closed-2026-06-22 -m "$(cat sprint-summary.md)"
$ git tag -a v1.1.0 -m "$(cat release-notes.md)"
$ git push origin main --tags

# Cleanup
$ git branch -D sprint/dashboard-rebuild/wave-1-planning
$ git branch -D sprint/dashboard-rebuild/wave-2-frontend
$ git branch -D sprint/dashboard-rebuild/wave-3-backend
$ git branch -D sprint/dashboard-rebuild/wave-4-quality
$ git branch -D sprint/dashboard-rebuild/integration
$ git push origin --delete sprint/dashboard-rebuild/wave-1-planning
# (etc.)
```

---

## Decisions Locked

| Decision | Choice |
|---|---|
| Branch granularity | Per wave, not per agent |
| Branch naming | `sprint/{name}/{wave-id}` |
| Commit format | `{type}({agent}): {summary}` with Sprint/Wave/Refs metadata |
| Commit author | Always the founder; attribution in message prefix |
| Wave merges | `--no-ff` merge commits, never rebase shared branches |
| Sprint close | Merge to main + sprint tag + release tag |
| Tags | Sprint close, release (semver), Phase Zero close |
| Worktrees | Designed for; used as parallel work scales |
| Stale branches | 30-day policy; merged, tagged-and-deleted, or documented |
| Force push | Allowed only on personal pre-merge branches |
| `.avel/` directory | Committed (except scratch/cache/tmp) |

---

## What This Doesn't Cover

- **PR workflow / code review.** Solo Avel doesn't open PRs against itself. When contractors join, add a PR-based workflow on top of this. The branch structure already supports it.
- **GitHub Actions / CI per sprint branch.** Designed separately. CI runs on wave merges and integration merges, not every commit.
- **Submodules and monorepo tools.** Phase Zero decides this per project; not framework concern.
- **Git LFS for large binary assets.** Standard practice when needed; not Avel-specific.

---

## The Honest Read

Disciplined git is unsexy but compounds. Three sprints in, you can trace any bug to the agent who introduced it. Ten sprints in, you have a versioned record of every architectural choice. Fifty sprints in, the git log is Avel's case study library.

The discipline costs five extra seconds per commit (typing the prefix) and one extra command per wave (the `--no-ff` merge). That's it. The payoff is permanent and growing.

Treat git like the audit trail it is.
