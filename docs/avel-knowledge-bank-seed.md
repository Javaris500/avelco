# Avel Knowledge Bank — Seed Content

> Pre-populated entries for the Knowledge Bank so agents have something to learn from in Sprint 1.
> Anti-vibe-coding patterns are the #1 priority category — catches AI-generated code that looks right but isn't.
> This is the cold-start solution. The bank grows from real sprints; this gets it started.
> Internal document. Last updated: May 24, 2026.

---

## TL;DR

10 categories of knowledge bank content. The first category (Anti-Vibe-Coding Patterns) is the highest priority because every AI-assisted sprint needs these protections from day one.

This document contains seed content — initial entries written from existing knowledge rather than discovered through real sprints. Each entry will be refined as real sprint experience accumulates.

Total seed entries: 50 (across 10 categories). Designed to be enough for first 3 sprints without being overwhelming.

---

## Structure of a Knowledge Bank Entry

Every entry follows this structure:

```yaml
---
id: [category]-[number]
category: [category name]
title: [short descriptive title]
status: canonical | draft | deprecated
applies_to: [list of agents who should read this]
framework_version: 1.0.0
created: 2026-05-24
tags: [searchable tags]
---

# Title

## What this pattern is

[1-2 sentences]

## Why it matters

[The cost of ignoring this pattern]

## How to apply

[Concrete steps or code example]

## How to verify

[How an agent confirms they've applied it correctly]

## Common failure modes

[How this pattern gets botched]
```

---

# Category 1: Anti-Vibe-Coding Patterns

These patterns catch AI-generated code that looks right but isn't. **Highest priority. Every agent reads these.**

## AVC-001: Schema-Handler Mismatch

**What:** Handler returns fields that don't exist in the database schema. TypeScript may compile because types match, but the actual query fails at runtime.

**Why it matters:** This is the most common AI-generated failure. The AI invents fields that "should" exist. Code looks correct. Production breaks.

**How to apply:** Every handler return type must be verified against the actual database schema, not just the TypeScript type. The Drizzle/Prisma schema is the source of truth — the type may be derived from it but should be re-verified.

**How to verify:**

```bash
# After writing a handler, run:
# 1. Generate types from schema if applicable
npm run db:generate

# 2. Type-check the handler
npx tsc --noEmit

# 3. Hit the endpoint with a real request and inspect response
curl http://localhost:3000/api/users/[real-id] | jq '.fields'
```

**Common failure modes:**
- Handler uses field `user.firstName` when DB has `first_name` — looks fine in TypeScript
- Handler joins to table that doesn't exist
- Handler returns nested data that the ORM didn't actually fetch

---

## AVC-002: Hallucinated Library APIs

**What:** Calling methods that don't exist on a library. AI invents plausible-sounding method names.

**Why it matters:** Code looks correct, won't compile in some cases, but in JavaScript/TypeScript can fail silently at runtime.

**How to apply:** Every external library call must be verified against actual documentation or via test run. When in doubt, check the package's index.d.ts or import the type definition.

**How to verify:**

```typescript
// Hover the method in IDE — TypeScript should show real signature
// If unsure, look up the actual export:
import { theMethod } from 'the-library';
console.log(typeof theMethod); // should be 'function'
```

