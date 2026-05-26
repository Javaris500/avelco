# Avel — Component Cheat Sheet

Reverse-engineered from the 12 reference images in `./images-ex/`. This document captures the **patterns**, not the assets. Hex values defer to `avel-brand-and-web-guide.md` — this cheat sheet uses **token names** (`bg`, `surface`, `surface-muted`, `surface-elevated`, `border`, `text`, `text-muted`, `text-subtle`, `accent`, `accent-hover`, `accent-soft`, `focus-ring`).

Use as spec when scaffolding any new surface. Two-mode system — every token resolves to a different hex in dark vs light per the brand guide. If a pattern below conflicts with the brand guide, the brand guide wins.

---

## Hard rules (apply everywhere)

- **Buttons are pill-shaped.** `border-radius: 9999px` (Tailwind `rounded-full`). No exceptions. Square buttons are not part of this system.
- **Cards use neutral borders, not filled backgrounds.** 1px `border` token (neutral gray in both modes). Sophisticated UI uses borders. Hover/active may shift the border toward `accent-soft`.
- **One filled accent button per surface.** Everything else is outlined or ghost. Accent is a finishing move.
- **Status conveyed by colored dot + pill outline,** not by filled blocks.
- **Spacing scale is strict.** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- **Border radius scale:**
  - Buttons, tabs, status pills, chips → `rounded-full` (pill)
  - Cards, modal containers, code blocks → 12–16px
  - Inputs, dropdowns → 8–10px
  - Avatars → `rounded-full`
- **Hover:** 0ms delay, 150ms transition. Border shifts toward `accent-soft`, card lifts 4px, button moves to `accent-hover`.
- **Surface bases are softened on purpose.** Dark `bg` (`#1A1D23`) is not pitch black; light `bg` (`#F4F5F7`) is not clinical white. Do not "fix" this by using pure black or pure white.

---

## Buttons

Pill in every state. Three variants is all we need.

| Variant | When | Treatment |
|---|---|---|
| **Primary** | One per surface — the close, the submit, the main action | Filled `accent`, white text, pill, optional leading icon. Hover → `accent-hover`. |
| **Secondary** | Cancel, dismiss, alternate path | Transparent fill, 1px `border` token, `text` color, pill. Hover → `surface-muted` fill. |
| **Ghost** | Toolbar actions, "Mark all as read," "Reset to default" | No border, `text-muted` color, hover reveals subtle `surface-muted` fill. |

Sizes: `sm` (h-8, px-3, text-xs), `md` (h-10, px-5, text-sm — default), `lg` (h-12, px-7, text-base — hero CTAs).

Icon-only buttons: square footprint but rounded-full (perfect circle). Used for close `X`, sidebar collapse, more menus.

**shadcn:** `Button` with `variant="default" | "outline" | "ghost"` plus a custom radius override to enforce pills.

Seen in: image 4 (+ New ticket — white pill top right), image 6 (Cancel + Export pair), image 11 (Verify Status, Dismiss, View Details).

---

## Status & priority pills

Used in tables, cards, and lists to convey state.

- Pill shape (`rounded-full`)
- 1px border in the status color at ~40% opacity
- Colored dot (filled circle) on the left, ~6px
- Label in the status color or white, small caps optional
- Transparent or very dark fill — borders do the work

Color semantics (suggest these defaults, confirm against brand guide):
- **Open / In progress** → blue tint
- **Pending / Waiting** → amber
- **Resolved / Done** → green
- **Breached / Critical** → red
- **Low / Info** → muted neutral

Avoid filled solid pills (looks juvenile and competes with the accent).

**shadcn:** `Badge` with custom variants per state.

Seen in: image 4 (SLA status column, Priority column), image 12 (Critical / High / Low severity tags on findings).

---

## Tag / category pills (non-status)

For categories, queues, departments — non-state metadata.

- Pill shape
- Small colored square icon or dot on the left
- Subtle background fill at ~10% color opacity, or just colored border
- Label in white or color-matched

Used to color-code a queue, a project, a team. Different from status pills because the color is identity, not state.

Seen in: image 4 (Platform, Billing, Authentication, Integrations queue tags).

---

## Cards

The universal container. Used for stats, list items, content blocks.

- Background: `surface` token (lifts above `bg` — in dark, `#393E46` over `#1A1D23`; in light, `#FFFFFF` over `#F4F5F7`)
- Border: 1px `border` token (neutral gray, both modes)
- Radius: 12–16px
- Padding: 20–24px
- Hover (on interactive cards): border shifts to `accent-soft` border tone, card lifts 4px, optional subtle shadow in light mode

