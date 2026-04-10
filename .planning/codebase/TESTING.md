# Testing Patterns

**Analysis Date:** 2026-04-10

## Test Framework

**Runner:**
- None configured
- There is no `test` script in `package.json`
- No Jest, Vitest, Playwright, Cypress, or similar dependency is installed

**Assertion Library:**
- None configured

**Current verification commands:**
```bash
npm run lint          # ESLint + Next.js rules
npm run build         # Production build validation
npm run db:generate   # Drizzle schema to SQL generation
npm run db:migrate    # Database migration execution
```

On this machine, `README.md` recommends `npm.cmd` instead of bare `npm` in PowerShell.

## Test File Organization

**Location:**
- No `tests/` directory exists
- No collocated `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` files were found

**Naming:**
- No project-level naming convention has been established yet for automated tests

**Structure:**
```text
Current state:
- application source only
- no automated test tree
- verification happens through lint/build/manual checks
```

## Test Structure

**Current pattern:**
- Static checks through TypeScript + ESLint
- Manual smoke testing through `npm run dev`
- Schema verification through Drizzle generation/migration commands

**Implication:**
- There is no existing `describe` / `it` structure to copy
- Any new test suite will need to establish both the runner and the file placement convention

## Mocking

**Framework:**
- None configured

**Observed pattern:**
- No mock utilities, fixtures, or test helpers exist in the repo

**Practical consequence:**
- Future work that adds booking APIs, auth, or availability logic will also need to define how external systems such as Neon and email providers are mocked

## Fixtures and Factories

**Current state:**
- None

**Closest existing reusable data sources:**
- `content/site.ts`
- `content/home.ts`
- `content/services.ts`
- `content/team.ts`
- `content/gallery.ts`

These are runtime content/config modules, not dedicated test fixtures.

## Coverage

**Requirements:**
- No coverage target is defined
- No coverage command or reporting setup exists

**Enforcement:**
- None

## Test Types

**Unit Tests:**
- Not implemented

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Not implemented

**Manual / static verification actually in use:**
- Linting (`eslint.config.mjs`)
- Production build validation
- Manual route checks in the browser
- Drizzle migration generation for schema sanity

## Common Patterns

**What is already safe to validate today:**
- Pure helpers such as `lib/links.ts`, `lib/home-page.ts`, and `lib/booking/catalog.ts`
- Render/build regressions via `npm run build`
- Schema drift via `npm run db:generate`

**Highest-value future test additions:**
- Booking-mode branching in `lib/home-page.ts`
- Service catalog helpers in `lib/booking/catalog.ts`
- Booking env validation in `lib/booking/env.ts`
- Route-level rendering for `/` and `/termin-buchen`
- Eventually the booking/admin backend once API routes exist

---
*Testing analysis: 2026-04-10*
*Update when automated testing is introduced or changed*
