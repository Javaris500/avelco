# Avel Integration ADRs

> Architecture Decision Records for the seams where Frontend and Backend meet.
> These standards apply Avel-wide. Every project follows them unless explicitly overridden in Phase Zero.
> Internal document. Last updated: May 24, 2026.

---

## Why These ADRs Exist

When Frontend (Wave 2) and Backend (Wave 3) work on the same project, they meet at specific seams: error responses, pagination, search results, file uploads. Without shared standards, each project re-invents these decisions, and Frontend and Backend may implement incompatible patterns.

These ADRs lock the standards once. Future sprints follow them automatically. Projects that genuinely need different patterns override in Phase Zero with explicit ADRs.

This document covers four standards:

1. **Error response format** — how the backend communicates errors
2. **Pagination format** — how list endpoints return paginated data
3. **Search results format** — how search endpoints return results
4. **File upload strategy** — Phase Zero decision template for file handling

---

# ADR-EF001: Error Response Format

**Status:** Canonical Avel-wide
**Applies to:** All API endpoints in every Avel project unless overridden in Phase Zero

## Context

Backend produces errors. Frontend handles them in UI. Without a standard shape, every project re-invents error handling. The result: inconsistent UX, debug-hostile responses, support burden.

## Decision

All Avel APIs return errors in this shape:

```typescript
{
  error: {
    code: string,           // machine-readable error code, e.g., "VALIDATION_ERROR"
    message: string,        // human-readable, what to show or log
    details?: object,       // optional structured details (e.g., field errors)
    requestId: string,      // unique ID for tracing this request
    timestamp: string       // ISO 8601 timestamp
  }
}
```

## Standard error codes

Reserved codes that mean the same thing across all Avel projects:

| Code | HTTP Status | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 422 | Input failed validation |
| `AUTHENTICATION_REQUIRED` | 401 | No valid auth provided |
| `AUTHORIZATION_DENIED` | 403 | Authenticated but not permitted |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Resource state conflict (e.g., duplicate) |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error, no specific reason |
| `EXTERNAL_SERVICE_ERROR` | 502 | Third-party service failed |
| `SERVICE_UNAVAILABLE` | 503 | Temporary unavailability (maintenance, overload) |
| `TIMEOUT` | 504 | Operation took too long |

Project-specific codes may be added but should follow `DOMAIN_REASON` pattern (e.g., `PAYMENT_FAILED`, `SUBSCRIPTION_EXPIRED`).

## Validation error details

When `code: "VALIDATION_ERROR"`, details follow this shape:

```typescript
{
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input",
    details: {
      fields: [
        { field: "email", message: "Must be a valid email address" },
        { field: "password", message: "Must be at least 12 characters" }
      ]
    },
    requestId: "req_abc123",
    timestamp: "2026-05-24T15:30:00Z"
  }
}
```

This format lets Frontend map field errors directly to form inputs.

## Examples

**404:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "requestId": "req_abc123",
    "timestamp": "2026-05-24T15:30:00Z"
  }
}
```

**429:**
```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Try again in 60 seconds.",
    "details": {
      "retryAfter": 60
    },
    "requestId": "req_abc123",
    "timestamp": "2026-05-24T15:30:00Z"
  }
}
```

**500:**
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong on our end. We've been notified.",
    "requestId": "req_abc123",
    "timestamp": "2026-05-24T15:30:00Z"
  }
}
```

Note: 500 errors do NOT leak internal details (stack traces, query errors, etc.) to the client. Full details go to logs server-side, tied to requestId.

## Frontend implications

Ghost's error handling assumes this shape. Strat's data-fetching layer parses errors into this format. Leon's error message copy uses the `message` field as the basis (may rewrite for UX, but message provides default).

## Backend implications

Kel implements error responses in this shape. Every API handler uses a shared `handleError()` utility that produces the correct format. Gat's auth errors use this format. Bridge's third-party error wrapping translates to this format.

## Verification

Every sprint, Proof's API tests verify error responses match this shape. Verdict's sign-off includes verifying error consistency.

## Consequences

**Positive:**
- Consistent UX across all Avel projects
- Frontend error handling is reusable
- Support requests reference requestId for fast debugging
- Field-level validation errors map directly to forms

**Negative:**
- Some legacy clients may expect different formats — handled by project-specific override ADR
- Adds slight overhead to error generation

---

# ADR-EF002: Pagination Format

**Status:** Canonical Avel-wide
**Applies to:** All list endpoints in every Avel project unless overridden in Phase Zero

## Context

List endpoints return collections. Frontend needs to know how to fetch more, render counts, handle empty states. Backend needs a pagination strategy that scales.

Two main strategies exist:
- **Offset-based** (`LIMIT 20 OFFSET 40`) — simple but slow at scale, broken when data changes mid-pagination
- **Cursor-based** — stable, scales well, slightly more complex

