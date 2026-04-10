# Architecture

**Analysis Date:** 2026-04-10

## Pattern Overview

**Overall:** Content-driven Next.js App Router monolith with an unfinished booking/backend foundation inside the same repo

**Key Characteristics:**
- Marketing pages are driven by typed repo content in `content/*.ts`
- Route files in `app/` are intentionally thin and compose reusable blocks
- Shared visual primitives live separately from page sections (`components/ui/` vs `components/blocks/`)
- Booking capability is modeled behind config and database modules, but the public flow is still a shell

## Layers

**Route Composition Layer:**
- Purpose: Define page entry points, metadata, and top-level composition
- Contains: `app/layout.tsx`, `app/page.tsx`, `app/termin-buchen/page.tsx`, `app/impressum/page.tsx`, `app/datenschutz/page.tsx`
- Depends on: content/config modules and reusable blocks
- Used by: Next.js runtime

**Block Layer:**
- Purpose: Render reusable page sections from props
- Contains: `components/blocks/hero.tsx`, `components/blocks/services-grid.tsx`, `components/blocks/team-grid.tsx`, `components/blocks/gallery-grid.tsx`, `components/blocks/contact.tsx`, `components/blocks/legal-page.tsx`, `components/blocks/site-footer.tsx`
- Depends on: UI primitives plus typed props
- Used by: page files in `app/`

**Design System Layer:**
- Purpose: Shared presentation primitives and motion wrappers
- Contains: `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/container.tsx`, `components/ui/heading.tsx`, `components/ui/reveal.tsx`, `components/ui/section.tsx`, `components/ui/typography.tsx`
- Depends on: React, Tailwind classes, `lib/cn.ts`, and Framer Motion for `reveal.tsx`
- Used by: block components and legal pages

**Content / Config Layer:**
- Purpose: Hold salon-specific copy, assets, booking mode, SEO, services, and legal text
- Contains: `content/site.ts`, `content/home.ts`, `content/services.ts`, `content/team.ts`, `content/gallery.ts`, `content/legal.ts`
- Depends on: TypeScript only
- Used by: routes, helpers, and booking catalog helpers

**Helper / Domain Layer:**
- Purpose: Convert config into render-ready actions and small domain helpers
- Contains: `lib/home-page.ts`, `lib/links.ts`, `lib/cn.ts`, `lib/booking/catalog.ts`, `lib/booking/env.ts`
- Depends on: content types and runtime env
- Used by: route files and data setup

**Booking Data Layer:**
- Purpose: Define operational booking schema and database access
- Contains: `db/schema.ts`, `db/index.ts`, `drizzle.config.ts`, `drizzle/0000_previous_oracle.sql`
- Depends on: Drizzle ORM, Neon HTTP client, env vars
- Used by: currently isolated foundation code; no public route consumes it yet

## Data Flow

**Marketing Page Render (`/`):**
1. Next.js enters `app/page.tsx`
2. The route imports repo-owned content from `content/site.ts`, `content/home.ts`, `content/services.ts`, `content/team.ts`, and `content/gallery.ts`
3. `lib/home-page.ts` resolves CTA links and booking-mode behavior
4. The page maps `homePage.sections` into reusable block instances
5. Client-only sections (`services-grid`, `gallery-grid`, `reveal`) hydrate for accordion state, image fallback handling, and motion

**Legal Page Render (`/impressum`, `/datenschutz`):**
1. Next.js enters the page file in `app/impressum/page.tsx` or `app/datenschutz/page.tsx`
2. Legal copy is pulled from `content/legal.ts`
3. Contact and ownership data come from `content/site.ts`
4. `components/blocks/legal-page.tsx` provides the two-column shell and shared styling

**Booking Shell Render (`/termin-buchen`):**
1. Next.js enters `app/termin-buchen/page.tsx`
2. The page reads `site.booking.mode` from `content/site.ts`
3. Shared contact actions are resolved through `lib/home-page.ts`
4. The page renders either a booking placeholder or contact-only guidance
5. No form submission, availability lookup, DB read, or API call occurs yet

**Database Setup Flow:**
1. A server-side consumer imports `db/index.ts`
2. `db/index.ts` calls `getBookingEnv()` from `lib/booking/env.ts`
3. `DATABASE_URL` is read from the environment and passed to Neon
4. Drizzle is initialized with the schema from `db/schema.ts`

**State Management:**
- File-based content/config drives most of the product state
- Client state is local and minimal (`openCategory` in `components/blocks/services-grid.tsx`, `failedSrc` in `components/blocks/gallery-grid.tsx`)
- No global store, API cache layer, or auth/session state exists yet

## Key Abstractions

**Site Configuration:**
- Purpose: One typed source of truth for brand, contact, SEO, and booking mode
- Example: `site` in `content/site.ts`
- Pattern: static config object with exported TypeScript types

**Homepage Contract:**
- Purpose: Control section order and CTA behavior without hardcoding content inside blocks
- Examples: `homePage` and `HomeAction` in `content/home.ts`
- Pattern: config-first page composition

**Reusable Blocks + UI Primitives:**
- Purpose: Keep salon-specific content separate from reusable rendering logic
- Examples: `Hero`, `ServicesGrid`, `ContactBlock`, `Button`, `Card`, `Heading`
- Pattern: prop-driven composition

**Booking Service Snapshot:**
- Purpose: Freeze service metadata for future booking records while reusing the marketing catalog
- Examples: `createBookingServiceSnapshot()` and `BookingServiceSnapshot` in `lib/booking/catalog.ts`
- Pattern: derive operational payloads from content models

## Entry Points

**Application Shell:**
- Location: `app/layout.tsx`
- Triggers: every route render
- Responsibilities: global metadata, fonts, global CSS, and footer composition

**Homepage:**
- Location: `app/page.tsx`
- Triggers: request to `/`
- Responsibilities: assemble homepage sections from content/config

**Booking Route Shell:**
- Location: `app/termin-buchen/page.tsx`
- Triggers: request to `/termin-buchen`
- Responsibilities: mode-aware booking/contact placeholder

**Database Bootstrap:**
- Location: `db/index.ts`
- Triggers: server-side import by future booking/admin code
- Responsibilities: env validation and Drizzle client creation

## Error Handling

**Strategy:** Fail fast for missing booking env, otherwise rely on framework defaults

**Patterns:**
- `lib/booking/env.ts` throws immediately when required booking env vars are missing
- `drizzle.config.ts` throws if `DATABASE_URL` is absent for CLI commands
- Render paths do not define custom error boundaries or domain-specific error types

## Cross-Cutting Concerns

**Booking Mode Gating:**
- `content/site.ts` controls whether booking is `contact_only` or `online_booking`
- `lib/home-page.ts`, `app/page.tsx`, `app/layout.tsx`, and `app/termin-buchen/page.tsx` all branch on this config

**Styling / Visual System:**
- Global design tokens live in `app/globals.css`
- Shared spacing, cards, typography, and buttons are centralized under `components/ui/`

**Motion:**
- Motion is wrapped in `components/ui/reveal.tsx`
- `useReducedMotion()` is respected to avoid forcing animation

**Project Handoff Context:**
- `CODEX_CONTEXT.md` documents intended future architecture beyond what is implemented today
- It is operationally important for future planning, but it is not part of runtime execution

---
*Architecture analysis: 2026-04-10*
*Update when major patterns change*
