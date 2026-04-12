# Phase 01: Builder Boundaries & Mode Hardening - Research

**Researched:** 2026-04-10 [VERIFIED: 2026-04-10 workspace session]
**Domain:** Next.js App Router builder boundaries, mode-gated brochure/booking separation, and repo-driven salon configuration. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]
**Confidence:** MEDIUM [VERIFIED: research synthesis based on current codebase, current Next.js docs, and current npm registry data]

<user_constraints>
## User Constraints (from CONTEXT.md)

Copied verbatim from `.planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md`. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]

### Locked Decisions [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]
- **D-01:** `content/site.ts` remains the primary salon-level config for brand, contact, opening hours, socials, and SEO.
- **D-02:** Booking-specific rules, fallback contact visibility, and booking-specific copy move into a dedicated `content/booking.ts` instead of continuing to grow inside `content/site.ts`.
- **D-03:** Phase 1 should not split the salon config into many tiny files such as `brand.ts`, `contact.ts`, or `seo.ts`; only the booking domain earns its own config module now.
- **D-04:** In `contact_only`, the site must not advertise a working online booking flow.
- **D-05:** Direct visits to `/termin-buchen` in `contact_only` should render a friendly fallback page that explains online booking is unavailable for this salon and shows the enabled contact options, rather than redirecting away.
- **D-06:** Contact channel visibility is salon-configurable in both modes. The salon decides whether phone, email, and WhatsApp are shown, and that shared config drives rendering consistently across brochure and booking entry surfaces.
- **D-07:** In `online_booking`, the salon may choose booking only or booking plus any configured fallback contact channels. No contact channel should be hard-hidden purely because booking mode is enabled.
- **D-08:** Brochure pages may expose simple navigation entry points to booking, but they must not host real booking flow steps, booking state, or server-backed booking interactions.
- **D-09:** The real public booking flow stays under `app/termin-buchen/*`, admin stays under `app/admin/*`, and operational logic stays under `lib/booking/*` plus `db/*`.
- **D-10:** Phase 1 should replace scattered one-off mode checks with shared mode-aware helpers so new brochure surfaces cannot accidentally drift from the configured salon mode.

### Claude's Discretion [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]
- Exact type names and object shape for `content/booking.ts`
- Exact helper layout for centralizing mode-aware route and CTA decisions
- Whether the booking entry link is resolved through one helper or a small set of shared helpers

### Deferred Ideas (OUT OF SCOPE) [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]
- None - discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BUIL-01 | Maintainer can create a new salon website by replacing structured salon content and configuration without rewriting shared brochure components. [VERIFIED: .planning/REQUIREMENTS.md] | Keep brochure blocks prop-driven, keep salon data in `content/*`, and centralize booking/mode derivation in a shared helper layer instead of inline route/component branching. [VERIFIED: components/blocks/contact.tsx, components/blocks/hero.tsx, app/page.tsx, lib/home-page.ts, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] |
| BUIL-02 | Maintainer can replace salon-specific brand and media assets without editing shared booking or admin logic. [VERIFIED: .planning/REQUIREMENTS.md] | Keep brand/media in `content/site.ts` and `public/*`, and keep booking/admin internals under `app/termin-buchen/*`, `app/admin/*`, `lib/booking/*`, and `db/*`. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md, content/site.ts, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] |
| MODE-01 | Maintainer can configure a salon website to run in `contact_only` mode. [VERIFIED: .planning/REQUIREMENTS.md] | Move booking-mode rules and fallback channel visibility into `content/booking.ts`, then resolve all brochure and `/termin-buchen` visibility through shared selectors. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md, content/site.ts, lib/home-page.ts] |
| MODE-02 | Maintainer can configure a salon website to run in `booking` mode. [VERIFIED: .planning/REQUIREMENTS.md] | Treat `MODE-02` as the same product mode the current code/context call `online_booking`, and standardize the naming in Phase 1 so planning and implementation stop drifting. [VERIFIED: .planning/REQUIREMENTS.md, content/site.ts, CODEX_CONTEXT.md, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] |
| MODE-03 | Visitor in `contact_only` mode sees contact paths and does not get a working public booking flow. [VERIFIED: .planning/REQUIREMENTS.md] | Keep `/termin-buchen` as a safe fallback page in `contact_only`, hide booking-entry CTAs outside booking mode, and derive visible contact channels from one shared config path. [VERIFIED: app/termin-buchen/page.tsx, lib/home-page.ts, app/layout.tsx, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] |
</phase_requirements>

## Summary

Phase 1 is an architectural hardening phase, not a tooling phase: the current repo already has the right broad builder shape, with prop-driven brochure blocks, repo-driven salon content, and isolated booking schema/environment helpers, but the mode contract is still duplicated across `content/site.ts`, `lib/home-page.ts`, `app/layout.tsx`, and `app/termin-buchen/page.tsx`. [VERIFIED: content/site.ts, lib/home-page.ts, app/layout.tsx, app/termin-buchen/page.tsx, AGENTS.md]