## Decision

Avel uses **cursor-based pagination by default**.

Response shape:

```typescript
{
  items: T[],                  // the data
  nextCursor: string | null,   // opaque cursor for next page, null if no more
  hasMore: boolean,            // explicit boolean for "more available"
  total?: number               // optional total count (expensive — only if requested)
}
```

Request shape (query params):

```
GET /api/users?limit=20&cursor=eyJpZCI6...
```

- `limit` — items per page, default 20, max 100
- `cursor` — opaque string from previous response's `nextCursor`, omit for first page

## Why cursor-based

1. **Stable when data changes.** Offset pagination skips or duplicates items when new data is inserted between page requests.
2. **Scales to large datasets.** `OFFSET 100000` is slow; cursor uses indexed seek.
3. **Consistent across all sort orders.** Just need a tiebreaker for non-unique sort fields.

## Cursor implementation

Cursors are opaque to the client but contain encoded state:

```typescript
// Backend encodes
const cursor = Buffer.from(JSON.stringify({
  lastId: lastItem.id,
  lastSortValue: lastItem.createdAt,
})).toString('base64url');

// Backend decodes for next page
const decoded = JSON.parse(Buffer.from(cursor, 'base64url').toString());
const items = await db.users.findMany({
  where: {
    OR: [
      { createdAt: { lt: decoded.lastSortValue } },
      { 
        createdAt: decoded.lastSortValue,
        id: { lt: decoded.lastId }  // tiebreaker
      }
    ]
  },
  orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  take: limit + 1,  // fetch one extra to know if there's more
});

const hasMore = items.length > limit;
const returnedItems = hasMore ? items.slice(0, limit) : items;
```

## Total count

`total` is **expensive** for large tables (requires full count query). Only included when:

- Client explicitly requests it via `?includeTotal=true`
- Or the use case requires it (admin tables, dashboards)

Default: omit `total`. Frontend uses `hasMore` for "load more" buttons.

## Examples

**First page request:**
```
GET /api/users?limit=20
```

**Response:**
```json
{
  "items": [
    { "id": "user_1", "name": "Alice" },
    { "id": "user_2", "name": "Bob" },
    // ... 18 more
  ],
  "nextCursor": "eyJsYXN0SWQiOiJ1c2VyXzIwIiwibGFzdFNvcnRWYWx1ZSI6IjIwMjYtMDUtMjQifQ",
  "hasMore": true
}
```

**Next page request:**
```
GET /api/users?limit=20&cursor=eyJsYXN0SWQiOiJ1c2VyXzIwIiwibGFzdFNvcnRWYWx1ZSI6IjIwMjYtMDUtMjQifQ
```

**Last page response:**
```json
{
  "items": [...],
  "nextCursor": null,
  "hasMore": false
}
```

## When to override

Phase Zero may override this default in specific cases:

- **Admin/internal dashboards** — sometimes offset is acceptable for known small datasets
- **Search results** — often pagination is "page 1 of N" UX, see ADR-EF003 for search
- **Real-time feeds** — cursors based on timestamps may differ from ID-based cursors

If a project overrides, document in project-specific ADR.

## Frontend implications

Strat's data layer uses TanStack Query's infinite queries with `nextCursor`. Ghost's "load more" UX uses `hasMore`. Axis (data viz) may need `total` for chart annotations.

## Backend implications

Leonora's queries use cursor-based pagination. Kel's list endpoints implement the standard response shape. Every list endpoint is paginated — no unpaginated lists in production.

## Verification

Proof tests verify:
- First page returns up to `limit` items
- `nextCursor` is non-null when more data exists
- Subsequent page returns different items than first page
- Last page returns `nextCursor: null` and `hasMore: false`

## Consequences

**Positive:**
- Consistent pagination across all Avel projects
- Scales to large datasets
- Stable when data changes mid-pagination
- Frontend pagination logic is reusable

**Negative:**
- Slightly more complex than offset
- Can't jump to "page 17" (cursor-based is sequential)
- Cursor encoding adds small overhead

---

# ADR-EF003: Search Results Format

**Status:** Canonical Avel-wide
**Applies to:** All search endpoints in every Avel project unless overridden in Phase Zero

## Context

Search endpoints differ from regular list endpoints. They return results with relevance scoring, often with metadata like highlighted matches, facets, and total counts (because search UX usually shows "X results").

## Decision

Avel search endpoints use this response shape:

```typescript
{
  results: SearchResult<T>[],     // ranked results
  total: number,                  // total matching results (search always includes total)
  facets?: Record<string, Facet[]>, // optional faceted breakdown
  query: string,                  // the parsed query
  cursor?: string,                // cursor for next page (if paginated)
  hasMore?: boolean,              // if paginated
  took?: number                   // search execution time in ms
}

type SearchResult<T> = {
  item: T,                        // the actual record
  score: number,                  // relevance score (0-1 normalized)
  highlights?: Record<string, string[]>, // matched fragments per field
}

type Facet = {
  value: string,
  count: number
}
```

