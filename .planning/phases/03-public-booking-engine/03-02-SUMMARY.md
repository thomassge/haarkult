---
phase: 03-public-booking-engine
plan: 02
subsystem: api
tags: [booking, availability, nextjs, drizzle, vitest, zod]

requires:
  - phase: 02-admin-auth-salon-setup
    provides: "Operational staff, service assignments, weekly availability, and exception data"
provides:
  - "Pure server-side availability engine for service, staff, schedule, exception, booking, lead-time, horizon, and slot-step rules"
  - "Public slot query validation and `/api/booking/slots` JSON endpoint"
  - "Injectable public availability query adapter for Plan 03-03 submit-time re-checks"
affects: [03-public-booking-engine, booking-submission, public-booking-flow]

tech-stack:
  added: []
  patterns:
    - "Pure availability calculation separated from database loading"
    - "Public query adapters accept injected transaction-like clients for conflict re-checks"

key-files:
  created:
    - lib/booking/availability.ts
    - lib/booking/public-validation.ts
    - lib/booking/public-queries.ts
    - app/api/booking/slots/route.ts
    - tests/phase-3/availability-engine.test.ts
  modified: []

key-decisions:
  - "Availability slots are generated from Europe/Berlin local booking dates and returned as UTC ISO-safe Date values."
  - "The public adapter keeps database reads injectable so booking submission can re-check availability inside its guarded transaction."

patterns-established:
  - "AvailabilitySlot.slotId is deterministic from concrete staff id plus UTC start timestamp."
  - "Public slot errors collapse to the German-safe `Ungueltige Anfrage.` response."

requirements-completed: [BOOK-06, STAF-05]

duration: 13 min
completed: 2026-04-13
---

# Phase 03 Plan 02: Public Availability Engine Summary

**Server-calculated booking slots with pure availability math, public validation, and an injectable slot lookup endpoint**

## Performance

- **Duration:** 13 min
- **Started:** 2026-04-13T15:37:09Z
- **Completed:** 2026-04-13T15:50:30Z
- **Tasks:** 2 completed
- **Files modified:** 5

## Accomplishments

- Built `calculateAvailableSlots()` with staff eligibility, no-preference staff search, weekly range fitting, lead time, booking horizon, slot step rules, exception blocking, and active booking blocking.
- Added public Zod validation plus `/api/booking/slots`, returning `{ slots }` for valid requests and `{ error: "Ungueltige Anfrage." }` for invalid public input.
- Added a public query adapter that reads setup and booking tables through either the root DB client or an injected transaction-like client for Plan 03-03 re-checks.
- Added focused Vitest coverage for availability math, public validation, adapter behavior, route error shape, and transaction injection.

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: failing availability tests** - `3a84bc2` (test)
2. **Task 1 GREEN: pure availability engine** - `324aeab` (feat)
3. **Task 2: public slot lookup endpoint** - `c04e89f` (feat)

**Plan metadata:** committed separately after self-check

## Files Created/Modified

- `lib/booking/availability.ts` - Pure slot calculation engine and exported availability types/helpers.
- `lib/booking/public-validation.ts` - Public slot query schema for service, date, and optional staff preference.
- `lib/booking/public-queries.ts` - Database/injected-client adapter that loads safe availability input and delegates to the engine.
- `app/api/booking/slots/route.ts` - Public GET endpoint for server-calculated slot JSON.
- `tests/phase-3/availability-engine.test.ts` - Nyquist coverage for engine rules, public validation, adapter behavior, and route error handling.

## Decisions Made

- Availability uses Europe/Berlin local dates for salon schedule minutes, then returns UTC Date values so JSON serialization is deterministic.
- The public adapter validates selected staff against active staff-service eligibility before calculation; the browser preference is only a filter.
- The adapter exposes `loadPublicAvailabilityInput()` and `getPublicAvailableSlots()` with injected `client` and `now` dependencies for submit-time reuse.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The first sandboxed Vitest run hit a Windows `spawn EPERM` while Vite loaded config. The command was rerun with approved elevated execution and then produced the expected RED failure.
- Initial RED expectations treated local booking times as UTC. During GREEN implementation, tests were corrected to assert Europe/Berlin local schedule behavior represented as UTC ISO timestamps.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None.

## Next Phase Readiness

Plan 03-03 can use `getPublicAvailableSlots()` or `loadPublicAvailabilityInput()` with an injected transaction-like client to re-check a selected slot before inserting a booking.

## Self-Check: PASSED

- Verified created files exist on disk.
- Verified task commits exist: `3a84bc2`, `324aeab`, `c04e89f`.

---
*Phase: 03-public-booking-engine*
*Completed: 2026-04-13*
