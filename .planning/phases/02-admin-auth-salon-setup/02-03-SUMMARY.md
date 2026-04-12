---
phase: 02-admin-auth-salon-setup
plan: 03
subsystem: admin-setup
tags: [admin, scheduling, availability, drizzle, zod, server-actions]

requires:
  - phase: 02-admin-auth-salon-setup
    provides: Protected admin auth, staff setup, service assignment, and setup completion foundation
provides:
  - Protected /admin/zeiten setup route for recurring weekly working hours
  - Protected /admin/ausnahmen setup route for vacation, break, and blocked-time exceptions
  - Zod validation for ISO weekdays, slot-aligned weekly ranges, no-overlap checks, and exception windows
  - Drizzle check constraints and migration for weekly range and exception window validity
  - Authorized Server Actions and DTO queries for weekly hours and availability exceptions
affects: [phase-03-public-booking-engine, phase-04-staff-operations]

tech-stack:
  added: []
  patterns:
    - Weekly availability uses ISO weekdays 1..7 with Monday as 1
    - All-day availability exceptions normalize through Europe/Berlin local-day bounds
    - Schedule setup actions require admin access before parsing or persistence

key-files:
  created:
    - app/admin/zeiten/page.tsx
    - app/admin/zeiten/_components/weekly-hours-form.tsx
    - app/admin/ausnahmen/page.tsx
    - app/admin/ausnahmen/_components/availability-exception-form.tsx
    - drizzle/0001_weekly_exception_constraints.sql
    - drizzle/meta/0001_snapshot.json
    - tests/phase-2/weekly-availability.test.ts
    - tests/phase-2/availability-exceptions.test.ts
  modified:
    - app/admin/page.tsx
    - db/schema.ts
    - drizzle/meta/_journal.json
    - lib/booking/setup-validation.ts
    - lib/booking/setup-queries.ts
    - lib/booking/setup-actions.ts
    - tests/phase-2/setup-completion.test.ts

key-decisions:
  - "Use ISO weekday 1..7 with Monday as 1 for all persisted weekly availability."
  - "Normalize all-day exception windows as Europe/Berlin local-day start to next local-day start."
  - "Keep availability exceptions optional for setup completion; weekly hours remain required for every active stylist."

patterns-established:
  - "Admin schedule forms post plain repeated fields to Server Actions, which perform all validation server-side."
  - "Weekly-hour updates replace one stylist's ranges transactionally after overlap validation."
  - "Exception DTOs are read separately from setup completion because exceptions override availability but do not gate setup readiness."

requirements-completed: [ADMN-06, STAF-03, STAF-04]

duration: 10 min
completed: 2026-04-12
---

# Phase 02 Plan 03: Working Hours and Exceptions Summary

**Server-owned weekly schedules and optional availability exceptions with guarded admin forms, validation, and database constraints**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-12T18:59:44Z
- **Completed:** 2026-04-12T19:09:57Z
- **Tasks:** 3
- **Files modified:** 15

## Accomplishments

- Added weekly-hours validation for ISO weekdays, minute bounds, booking slot-step alignment, and no overlapping ranges per weekday.
- Added availability-exception validation and normalization for vacation, break, and blocked windows, including all-day Europe/Berlin semantics.
- Added Drizzle check constraints plus a generated migration and snapshot for weekly range and exception window validity.
- Added protected admin setup screens for recurring weekly hours and optional availability exceptions.
- Updated setup completion and dashboard status so weekly hours are required and exceptions stay optional.

## Task Commits

1. **Task 1 RED: failing schedule validation tests** - `869b4af` (test)
2. **Task 1 GREEN: schedule validation schemas** - `8f7e938` (feat)
3. **Task 2 RED: failing schedule persistence tests** - `8522792` (test)
4. **Task 2 GREEN: persistence actions, queries, and migration** - `2849391` (feat)
5. **Task 3: protected schedule setup screens** - `55a1310` (feat)

## Files Created/Modified