The biggest planning risk is drift, not missing infrastructure. Current code already violates locked decisions in two concrete ways: `resolvePageActions()` hard-hides WhatsApp whenever booking mode is enabled, which conflicts with D-07, and `SiteFooter` bypasses the shared action resolver entirely, which means footer contact visibility cannot stay consistent with D-06. [VERIFIED: lib/home-page.ts, components/blocks/site-footer.tsx, app/layout.tsx, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]

The clean Phase 1 plan is: keep `content/site.ts` for brand/contact/SEO/hours, add exactly one new `content/booking.ts`, introduce one brochure-safe mode selector layer, and keep any real booking/admin UI or server behavior physically isolated under booking/admin routes and modules. Next.js App Router’s current project-organization guidance explicitly supports route colocation, private folders, and route groups for exactly this kind of separation. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md, AGENTS.md, CODEX_CONTEXT.md] [CITED: https://nextjs.org/docs/app/getting-started/project-structure]

**Primary recommendation:** Add `content/booking.ts`, replace all scattered `site.booking.mode` checks with shared selectors, and enforce that brochure code only consumes derived props or brochure-safe helpers while booking/admin logic stays under `app/termin-buchen/*`, `app/admin/*`, `lib/booking/*`, and `db/*`. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md, app/page.tsx, app/layout.tsx, lib/home-page.ts, app/termin-buchen/page.tsx]

## Project Constraints (from AGENTS.md)

- Keep the product salon-first; future non-salon abstraction is out of scope for this phase. [VERIFIED: AGENTS.md]
- Preserve two supported product modes, `contact_only` and `booking`, while noting that current code/context currently use `online_booking` as the internal literal. [VERIFIED: AGENTS.md, content/site.ts, CODEX_CONTEXT.md, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]
- Keep salon-specific content repo-driven and swappable; do not introduce a CMS. [VERIFIED: AGENTS.md]
- Keep brochure components prop-driven; `components/blocks/*` should not import salon content directly or booking internals directly. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md]
- Keep booking/admin logic shared across salons and out of brochure-only components. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md]
- Keep content German-only. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md]
- Use `npm.cmd` rather than plain `npm` in this PowerShell environment. [VERIFIED: AGENTS.md]
- Do not plan customer accounts or online payments into this phase. [VERIFIED: AGENTS.md]

## Standard Stack