Request shape:

```
GET /api/search?q=user+query&limit=20&filter[category]=docs
```

- `q` — the search query
- `limit` — results per page (default 20)
- `cursor` — for pagination (optional)
- `filter[field]` — facet filters
- `facet[field]=true` — include facet counts for field

## Why search differs from list pagination

Search results have intrinsic ranking (relevance score). Showing "result 47 of 1,234" is standard UX. Highlights show why results matched. Facets enable refinement.

These needs justify a separate shape from regular list endpoints.

## Examples

**Basic search:**
```
GET /api/search?q=onboarding
```

**Response:**
```json
{
  "results": [
    {
      "item": { "id": "doc_1", "title": "Onboarding Guide", ... },
      "score": 0.92,
      "highlights": {
        "title": ["<em>Onboarding</em> Guide"],
        "content": ["...your <em>onboarding</em> process..."]
      }
    },
    {
      "item": { "id": "doc_5", "title": "User Onboarding Best Practices", ... },
      "score": 0.87,
      "highlights": {...}
    }
  ],
  "total": 23,
  "query": "onboarding",
  "took": 47
}
```

**Search with facets:**
```
GET /api/search?q=onboarding&facet[category]=true&facet[author]=true
```

**Response:**
```json
{
  "results": [...],
  "total": 23,
  "facets": {
    "category": [
      { "value": "guide", "count": 12 },
      { "value": "tutorial", "count": 8 },
      { "value": "reference", "count": 3 }
    ],
    "author": [
      { "value": "alice", "count": 9 },
      { "value": "bob", "count": 6 }
    ]
  },
  "query": "onboarding",
  "took": 53
}
```

**Filtered search:**
```
GET /api/search?q=onboarding&filter[category]=guide
```

**Response includes only items matching filter, facets recalculated to show remaining options.**

## Semantic search (vector) results

For semantic search (using vector embeddings), the same shape applies but:

- `score` represents cosine similarity (0-1)
- `highlights` may be omitted (no keyword matches to highlight)
- Different ranking algorithm produces different ordering

The response shape is consistent. The retrieval mechanism differs.

## Hybrid search

When combining full-text and vector search:

```typescript
type SearchResult<T> = {
  item: T,
  score: number,                  // combined/normalized score
  textScore?: number,             // optional separate text score
  semanticScore?: number,         // optional separate semantic score
  highlights?: Record<string, string[]>,
}
```

The combined `score` is the primary ranking. Individual scores let Frontend show why something matched.

## Empty results

Empty searches return:

```json
{
  "results": [],
  "total": 0,
  "query": "nonsense gibberish",
  "took": 12
}
```

Frontend shows "no results found" empty state. Search suggestions can be added at the application level.

## Frontend implications

- **Ghost** renders search results with highlighted matches
- **Axis** may visualize facets as filter chips or charts
- **Strat** caches search results with appropriate stale times (shorter than typical queries)
- **Leon** writes the empty-results copy and search hints

## Backend implications

- **Leonora** implements search infrastructure (Postgres FTS, vector search, or external like Algolia)
- **Kel** exposes the search endpoint and translates query params
- Both reference the same response shape ADR

## Verification

Proof tests:
- Search returns results in score order (highest first)
- Filters reduce result set correctly
- Facet counts match result distribution
- Empty queries return empty results gracefully
- Performance under load (search is often the slowest endpoint)

## Consequences

**Positive:**
- Consistent search experience across all Avel projects
- Frontend search components are reusable
- Backend search implementations follow the same contract

**Negative:**
- Facet computation can be expensive — only include when requested
- Highlight extraction adds overhead — backend can skip when not requested

---

# Phase Zero ADR Template: File Upload Strategy

**Applies to:** Projects that include file upload functionality

## Why this needs Phase Zero treatment

File uploads can be implemented several ways. The right choice depends on file size, security requirements, user experience needs, and backend architecture. Locking this at Phase Zero prevents mid-sprint rework.

## ADR template to include in Phase Zero output

When Phase Zero identifies file upload as in-scope, the following ADR is produced and committed to the client repo:

