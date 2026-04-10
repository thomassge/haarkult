# Codebase Structure

**Analysis Date:** 2026-04-10

## Directory Layout

```text
haarkult/
|- app/                 # Next.js App Router entry points and global styles
|  |- datenschutz/      # Privacy page route
|  |- impressum/        # Imprint page route
|  \- termin-buchen/    # Booking/contact route shell
|- components/          # Reusable UI system and page blocks
|  |- blocks/           # Section-level components
|  \- ui/               # Design primitives and motion helpers
|- content/             # Typed salon-specific content and config
|- db/                  # Drizzle schema and DB bootstrap
|- drizzle/             # Generated SQL migration and Drizzle metadata
|  \- meta/             # Generated migration snapshots
|- lib/                 # Shared helpers and small domain modules
|  \- booking/          # Booking-specific helpers and env access
|- public/              # Static images, icons, and brand assets
|  |- brand/            # Brand images and logo
|  |- gallery/          # Gallery images
|  \- team/             # Team photos
|- .next/               # Generated Next.js build/dev output
|- .planning/codebase/  # Generated GSD codebase map
|- CODEX_CONTEXT.md     # Human handoff and future-work context
|- README.md            # Project overview and local dev guidance
|- package.json         # Scripts and dependency manifest
\- tsconfig.json        # TypeScript compiler config
```

## Directory Purposes

**app/**
- Purpose: Page entry points, metadata, and global styling
- Contains: `page.tsx`, `layout.tsx`, route folders with their own `page.tsx`, and `globals.css`
- Key files: `app/page.tsx`, `app/layout.tsx`, `app/termin-buchen/page.tsx`
- Subdirectories: route folders named after URL paths

**components/blocks/**
- Purpose: Reusable, prop-driven sections composed by route files
- Contains: hero, services, gallery, team, contact, legal, and footer blocks
- Key files: `components/blocks/hero.tsx`, `components/blocks/services-grid.tsx`, `components/blocks/legal-page.tsx`
- Subdirectories: none; flat block inventory

**components/ui/**
- Purpose: Shared design-system primitives
- Contains: button, card, typography, layout wrappers, and motion helpers
- Key files: `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/reveal.tsx`
- Subdirectories: none

**content/**
- Purpose: Repo-owned salon content and product configuration
- Contains: typed objects for site identity, homepage order, services, team, gallery, and legal text
- Key files: `content/site.ts`, `content/home.ts`, `content/services.ts`, `content/legal.ts`
- Subdirectories: none

**lib/**
- Purpose: Shared helpers that are not full UI components
- Contains: URL helpers, homepage action resolution, utility class joining
- Key files: `lib/home-page.ts`, `lib/links.ts`, `lib/cn.ts`
- Subdirectories: `lib/booking/` for booking helpers

**lib/booking/**
- Purpose: Booking-domain support code that should stay isolated from marketing components
- Contains: env access and service catalog helpers
- Key files: `lib/booking/env.ts`, `lib/booking/catalog.ts`
- Subdirectories: none yet

**db/**
- Purpose: Booking/admin data model and DB connection bootstrap
- Contains: `schema.ts` and `index.ts`
- Key files: `db/schema.ts`, `db/index.ts`
- Subdirectories: none

**drizzle/**
- Purpose: Generated migration artifacts
- Contains: SQL migration files plus metadata snapshots
- Key files: `drizzle/0000_previous_oracle.sql`, `drizzle/meta/0000_snapshot.json`
- Subdirectories: `meta/` for snapshot bookkeeping

**public/**
- Purpose: Static assets referenced by content/config
- Contains: brand, gallery, and team imagery plus SVG/icon assets
- Key files: `public/brand/haarkult-logo.png`, `public/gallery/Salon.png`, `public/team/MariaSamartzidou.jpg`
- Subdirectories: `brand/`, `gallery/`, `team/`

## Key File Locations

**Entry Points:**
- `app/layout.tsx` - Global app shell, metadata, footer, fonts, and CSS import
- `app/page.tsx` - Homepage composition
- `app/termin-buchen/page.tsx` - Booking/contact route shell
- `app/impressum/page.tsx` - Imprint route
- `app/datenschutz/page.tsx` - Privacy route

**Configuration:**
- `package.json` - Scripts and dependency versions
- `tsconfig.json` - TypeScript strict mode and `@/*` alias
- `eslint.config.mjs` - ESLint flat config
- `next.config.ts` - Redirect rules
- `drizzle.config.ts` - DB schema/migration configuration
- `.env.example` - Booking env contract

**Core Logic:**
- `content/site.ts` - Brand/contact/SEO/booking mode contract
- `content/home.ts` - Homepage section order and CTA definitions
- `content/services.ts` - Service catalog and booking metadata
- `lib/home-page.ts` - CTA resolution and booking-mode branching
- `db/schema.ts` - Booking/admin schema

**Testing:**
- No `tests/` directory, `*.test.*`, or `*.spec.*` files currently exist

**Documentation:**
- `README.md` - Project usage and maintenance notes
- `CODEX_CONTEXT.md` - Ongoing architecture/product handoff
- `.planning/codebase/*.md` - Generated codebase map docs

## Naming Conventions

**Files:**
- kebab-case file names for most modules (`site-footer.tsx`, `home-page.ts`, `services-grid.tsx`)
- Next.js route files use framework naming (`page.tsx`, `layout.tsx`)
- Content files are singular domain nouns (`site.ts`, `team.ts`, `gallery.ts`)

**Directories:**
- lowercase directory names throughout (`app`, `components`, `content`, `public`)
- semantic grouping by role rather than by feature slices

**Special Patterns:**
- `content/*.ts` holds repo-owned content/config, not rendering logic
- `components/blocks/*.tsx` renders section-level UI
- `components/ui/*.tsx` holds reusable primitives
- `drizzle/` is generated output and should not be edited casually by hand

## Where to Add New Code

**New marketing page:**
- Primary code: `app/<route>/page.tsx`
- Reusable sections: `components/blocks/`
- Supporting content/config: `content/`

**New reusable UI primitive:**
- Implementation: `components/ui/`
- Consumers: section blocks in `components/blocks/`

**New booking-domain helper:**
- Implementation: `lib/booking/`
- Schema changes: `db/schema.ts` plus new generated files under `drizzle/`

**New booking route or API surface:**
- Page shell: `app/<route>/page.tsx`
- Recommended server endpoints: `app/api/...` (not present yet, but consistent with Next.js structure)
- Shared domain logic: `lib/booking/`

**Tests:**
- No house location is established yet
- If tests are introduced, decide explicitly between collocated `*.test.ts(x)` files and a top-level `tests/` directory before scaling coverage

## Special Directories

**.next/**
- Purpose: Next.js generated build/dev output
- Source: created by `next dev` / `next build`
- Committed: No

**drizzle/**
- Purpose: Generated migration SQL and metadata snapshots
- Source: `drizzle-kit generate`
- Committed: Yes

**.planning/codebase/**
- Purpose: Generated GSD analysis docs
- Source: `gsd-map-codebase`
- Committed: Intended to be committed by this workflow

---
*Structure analysis: 2026-04-10*
*Update when directory structure changes*