No new production dependency is required for Phase 1; the phase can be implemented on the existing Next.js + React + TypeScript stack. [VERIFIED: package.json, app/page.tsx, app/layout.tsx, app/termin-buchen/page.tsx]

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | Repo: `16.1.6`; npm latest: `16.2.3` published `2026-04-08T18:46:32.059Z`. [VERIFIED: package.json, npm registry] | App Router routing, layouts, file conventions, and future route handlers. [VERIFIED: package.json] | Phase 1 is mostly route/file-boundary work, and current Next.js docs explicitly support colocation, private folders, route groups, and `route.ts` handlers for clean separation. [CITED: https://nextjs.org/docs/app/getting-started/project-structure] [CITED: https://nextjs.org/docs/app/getting-started/route-handlers] |
| `react` / `react-dom` | Repo: `19.2.3`; npm latest: `19.2.5` published `2026-04-08T18:39:24.455Z`. [VERIFIED: package.json, npm registry] | Server-rendered route/components with selective client hydration only where needed. [VERIFIED: package.json, AGENTS.md] | Next.js App Router renders layouts/pages as Server Components by default, which matches the project rule to keep brochure surfaces mostly server-rendered. [CITED: https://nextjs.org/docs/app/getting-started/linking-and-navigating] |
| `typescript` | Package range: `^5`; installed: `5.9.3`; npm latest: `6.0.2` published `2026-03-23T16:14:45.521Z`. [VERIFIED: package.json, node_modules/typescript/package.json, npm registry] | Typed config contracts, literal unions, and compile-time boundary enforcement. [VERIFIED: content/site.ts, content/home.ts, tsconfig.json] | Phase 1 needs stronger contracts, not looser runtime branching; current repo already uses `as const`, exported types, and strict TS successfully. [VERIFIED: content/site.ts, content/home.ts, AGENTS.md] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `eslint` / `eslint-config-next` | Repo ranges: `^9` / `16.1.6`. [VERIFIED: package.json] | Enforce route/component hygiene and catch boundary regressions during refactor. [VERIFIED: package.json, eslint.config.mjs] | Use on every commit; `npm.cmd run lint` passes in the current workspace. [VERIFIED: package.json, workspace shell run on 2026-04-10] |
| `vitest` + `@testing-library/react` + `jsdom` + `@vitejs/plugin-react` + `vite-tsconfig-paths` | Latest verified: `4.1.4`, `16.3.2`, `29.0.2`, `6.0.1`, `6.1.1`. [VERIFIED: npm registry] | Minimal unit/component harness for shared mode selectors and synchronous route components. [CITED: https://nextjs.org/docs/app/guides/testing] | Use if Phase 1 adds automated regression coverage for centralized mode helpers and the `/termin-buchen` fallback surface. [CITED: https://nextjs.org/docs/app/guides/testing] |
| `@playwright/test` | Latest verified: `1.59.1`. [VERIFIED: npm registry] | Browser-level smoke coverage for `/` and `/termin-buchen` behavior across both modes. [CITED: https://nextjs.org/docs/app/guides/testing] | Use only if the planner wants true route-level verification in Phase 1; it is heavier than a first Vitest harness. [CITED: https://nextjs.org/docs/app/guides/testing] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `vitest` first | `@playwright/test` first | Playwright verifies real route behavior better, but it is slower and heavier for a first harness when most Phase 1 logic is pure config/helper work. [CITED: https://nextjs.org/docs/app/guides/testing] |
| Physical route-group moves in Phase 1 | Keep current route layout and add `_components` / `_lib` plus shared selectors first | Route groups are officially supported and useful, but helper centralization is the mandatory safety win; physical folder churn is optional if it would bloat the phase. [CITED: https://nextjs.org/docs/app/getting-started/project-structure] [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] |

**Installation:** Optional dev-only test harness for Wave 0. [CITED: https://nextjs.org/docs/app/guides/testing] [VERIFIED: npm registry]

```bash
npm.cmd install -D vitest @vitejs/plugin-react jsdom @testing-library/react vite-tsconfig-paths
```

**Version verification:** [VERIFIED: npm registry]
- `next`: repo `16.1.6`; latest `16.2.3`; repo version published `2026-01-27T21:54:07.626Z`; latest published `2026-04-08T18:46:32.059Z`.
- `react`: repo `19.2.3`; latest `19.2.5`; repo version published `2025-12-11T22:55:28.598Z`; latest published `2026-04-08T18:39:24.455Z`.
- `typescript`: installed `5.9.3`; latest `6.0.2`; do not absorb the major upgrade into Phase 1 unless the user explicitly broadens scope. [VERIFIED: node_modules/typescript/package.json, npm registry]

## Architecture Patterns

### Recommended Project Structure
```text
app/
├── layout.tsx                  # global brochure-safe shell only
├── page.tsx                    # homepage composition only
├── termin-buchen/
│   ├── page.tsx                # booking entry or contact-only fallback
│   ├── _components/            # route-local, non-routable booking-entry UI
│   └── _lib/                   # route-local, non-routable presentation helpers
├── admin/
│   ├── page.tsx                # future admin entry
│   ├── _components/            # route-local admin UI
│   └── _lib/                   # route-local admin helpers
content/
├── site.ts                     # brand, contact, hours, socials, SEO
├── booking.ts                  # booking mode, fallback visibility, booking copy
├── home.ts                     # brochure section order and CTA declarations
lib/
├── site-mode.ts                # shared brochure-safe selectors/resolvers
├── home-page.ts                # can delegate to site-mode.ts after Phase 1
└── booking/                    # operational booking/admin helpers only
db/                             # server-only persistence layer
```
This structure keeps the existing repo-driven builder model, adds only one new config module, and uses Next.js-supported private folders for non-routable route-local code. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md, content/site.ts, lib/home-page.ts] [CITED: https://nextjs.org/docs/app/getting-started/project-structure]

### Pattern 1: Single Booking Domain Config Module
**What:** Keep `content/site.ts` as the salon-level source for brand/contact/SEO/hours, and move only booking-domain settings and copy into `content/booking.ts`. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]

**When to use:** Use immediately in Plan `01-01`, because current `content/site.ts` already mixes brand/contact data with booking-policy fields. [VERIFIED: content/site.ts]

**Example:**
```ts
// Based on the repo's current literal-union config style and locked decision D-02.
// Source: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md, content/site.ts, content/home.ts
export const bookingModes = ["contact_only", "online_booking"] as const;
export type BookingMode = (typeof bookingModes)[number];

export type BookingContent = {
  mode: BookingMode;
  fallbackActions: Array<"phone" | "whatsapp" | "email">;
  copy: {
    disabledTitle: string;
    disabledBody: string;
  };
};

export const booking = {
  mode: "contact_only",
  fallbackActions: ["phone", "email"],
  copy: {
    disabledTitle: "Online-Terminbuchung ist aktuell nicht aktiv",
    disabledBody: "Dieses Studio vergibt Termine derzeit direkt ueber Telefon und E-Mail.",
  },
} satisfies BookingContent;
```

### Pattern 2: Brochure-Safe Mode Selector Layer
**What:** Replace inline `site.booking.mode` checks with a helper module that resolves mode state, booking entry visibility, visible fallback channels, and route copy for brochure surfaces. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md, app/page.tsx, app/layout.tsx, app/termin-buchen/page.tsx, lib/home-page.ts]

**When to use:** Use in every brochure route/block and in `/termin-buchen`; do not let footer, homepage, and booking entry each decide mode separately. [VERIFIED: app/page.tsx, app/layout.tsx, app/termin-buchen/page.tsx, components/blocks/site-footer.tsx]

**Example:**
```ts
// Source: current drift observed in app/layout.tsx, app/page.tsx, app/termin-buchen/page.tsx, lib/home-page.ts
export type BookingPresentationState = {
  isOnlineBooking: boolean;
  bookingHref: string | null;
  visibleContactKinds: Array<"phone" | "whatsapp" | "email">;
};

export function getBookingPresentationState(mode: "contact_only" | "online_booking", fallbackActions: BookingPresentationState["visibleContactKinds"]): BookingPresentationState {
  const isOnlineBooking = mode === "online_booking";

  return {
    isOnlineBooking,
    bookingHref: isOnlineBooking ? "/termin-buchen" : null,
    visibleContactKinds: fallbackActions,
  };
}
```

### Pattern 3: Route Isolation With Private Folders and Optional Route Groups
**What:** Keep real booking flow steps under `app/termin-buchen/*`, keep admin under `app/admin/*`, and colocate route-local UI/utilities under `_components` and `_lib` so they never become routable by accident. If the phase already moves many files, route groups like `(brochure)`, `(booking)`, and `(admin)` are a valid organizational upgrade that does not change URLs. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] [CITED: https://nextjs.org/docs/app/getting-started/project-structure]

**When to use:** Use in Plan `01-03`; this is the cleanest way to keep future booking/admin complexity from bleeding back into brochure components. [VERIFIED: .planning/ROADMAP.md, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]

**Example:**
```text
app/
├── page.tsx
├── termin-buchen/
│   ├── page.tsx
│   ├── _components/BookingEntryCard.tsx
│   └── _lib/presentation.ts
└── admin/
    ├── page.tsx
    ├── _components/AdminShell.tsx
    └── _lib/navigation.ts
```

### Anti-Patterns to Avoid
- **Inline mode branching in multiple files:** Current mode checks are duplicated in `app/layout.tsx`, `app/page.tsx`, `app/termin-buchen/page.tsx`, and `lib/home-page.ts`, which is exactly the drift D-10 is trying to remove. [VERIFIED: app/layout.tsx, app/page.tsx, app/termin-buchen/page.tsx, lib/home-page.ts, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]
- **Hard-hiding contact channels because booking is enabled:** Current `resolvePageActions()` removes WhatsApp in `online_booking`, which directly conflicts with D-07. [VERIFIED: lib/home-page.ts, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]
- **Hardcoded fallback copy that ignores config:** Current `/termin-buchen` fallback list still hardcodes phone/WhatsApp/email text instead of reflecting enabled channels only. [VERIFIED: app/termin-buchen/page.tsx, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]
- **Over-fragmenting salon config:** D-03 explicitly rejects splitting `site.ts` into many tiny modules in Phase 1. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mode-aware brochure visibility | Ad-hoc `site.booking.mode` checks in every route/component. [VERIFIED: app/layout.tsx, app/page.tsx, app/termin-buchen/page.tsx] | One shared brochure-safe selector layer such as `lib/site-mode.ts`. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] | The current codebase already drifted; centralization is the only reliable way to keep homepage, footer, and `/termin-buchen` consistent. [VERIFIED: lib/home-page.ts, components/blocks/site-footer.tsx, app/termin-buchen/page.tsx] |
| Booking-domain config spread | Optional booleans and copy split across `site.ts`, `home.ts`, and JSX. [VERIFIED: content/site.ts, content/home.ts, app/termin-buchen/page.tsx] | `content/booking.ts` plus selector helpers. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] | This keeps the builder swappable without over-splitting the whole content model. [VERIFIED: AGENTS.md, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] |
| Route-local internals | Shared global folders for every booking/admin helper before those routes exist. [ASSUMED] | Route-local `_components` / `_lib`, with route groups only when layout partitioning becomes useful. [CITED: https://nextjs.org/docs/app/getting-started/project-structure] | Next.js private folders give clean non-routable isolation with less churn than prematurely inventing a large cross-app abstraction. [CITED: https://nextjs.org/docs/app/getting-started/project-structure] |
| Brochure to booking coupling | Importing `db/*`, future auth helpers, or server-backed booking logic into `components/blocks/*`. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md] | Keep blocks presentational and feed them resolved props from `app/*` or brochure-safe helpers. [VERIFIED: AGENTS.md, app/page.tsx, components/blocks/contact.tsx] | This preserves BUIL-01/BUIL-02 and keeps the brochure reusable across salons and product modes. [VERIFIED: .planning/REQUIREMENTS.md, AGENTS.md] |

**Key insight:** Phase 1 should not invent a generalized “builder engine”; it should remove the current drift points so the existing content-driven architecture can keep scaling safely into booking/admin work. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md, .planning/ROADMAP.md]

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None for builder mode/config. Current persisted data model in `db/schema.ts` stores operational booking entities, not salon builder mode or fallback-channel config. [VERIFIED: db/schema.ts, content/site.ts] | Code edit only. No data migration is required for moving config from `content/site.ts` to `content/booking.ts`. [VERIFIED: db/schema.ts, content/site.ts] |
| Live service config | None found in repository scope. Current builder mode and fallback behavior are repo-driven, and no `app/api/booking/*` surface or external workflow/export files are committed yet. [VERIFIED: content/site.ts, app/termin-buchen/page.tsx, codebase scan showing no `app/api/booking`] | Code edit only. No live-service migration is implied by the repo state visible in this phase. [VERIFIED: codebase scan] |
| OS-registered state | None found. No service unit files, task scheduler manifests, PM2 configs, or launcher registrations are committed. [VERIFIED: codebase scan] | None. [VERIFIED: codebase scan] |
| Secrets/env vars | `DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY`, `BOOKING_FROM_EMAIL`, and `BOOKING_NOTIFICATION_EMAIL` exist today. [VERIFIED: .env.example, lib/booking/env.ts] | Code edit only. Phase 1 should not rename or migrate these variables. [VERIFIED: .env.example, lib/booking/env.ts] |
| Build artifacts | `.next/` output and `tsconfig.tsbuildinfo` are present/produced in the current workspace. [VERIFIED: workspace build output on 2026-04-10, codebase scan] | Rebuild after module moves. No artifact migration is required. [VERIFIED: workspace build output on 2026-04-10] |

## Common Pitfalls

### Pitfall 1: Mode Literal Drift
**What goes wrong:** Requirements and AGENTS use `booking`, while current code and phase context use `online_booking`; partial refactors then update only some files. [VERIFIED: .planning/REQUIREMENTS.md, AGENTS.md, content/site.ts, CODEX_CONTEXT.md, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]

**Why it happens:** Product vocabulary changed faster than the codebase and planning docs. [VERIFIED: source comparison across requirements, context, and code]

**How to avoid:** Canonicalize one internal literal in Wave 0, then update docs, types, and helpers in the same plan. [VERIFIED: source comparison across requirements, context, and code]

**Warning signs:** A helper, test, or plan task mentions `booking`, but the code path still branches on `online_booking`. [VERIFIED: content/site.ts, .planning/REQUIREMENTS.md]

### Pitfall 2: Config Says One Thing, Copy Says Another
**What goes wrong:** Visible contact channels and explanatory text diverge, so a salon config hides a channel in one place but the fallback page still promises it elsewhere. [VERIFIED: app/termin-buchen/page.tsx, lib/home-page.ts, components/blocks/site-footer.tsx]

**Why it happens:** Action visibility is partially data-driven and partially hardcoded in JSX text or component props. [VERIFIED: lib/home-page.ts, app/termin-buchen/page.tsx, app/layout.tsx]

**How to avoid:** Derive both action visibility and fallback copy inputs from the same helper output. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]