**Common failure modes:**
- `axios.getJson()` (doesn't exist — `axios.get()` returns the data property automatically with `.data`)
- `prisma.user.findById()` (Prisma uses `findUnique({ where: { id }})`)
- `stripe.subscriptions.list({ customerId })` (parameter is `customer`, not `customerId`)
- Made-up methods that match common naming conventions but don't exist

---

## AVC-003: Made-Up Environment Variables

**What:** Code references env vars that don't exist in `.env.example`. Looks like a real config dependency. Actually references nothing.

**Why it matters:** Code runs locally because the dev has the real value set. Code fails in CI or production because the var isn't defined.

**How to apply:** Every `process.env.X` reference must have a matching entry in `.env.example` (with a placeholder value or comment about what it should be). Add the var to `.env.example` immediately when adding to code.

**How to verify:**

```bash
# Find all env var references in code
grep -rn "process\.env\." src/

# Compare to .env.example
cat .env.example

# Every code reference should have an example entry
```

**Common failure modes:**
- AI invents `process.env.STRIPE_PUBLISHABLE_KEY` when the project uses `STRIPE_PUBLIC_KEY`
- Uses `OPENAI_API_KEY` when project standard is `OPENAI_KEY`
- References namespaced var that doesn't follow project convention

---

## AVC-004: Plausible But Wrong SQL

**What:** Queries that look right but query nonexistent columns or use wrong joins.

**Why it matters:** SQL doesn't fail compilation. It fails at runtime, often in production after the migration but before traffic.

**How to apply:** Every committed SQL query must be tested against a real database with the actual schema applied. Drizzle/Prisma/sqlc can help but don't guarantee correctness if the AI invented the model.

**How to verify:**

```sql
-- Before committing a query, run it manually:
EXPLAIN ANALYZE [your query]

-- Verifies:
-- 1. All tables/columns exist
-- 2. Indexes are used
-- 3. Query plan is reasonable
```

**Common failure modes:**
- Joining on a column that doesn't exist
- Using a column name from another similar table
- `SELECT user_id FROM users` when the column is `id`
- Forgetting `WHERE deleted_at IS NULL` on soft-deleted tables

---

## AVC-005: Type Assertions Hiding Bugs

**What:** `as User` casts that bypass real type checking.

**Why it matters:** TypeScript's safety relies on inference. `as` casts tell TypeScript to trust you. If you're wrong (or the AI was wrong), runtime crashes.

**How to apply:** Zero `as` casts in production code without an explicit justifying comment. Use type guards, validation libraries (Zod), or proper inference instead.

**How to verify:**

```bash
# Count `as` casts in committed code
grep -rn " as [A-Z]" src/ | wc -l

# Each one should have a comment explaining why
# Acceptable cases:
# - Casting after Zod validation (you've already proven the shape)
# - Type narrowing in a discriminated union
# - Working around a library's incomplete types (with TODO to fix)
```

**Common failure modes:**
- `const user = req.body as User` — body could be anything
- `const result = await fetch(...).json() as Response` — JSON could be malformed
- Asserting non-null without checking (`obj!.field`)
- Casting through `unknown` to bypass strict mode

---

## AVC-006: Off-By-One in Pagination

**What:** Pagination math that looks correct but skips or duplicates items at page boundaries.

**Why it matters:** Looks fine in testing with small data. Breaks in production with real data volumes. Users miss results or see duplicates.

**How to apply:** Pagination must be tested against real data with the actual sort order. Cursor-based pagination preferred over offset for large datasets.

**How to verify:**

```typescript
// Test pagination with a realistic dataset:
// 1. Get page 1, note last item ID
// 2. Get page 2, verify first item is different from last item of page 1
// 3. Get all pages, verify total count matches DB count
// 4. Verify no duplicates across pages
```

**Common failure modes:**
- `LIMIT 20 OFFSET (page * 20)` when page is 0-indexed (correct) vs 1-indexed (off by 20)
- Sorting by non-unique field causes duplicates with offset pagination
- Cursor-based pagination but cursor doesn't include tiebreaker for non-unique sort

---

## AVC-007: Promise Chains That Don't Await

**What:** Async code that looks parallel but actually drops errors or returns before completing.

**Why it matters:** Errors get swallowed. Operations complete after the response is sent. Database connections leak.

**How to apply:** Every Promise must be awaited, .catch'd, or explicitly marked fire-and-forget with a comment.

**How to verify:**

```typescript
// Bad:
sendEmail(user); // returns Promise, but we don't await — error if email fails is invisible
return res.status(200);

// Good:
await sendEmail(user);
return res.status(200);

// Or explicitly fire-and-forget:
sendEmail(user).catch(err => log.error('Email send failed', err));
return res.status(200);
```

**Common failure modes:**
- Forgotten await in a series of operations
- `.then().catch()` without final await
- `Promise.all()` without await
- async function called without await in a non-async context

---

## AVC-008: Mock Data Leaking to Production

**What:** Placeholder values (`John Doe`, `test@example.com`, `Lorem ipsum`) shipped to production.

**Why it matters:** Embarrassing in client demos. Sometimes legal issues if PII is involved (using real-sounding test data that's actually fake).

**How to apply:** Pre-deploy grep for known placeholder strings. CI pipeline includes this check.

**How to verify:**

```bash
# Before deploy:
grep -rn "John Doe\|test@example\.com\|Lorem ipsum\|placeholder\|TODO:" src/
# Should return nothing in committed code
```

**Common failure modes:**
- AI-generated default values that look real
- Test fixtures imported in production code
- Demo data left in seed scripts that get auto-run
- API responses with hardcoded placeholders for "unknown" cases

---

## AVC-009: Confident But Wrong Error Handling

**What:** `try/catch` blocks that catch the wrong error type, handle errors incorrectly, or swallow them silently.

**Why it matters:** Errors that should propagate get hidden. Bugs that should crash loudly cause subtle data corruption instead.

**How to apply:** Every catch block must either: re-throw, return a meaningful response, or explicitly log+continue with comment explaining why.

**How to verify:**

```typescript
// Bad — swallows everything:
try {
  await doThing();
} catch (e) {
  // silent
}

// Bad — too broad:
try {
  await fetchUser();
  await sendEmail(); // network error here is treated same as user-not-found
} catch (e) {
  return res.status(404).json({ error: "User not found" });
}

// Good:
try {
  const user = await fetchUser();
  await sendEmail(user);
} catch (e) {
  if (e instanceof NotFoundError) {
    return res.status(404).json({ error: "User not found" });
  }
  log.error('Operation failed', { error: e });
  return res.status(500).json({ error: "Internal error", requestId: req.id });
}
```

**Common failure modes:**
- Empty catch blocks
- Logging without re-throwing or returning
- Catching at too broad a scope
- Returning generic 500 for what should be 400 (or vice versa)

---

## AVC-010: Validation Bypassed at Trust Boundaries

**What:** Code that treats internal calls as trusted but is actually still receiving external input.

**Why it matters:** Validation happens at the API boundary, then is assumed everywhere downstream. But background jobs from queues, webhooks, scheduled tasks — all also need validation.

**How to apply:** Every entry point to your system validates input independently. Don't trust IDs from queues, webhooks, or any external source.

**How to verify:**

```typescript
// Bad:
async function processWebhook(payload: WebhookPayload) {
  // payload is typed but came from network — actually unknown
  const user = await db.user.findUnique({ where: { id: payload.userId }});
  if (user) { ... } // could be invalid ID, SQL injection, etc.
}

// Good:
async function processWebhook(rawPayload: unknown) {
  const payload = webhookSchema.parse(rawPayload); // Zod throws if invalid
  const user = await db.user.findUnique({ where: { id: payload.userId }});
  if (user) { ... }
}
```

**Common failure modes:**
- Webhook handlers that trust the payload because the route is "private"
- Background jobs that receive serialized objects and don't re-validate
- Internal microservice calls without auth/validation
- Test data leaking into production paths

---

# Category 2: Frontend Patterns

## FE-001: useState vs Server State

**What:** When to use local React state vs server state libraries (TanStack Query, SWR).

**Why it matters:** Mixing them creates inconsistencies, stale data, race conditions, and difficult-to-debug bugs.

**How to apply:**
- Data that comes from a server: use TanStack Query or SWR
- Data that's local to the component: useState
- Form state: react-hook-form
- Never useState for server-fetched data

**Common failure modes:**
- `const [user, setUser] = useState(null); useEffect(() => fetchUser().then(setUser))` — recreates patterns TanStack Query solved
- Mixing optimistic local state with server state without proper coordination

---

## FE-002: Empty/Loading/Error State Trinity

**What:** Every async UI component needs three explicit states.

**Why it matters:** Default behavior is "show blank screen" — terrible UX.

**How to apply:** Every async component renders one of: loading skeleton, empty state ("no items yet"), error state with retry, or actual data.

```tsx
const { data, isLoading, error } = useQuery(['items'], fetchItems);

if (isLoading) return <ItemsSkeleton />;
if (error) return <ErrorState onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState />;
return <ItemsList items={data} />;
```

---

## FE-003: Form Validation Alignment

**What:** Client-side and server-side validation must produce consistent results.

**Why it matters:** User submits, client says "valid," server rejects with cryptic error.

**How to apply:** Use shared Zod schemas (per Phase Zero ADR — shared package, generated, or sync-comment copy).

---

## FE-004: Accessible Form Inputs

**What:** Every form input must have a label, error association, and keyboard support.

**How to apply:**

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-describedby={error ? "email-error" : undefined}
  aria-invalid={!!error}
/>
{error && <span id="email-error" role="alert">{error}</span>}
```

---

## FE-005: Optimistic UI with Rollback

**What:** When mutations should feel instant, optimistic UI shows the result immediately and reverts on failure.

**How to apply:** TanStack Query's `onMutate` + `onError` for rollback.

---

# Category 3: Backend Patterns

## BE-001: Service Layer Pattern

**What:** API handlers should be thin; business logic lives in services.

**Why:** Handlers couple to HTTP. Services are testable, reusable across different entry points (HTTP, jobs, CLI).

**How to apply:**

```typescript
// Handler — thin, just HTTP concerns
async function createUserHandler(req, res) {
  const input = createUserSchema.parse(req.body);
  const user = await userService.createUser(input);
  return res.status(201).json(user);
}

// Service — business logic
class UserService {
  async createUser(input: CreateUserInput): Promise<User> {
    // validate, check duplicates, create, send welcome email
  }
}
```

---

## BE-002: Idempotency Keys for External-Facing Mutations

**What:** Endpoints that create or modify external state should accept idempotency keys.

**Why:** Network retries cause duplicate creation. Especially critical for payments, emails, jobs.

**How to apply:** Accept `Idempotency-Key` header. Store with TTL. Reject duplicates with cached response.

---

## BE-003: Boundary Validation, Trust Internals

**What:** Validate at every external boundary (API, webhook, queue). Trust internal calls within a process.

**Why:** Re-validating everywhere is expensive and inconsistent. Validating at boundaries gives clear trust zones.

---

## BE-004: Soft Delete by Default

**What:** Add `deleted_at` to every table. Never `DELETE FROM`.

**Why:** Recovery from accidental deletes. Audit trail. GDPR Article 17 compliance handled separately with explicit hard-delete.

---

## BE-005: Connection Pool Sizing

**What:** Database connection pool size affects throughput and latency.

**How to apply:** Start with `(concurrent_requests * 1.2)`. Adjust based on slow query log and connection wait time.

---

# Category 4: Wave 4 (Quality & Deployment) Patterns

## Q4-001: Test the Rollback Plan

**What:** Rollback procedure isn't real until it's been tested in production-like conditions.

**Why:** Untested rollbacks fail when needed most.

**How to apply:** Pre-launch, deliberately deploy bad code to staging, execute rollback, verify recovery. Document the time it took.

---

## Q4-002: Alert Test Required

**What:** Beacon's first alert must be deliberately triggered to verify the alert path works.

**Why:** Many monitoring setups are "configured but never tested." Test alert verifies the whole chain: detection → routing → delivery to founder.

---

## Q4-003: Staging Mirrors Production

**What:** Staging environment matches production: same database type, same external integrations, same auth, just with different keys and reduced scale.

**Why:** Bugs that only appear with real conditions need staging that has real conditions.

---

## Q4-004: PII Inventory at Sprint Close

**What:** Document every place user PII is stored, logged, or transmitted. Update at sprint close.

**Why:** GDPR/CCPA compliance starts with knowing what data you have. You can't protect what you don't know about.

---

## Q4-005: The Five Hard Gates

**What:** No sprint ships without all five:
1. QA suite passing (Proof)
2. Security audit clean (Warden)
3. Production deploy verified (Launch)
4. Monitoring live with test alert acknowledged (Beacon)
5. Rollback tested and documented (Launch / Refuge)

**Why:** Each gate has saved Avel from shipping bad work. None are negotiable.

---

# Category 5: Cross-Cutting Patterns

## XC-001: ADR for Every Architectural Decision

**What:** Architecture Decision Records document non-trivial choices.

**Why:** Future you (or contractors) need to know why decisions were made, not just what they were.

**How to apply:** When a decision is non-trivial, write a 1-page ADR. Lives in `.avel/decisions/`.

---

## XC-002: Phase Zero Catches 80% of Sprint Risk

**What:** Most sprint failures trace back to insufficient Phase Zero discovery.

**Why:** Time spent before sprint starts is 10x cheaper than time spent mid-sprint addressing missed requirements.

**How to apply:** Phase Zero output includes: project context, ADRs for non-obvious decisions, sprint brief with explicit scope boundaries, identified risks with mitigations.

---

## XC-003: Communication Velocity > Communication Completeness

**What:** A rough update fast beats a polished update slow.

**Why:** Clients tolerate uncertainty if they have visibility. They don't tolerate silence.

**How to apply:** Weekly status update minimum, regardless of progress. "Still working on X, no blockers" is fine.

---

# Category 6: Anti-Patterns

## AP-001: useState for Server Data

**What it looks like:** `const [user, setUser] = useState(null); useEffect(() => fetchUser().then(setUser))`

**Why it's bad:** Reimplements caching, refetching, and error handling poorly. Loses TanStack Query's benefits.

**The fix:** Use TanStack Query or SWR.

---

## AP-002: JWT for Web-Only Apps

**What it looks like:** Stateless JWTs for a web-only application.

**Why it's bad:** JWTs can't be revoked without infrastructure (token blacklist). Session cookies are simpler and more secure for web-only.

**The fix:** Use session cookies. Reserve JWTs for cross-domain or mobile.

---

## AP-003: SELECT * in Committed Code

**What it looks like:** `SELECT * FROM users WHERE ...`

**Why it's bad:** Couples query to schema. Hides unintended PII leaks. Breaks when columns are added.

**The fix:** Explicit column lists. Always.

---

## AP-004: Hardcoded API Keys

**What it looks like:** `const stripeKey = "sk_live_..."` in committed code.

**Why it's bad:** Obvious — credentials shouldn't be in code.

**The fix:** Environment variables. Secrets manager for production. Pre-commit hook to scan for secrets.

---

## AP-005: Promise.all() Without Error Handling

**What it looks like:** `await Promise.all([sendEmail(), updateUser(), logEvent()])`

**Why it's bad:** First failure cancels everything, but you might want some operations to succeed even if others fail. Or one failure should fail all — but you need explicit handling.

**The fix:** `Promise.allSettled()` when partial success is acceptable. Explicit try/catch around each when ordering matters.

---

## AP-006: Auth Check Only in Middleware

**What it looks like:** Auth verified once in middleware. Service layer assumes user is authenticated.

**Why it's bad:** Bypassing the middleware bypasses auth. Service layer code called from non-HTTP contexts (jobs, scripts) doesn't get the auth check.

**The fix:** Service layer re-verifies authorization on protected operations. Defense in depth.

---

## AP-007: Migration Without Down

**What it looks like:** Database migration that has no rollback path.

**Why it's bad:** Forced forward only. If migration causes issues, no clean recovery.

**The fix:** Every migration has a tested down migration. Even if the down is "manually restore from backup," it's explicit.

---

## AP-008: Webhook Without Signature Verification

**What it looks like:** Receiving webhooks from Stripe/etc. without verifying the signature.

**Why it's bad:** Anyone can POST to your webhook URL and trigger actions.

**The fix:** Always verify webhook signatures. Use the library function the provider gives — don't roll your own.

---

## AP-009: Inline Styles for Static Values

**What it looks like:** `<div style={{ color: '#0066cc' }}>...`

**Why it's bad:** Brand color hardcoded in one component. When brand updates, hunt across codebase.

**The fix:** Tokens (CSS variables) or Tailwind classes that reference the design system.

---

## AP-010: Generic Error Messages

**What it looks like:** `return res.status(500).json({ error: "Internal error" })`

**Why it's bad:** Useless for debugging. Users see meaningless messages. Support burden.

**The fix:** Structured error responses with codes, messages, requestId. Log full error server-side, return safe info client-side.

---

# Category 7: ADRs (Architecture Decision Records)

These are Avel-wide ADRs that apply to every project.

## ADR-A001: TypeScript Strict Everywhere

**Status:** Canonical
**Context:** Most JavaScript codebases accumulate type drift over time.
**Decision:** All Avel projects use TypeScript with `strict: true` enabled.
**Consequences:** Some libraries with poor types require workarounds. Long-term maintainability significantly improved.

---

## ADR-A002: Postgres as Default Database

**Status:** Canonical
**Context:** Many database choices exist. Standardization helps with shared knowledge and tooling.
**Decision:** Postgres is the default unless project requirements demand otherwise.
**Consequences:** Knowledge bank patterns assume Postgres. Switching costs for clients with existing MySQL/MongoDB setups documented per project.

---

## ADR-A003: UUID Primary Keys

**Status:** Canonical
**Context:** Auto-increment integers leak business information (sequential, predictable).
**Decision:** All new tables use UUID primary keys (v7 if Postgres supports, v4 otherwise).
**Consequences:** Slightly larger indexes. Better security and merge-ability across services.

---

## ADR-A004: snake_case DB, camelCase Application

**Status:** Canonical
**Context:** Different ecosystems prefer different naming. Avoiding constant translation matters.
**Decision:** Postgres uses snake_case. JavaScript/TypeScript uses camelCase. ORM handles the translation.
**Consequences:** Drizzle/Prisma configured to map naming. Knowledge bank patterns assume this convention.

---

## ADR-A005: 50% Upfront, 50% Delivery Billing

**Status:** Canonical (business decision)
**Context:** Service businesses have collection risk.
**Decision:** All sprints bill 50% upfront on signed brief, 50% on delivery.
**Consequences:** Cash flow is protected. Some clients balk at upfront — they self-select out, which is fine.

---

# Category 8: Exemplars (Code Samples)

Reference implementations of common patterns.

## EX-001: API Handler with Validation

```typescript
// app/api/users/route.ts
import { z } from 'zod';
import { db } from '@/lib/db';
import { handleError } from '@/lib/api-errors';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = createUserSchema.parse(body);

    const user = await db.user.create({
      data: input,
    });

    return Response.json(user, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
```

---

## EX-002: React Component with All States

```tsx
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export function UserList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <Skeleton className="h-32" />;
  
  if (error) {
    return (
      <div className="text-center p-8">
        <p>Couldn't load users.</p>
        <button onClick={() => refetch()}>Try again</button>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center p-8">
        <p>No users yet.</p>
        <p className="text-sm text-muted-foreground">
          Invite your first teammate to get started.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## EX-003: Database Schema with Avel Standards

```typescript
// schemas/users.ts
import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  email_verified: boolean('email_verified').notNull().default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  deleted_at: timestamp('deleted_at'),
});

// Migration
// CREATE TABLE users (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   email TEXT NOT NULL UNIQUE,
//   name TEXT NOT NULL,
//   email_verified BOOLEAN NOT NULL DEFAULT FALSE,
//   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
//   updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
//   deleted_at TIMESTAMP
// );
// CREATE INDEX idx_users_email_active ON users(email) WHERE deleted_at IS NULL;
```

---

## EX-004: Webhook Handler with Signature Verification

```typescript
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature');

  if (!sig) {
    return new Response('Missing signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return new Response(`Invalid signature`, { status: 400 });
  }

  // Idempotency: have we already processed this event?
  const existing = await db.webhookEvent.findUnique({
    where: { stripeEventId: event.id },
  });
  if (existing) {
    return new Response('Already processed', { status: 200 });
  }

  // Process event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    // ... other cases
  }

  // Record we processed it
  await db.webhookEvent.create({
    data: { stripeEventId: event.id, eventType: event.type },
  });

  return new Response('OK', { status: 200 });
}
```

---

## EX-005: Background Job with Idempotency

```typescript
// lib/queue/sendWelcomeEmail.ts
import { defineJob } from '@/lib/inngest';

export const sendWelcomeEmail = defineJob({
  id: 'send-welcome-email',
  schema: z.object({
    userId: z.string().uuid(),
  }),

  async handler({ event }) {
    const { userId } = event.data;

    // Idempotency: has this user already received welcome?
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      log.warn('Welcome email job: user not found', { userId });
      return { sent: false, reason: 'user_not_found' };
    }
    if (user.welcomeEmailSentAt) {
      return { sent: false, reason: 'already_sent' };
    }

    // Send email
    await resend.emails.send({
      to: user.email,
      from: 'hello@avelco.dev',
      subject: 'Welcome',
      html: renderWelcomeEmail({ name: user.name }),
    });

    // Mark as sent (this makes the operation idempotent)
    await db.user.update({
      where: { id: userId },
      data: { welcomeEmailSentAt: new Date() },
    });

    return { sent: true };
  },
});
```

---

# Category 9: Retrospectives (template)

This category gets populated from real sprints. Each retro follows a template:

```markdown
# Sprint Retrospective: [name]

## Sprint summary
- Duration: [N] weeks
- Team activated: [list]
- Outcomes shipped: [list]

## What worked
[bullet list]

## What didn't
[bullet list]

## Time vs estimate
| Wave | Estimated | Actual | Variance reason |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

## Knowledge bank candidates
- [ ] New pattern: [description]
- [ ] New anti-pattern: [description]
- [ ] New ADR: [description]

## Framework changes proposed
[any changes to standards, agents, or process]

## Action items for next sprint
[concrete changes to apply]
```

First entry: written after Sprint Zero completion.

---

# Category 10: Per-Agent Learning Logs

Each agent's accumulated wisdom from their work. Started empty, grows from real sprints.

Sample structure for each agent's log:

```
agent-logs/
├── helm.md           # Helm's accumulated learnings
├── atlas.md          # Atlas's log
├── leonora.md        # Leonora's log
├── gat.md
├── kel.md
├── dunn.md
├── zero.md
├── fantem.md
├── ghost.md
├── leon.md
├── nemi.md
├── leia.md
├── axis.md
├── strat.md
├── verdict.md
├── proof.md
├── warden.md
├── launch.md
├── beacon.md
├── mira.md          # Command center agent logs
├── zo.md
├── della.md
├── uno.md
├── raven.md
└── plye.md
```

Each starts empty. After each sprint, that agent's log gets new entries based on what was learned.

Sample first entries:

**helm.md (seeded):**
- "Phase Zero quality predicts sprint outcomes more than any other factor. Spend time here, save time everywhere else."

**leonora.md (seeded):**
- "Every UUID-keyed table gets a created_at, updated_at, deleted_at. No exceptions."
- "Foreign keys must have indexes. Always."

**gat.md (seeded):**
- "Auth method decision (session vs JWT) must happen at Phase Zero, before any code. Mid-sprint changes cascade badly."

These get richer over time. The bank is a living resource, not a static document.

---

## How To Use This Seed Content

1. **Copy these entries into the Knowledge Bank database** when Phase 5 of the command center build (Knowledge Bank infrastructure) is complete.
2. **Tag each entry appropriately** for retrieval — patterns get pattern tags, anti-patterns get anti-pattern tags, etc.
3. **Embed each entry** through the embedding pipeline so semantic retrieval works.
4. **Verify the embeddings retrieve correctly** by asking Zo questions whose answers should match these entries.

---

## Expected Bank Growth Over First 5 Sprints

| Sprint | Patterns added | Anti-patterns added | ADRs added | Exemplars added |
|---|---|---|---|---|
| Seed | 40 | 10 | 5 | 5 |
| Sprint 1 (Avel CC) | +5-10 | +3-5 | +2-3 | +2-3 |
| Sprint 2 | +3-5 | +2-3 | +1-2 | +1-2 |
| Sprint 3 | +3-5 | +2-3 | +1-2 | +1-2 |
| Sprint 4 | +3-5 | +1-3 | +0-1 | +1-2 |
| Sprint 5 | +3-5 | +1-3 | +0-1 | +1-2 |

By end of Sprint 5: roughly 60-75 patterns, 18-27 anti-patterns, 9-15 ADRs, 11-16 exemplars. Plus growing per-agent logs.

This is enough to be genuinely useful. Knowledge compounds from here.

---

## What This Seed Does NOT Include

Deliberately not seeded:

- **Tech-stack-specific exemplars** beyond the basics — Drizzle vs Prisma vs sqlc specifics emerge from real choices
- **Client-specific patterns** — only emerge from real client work
- **Performance benchmarks** — meaningless without real workloads
- **Industry-specific compliance** — only relevant if you take healthcare/finance clients

These come from real sprints, not theory.

---

## The Honest Read

Seed content gives the agents something to learn from in Sprint 1. Without it, the bank is empty and agents lose a lot of context.

But seed content also risks ossification — patterns that "look right" but haven't been tested against Avel's actual sprint experience. Treat these entries as **first drafts**. The first 5 sprints will refine, deprecate, or strengthen each one.

The anti-vibe-coding category is the most valuable seed content. AI-assisted development produces vibe code by default. Avel's discipline is to catch it systematically. These 10 patterns are the foundation of that discipline.

Use this seed. Let real sprints refine it.
