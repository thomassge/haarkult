# Coding Conventions

**Analysis Date:** 2026-04-10

## Naming Patterns

**Files:**
- kebab-case for most source files (`site-footer.tsx`, `home-page.ts`, `services-grid.tsx`)
- Framework-reserved route names for Next.js (`page.tsx`, `layout.tsx`)
- No existing `*.test.ts` or `*.spec.ts` pattern yet

**Functions:**
- camelCase for helpers and utilities (`resolvePageActions`, `fillMessageTemplate`, `getBookingEnv`)
- PascalCase for React component exports (`Hero`, `ContactBlock`, `LegalPage`)
- No special prefix for async functions because the current codebase has almost no async application helpers yet

**Variables:**
- camelCase for local variables and objects (`bookingAction`, `fallbackContactActions`, `failedSrc`)
- lowercase `const` arrays are used as enum-like sources of truth (`homeSectionIds`, `bookingModes`, `bookingFallbackActionKinds`)
- No underscore prefix convention is used

**Types:**
- PascalCase for type aliases (`SiteConfig`, `HomeAction`, `BookingEnv`, `Service`)
- `as const` arrays plus derived unions are preferred for constrained string sets in content/config modules
- Drizzle enums use exported `const` identifiers ending in `Enum` (`bookingStatusEnum`, `adminRoleEnum`)

## Code Style

**Formatting:**
- The repo is consistently formatted with 2-space indentation
- Double quotes are used for strings
- Semicolons are required
- Trailing commas appear where Prettier/TypeScript formatting would add them

**Linting:**
- ESLint flat config lives in `eslint.config.mjs`
- The project extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Run via `npm run lint` (or `npm.cmd run lint` on this PowerShell setup)

**TypeScript:**
- `tsconfig.json` enables `strict`, `noEmit`, `isolatedModules`, and path aliasing
- Types are pushed to the edges of config/content modules instead of relying on `any`

## Import Organization

**Order:**
1. External packages and framework imports (`react`, `next/*`, `framer-motion`)
2. Internal modules via the `@/*` alias
3. Relative imports when required (for example `./globals.css` in `app/layout.tsx`)

**Grouping:**
- A blank line usually separates external imports from internal alias imports
- `import type` is used explicitly for type-only imports
- Imports are generally kept concise rather than heavily sorted or grouped by comments

**Path Aliases:**
- `@/*` maps to the repository root via `tsconfig.json`
- Most application code uses the alias instead of deep relative paths

## Error Handling

**Patterns:**
- Fail fast on missing booking env vars in `lib/booking/env.ts`
- Fail fast in CLI config for missing DB config in `drizzle.config.ts`
- Keep render-time helpers pure and branch-driven instead of wrapping everything in try/catch

**Error Types:**
- Standard `Error` is used; there are no custom domain error classes yet
- No `Result` abstraction or centralized error helper exists

## Logging

**Framework:**
- None

**Patterns:**
- No committed `console.*` logging was found in the application code
- Operational visibility currently depends on framework/runtime defaults rather than explicit app logging

## Comments

**When to Comment:**
- Comments are sparse and usually explain intent or editorial guidance, not obvious mechanics
- Content/config files contain short, human-readable comments where the repo acts as a builder template (`content/home.ts`, `content/services.ts`)
- Inline comments are not overused in UI components

**Language:**
- User-facing content and some comments are German
- Technical identifiers remain English

**JSDoc / TSDoc:**
- Not commonly used in the current codebase

## Function Design

**Size:**
- Helpers are generally short and single-purpose (`telHref`, `formatAddressLine`, `getBookableServiceById`)
- Larger render functions stay readable by delegating UI structure into reusable components

**Parameters:**
- Props objects are typed explicitly for components
- Utility functions prefer small positional parameter lists until an options object becomes necessary

**Return Values:**
- Guard clauses are used for optional behavior (`if (!site.socials.instagram) return []`)
- Data derivation is favored over mutation

## Module Design

**Exports:**
- Named exports are preferred for utilities, content modules, and reusable components
- Default exports are reserved for Next.js route components (`app/*/page.tsx`, `app/layout.tsx`)

**Boundaries:**
- `content/*` is the source of truth for salon-specific data
- `components/blocks/*` should receive props rather than importing salon content directly
- `lib/booking/*` is the intended boundary for booking-specific domain helpers

**Barrel Files:**
- None are used
- Modules are imported directly from their file paths

---
*Convention analysis: 2026-04-10*
*Update when patterns change*