- `lib/booking/setup-validation.ts` - Weekly range schemas, ISO weekday labels, overlap validation, exception schema, and Europe/Berlin normalization.
- `db/schema.ts` - Drizzle check constraints for weekly weekday/minute validity and exception window ordering.
- `drizzle/0001_weekly_exception_constraints.sql` - Generated migration adding schedule check constraints.
- `drizzle/meta/_journal.json` - Drizzle journal updated for the 0001 migration.
- `drizzle/meta/0001_snapshot.json` - Drizzle generated schema snapshot for the 0001 migration.
- `lib/booking/setup-actions.ts` - Authorized weekly replacement action plus exception save/delete actions.
- `lib/booking/setup-queries.ts` - Weekly-hours and exception setup DTO queries.
- `app/admin/page.tsx` - Dashboard status now distinguishes required weekly hours from optional exceptions.
- `app/admin/zeiten/page.tsx` - Protected weekly-hours setup route.
- `app/admin/zeiten/_components/weekly-hours-form.tsx` - German weekly range form with multiple rows per weekday.
- `app/admin/ausnahmen/page.tsx` - Protected exception setup route and saved-exception list.
- `app/admin/ausnahmen/_components/availability-exception-form.tsx` - German creation form for Urlaub, Pause, and Blockierte Zeit.
- `tests/phase-2/weekly-availability.test.ts` - Weekly validation and persistence source checks.
- `tests/phase-2/availability-exceptions.test.ts` - Exception validation and persistence source checks.
- `tests/phase-2/setup-completion.test.ts` - Setup completion checks proving exceptions are optional and weekly hours are required.

## Decisions Made

- Used ISO weekday `1..7` with Monday as `1` because the admin/product locale is Germany and Phase 3 needs one stable convention.
- Stored all-day exceptions as unambiguous UTC instants derived from Europe/Berlin local-day boundaries.
- Kept forms plain and server-rendered; Server Actions remain the validation and persistence boundary.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Vitest and Drizzle generation both initially hit Windows `spawn EPERM` inside the sandbox. The same commands succeeded after approved escalation.
- Drizzle generated `0001_happy_frog_thor.sql`; it was renamed to `0001_weekly_exception_constraints.sql` and the journal tag was updated to keep the migration name stable for this plan.

## Known Stubs

None.

## Threat Flags

None beyond the planned admin Server Action, setup database, and local-date trust boundaries in the plan threat model.

## User Setup Required

None - no new external service configuration required.

## Verification

- `$env:DATABASE_URL="postgresql://user:password@localhost:5432/haarkult"; npm.cmd run db:generate` - passed after sandbox escalation; generated the 0001 migration and snapshot.
- `npm.cmd run test:unit -- tests/phase-2/weekly-availability.test.ts tests/phase-2/availability-exceptions.test.ts tests/phase-2/setup-completion.test.ts tests/phase-1/content-boundaries.test.ts` - passed, 18 tests.
- `npm.cmd run lint` - passed.
- `npm.cmd run build` - passed.
- DB-backed manual smoke was not run because this environment does not include real admin login and database secrets.

## Next Phase Readiness

Phase 3 can read active staff, service assignments, weekly ranges, and persisted exceptions from the server-owned booking model. Availability calculations should use ISO weekday `1..7`, apply optional exceptions as overrides, and rely on weekly ranges only after setup completion is true.

## Self-Check: PASSED

- Summary file exists.
- Task commits exist: `869b4af`, `8f7e938`, `8522792`, `2849391`, `55a1310`.
- Key files exist: `app/admin/zeiten/page.tsx`, `app/admin/ausnahmen/page.tsx`, `lib/booking/setup-validation.ts`, `lib/booking/setup-actions.ts`, `lib/booking/setup-queries.ts`, `drizzle/0001_weekly_exception_constraints.sql`, and the Phase 2 schedule test files.

---
*Phase: 02-admin-auth-salon-setup*
*Completed: 2026-04-12*
