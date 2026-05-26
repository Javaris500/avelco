# Avel Backend Skills — Coverage, Gaps, Recommendations

> Backend is where Avel's reputation lives or dies. A frontend bug is embarrassing. A backend bug leaks data, charges the wrong card, or takes the system down.
> This doc maps modern backend territory, grades our coverage, identifies gaps, and locks recommendations.
> Internal document. Last updated: May 24, 2026.

---

## TL;DR

Five backend skills cover a 10-territory backend system. Coverage is mostly strong with two real gaps and three over-merged areas that need internal restructuring.

**Decision:** Keep the 5-skill roster. Strengthen existing skills rather than adding new ones. Add explicit Phase Zero ADR items to cover gaps that are architecture decisions, not implementation work.

**Skills affected:** Anchor (expands to own performance), Vault (split internal references), Relay (equal-weight API/jobs sections), Gate (deeper authorization), Bridge (unchanged).

---

## The Full Backend Territory in 2026

A modern production backend has 10 distinct concerns:

1. **Data layer** — schema, migrations, indexes, query patterns, ORM choice
2. **Auth** — identity, sessions, tokens, password storage, OAuth, MFA, password reset
3. **Authorization** — permissions matrix, role checks, row-level security, scope enforcement
4. **API surface** — REST/GraphQL design, versioning, pagination, contract documentation
5. **Request handling** — middleware (rate limit, CORS, validation, logging, errors), handlers, services
6. **Third-party integrations** — clients, retry/circuit-breaker, webhook signature verification, idempotency
7. **Background work** — jobs, queues, scheduled tasks, idempotency, dead-letter queues, outbox pattern
8. **Caching & performance** — query optimization, caching layer, connection pooling, p99 targets
9. **Observability hooks** — structured logging, correlation IDs, metrics emission, distributed tracing prep
10. **API gateway / edge** — rate limiting at edge, request routing, TLS termination

Every Avel client project touches at least 7 of these. Most touch all 10.

---

## Current Backend Roster

After merges from earlier conversations (Core merged into Vault, Engine merged into Relay):

| Skill | Role | Wave |
|---|---|---|
| **Anchor** | Backend LEAD | 3 |
| **Vault** | Data — schema + migrations + models + repositories | 3 |
| **Gate** | Auth + authorization | 3 |
| **Relay** | Services — API handlers + background jobs | 3 |
| **Bridge** | Integration — third-party services | 3 |

---

## Coverage Map

| Territory | Current owner | Grade | Notes |
|---|---|---|---|
| Data layer | Vault | **A** | Strong fit. Core merge works. |
| Auth | Gate | **A** | Right scope. |
| Authorization | Gate | **B+** | Lumped with auth. For multi-tenant or row-level security work, deserves its own section. |
| API surface | Relay | **A−** | Strong. |
| Request handling / middleware | Relay | **B** | Inside Relay's scope but easily under-emphasized. Middleware order matters. |
| Third-party integrations | Bridge | **A** | Clear and strong. |
| Background jobs | Relay (Engine merged) | **B** | Concerning. Jobs have different failure modes than HTTP. Risk of neglect. |
| Caching & performance | **Gap** | **D** | Nobody owns p99 targets, caching strategy, connection pool tuning. |
| Observability hooks | Split | **C** | Vault → slow query logs. Relay → request logs. Beacon configures dashboards (Wave 4). No clear owner during build. |
| API gateway / edge | Launch | **C** | Launch handles deploy infra but rate-limit-at-edge-vs-in-code is an architecture decision before Launch ever activates. |

**Two real gaps:** caching/performance, and API gateway / edge architecture.

---

## Eight Principles For Backend Skills

These differ from frontend skill principles in meaningful ways:

### 1. Backend skills must be paranoid by default

Frontend skills can be optimistic. Backend skills must assume hostile input. The first line of every backend SKILL.md reminds Claude: trust nothing, validate everything, encrypt in transit and at rest, default state of every protected route is rejection.