**Warning signs:** Strings like “telefonisch, per WhatsApp oder per E-Mail” appear directly in route files. [VERIFIED: app/termin-buchen/page.tsx]

### Pitfall 3: Footer/Header Drift Outside Shared Helpers
**What goes wrong:** Shared navigation surfaces show booking/contact links that do not match homepage or booking-entry behavior. [VERIFIED: app/layout.tsx, components/blocks/site-footer.tsx, app/page.tsx]

**Why it happens:** `SiteFooter` receives raw phone/email plus an inline booking link decision instead of a resolved action list. [VERIFIED: app/layout.tsx, components/blocks/site-footer.tsx]

**How to avoid:** Feed navigation and footer from the same resolved mode/action state used by brochure pages. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]

**Warning signs:** Footer props include direct contact primitives while brochure blocks consume resolved action objects. [VERIFIED: components/blocks/site-footer.tsx, components/blocks/contact.tsx]

### Pitfall 4: Brochure Components Become Booking Hosts
**What goes wrong:** Booking flow steps, booking state, or DB-backed interactions leak into brochure blocks, making BUIL-01 and BUIL-02 harder to preserve. [VERIFIED: .planning/REQUIREMENTS.md, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]

**Why it happens:** It is tempting to “just add one more step” to a homepage or contact section before the real booking route is built. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md, CODEX_CONTEXT.md]

