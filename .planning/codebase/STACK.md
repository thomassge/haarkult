# Technology Stack

**Analysis Date:** 2026-04-10

## Languages

**Primary:**
- TypeScript - All application, content, database schema, and utility code in `app/`, `components/`, `content/`, `lib/`, and `db/`

**Secondary:**
- JavaScript (ES modules) - Tooling config in `eslint.config.mjs` and `postcss.config.mjs`
- JSON - Package metadata and TypeScript config in `package.json`, `package-lock.json`, `tsconfig.json`, and `drizzle/meta/*.json`
- SQL - Generated schema migration in `drizzle/0000_previous_oracle.sql`
- Markdown - Human workflow context in `README.md` and `CODEX_CONTEXT.md`

## Runtime

**Environment:**
- Node.js - Required for Next.js, ESLint, and Drizzle CLI; the repo does not pin an `engines` version in `package.json`
- Browser runtime - Selective client-side hydration for animated and interactive blocks in `components/ui/reveal.tsx`, `components/blocks/services-grid.tsx`, and `components/blocks/gallery-grid.tsx`

**Package Manager:**
- npm - Documented in `README.md`
- Lockfile: `package-lock.json` is committed

## Frameworks

**Core:**
- Next.js 16.1.6 - App Router application shell and page rendering (`app/layout.tsx`, `app/page.tsx`, `app/*/page.tsx`)
- React 19.2.3 - Component model for server and client rendering
- Tailwind CSS 4 - Styling via utility classes and `@theme` tokens in `app/globals.css`

**Animation / UI:**
- Framer Motion 12.38.0 - Selective reveal/stagger motion in `components/ui/reveal.tsx`

**Data / Booking Foundation:**
- Drizzle ORM 0.45.2 - Database schema and Neon HTTP client adapter in `db/schema.ts` and `db/index.ts`
- Neon serverless driver 1.0.2 - Postgres access in `db/index.ts`
- drizzle-kit 0.31.10 - Migration generation and execution via `npm run db:generate` and `npm run db:migrate`

**Testing:**
- No automated test framework is configured in `package.json`

**Build / Dev:**
- TypeScript 5 - Static typing with strict mode in `tsconfig.json`
- ESLint 9 with `eslint-config-next` - Linting via `npm run lint`
- dotenv 17.4.1 - Env loading for Drizzle CLI through `drizzle.config.ts`

## Key Dependencies

**Critical:**
- `next` 16.1.6 - Application runtime, routing, metadata, image optimization, and build pipeline
- `react` / `react-dom` 19.2.3 - Component rendering model used across the app
- `framer-motion` 12.38.0 - Required for the reusable reveal and stagger helpers
- `drizzle-orm` 0.45.2 - Typed schema and database access foundation for the booking track
- `@neondatabase/serverless` 1.0.2 - External Postgres client used by Drizzle

**Infrastructure:**
- `dotenv` 17.4.1 - Loads `DATABASE_URL` for Drizzle commands
- `eslint` 9 and `eslint-config-next` 16.1.6 - Enforce Next.js + TypeScript lint rules
- `@tailwindcss/postcss` 4 and `tailwindcss` 4 - Tailwind CSS build integration

## Configuration

**Environment:**
- Booking-related env vars are documented in `.env.example`
- Runtime env access is centralized in `lib/booking/env.ts`
- Drizzle CLI requires `DATABASE_URL` via `drizzle.config.ts`

**Build:**
- `next.config.ts` - Redirect rules
- `tsconfig.json` - Strict TypeScript config and `@/*` path alias
- `eslint.config.mjs` - Flat ESLint config using Next presets
- `postcss.config.mjs` - Tailwind PostCSS integration
- `drizzle.config.ts` - Schema path and migration output

## Platform Requirements

**Development:**
- Any Node-compatible OS should work, but `README.md` explicitly documents `npm.cmd` usage for this PowerShell setup
- No Docker, local database container, or CI-only toolchain is required by the repo itself

**Production:**
- Inference: a Node-compatible Next.js host is expected, but no deployment config is committed
- When booking infrastructure is used, a reachable PostgreSQL database is required through `DATABASE_URL`
- Static assets are served from `public/`; generated build output lands in `.next/`

---
*Stack analysis: 2026-04-10*
*Update after major dependency changes*