This isn't standards-layer stuff. This is mindset. It belongs in every backend skill's preamble.

### 2. Every backend handoff includes a security checkpoint

Frontend handoffs verify contract compliance. Backend handoffs include security verification.

- Vault → Gate handoff: verify no `SELECT *` in committed code
- Gate → Relay handoff: verify all routes default to auth-required
- Relay → Bridge handoff: verify rate limiting on every public endpoint
- Bridge → Anchor handoff: verify API keys in secrets manager, webhook signatures verified

Each handoff includes a security checkpoint that the receiving agent (or Anchor) verifies before accepting.

### 3. Backend skills produce contracts, not just code

Frontend produces components and pages. Backend produces *contracts* other systems depend on.

- Vault → schema documentation + ER diagram
- Gate → permission matrix + auth flow documentation
- Relay → OpenAPI spec + middleware order documentation
- Bridge → integration spec per provider

Every backend skill's Definition of Done includes a contract artifact.

### 4. Self-verification is heavier on the backend

Frontend self-verification: "does it render, do the routes work."
Backend self-verification: "does the migration apply, does the down migration work, does auth reject invalid tokens, does rate limiting actually limit, do webhooks verify signatures."

Each backend skill's Self-Verification section runs *executable checks*, not visual ones. Backend leans heavily on the verification scripts because verification is mechanical.

### 5. Backend skills must consider dependency failure

Database might be slow. Third-party API might be down. Queue might back up. Frontend skills mostly assume backend works. Backend skills assume nothing.

Every backend skill's Common Failure Modes section includes dependency failure scenarios.

### 6. The order of construction matters

Frontend can build components in parallel with pages. Backend has strict dependency order:

```
Schema (Vault) → Auth (Gate) → API (Relay) → Integrations (Bridge)
```

Each depends on the previous. Anchor's wave coordination enforces this order more strictly than North's frontend coordination.

### 7. Backend skills produce observability hooks

Backend skills produce telemetry deliberately: structured logs with correlation IDs, metric emission points, distributed trace propagation.

Every backend skill's Definition of Done includes: structured logging at boundaries, correlation IDs propagated, metric emission points identified for Beacon.

### 8. Database-of-record discipline

The frontend can be rebuilt from scratch. The backend's database cannot. Migrations must be reversible. Data backed up before destructive operations. Soft-delete is default. Hard-delete requires explicit documentation.

Vault enforces this; every other backend skill that touches data respects it.

---

## Recommendations — How To Close The Gaps

### A. Anchor expands to own backend performance

**Problem:** Nobody owns end-to-end backend performance the way Swift owns frontend Core Web Vitals.

**Solution:** Anchor's sign-off includes performance verification, not just contract and security.

**Added to Anchor's Definition of Done:**

```markdown
- [ ] p50 latency under 100ms for read endpoints (representative load)
- [ ] p99 latency under 1s for non-batch endpoints
- [ ] Database query patterns reviewed for N+1 issues
- [ ] Connection pool size tuned for expected load
- [ ] Caching strategy documented (or explicit absence justified in ADR)
- [ ] Slow query log reviewed; queries >100ms documented or optimized
```

Anchor doesn't *implement* the performance work — Vault and Relay do. Anchor *verifies* it before sign-off. This is the right place because performance is a system property, not a single component.

**Why not a new skill?** Adding a sixth backend skill fragments responsibility. Performance crosses Vault (queries), Relay (handlers, caching), and Bridge (external call latency). One LEAD owns the gate. Implementations stay with specialists.

### B. API gateway / edge architecture becomes a Phase Zero ADR

**Problem:** Rate limiting at edge vs in-code, TLS termination, API gateway selection — these are architecture decisions that need to happen before Wave 3 starts. Currently implicit.

**Solution:** Helm's Phase Zero architecture decision step gets a new required ADR.

**New ADR template item in Phase Zero:**

