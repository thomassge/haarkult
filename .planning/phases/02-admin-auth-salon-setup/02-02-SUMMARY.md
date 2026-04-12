---
phase: 02-admin-auth-salon-setup
plan: 02
subsystem: admin-setup
tags: [admin, staff, booking, drizzle, zod, server-actions]

requires:
  - phase: 02-admin-auth-salon-setup
    provides: Protected admin auth foundation and requireAdmin session guard
provides:
  - Protected /admin/stylisten setup route for operational booking staff
  - Zod validation for staff inputs and catalog-backed service assignments
  - Authorized Server Actions for stylist save and deactivate flows
  - Setup completion derivation from active staff, service assignments, and weekly hours
affects: [phase-03-public-booking-engine, phase-04-staff-operations]

tech-stack:
  added: []
  patterns:
    - Lazy DB imports keep pure setup modules importable without DATABASE_URL
    - Staff service assignments persist service IDs only and derive labels from the catalog
    - Admin Server Actions call requireAdmin before operational setup mutations

key-files:
  created:
    - lib/booking/setup-validation.ts
    - lib/booking/setup-queries.ts
    - lib/booking/setup-actions.ts
    - app/admin/stylisten/page.tsx
    - app/admin/stylisten/_components/stylist-setup-form.tsx
    - tests/phase-2/staff-validation.test.ts
    - tests/phase-2/service-assignment.test.ts
    - tests/phase-2/setup-completion.test.ts
  modified:
    - app/admin/page.tsx
    - app/admin/_components/admin-shell.tsx

key-decisions:
  - "Keep setup queries lazy-loading the database so unit tests can import pure helpers without booking env vars."
  - "Treat Alle Leistungen as a form convenience that resolves to current bookable service IDs at write time."
  - "Keep staff deactivation non-destructive by updating active=false."

patterns-established:
  - "Operational booking staff is database-owned and separate from public marketing team content."
  - "Service assignment DTOs may display catalog labels, but persistence stores only staffId and serviceId."
  - "Setup completion is derived server-side from active staff rows, service assignments, and weekly ranges."

requirements-completed: [ADMN-06, STAF-01, STAF-02]

duration: 8 min
completed: 2026-04-12
---

# Phase 02 Plan 02: Staff Setup Summary

**Protected stylist setup with catalog-backed service assignment, authorized Server Actions, and setup-completion status**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-12T18:48:55Z
- **Completed:** 2026-04-12T18:57:15Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- Added staff and service-assignment validation with stable slugs, active defaults, all-services resolution, and unknown service rejection.
- Added setup DTO queries that derive display labels from `bookableServices` while keeping `staff_services` persistence to service IDs only.
- Added protected stylist setup UI at `/admin/stylisten` with German create, edit, service assignment, and deactivate forms.
- Updated `/admin` to show setup progress and exact missing setup items for stylists, services, and weekly hours.

## Task Commits

1. **Task 1 RED: failing setup validation tests** - `ddd8509` (test)
2. **Task 1 GREEN: setup validation and completion helpers** - `d7442c4` (feat)
3. **Task 2 RED: failing setup action/query tests** - `6f15cf7` (test)
4. **Task 2 GREEN: authorized actions and setup queries** - `ec1717c` (feat)
5. **Task 3: protected stylist setup UI** - `62fe4c5` (feat)

## Files Created/Modified

- `lib/booking/setup-validation.ts` - Zod schemas, staff slug normalization, known bookable service validation, and assignment resolution.
- `lib/booking/setup-queries.ts` - Setup DTOs, catalog-backed service display mapping, setup data queries, and completion derivation.
- `lib/booking/setup-actions.ts` - Guarded stylist save/deactivate Server Actions with transactional service assignment replacement.
- `app/admin/page.tsx` - Protected setup dashboard with onboarding status and setup counts.
- `app/admin/_components/admin-shell.tsx` - Dashboard shell status slot and card status text.
- `app/admin/stylisten/page.tsx` - Protected focused stylist setup route.
- `app/admin/stylisten/_components/stylist-setup-form.tsx` - Server-action forms for staff details, active state, all services, selected services, and deactivation.
- `tests/phase-2/staff-validation.test.ts` - Staff input, slug, and content-boundary tests.
- `tests/phase-2/service-assignment.test.ts` - All-services, individual service, unknown service, and action-source tests.
- `tests/phase-2/setup-completion.test.ts` - Setup-completion and catalog DTO tests.

## Decisions Made

- Used lazy `await import("@/db")` inside DB-backed functions so pure validation/completion tests do not need `DATABASE_URL`.
- Kept `Alle Leistungen` as a boolean input path that expands to all current `bookableServices` IDs before persistence.
- Used non-destructive staff deactivation to preserve existing operational rows for future booking references.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Tightened deactivate action ID validation**
- **Found during:** Task 3 (Build protected stylist setup page and dashboard setup cards)
- **Issue:** `deactivateStylistAction` parsed an optional ID, which made `eq(staff.id, id)` fail TypeScript during `next build`.
- **Fix:** Required and parsed the `id` field before issuing the update.
- **Files modified:** `lib/booking/setup-actions.ts`
- **Verification:** `npm.cmd run build`
- **Committed in:** `62fe4c5`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Build correctness improved without expanding scope.

## Issues Encountered

- Initial Vitest execution hit a Windows `spawn EPERM` while loading config in the sandbox. The same command succeeded after approved escalation and subsequent test runs completed normally.

## Known Stubs

None.

## Threat Flags

None beyond the planned admin Server Action, catalog assignment, and setup DTO trust boundaries in the plan threat model.

## User Setup Required

None - no new external service configuration required.

## Verification

- `npm.cmd run test:unit -- tests/phase-2/staff-validation.test.ts tests/phase-2/service-assignment.test.ts tests/phase-2/setup-completion.test.ts tests/phase-1/content-boundaries.test.ts` - passed, 17 tests.
- `npm.cmd run lint` - passed.
- `npm.cmd run build` - passed.
- Manual DB smoke was not run because this environment does not include real admin login and database secrets.

## Next Phase Readiness

Plan 02-03 can build weekly hours and availability exception management on top of active staff rows and setup completion. Public booking work can later consume operational staff and service IDs without importing `content/team.ts`.

## Self-Check: PASSED

- Summary file exists.
- Task commits exist: `ddd8509`, `d7442c4`, `6f15cf7`, `ec1717c`, `62fe4c5`.
- Key files exist: `lib/booking/setup-validation.ts`, `lib/booking/setup-queries.ts`, `lib/booking/setup-actions.ts`, `app/admin/stylisten/page.tsx`, `app/admin/stylisten/_components/stylist-setup-form.tsx`, and the three Phase 2 test files.

---
*Phase: 02-admin-auth-salon-setup*
*Completed: 2026-04-12*