**How to avoid:** Keep brochure blocks pure/presentational and let only booking/admin routes own real flow state or server actions later. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md]

**Warning signs:** A brochure block starts importing `lib/booking/*`, `db/*`, or future API/action code. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md]

## Code Examples

Verified patterns from official docs and the current codebase:

### Route-Local Non-Routable Files
```text
app/
└── termin-buchen/
    ├── page.tsx
    ├── _components/BookingEntryCard.tsx
    └── _lib/presentation.ts
```
Source: Next.js project-structure docs explicitly allow private folders such as `_folder` for non-routable implementation details. [CITED: https://nextjs.org/docs/app/getting-started/project-structure]

### Route Handler Placement
```ts
// Source: https://nextjs.org/docs/app/getting-started/route-handlers
export async function POST(request: Request) {}
```
Use this later for real booking APIs under `app/api/booking/*`; do not mix a `route.ts` and `page.tsx` at the same segment level. [CITED: https://nextjs.org/docs/app/getting-started/route-handlers]

### Shared Booking Entry Resolution
```ts
// Source: current duplication in app/page.tsx, app/layout.tsx, and lib/home-page.ts
export function getBookingEntryHref(mode: "contact_only" | "online_booking") {
  return mode === "online_booking" ? "/termin-buchen" : null;
}
```
This is the minimal selector every brochure surface should consume instead of branching inline. [VERIFIED: app/page.tsx, app/layout.tsx, lib/home-page.ts, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Scattered inline App Router mode checks in routes/components. [VERIFIED: app/layout.tsx, app/page.tsx, app/termin-buchen/page.tsx, lib/home-page.ts] | Shared selector/helper layer plus optional route-local private folders or route groups. [CITED: https://nextjs.org/docs/app/getting-started/project-structure] [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] | Current Next.js docs updated `2026-03-31`; phase decisions captured `2026-04-10`. [CITED: https://nextjs.org/docs/app/getting-started/project-structure] [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] | Reduces drift across homepage, footer, and booking entry surfaces before booking/admin complexity increases. [VERIFIED: app/layout.tsx, app/page.tsx, app/termin-buchen/page.tsx] |
| One growing site config object for every domain concern. [VERIFIED: content/site.ts] | One salon-level config plus one booking-domain config module when booking rules start to grow. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md, CODEX_CONTEXT.md] | Booking split was explicitly approved in phase context on `2026-04-10`. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] | Keeps builder swapability high without fragmenting into many tiny files too early. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md, AGENTS.md] |
| Brochure pages and APIs treated as separate concerns outside `app`. [ASSUMED] | App Router route handlers colocated under `app`, with booking/admin behavior still physically separated from brochure routes. [CITED: https://nextjs.org/docs/app/getting-started/route-handlers] [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] | Current Next.js route-handler docs updated `2026-03-31`. [CITED: https://nextjs.org/docs/app/getting-started/route-handlers] | Future booking APIs can live near route boundaries without leaking into brochure blocks. [CITED: https://nextjs.org/docs/app/getting-started/route-handlers] [VERIFIED: CODEX_CONTEXT.md] |

**Deprecated/outdated:**
- Hard-hiding WhatsApp in booking mode is outdated relative to D-07 and should be removed in Phase 1. [VERIFIED: lib/home-page.ts, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]
- Inline footer booking/contact decisions are outdated relative to D-06 and D-10 and should move behind shared selectors. [VERIFIED: app/layout.tsx, components/blocks/site-footer.tsx, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Route-local `_components` / `_lib` is the best first physical organization even if route groups are deferred. [ASSUMED] | Architecture Patterns / Don't Hand-Roll | Low. The planner can still keep the selector-layer recommendation and choose route groups earlier if desired. |
| A2 | The older “outside `app`” API/file-organization model is the main alternative the planner would otherwise drift toward. [ASSUMED] | State of the Art | Low. The practical recommendation to keep booking/admin logic isolated inside current App Router boundaries still stands. |

## Open Questions (RESOLVED)

1. **Which mode literal should Phase 1 canonize internally: `booking` or `online_booking`?**
   - Resolved outcome: Phase 1 canonizes `booking` as the internal literal. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-01-PLAN.md]
   - Evidence: `01-01-PLAN.md` explicitly normalizes the internal booking-mode literal to `booking` and requires `online_booking` to be removed from the touched config exports. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-01-PLAN.md]
   - Implementation effect: Future Phase 1 work and gap closure should treat `booking` as the only canonical internal mode vocabulary. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-01-PLAN.md]