```markdown
## ADR: Edge & Gateway Architecture

- Rate limiting strategy: [edge / in-code / both]
  - If edge: which gateway (Cloudflare, AWS API Gateway, etc.)
  - If in-code: which middleware (express-rate-limit, etc.)
- TLS termination point: [edge / load balancer / application]
- Request routing: [API gateway / Kubernetes ingress / Vercel rewrites / etc.]
- CORS strategy: [edge enforcement / in-code middleware / both]
- DDoS protection: [edge service / N/A]
```

Once decided, implementation splits naturally: Launch configures the edge, Relay configures in-code middleware, both reference the ADR.

**Why not a new skill?** This is one architecture decision, not an ongoing role. Lives in Phase Zero where it belongs.

### C. Vault strengthens internal structure

**Problem:** Vault carries Data territory (schema + models + queries + ORM patterns) — significant scope. Risk of becoming a kitchen sink.

**Solution:** Vault's references split by concern. SKILL.md stays focused; depth lives in references.

**Updated Vault structure:**

```
vault/
├── SKILL.md                              # ~120 lines: the gateway
└── references/
    ├── schema-patterns.md                # naming, types, NOT NULL defaults, FKs
    ├── migration-patterns.md             # reversibility, online techniques, batching
    ├── query-optimization.md             # N+1, EXPLAIN ANALYZE, index strategy
    ├── orm-patterns-drizzle.md           # stack-specific gotchas
    ├── orm-patterns-sqlc.md
    ├── orm-patterns-prisma.md
    ├── soft-delete-pattern.md            # standard approach
    └── log.md                            # Vault's learning log
```

The SKILL.md says "if working on schema, see schema-patterns. If migrating, see migration-patterns. If choosing an ORM approach, see orm-patterns-{stack}." Progressive disclosure done deliberately.

**Vault's Definition of Done additions:**

```markdown
- [ ] Schema diagram or DDL listing produced
- [ ] Every migration is reversible (down migration written and tested)
- [ ] Every foreign key has a corresponding index
- [ ] No `SELECT *` in committed code (grep verified)
- [ ] All queries parameterized (no string concatenation with user input)
- [ ] Soft delete implemented unless hard delete is documented in ADR
- [ ] Migrations tested against fresh DB AND against DB with previous schema
- [ ] Down migration tested for every migration
```

### D. Relay treats API and jobs as equal first-class concerns

**Problem:** Engine merged into Relay. Risk that jobs become an afterthought because API handlers are more visible.

**Solution:** Relay's SKILL.md has separate, equal-weight sections for API and jobs. Reference files split. Definition of Done has separate checklists.

**Updated Relay structure:**

```
relay/
├── SKILL.md                              # ~150 lines: covers BOTH API and jobs
└── references/
    ├── api-patterns.md                   # REST/GraphQL design, handler shape, services
    ├── middleware-order.md               # the canonical stack
    ├── validation-patterns.md            # boundary validation, schema validators
    ├── pagination-patterns.md            # cursor vs offset, response shape
    ├── error-handling-patterns.md        # structured errors, status codes
    ├── job-patterns.md                   # idempotency, retry, timeouts, DLQ
    ├── queue-patterns.md                 # BullMQ, Asynq, Celery — stack-specific
    ├── outbox-pattern.md                 # for jobs triggered by DB writes
    ├── scheduled-task-patterns.md        # cron, timezones, testing
    └── log.md
```

**Relay's Definition of Done splits:**

```markdown
### API work (if sprint includes API)

- [ ] All endpoints in API contract implemented
- [ ] OpenAPI spec produced and validated
- [ ] Middleware applied in canonical order
- [ ] Validation at every boundary (no raw `req.body` in handlers)
- [ ] Rate limiting on every public endpoint
- [ ] Auth on every protected route
- [ ] Pagination on every list endpoint
- [ ] Structured error responses
- [ ] Correlation IDs in all logs

### Job work (if sprint includes jobs)

- [ ] Every job has explicit timeout
- [ ] Every job has explicit retry limit
- [ ] Every job is idempotent (test confirms running twice produces same result)
- [ ] Dead-letter queue configured and monitored
- [ ] Job arguments are serializable and small (IDs, not whole objects)
- [ ] Long-running jobs report progress
- [ ] Scheduled tasks tested with manual trigger
- [ ] Outbox pattern used when job triggers from DB write
```