```markdown
# ADR: File Upload Strategy

## Status
Decided at Phase Zero

## Context
This project requires file uploads for [specific use case].

## Decision

### Upload pattern
- [ ] **Direct-to-cloud** — Frontend uploads directly to S3/R2/Vercel Blob via signed URL
- [ ] **Through-backend** — Frontend uploads to backend, backend forwards to storage

Choice: [pick one]

### Storage provider
- [ ] Vercel Blob — simplest, integrated with Vercel deployment
- [ ] AWS S3 — most mature, complex setup
- [ ] Cloudflare R2 — S3-compatible, no egress fees
- [ ] Backblaze B2 — cheap, less mature
- [ ] Self-hosted — only for specific compliance requirements

Choice: [pick one]

### File constraints
- **Max file size:** [N] MB
- **Allowed types:** [list MIME types or extensions]
- **Total storage per user:** [N] GB (or "unlimited")

### Processing requirements
- [ ] **Virus scanning** — required / not required
- [ ] **Image resizing/optimization** — required / not required (specify sizes if yes)
- [ ] **PDF processing** — text extraction, page rendering, etc.
- [ ] **Video transcoding** — if applicable

### Access control
- [ ] **Public** — anyone with URL can view (avatars, public assets)
- [ ] **Authenticated** — requires valid auth, any user
- [ ] **Owner-only** — requires auth + ownership check
- [ ] **Signed URLs** — temporary access via signed URL

### Retention
- [ ] **Permanent** — keep until user deletes
- [ ] **Time-bound** — auto-delete after [N] days
- [ ] **On account deletion** — deleted with user account (GDPR compliance)
```

## Decision logic — which pattern when

### Use direct-to-cloud when:
- Files are large (>5MB)
- High volume of uploads
- Storage is the primary cost concern
- Backend doesn't need to process the file content directly

### Use through-backend when:
- Files require server-side processing before storage
- Strict security requirements (virus scanning, content validation)
- File metadata needs to be extracted server-side
- Authentication/authorization is complex

### Storage provider selection

| Provider | Best for | Avoid when |
|---|---|---|
| Vercel Blob | Vercel-hosted apps, simplicity | Need S3 API compatibility |
| AWS S3 | Enterprise, mature ecosystem | Solo founder simplicity matters more |
| Cloudflare R2 | High-volume, S3-compatible | Need specific AWS services |
| Backblaze B2 | Budget-constrained projects | Need mature SDK ecosystem |

## Implementation handoff

Once ADR is decided:

**For direct-to-cloud:**
- **Kel** implements signed URL endpoint
- **Dunn** implements storage provider integration
- **Ghost** implements upload UI with signed URL flow

**For through-backend:**
- **Kel** implements upload endpoint with multipart parsing
- **Dunn** implements storage provider integration
- **Ghost** implements upload UI with progress reporting

Both patterns coordinate through Atlas at the sprint level.

## Verification

Proof tests:
- Files within size limit upload successfully
- Files exceeding limit are rejected
- Disallowed file types are rejected
- Access control rules enforced
- Virus scanning (if applicable) runs on uploads
- Retention rules execute (if applicable)

Warden audits:
- File type validation prevents executable uploads
- Signed URLs have appropriate expiration
- Access control prevents unauthorized retrieval
- PII files (if applicable) handled per compliance requirements

## Consequences

**Positive:**
- File upload strategy decided once, implemented consistently
- Both Frontend and Backend implement against the same contract
- Security and compliance considerations addressed upfront

**Negative:**
- Adds Phase Zero decision overhead
- Wrong choice (e.g., through-backend for huge files) is expensive to change mid-sprint

---

## How These ADRs Get Used

1. **Avel-standards skill** references these ADRs as canonical Avel-wide standards
2. **Phase Zero** doesn't need to re-decide error response, pagination, or search formats — those are locked
3. **Phase Zero** does need to decide file upload strategy per project — template provided here
4. **Project-specific overrides** (when needed) get their own ADR in the client's repo, documented as overriding the Avel default

## What These ADRs Don't Cover

Deliberately out of scope:

- **GraphQL response formats** — Avel defaults to REST. If a project uses GraphQL, separate ADR needed.
- **gRPC formats** — same reasoning
- **WebSocket message formats** — project-specific decision in Phase Zero
- **Webhook payload formats** — depends on the receiving third-party service
- **Streaming response formats (SSE)** — covered separately in streaming pack

These get addressed when projects need them, not pre-emptively.

## Status

| ADR | Status |
|---|---|
| Error Response Format | Canonical, locked |
| Pagination Format | Canonical, locked |
| Search Results Format | Canonical, locked |
| File Upload Strategy Template | Phase Zero template, decided per project |

All four are operational standards for Avel as of v1.

---

## The Honest Read

These ADRs feel like over-engineering for a solo founder pre-launch. They're not. Here's why:

Every sprint without these standards repeats the same decisions. Error format gets reinvented. Pagination gets implemented inconsistently. Search results vary between endpoints in the same project.

Locking these once means:
- Less Phase Zero decision overhead per project
- Frontend and Backend always agree on the contract
- Reusable components across projects
- Easier for Avel to onboard contractors later (they learn standards once)

The cost: a few hours of writing this document. The benefit: hundreds of hours saved across future sprints.

This is what "Built with intent" looks like at the integration layer.