2. **Should Plan `01-03` physically adopt route groups now, or keep current folder paths and use private folders only?**
   - Resolved outcome: Plan `01-03` keeps the current route paths and uses route-local private folders (`_components`, `_lib`) instead of adopting route groups. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-03-PLAN.md, .planning/phases/01-builder-boundaries-mode-hardening/01-03-SUMMARY.md]
   - Evidence: `01-03-PLAN.md` and `01-03-SUMMARY.md` both define and describe the implemented route-local private-folder structure under `app/termin-buchen/*` and `app/admin/*`. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-03-PLAN.md, .planning/phases/01-builder-boundaries-mode-hardening/01-03-SUMMARY.md]
   - Implementation effect: Phase 1 preserves URL structure and boundary clarity without adding route-group file-move churn. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-03-SUMMARY.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `next build`, `eslint`, future test tooling. [VERIFIED: package.json] | ✓ [VERIFIED: workspace shell run on 2026-04-10] | `v24.13.1`. [VERIFIED: workspace shell run on 2026-04-10] | — |
| npm (`npm.cmd`) | Script execution and optional dev dependency install. [VERIFIED: package.json, AGENTS.md] | ✓ [VERIFIED: workspace shell run on 2026-04-10] | `11.12.1`. [VERIFIED: workspace shell run on 2026-04-10] | Use `npm.cmd` specifically in PowerShell on this machine. [VERIFIED: AGENTS.md] |