If a sprint has only API work, only the API checklist applies. Same for jobs-only. Both apply when both are in scope.

### E. Gate deepens authorization coverage

**Problem:** Gate owns both authentication and authorization. For simple projects this works. For multi-tenant SaaS or any project with row-level security, authorization is its own beast that gets short-changed.

**Solution:** Gate's SKILL.md has explicit authorization sections distinct from authentication. References split.

**Updated Gate structure:**

```
gate/
├── SKILL.md                              # ~130 lines
└── references/
    ├── auth-method-decisions.md          # session vs JWT vs OAuth, choosing
    ├── password-handling.md              # Argon2id, bcrypt, password reset
    ├── session-management.md             # cookies, refresh, revocation
    ├── oauth-patterns.md                 # state, PKCE, callback validation
    ├── permission-matrix-design.md       # roles, scopes, attribute-based
    ├── row-level-security.md             # Postgres RLS patterns, when to use
    ├── multi-tenant-patterns.md          # shared DB vs separate DB, isolation
    ├── mfa-patterns.md                   # TOTP, passkeys, SMS (last resort)
    └── log.md
```

**Gate's Definition of Done splits:**

```markdown
### Authentication

- [ ] Auth method chosen and documented in ADR
- [ ] Password storage uses Argon2id or bcrypt with current cost factor
- [ ] Password reset uses single-use, time-limited tokens
- [ ] Session/token expiration documented
- [ ] Rate limiting stricter than data endpoints on auth routes
- [ ] Auth errors return generic messages (no user enumeration)

### Authorization

- [ ] Permission matrix documented (every role × every action)
- [ ] Authorization checked at service layer, not handler alone
- [ ] Row-level security implemented if multi-tenant (or absence justified)
- [ ] Default state of every route is "requires auth" (public routes explicit)
- [ ] Authorization re-checked on every protected operation (no client trust)
```

### F. Bridge gets explicit dependency-failure handling

**Problem:** Bridge is well-scoped but the "what if the third party fails" scenarios are sometimes treated as edge cases when they should be defaults.

**Solution:** Bridge's Common Failure Modes section is more aggressive about hostile-world assumptions.

**Bridge's Common Failure Modes (sample):**

```markdown
## Common Failure Modes — Watch For These

### Third-party returns malformed JSON
Symptom: Parse error crashes the handler.
Catch: Wrap external response parsing in try-catch. Return structured error.

### Third-party is slow
Symptom: Handler holds open for 30+ seconds, exhausts connection pool.
Catch: Every external call has timeout (default 10s, documented per integration).

### Webhook from third-party with wrong signature
Symptom: Webhook processed anyway, attacker triggers actions.
Catch: Verify signature before any processing. Return 401 on failure.

### Third-party rate limits us
Symptom: 429 from third-party, our code crashes or retries forever.
Catch: Distinguish transient (retry with backoff) from permanent (alert) failures.

### Idempotency key collision
Symptom: Two different operations share an idempotency key, second silently fails.
Catch: Idempotency keys include operation type + entity ID + timestamp.

### Secret leaked in logs
Symptom: Outbound payload logged in full, contains API key or webhook secret.
Catch: PII/secret redaction in logging utility. Test by inspecting logs after each integration.
```

### G. Backend-specific Definition of Done template

A shared reference all backend skills can pull from for the universal checks.

**File:** `avel-standards/references/backend-dod-template.md`

Contents are the union of common backend Definition of Done items. Backend skills reference this in their own DoD section: "All items in `backend-dod-template.md` apply, plus the skill-specific items below."

This eliminates duplication and ensures every backend skill enforces the same baseline.

---

## Two Backend Verification Scripts Worth Adding