**Card subtypes:**

| Subtype | Use | Composition |
|---|---|---|
| **KPI card** | Dashboard stats | Label (small, muted) → number (large, white) → delta or sparkline |
| **List card** | Kanban tickets, lead rows | Title → snippet → tag row → avatar + due-date footer |
| **Create card** | Modal "what to make" pickers | Icon (top-left, brand-colored bg circle) → title → one-line description |
| **Notification card** | Alerts drawer | Status icon → title + body → timestamp → 1–2 pill action buttons |

**shadcn:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. Override default radius if needed.

Seen in: image 1 (kanban tickets), image 5 (Shipment / Vehicle create cards), image 9 (KPI stats), image 11 (notifications).

---

## Modals / Dialogs

Center-screen, backdrop blurred.

- Backdrop: dark overlay at ~60% with `backdrop-blur-sm`
- Container: max-width 480–640px depending on content, radius 16px
- Header: title (large), subtitle (muted, one line), `X` close (circular icon button) in top-right
- Body: sectioned with small uppercase or sentence-case labels above each group
- Footer: right-aligned, **Cancel (secondary) + Primary action (accent filled pill)** pair
- Use selectable pill groups (`rounded-full` outline pills) for format/range/preset selectors inside modals

**shadcn:** `Dialog`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`. For sectioned forms inside, lean on `Label` + `RadioGroup` (visually styled as pills).

Seen in: image 5 (simple create picker), image 6 (export configurator with pill selectors + checkboxes), image 7 (slot-based dashboard customizer).

---

## Sidebar / Primary navigation

The persistent left nav for `/app/*`.

**Structure (top to bottom):**
1. **Workspace / brand mark** — logo + product name, ~56px tall
2. **Primary nav** — icon + label rows, grouped if needed (Navigation / Pinned / Chats style)
3. **Section labels** — small, uppercase, muted, 11–12px
4. **Sub-items** — indented one level, smaller text, no icon
5. **Spacer / divider**
6. **Bottom card** — user profile, upgrade nudge, or settings

**Item spec:**
- Height: 36–40px
- Padding: 12px horizontal, 8–10px vertical
- Icon left (16–18px), gap 12px, label right
- **Active state:** `surface-muted` background fill + small `accent` indicator dot (4px) on the left, label color = `text`
- **Hover:** background fills to `surface-muted` at lower opacity, label brightens slightly toward `text`
- Items themselves are rounded 8px (not pills — too informal for nav)

Collapsible: icon-only mode at narrow widths.

**shadcn:** No first-class sidebar primitive — compose from `Button variant="ghost"` rows + `Separator`. shadcn's new `Sidebar` block (if available) works.

Seen in: image 1 (Taskora pastel icons), image 2 (spacing cheat sheet — useful reference for the spacing math), image 3 (chat app sidebar with hover context menu), image 10 (Developer Board sidebar), image 12 (ZeroLeaks sidebar).

---

## Tabs

Two flavors. Pick by density.

**Pill tabs** — for small inline groups, 2–5 options.
- `rounded-full`, no underline
- Active: filled background (subtle white at ~8%) or accent fill if it's the primary toggle
- Inactive: ghost
- Used for view toggles like Active / Local / Staging

**Underline tabs** — for full section navigation, 5+ options.
- No background, 2px underline in accent on the active tab
- Inactive: muted text, no underline
- Used for Summary / Timeline / Backlog / Board / List / Forms style nav

**shadcn:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`. Restyle for pill or underline.

Seen in: image 3 (Active/Local/Staging pill tabs), image 10 (Summary/Timeline/Backlog underline tabs), image 12 (Findings/Attack surface underline).

---

## Data tables

The workhorse for CRM, leads, sprints, tickets.

**Anatomy:**
1. **Header bar** — title + meta string (`"11 visible · 1 unassigned · 8 near SLA"`) + primary action button right-aligned
2. **Filter bar** — search input (with icon, ~`w-72`), then filter dropdowns (queue, status, owner), then "Columns N" config, then "Actions" overflow menu — all aligned in one row
3. **Bulk action bar** (conditional) — appears above the table when rows are selected: "N selected • <instruction>" + inline edit controls + primary apply button + Clear text link
4. **Table** —
   - Sticky header row with sort indicators
   - Checkbox column first (for select-all + per-row)
   - Compact rows (~48–56px tall)
   - Avatar + name in person columns
   - Status / Priority columns use pills (see above)
   - Color-tagged queue/category columns
   - SLA / countdown columns with subdued color + secondary label ("Breached", "Reply soon")
5. **Footer** — "Rows per page" selector left, pagination chip right (1 of N), prev/next arrows

**shadcn:** Use `Table` primitives + TanStack Table for sorting/filtering/selection. `Checkbox`, `Select`, `DropdownMenu` for filters.

Seen in: image 4 (Support Queue — gold standard reference for the bulk-action pattern), image 8 (Customer pipeline), image 10 (Developer board with indented sub-rows).

---

## Inputs & search

- Height matches button `md` (h-10)
- Radius 8–10px (NOT pill — too informal for text entry)
- Background: `surface` (in dark) / `surface-muted` (in light) so inputs sit visually inside cards without disappearing
- Border: 1px `border` token. Focus: 1px `border-strong` + 2px `focus-ring` offset (`#0092CA99`)
- Left icon (16px) at 12px from edge when searchable
- Placeholder: `text-subtle` token
- Trailing hint text supported ("@ to add files, / for commands" style)

Composite: search + filter chips in a row, all matching height.

**shadcn:** `Input`, `Select`, `Command` (for slash/at menus).

Seen in: image 3 (chat composer with hint text), image 4 (search + dropdowns row).

---

## Avatars

- Circle (`rounded-full`)
- 24px (table row), 28px (header), 32px (profile card), 40px (chat sender)
- Fallback: initials, single color background pulled from a deterministic hash
- Optional status dot bottom-right (online/offline)

Avatar stacks for assignees:
- Overlap by ~30%
- Ring `1px solid background-color` to create separation
- Overflow chip "+N" at the end if more than 3–4

**shadcn:** `Avatar`, `AvatarImage`, `AvatarFallback`.

Seen in: image 1 (Team Activity), image 10 (Assigned column with stacks), image 4 (Requester column).

---

## Chat layout (for Mira / Zo)

Two-column app surface.

**Left column (~280–320px):**
- Search input top
- Section: "+ New chat" + "Projects" + "Skills" (functional shortcuts)
- Section: "Pinned" (highlighted)
- Section: "Chats" — scrollable list of threads
- Each thread: title (one line, truncated), timestamp ("1d"), hover reveals 3-dot menu
- Right-click / hover menu: Pin, Add to project, Rename, Archive, **Delete** (red text — only place red appears in nav)

**Right column (chat surface):**
- Top tab strip: Active / Local / Staging or similar context toggle (pill tabs)
- Message stream:
  - Agent name + timestamp header line
  - Content block (text, code with diff highlighting, embedded results)
  - Code blocks: rounded, monospaced, syntax-highlighted, +N / -N change counts above
- Composer at bottom: single-row input, placeholder hints commands ("Ask anything, @ to add files, / for commands"), no send button needed (Enter sends, Shift+Enter newline), tiny + icon for attachments

**shadcn:** Compose from `ScrollArea`, `Input`, `DropdownMenu`, `ContextMenu`. Code blocks via a markdown renderer with custom theme.

Seen in: image 3 (the cleanest reference for this whole surface).

---

## Stats / KPI strip

Dashboard header row.

- 3–4 KPI cards in a flex row
- Each card: small muted label → big number (~32–40px) → delta indicator (small, colored arrow + percentage) OR mini sparkline
- Card padding ~20px, border per card spec above
- On narrow widths, stack vertically

Seen in: image 9 (Total Meetings, Avg Meeting Time, Attendance, Engagement).

---

## Charts

Keep them simple and on-brand.

- **Line chart** — single color (accent), no gridlines beyond a faint horizontal baseline, time-range pill selector above (1D, 5D, 1M, etc. — pill group)
- **Donut chart** — center label (big number + small caption), segments use semantic colors (Critical/High/Medium/Low)
- **Horizontal bar chart** — for ranked metrics like "Attack surface exposure," each bar fills left-to-right, numeric value right-aligned
- **Radar / spider chart** — for multi-dimension assessments
- **Progress bar** — thin (4–6px), color-coded by category, percentage label right of bar

Use the accent color and a small palette of semantic colors only. No rainbow data viz.

Seen in: image 11 (line chart + TF pills), image 12 (donut + horizontal bars + radar).

---

## Notifications drawer / inbox

- Slides in from right OR appears as a panel inside the page
- Tabs at top: Unread (with count), All
- Each notification: status-colored icon → title (one line, bold) → description (one line, muted) → timestamp → action buttons (pill, secondary/ghost)
- "Mark all as read" ghost link top-right of panel
- Separator between days

**shadcn:** `Sheet` for the drawer, `Tabs` for filter, `Card`-like rows.

Seen in: image 11 (full notifications panel).

---

## Page headers

Every internal page starts with this.

- **Row 1:** H1 title (large, white) + optional meta string (muted, dot-separated)
- **Row 2 (optional):** breadcrumb above the title for nested pages
- **Right side of row 1:** action button cluster — secondary actions as ghost/outline, primary as filled pill

Pad below by 24–32px before content begins.

Seen in: image 4 (Support Queue header), image 12 (Security Report header with Export PDF + Re-scan).

---

## Empty, loading, and reduced-motion states

- **Empty state:** small icon, one-line message ("No leads yet"), one secondary pill action ("Add lead")
- **Loading:** skeleton blocks (rounded, subtle pulse), never spinners. Pulse animation respects `prefers-reduced-motion: reduce` by disabling
- **Hover/focus:** all interactive elements have visible focus ring — 2px accent at ~60% opacity, offset 2px from element
- **prefers-reduced-motion:** all decorative motion (gradient drifts, continuous scrolls, stagger entrances) freezes; only essential transitions remain (modal open/close, dropdown reveal)

---

## What shadcn gives us out-of-the-box

Map of Avel patterns → shadcn primitives. Install only what's used.

| Pattern | shadcn primitive |
|---|---|
| Buttons (pill override) | `Button` |
| Status/category pills | `Badge` |
| Cards | `Card` family |
| Modals | `Dialog`, `AlertDialog` |
| Drawers | `Sheet` |
| Tabs | `Tabs` |
| Tables | `Table` (+ TanStack Table) |
| Inputs | `Input`, `Textarea`, `Label` |
| Selects / dropdowns | `Select`, `DropdownMenu` |
| Tooltips | `Tooltip` |
| Toasts | `Sonner` |
| Avatars | `Avatar` |
| Checkboxes / radios | `Checkbox`, `RadioGroup` |
| Command palette (chat slash menu) | `Command` |
| Context menu (chat thread right-click) | `ContextMenu` |
| Form scaffolding | `Form` + React Hook Form + Zod |
| Skeletons | `Skeleton` |
| Separator | `Separator` |
| Scroll containers | `ScrollArea` |

Sidebar is the one structure shadcn doesn't ship a strong primitive for — compose from ghost `Button` rows + `Separator`, or use shadcn's newer `Sidebar` block if available.

---

## Image → pattern index

Quick map back to source images.

| Image | Pattern source |
|---|---|
| `23-33-42` | Taskora dashboard — kanban + Team Activity row + pastel sidebar icons |
| `23-34-48` | Desktop sidebar spacing reference (use as math reference) |
| `23-35-31` | Chat app — best reference for Mira/Zo layout, composer hint, hover context menu |
| `23-36-17` | Support Queue — best reference for data table + bulk action bar |
| `23-37-13` | Add new modal — simple create picker pattern |
| `23-37-29` | Export modal — pill group selectors + checkboxes + dual action footer |
| `23-37-43` | Customise overview modal — slot/locked-slot picker grid |
| `23-39-27` | Customer pipeline table — compact CRM density |
| `23-40-01` | Meeting Reports — KPI strip + meeting calendar widget pattern |
| `23-41-10` | Developer Board — progress bars + indented sub-tasks + avatar stacks |
| `23-41-22` | Stocks + notifications drawer — chart TF selector + notification cards |
| `23-42-14` | ZeroLeaks security report — donut + horizontal bars + radar + finding cards with severity pills |

---

## What NOT to copy from these references

- The **orange accent** in images 5–7 — Avel uses ONE accent (`#0092CA`), not warm orange
- The **pastel multi-color sidebar icons** in image 1 — too playful for Avel's "Built with intent." voice
- **Filled solid status pills** — Avel uses outlined pills with colored dots
- **Heavy filled card backgrounds** — Avel uses borders and elevation
- **Pitch-black backgrounds** in any reference — Avel dark `bg` is `#1A1D23`, not OLED black
- **Pure white backgrounds** for full sections — Avel light `bg` is `#F4F5F7`; pure white is reserved for `surface` (cards) only
- **Centered body copy** in any of the dashboards — body text is left-aligned only

The references inform structure, density, and component anatomy. Color, voice, and restraint come from `avel-brand-and-web-guide.md`.