**Missing dependencies with no fallback:**
- None for Phase 1 research/planning. Current `npm.cmd run lint` and `npm.cmd run build` both succeeded in this workspace on 2026-04-10. [VERIFIED: workspace shell run on 2026-04-10]

**Missing dependencies with fallback:**
- None identified. [VERIFIED: workspace shell run on 2026-04-10]

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Current: none committed. Recommended Wave 0: `vitest@4.1.4` + `@testing-library/react@16.3.2` + `jsdom@29.0.2`. [VERIFIED: codebase scan, npm registry] [CITED: https://nextjs.org/docs/app/guides/testing] |
| Config file | None today; create `vitest.config.ts` if Phase 1 adds automated tests. [VERIFIED: codebase scan] |
| Quick run command | `npm.cmd run lint`. [VERIFIED: package.json, workspace shell run on 2026-04-10] |
| Full suite command | `npm.cmd run lint` then `npm.cmd run build` today; add `npm.cmd run test:unit` after Wave 0 if a Vitest harness is added. [VERIFIED: package.json, workspace shell run on 2026-04-10] |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BUIL-01 | Shared brochure surfaces derive booking/contact visibility from shared selectors instead of route-local branching. [VERIFIED: .planning/REQUIREMENTS.md, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] | unit | `npm.cmd run test:unit -- tests/phase-1/site-mode.test.ts` [ASSUMED] | ❌ Wave 0 [VERIFIED: codebase scan] |
| BUIL-02 | Swapping brand/media data does not require editing booking/admin modules. [VERIFIED: .planning/REQUIREMENTS.md] | unit/integration | `npm.cmd run test:unit -- tests/phase-1/content-boundaries.test.ts` [ASSUMED] | ❌ Wave 0 [VERIFIED: codebase scan] |
| MODE-01 | `contact_only` hides booking-entry CTAs on brochure surfaces and resolves only configured contact channels. [VERIFIED: .planning/REQUIREMENTS.md, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] | unit | `npm.cmd run test:unit -- tests/phase-1/site-mode.test.ts` [ASSUMED] | ❌ Wave 0 [VERIFIED: codebase scan] |
| MODE-02 | Booking mode exposes `/termin-buchen` entry while preserving configured fallback contact visibility. [VERIFIED: .planning/REQUIREMENTS.md, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] | unit | `npm.cmd run test:unit -- tests/phase-1/site-mode.test.ts` [ASSUMED] | ❌ Wave 0 [VERIFIED: codebase scan] |
| MODE-03 | Direct visit to `/termin-buchen` in `contact_only` renders the friendly fallback page and not a real booking flow. [VERIFIED: .planning/REQUIREMENTS.md, .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] | component/integration | `npm.cmd run test:unit -- tests/phase-1/termin-buchen-page.test.tsx` [ASSUMED] | ❌ Wave 0 [VERIFIED: codebase scan] |

### Sampling Rate
- **Per task commit:** `npm.cmd run lint`. [VERIFIED: package.json, workspace shell run on 2026-04-10]
- **Per wave merge:** `npm.cmd run lint` and `npm.cmd run build`. [VERIFIED: package.json, workspace shell run on 2026-04-10]
- **Phase gate:** `lint` + `build` green, plus manual smoke of `/` and `/termin-buchen` in both modes until automated tests exist. [VERIFIED: workspace shell run on 2026-04-10] [CITED: https://nextjs.org/docs/app/guides/testing]

### Wave 0 Gaps
- [ ] `vitest.config.ts` — required to add a fast unit harness. [VERIFIED: codebase scan] [CITED: https://nextjs.org/docs/app/guides/testing]
- [ ] `tests/phase-1/site-mode.test.ts` — covers BUIL-01, MODE-01, and MODE-02. [ASSUMED]
- [ ] `tests/phase-1/termin-buchen-page.test.tsx` — covers MODE-03. [ASSUMED]
- [ ] `tests/setup.ts` — shared test setup for jsdom/RTL if component tests are added. [ASSUMED]
- [ ] `package.json` script such as `test:unit` — required so the plan can run Phase 1 checks consistently. [VERIFIED: package.json]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no. Admin auth is Phase 2 work, not Phase 1. [VERIFIED: .planning/ROADMAP.md] | — |
| V3 Session Management | no. No session layer is added in this phase. [VERIFIED: .planning/ROADMAP.md, current codebase scan] | — |
| V4 Access Control | yes. Phase 1 is explicitly about mode-gating public booking exposure and keeping admin/booking boundaries separate from brochure code. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] | Shared mode selectors plus physical separation of `app/termin-buchen/*`, `app/admin/*`, `lib/booking/*`, and `db/*`. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md, CODEX_CONTEXT.md] |
| V5 Input Validation | yes, for repo-driven config contracts rather than public form input. [VERIFIED: content/site.ts, content/home.ts] | Keep literal unions and `satisfies`-style typed config objects so invalid fallback kinds or mode values fail at compile time. [VERIFIED: content/site.ts, content/home.ts] |
| V6 Cryptography | no. This phase does not add new crypto or secrets handling. [VERIFIED: .env.example, lib/booking/env.ts, .planning/ROADMAP.md] | — |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Disabled booking mode still exposes booking CTAs or misleading route copy. [VERIFIED: current drift in app/layout.tsx, app/termin-buchen/page.tsx, lib/home-page.ts] | Tampering | Centralize mode resolution and generate both visible actions and fallback copy from the same state object. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] |
| Brochure components import booking/admin internals and accidentally expose server-side concerns in public UI code. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md] | Information Disclosure | Keep brochure blocks prop-driven and keep operational logic under booking/admin modules only. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md] |
| Footer or secondary navigation bypasses shared visibility rules and advertises routes/features that are off for the current salon. [VERIFIED: app/layout.tsx, components/blocks/site-footer.tsx] | Spoofing | Feed footer/header links from the same resolved mode/action state as brochure sections. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)
- Codebase inspection: `content/site.ts`, `content/home.ts`, `lib/home-page.ts`, `app/page.tsx`, `app/layout.tsx`, `app/termin-buchen/page.tsx`, `components/blocks/site-footer.tsx`, `db/schema.ts`, `.env.example`, `package.json`. [VERIFIED: codebase files]
- `.planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md` - locked phase decisions and integration targets. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md]
- `AGENTS.md` and `CODEX_CONTEXT.md` - project constraints and intended architecture direction. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md]
- Next.js Project Structure docs - colocation, private folders, route groups, and route exposure rules. [CITED: https://nextjs.org/docs/app/getting-started/project-structure]
- Next.js Route Handlers docs - `route.ts` placement and segment-level rule against colocating `route.ts` and `page.tsx` at the same route segment. [CITED: https://nextjs.org/docs/app/getting-started/route-handlers]
- Next.js Linking and Navigating docs - App Router layouts/pages are Server Components by default. [CITED: https://nextjs.org/docs/app/getting-started/linking-and-navigating]
- Next.js Testing docs - testing types and the official Vitest/Playwright guidance. [CITED: https://nextjs.org/docs/app/guides/testing]
- npm registry queries run on 2026-04-10 for `next`, `react`, `typescript`, `vitest`, `@testing-library/react`, `@vitejs/plugin-react`, `jsdom`, `vite-tsconfig-paths`, and `@playwright/test`. [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)
- None. [VERIFIED: research session scope]

### Tertiary (LOW confidence)
- None beyond the explicit `[ASSUMED]` items listed in the Assumptions Log. [VERIFIED: research session scope]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - current versions were verified against the npm registry and the phase does not depend on speculative new production dependencies. [VERIFIED: npm registry, package.json]
- Architecture: HIGH - the boundary recommendation is grounded in locked phase decisions, current code drift, and current Next.js App Router organization docs. [VERIFIED: .planning/phases/01-builder-boundaries-mode-hardening/01-CONTEXT.md, codebase files] [CITED: https://nextjs.org/docs/app/getting-started/project-structure]
- Pitfalls: HIGH - each pitfall maps to a concrete inconsistency already present in the repo or in current vocabulary drift between requirements, context, and code. [VERIFIED: .planning/REQUIREMENTS.md, content/site.ts, lib/home-page.ts, app/layout.tsx, app/termin-buchen/page.tsx]

**Research date:** 2026-04-10 [VERIFIED: workspace session]
**Valid until:** 2026-05-10 for codebase-specific planning; re-check npm versions and Next.js docs sooner if Phase 1 planning slips materially. [VERIFIED: research synthesis policy]
