---
phase: 01-builder-boundaries-mode-hardening
plan: 03
subsystem: boundaries
tags: [nextjs, app-router, brochure-boundaries, booking, admin, vitest]
requires:
  - phase: 01-01
    provides: booking config split and brochure-safe mode selectors
  - phase: 01-02
    provides: unit harness and public mode contract coverage
provides:
  - thin termin-buchen route composition with route-local presentation modules
  - explicit admin route boundary placeholder under app/admin
  - shared footer and layout public action wiring from lib/site-mode
  - brochure boundary regression coverage for booking and db import leakage
affects: [app-layout, site-footer, termin-buchen, admin-boundary, tests]
tech-stack:
  added: []
  patterns:
    - route-local private folders for booking and admin surfaces
    - shared public action selectors for brochure navigation surfaces
    - source-level regression tests for brochure import boundaries
key-files:
  created:
    - app/termin-buchen/_components/booking-entry-shell.tsx
    - app/termin-buchen/_lib/booking-entry-content.ts
    - app/admin/page.tsx
    - app/admin/_components/admin-shell.tsx
    - tests/phase-1/content-boundaries.test.ts
  modified:
    - app/termin-buchen/page.tsx
    - app/layout.tsx
    - components/blocks/site-footer.tsx
    - lib/site-mode.ts
key-decisions:
  - "The real booking entry surface stays under app/termin-buchen/* with non-routable _components and _lib support files."
  - "The admin area gets its own route tree immediately, even before auth is implemented, to preserve a clean future access-control boundary."
  - "Layout and footer now consume shared public site actions from lib/site-mode instead of deciding from raw contact props or booking href branches."
patterns-established:
  - "Brochure layout surfaces receive pre-resolved public actions instead of raw phone/email primitives."
  - "Boundary regression tests read brochure entrypoints as source files to catch booking-engine or db import drift."
requirements-completed: [BUIL-01, BUIL-02]
duration: 17 min
completed: 2026-04-10
---

# Phase 01 Plan 03: Boundary Isolation Summary

**Thin booking-route composition, explicit admin route separation, and shared brochure action wiring backed by boundary regression tests**

## Performance

- **Duration:** 17 min
- **Started:** 2026-04-10T15:58:00+02:00
- **Completed:** 2026-04-10T16:15:18+02:00
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Moved `/termin-buchen` presentation and content assembly into private route-local modules so `app/termin-buchen/page.tsx` is now a thin composition file.
- Added `app/admin/page.tsx` and `app/admin/_components/admin-shell.tsx` as an explicit admin boundary with no brochure, booking-engine, or database imports.
- Replaced footer-specific booking/contact decisions with shared `resolvePublicSiteActions()` output from `lib/site-mode.ts`.
- Added `tests/phase-1/content-boundaries.test.ts` to lock brochure import boundaries and shared footer/layout selector usage.

## Task Commits

1. **Task 1: Move booking-entry presentation into route-local modules and create the admin boundary** - `dec940b` (`feat`)
2. **Task 2: Feed layout and footer from shared public actions and lock the boundary with tests** - `fa92c13` (`feat`)

## Verification

- `npm.cmd run lint`
- `npm.cmd run test:unit -- tests/phase-1/content-boundaries.test.ts`
- `npm.cmd run build`
- Local smoke check via `npm.cmd run start` + HTTP requests:
  - `/` -> `200`
  - `/admin` -> `200`

## Decisions Made

- Booking entry composition now belongs to the booking route tree, not the brochure layer, which keeps future booking flow work physically contained.
- The admin placeholder intentionally uses only shared UI primitives so later auth and operations work can land behind a clean route boundary.
- Footer actions are now derived from the same brochure-safe selector layer as the rest of the public site, removing a drift path from layout/footer wiring.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed a syntax error in the new boundary regression test**
- **Found during:** Task 2 verification
- **Issue:** `tests/phase-1/content-boundaries.test.ts` was missing the closing `describe()` terminator, which broke linting.
- **Fix:** Added the missing closing line and reran verification.
- **Files modified:** `tests/phase-1/content-boundaries.test.ts`
- **Verification:** `npm.cmd run lint`, `npm.cmd run test:unit -- tests/phase-1/content-boundaries.test.ts`, `npm.cmd run build`
- **Committed in:** `fa92c13`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** No scope expansion; required to complete planned verification.

## Known Stubs

- `app/admin/page.tsx` and `app/admin/_components/admin-shell.tsx`: intentional placeholder boundary for later protected admin work. This plan required the boundary, not auth or operational features.

## Threat Flags

None.

## Self-Check: PASSED

- Summary file exists.
- Task commits `dec940b` and `fa92c13` exist in git history.

---
*Phase: 01-builder-boundaries-mode-hardening*
*Completed: 2026-04-10*