Backend benefits more from scripts than frontend because verification is mechanical.

### `vault/scripts/verify-migrations.py`

**Input:** path to migrations directory, test database connection string
**Output:** for each migration, success/failure of:
- Up migration against fresh DB
- Up migration against DB with previous schema
- Down migration after up
- Verification query confirming expected schema state

**Why:** Migration testing is the single most common reason Vault declares done too early. A script removes the temptation to skip the database-with-previous-schema test.

### `relay/scripts/verify-routes.py`

**Input:** OpenAPI spec, base URL of running app
**Output:** for each documented route:
- Does it respond?
- Returns expected status codes on happy path?
- Returns 401 when auth required but not provided?
- Returns 422 with field-level errors on validation failure?
- Returns rate limit headers?

**Why:** Route verification is mechanical. Scripts catch routes that exist in code but don't match the spec, or routes that skip middleware.

---

## Updated Backend Skills — Summary

| Skill | Changes |
|---|---|
| **Anchor** | Expands Definition of Done to include performance verification. Owns the perf gate at Wave 3 sign-off. |
| **Vault** | Internal references split by concern. Adds `verify-migrations.py` script. Definition of Done strengthened. |
| **Gate** | Internal split for authentication vs authorization. References cover multi-tenant and RLS patterns. |
| **Relay** | Equal-weight API and jobs sections. References split. Definition of Done has separate checklists. Adds `verify-routes.py` script. |
| **Bridge** | Common Failure Modes strengthened with hostile-world defaults. |

Plus:

- **Phase Zero** adds the Edge & Gateway Architecture ADR template
- **avel-standards** adds `references/backend-dod-template.md` as the shared baseline

---

## File Count Impact

Before this restructure: ~5 SKILL.md files + ~5 reference files + 0 scripts = 10 files for backend.

After: 5 SKILL.md files + 22 reference files + 2 scripts = 29 files for backend.

Tradeoff: more files, but each is small and focused. Progressive disclosure means Claude loads only the ones relevant to current work. SKILL.md bodies stay under 150 lines each.

---

## Decisions Locked

| Decision | Choice |
|---|---|
| Backend roster size | 5 skills — keep, don't add |
| Anchor performance ownership | Yes, owns the gate |
| API gateway / edge | Phase Zero ADR, not a skill |
| Vault reference split | Yes — schema, migration, query, ORM per stack, soft-delete |
| Relay API/jobs treatment | Equal weight, separate DoD checklists |
| Gate authz coverage | Strengthened with multi-tenant + RLS references |
| Bridge failure handling | Hostile-world defaults in Common Failure Modes |
| Backend-specific DoD template | In `avel-standards/references/` |
| Verification scripts | 2 — `verify-migrations.py`, `verify-routes.py` |

---

## What This Doesn't Cover

Explicitly out of scope for backend skills:

- **Database administration** (backup schedules, replication, point-in-time recovery) — DevOps territory, Launch
- **Production database tuning** (autovacuum settings, shared_buffers) — Launch + DBA work, Phase Zero ADR if it matters
- **Data warehouse / analytics pipelines** — separate engagement, not standard Avel sprint scope
- **gRPC, WebSocket, Server-Sent Events** — covered as project overrides when relevant
- **Service mesh, microservices orchestration** — Avel builds monoliths and small service sets by default; complex orchestration is Enterprise-tier scope

These are deliberate boundaries. Avel doesn't pretend to cover everything backend-shaped.

---

## The Honest Read

The backend skill set is now structurally sound. Five skills, clear ownership, gaps closed through ADRs and reference splits rather than new skills. The merges (Core → Vault, Engine → Relay) work as long as the internal sections give equal weight to merged concerns.

Risk to watch: Anchor's performance ownership is new. First few sprints, performance will be the gate that gets fumbled. Mitigation: explicit Definition of Done items + the verify-routes.py script + a performance pattern in `avel-knowledge` after the first sprint surfaces real numbers.

This backend skill structure is what Avel ships with.
