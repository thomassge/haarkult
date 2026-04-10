<!-- GSD:project-start source:PROJECT.md -->
## Project

**Haarkult Salon Builder**

This project starts as the real website for the user's mother's salon, Haarkult-Maintal. It is also intended to become a reusable salon website system where most variation between salons comes from swapping structured salon information, services, staff data, and assets instead of rebuilding the application.

The current priority is to complete the salon-specific booking and admin product on top of the existing brochure site, while keeping the architecture reusable for other hair salons later.

**Core Value:** A salon should be able to run a premium website with either contact-only mode or real booking mode by changing salon-specific content and configuration, not by rewriting the codebase.

### Constraints

- **Scope**: Hair salons only for the current project - future vertical expansion must not dilute the salon-first delivery
- **Product Modes**: Support both `contact_only` and `booking` - some salons only need an informational/contact website
- **Content Model**: Salon-specific content and assets must be easy to replace - reuse depends on structured, swappable salon data
- **Booking Reuse**: Booking and admin logic should be shared across salons - avoid per-salon branching in the core booking engine
- **UX Rule**: Stylist selection must be conditional - if there is only one stylist, clients should not be asked to choose
- **Language**: German content only - matches the current target market and existing product direction
- **Content Operations**: No CMS for now - repo-driven content is simpler and already aligned with the current architecture
- **Auth/Product Scope**: Customer accounts are out of scope for v1 - booking remains guest-first
- **Payments**: No online payments in the first booking release - focus on scheduling and salon operations first
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript - All application, content, database schema, and utility code in `app/`, `components/`, `content/`, `lib/`, and `db/`
- JavaScript (ES modules) - Tooling config in `eslint.config.mjs` and `postcss.config.mjs`
- JSON - Package metadata and TypeScript config in `package.json`, `package-lock.json`, `tsconfig.json`, and `drizzle/meta/*.json`
- SQL - Generated schema migration in `drizzle/0000_previous_oracle.sql`
- Markdown - Human workflow context in `README.md` and `CODEX_CONTEXT.md`
## Runtime
- Node.js - Required for Next.js, ESLint, and Drizzle CLI; the repo does not pin an `engines` version in `package.json`
- Browser runtime - Selective client-side hydration for animated and interactive blocks in `components/ui/reveal.tsx`, `components/blocks/services-grid.tsx`, and `components/blocks/gallery-grid.tsx`
- npm - Documented in `README.md`
- Lockfile: `package-lock.json` is committed
## Frameworks
- Next.js 16.1.6 - App Router application shell and page rendering (`app/layout.tsx`, `app/page.tsx`, `app/*/page.tsx`)
- React 19.2.3 - Component model for server and client rendering
- Tailwind CSS 4 - Styling via utility classes and `@theme` tokens in `app/globals.css`
- Framer Motion 12.38.0 - Selective reveal/stagger motion in `components/ui/reveal.tsx`
- Drizzle ORM 0.45.2 - Database schema and Neon HTTP client adapter in `db/schema.ts` and `db/index.ts`
- Neon serverless driver 1.0.2 - Postgres access in `db/index.ts`
- drizzle-kit 0.31.10 - Migration generation and execution via `npm run db:generate` and `npm run db:migrate`
- No automated test framework is configured in `package.json`
- TypeScript 5 - Static typing with strict mode in `tsconfig.json`
- ESLint 9 with `eslint-config-next` - Linting via `npm run lint`
- dotenv 17.4.1 - Env loading for Drizzle CLI through `drizzle.config.ts`
## Key Dependencies
- `next` 16.1.6 - Application runtime, routing, metadata, image optimization, and build pipeline
- `react` / `react-dom` 19.2.3 - Component rendering model used across the app
- `framer-motion` 12.38.0 - Required for the reusable reveal and stagger helpers
- `drizzle-orm` 0.45.2 - Typed schema and database access foundation for the booking track
- `@neondatabase/serverless` 1.0.2 - External Postgres client used by Drizzle
- `dotenv` 17.4.1 - Loads `DATABASE_URL` for Drizzle commands
- `eslint` 9 and `eslint-config-next` 16.1.6 - Enforce Next.js + TypeScript lint rules
- `@tailwindcss/postcss` 4 and `tailwindcss` 4 - Tailwind CSS build integration
## Configuration
- Booking-related env vars are documented in `.env.example`
- Runtime env access is centralized in `lib/booking/env.ts`
- Drizzle CLI requires `DATABASE_URL` via `drizzle.config.ts`
- `next.config.ts` - Redirect rules
- `tsconfig.json` - Strict TypeScript config and `@/*` path alias
- `eslint.config.mjs` - Flat ESLint config using Next presets
- `postcss.config.mjs` - Tailwind PostCSS integration
- `drizzle.config.ts` - Schema path and migration output
## Platform Requirements
- Any Node-compatible OS should work, but `README.md` explicitly documents `npm.cmd` usage for this PowerShell setup
- No Docker, local database container, or CI-only toolchain is required by the repo itself
- Inference: a Node-compatible Next.js host is expected, but no deployment config is committed
- When booking infrastructure is used, a reachable PostgreSQL database is required through `DATABASE_URL`
- Static assets are served from `public/`; generated build output lands in `.next/`
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- kebab-case for most source files (`site-footer.tsx`, `home-page.ts`, `services-grid.tsx`)
- Framework-reserved route names for Next.js (`page.tsx`, `layout.tsx`)
- No existing `*.test.ts` or `*.spec.ts` pattern yet
- camelCase for helpers and utilities (`resolvePageActions`, `fillMessageTemplate`, `getBookingEnv`)
- PascalCase for React component exports (`Hero`, `ContactBlock`, `LegalPage`)
- No special prefix for async functions because the current codebase has almost no async application helpers yet
- camelCase for local variables and objects (`bookingAction`, `fallbackContactActions`, `failedSrc`)
- lowercase `const` arrays are used as enum-like sources of truth (`homeSectionIds`, `bookingModes`, `bookingFallbackActionKinds`)
- No underscore prefix convention is used
- PascalCase for type aliases (`SiteConfig`, `HomeAction`, `BookingEnv`, `Service`)
- `as const` arrays plus derived unions are preferred for constrained string sets in content/config modules
- Drizzle enums use exported `const` identifiers ending in `Enum` (`bookingStatusEnum`, `adminRoleEnum`)
## Code Style
- The repo is consistently formatted with 2-space indentation
- Double quotes are used for strings
- Semicolons are required
- Trailing commas appear where Prettier/TypeScript formatting would add them
- ESLint flat config lives in `eslint.config.mjs`
- The project extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Run via `npm run lint` (or `npm.cmd run lint` on this PowerShell setup)
- `tsconfig.json` enables `strict`, `noEmit`, `isolatedModules`, and path aliasing
- Types are pushed to the edges of config/content modules instead of relying on `any`
## Import Organization
- A blank line usually separates external imports from internal alias imports
- `import type` is used explicitly for type-only imports
- Imports are generally kept concise rather than heavily sorted or grouped by comments
- `@/*` maps to the repository root via `tsconfig.json`
- Most application code uses the alias instead of deep relative paths
## Error Handling
- Fail fast on missing booking env vars in `lib/booking/env.ts`
- Fail fast in CLI config for missing DB config in `drizzle.config.ts`
- Keep render-time helpers pure and branch-driven instead of wrapping everything in try/catch
- Standard `Error` is used; there are no custom domain error classes yet
- No `Result` abstraction or centralized error helper exists
## Logging
- None
- No committed `console.*` logging was found in the application code
- Operational visibility currently depends on framework/runtime defaults rather than explicit app logging
## Comments
- Comments are sparse and usually explain intent or editorial guidance, not obvious mechanics
- Content/config files contain short, human-readable comments where the repo acts as a builder template (`content/home.ts`, `content/services.ts`)
- Inline comments are not overused in UI components
- User-facing content and some comments are German
- Technical identifiers remain English
- Not commonly used in the current codebase
## Function Design
- Helpers are generally short and single-purpose (`telHref`, `formatAddressLine`, `getBookableServiceById`)
- Larger render functions stay readable by delegating UI structure into reusable components
- Props objects are typed explicitly for components
- Utility functions prefer small positional parameter lists until an options object becomes necessary
- Guard clauses are used for optional behavior (`if (!site.socials.instagram) return []`)
- Data derivation is favored over mutation
## Module Design
- Named exports are preferred for utilities, content modules, and reusable components
- Default exports are reserved for Next.js route components (`app/*/page.tsx`, `app/layout.tsx`)
- `content/*` is the source of truth for salon-specific data
- `components/blocks/*` should receive props rather than importing salon content directly
- `lib/booking/*` is the intended boundary for booking-specific domain helpers
- None are used
- Modules are imported directly from their file paths
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Marketing pages are driven by typed repo content in `content/*.ts`
- Route files in `app/` are intentionally thin and compose reusable blocks
- Shared visual primitives live separately from page sections (`components/ui/` vs `components/blocks/`)
- Booking capability is modeled behind config and database modules, but the public flow is still a shell
## Layers
- Purpose: Define page entry points, metadata, and top-level composition
- Contains: `app/layout.tsx`, `app/page.tsx`, `app/termin-buchen/page.tsx`, `app/impressum/page.tsx`, `app/datenschutz/page.tsx`
- Depends on: content/config modules and reusable blocks
- Used by: Next.js runtime
- Purpose: Render reusable page sections from props
- Contains: `components/blocks/hero.tsx`, `components/blocks/services-grid.tsx`, `components/blocks/team-grid.tsx`, `components/blocks/gallery-grid.tsx`, `components/blocks/contact.tsx`, `components/blocks/legal-page.tsx`, `components/blocks/site-footer.tsx`
- Depends on: UI primitives plus typed props
- Used by: page files in `app/`
- Purpose: Shared presentation primitives and motion wrappers
- Contains: `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/container.tsx`, `components/ui/heading.tsx`, `components/ui/reveal.tsx`, `components/ui/section.tsx`, `components/ui/typography.tsx`
- Depends on: React, Tailwind classes, `lib/cn.ts`, and Framer Motion for `reveal.tsx`
- Used by: block components and legal pages
- Purpose: Hold salon-specific copy, assets, booking mode, SEO, services, and legal text
- Contains: `content/site.ts`, `content/home.ts`, `content/services.ts`, `content/team.ts`, `content/gallery.ts`, `content/legal.ts`
- Depends on: TypeScript only
- Used by: routes, helpers, and booking catalog helpers
- Purpose: Convert config into render-ready actions and small domain helpers
- Contains: `lib/home-page.ts`, `lib/links.ts`, `lib/cn.ts`, `lib/booking/catalog.ts`, `lib/booking/env.ts`
- Depends on: content types and runtime env
- Used by: route files and data setup
- Purpose: Define operational booking schema and database access
- Contains: `db/schema.ts`, `db/index.ts`, `drizzle.config.ts`, `drizzle/0000_previous_oracle.sql`
- Depends on: Drizzle ORM, Neon HTTP client, env vars
- Used by: currently isolated foundation code; no public route consumes it yet
## Data Flow
- File-based content/config drives most of the product state
- Client state is local and minimal (`openCategory` in `components/blocks/services-grid.tsx`, `failedSrc` in `components/blocks/gallery-grid.tsx`)
- No global store, API cache layer, or auth/session state exists yet
## Key Abstractions
- Purpose: One typed source of truth for brand, contact, SEO, and booking mode
- Example: `site` in `content/site.ts`
- Pattern: static config object with exported TypeScript types
- Purpose: Control section order and CTA behavior without hardcoding content inside blocks
- Examples: `homePage` and `HomeAction` in `content/home.ts`
- Pattern: config-first page composition
- Purpose: Keep salon-specific content separate from reusable rendering logic
- Examples: `Hero`, `ServicesGrid`, `ContactBlock`, `Button`, `Card`, `Heading`
- Pattern: prop-driven composition
- Purpose: Freeze service metadata for future booking records while reusing the marketing catalog
- Examples: `createBookingServiceSnapshot()` and `BookingServiceSnapshot` in `lib/booking/catalog.ts`
- Pattern: derive operational payloads from content models
## Entry Points
- Location: `app/layout.tsx`
- Triggers: every route render
- Responsibilities: global metadata, fonts, global CSS, and footer composition
- Location: `app/page.tsx`
- Triggers: request to `/`
- Responsibilities: assemble homepage sections from content/config
- Location: `app/termin-buchen/page.tsx`
- Triggers: request to `/termin-buchen`
- Responsibilities: mode-aware booking/contact placeholder
- Location: `db/index.ts`
- Triggers: server-side import by future booking/admin code
- Responsibilities: env validation and Drizzle client creation
## Error Handling
- `lib/booking/env.ts` throws immediately when required booking env vars are missing
- `drizzle.config.ts` throws if `DATABASE_URL` is absent for CLI commands
- Render paths do not define custom error boundaries or domain-specific error types
## Cross-Cutting Concerns
- `content/site.ts` controls whether booking is `contact_only` or `online_booking`
- `lib/home-page.ts`, `app/page.tsx`, `app/layout.tsx`, and `app/termin-buchen/page.tsx` all branch on this config
- Global design tokens live in `app/globals.css`
- Shared spacing, cards, typography, and buttons are centralized under `components/ui/`
- Motion is wrapped in `components/ui/reveal.tsx`
- `useReducedMotion()` is respected to avoid forcing animation
- `CODEX_CONTEXT.md` documents intended future architecture beyond what is implemented today
- It is operationally important for future planning, but it is not part of runtime execution
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
