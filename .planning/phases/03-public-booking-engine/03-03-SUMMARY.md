---
phase: 03-public-booking-engine
plan: 03
subsystem: booking
tags: [nextjs, react, server-actions, drizzle, vitest, zod]

requires:
  - phase: 03-public-booking-engine
    provides: "Plan 03-01 public service/stylist flow and Plan 03-02 slot availability query adapter"
provides:
  - "Guest booking submission validation with German public-safe field errors"
  - "Conflict-safe public booking action with same-staff same-date advisory locking"
  - "Date-first public slot selection, contact form, stale-slot retry, and success UI"
affects: [public-booking-engine, booking-submission, booking-ui]

tech-stack:
  added: []
  patterns:
    - "Server action dependencies are injectable for transaction and availability re-check tests"
    - "Route-local booking steps split service, stylist, slot, contact, summary, and result concerns"

key-files:
  created:
    - app/termin-buchen/_components/slot-step.tsx
    - app/termin-buchen/_components/contact-step.tsx
    - app/termin-buchen/_components/booking-result.tsx
    - lib/booking/public-actions.ts
    - tests/phase-3/booking-submission.test.ts
  modified:
    - app/termin-buchen/_components/booking-flow.tsx
    - app/termin-buchen/_components/booking-summary.tsx
    - lib/booking/public-validation.ts
    - tests/phase-3/public-booking-flow.test.tsx

key-decisions:
  - "Public booking submission uses a transaction-scoped Postgres advisory lock keyed by concrete staff id and local date instead of adding a Phase 3 schema migration."
  - "The browser submits the concrete staff id from the selected server slot, while stylist preference remains optional and is rechecked server-side."

patterns-established:
  - "Stale slot conflicts return a typed result that preserves user-entered fields and clears only the invalid slot."
  - "Public booking UI reloads slots from `/api/booking/slots` after date selection and stale-slot conflicts."

requirements-completed: [BOOK-07, BOOK-08]

duration: 10 min
completed: 2026-04-13
---

# Phase 03 Plan 03: Booking Submission And Result States Summary

**Conflict-safe guest booking submission with date-first slot selection, contact capture, stale-slot retry, and German success states.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-13T18:58:30Z
- **Completed:** 2026-04-13T19:07:31Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Added `publicBookingSubmissionSchema` and `createPublicBooking()` with required guest contact validation, advisory lock acquisition, transaction-scoped availability re-check, booking insert, and `bookingEvents` creation.
- Added duplicate-submit coverage proving the second same-staff same-date submission returns `slot_conflict` after the first insert.
- Replaced placeholder time/contact UI with date buttons, `/api/booking/slots` fetches, time chips, contact fields, stale-slot conflict retry, and success panels.

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Public booking submission tests** - `db23c03` (test)
2. **Task 1 GREEN: Conflict-safe public booking submission** - `64ba759` (feat)
3. **Task 2 RED: Booking flow interaction tests** - `d1ba372` (test)
4. **Task 2 GREEN: Slot, contact, conflict, and result UI** - `8b4eebd` (feat)

**Plan metadata:** committed separately after this summary was created.

## Files Created/Modified

- `lib/booking/public-actions.ts` - Server action and core booking creation path with validation, lock, re-check, booking insert, and event insert.
- `lib/booking/public-validation.ts` - Adds guest booking submission schema and German validation copy.
- `app/termin-buchen/_components/booking-flow.tsx` - Wires service/stylist selection to date-first slot loading, contact state, submit action, conflict retry, and success result state.
- `app/termin-buchen/_components/slot-step.tsx` - Renders 14 date choices, loading/empty/error states, retry action, and server-calculated time chips.
- `app/termin-buchen/_components/contact-step.tsx` - Renders required name, phone, email, optional note, helper copy, trust copy, and disabled/pending submit state.
- `app/termin-buchen/_components/booking-result.tsx` - Renders manual or instant success copy and selected appointment summary.
- `app/termin-buchen/_components/booking-summary.tsx` - Shows selected service, stylist, date, and slot summary.
- `tests/phase-3/booking-submission.test.ts` - Covers validation, lock/re-check/insert order, confirmation modes, stale-slot conflicts, and duplicate concurrent submissions.
- `tests/phase-3/public-booking-flow.test.tsx` - Covers date-first slot fetch, contact submit, success UI, conflict preservation, and slot lookup empty/error states.

## Decisions Made

- Used Postgres `pg_advisory_xact_lock(hashtextextended(...))` through Drizzle `sql` for same-staff same-date serialization, keeping Phase 3 free of schema changes.
- Kept the public action dependency-injectable so transaction order, availability re-checks, and duplicate submit behavior can be tested without a real database.
- Treated `booking.confirmationMode === "manual"` as `pending`; every other configured mode maps to an initially `confirmed` booking with instant success copy.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Sandboxed Vitest runs intermittently hit Windows `spawn EPERM` while loading Vite config. Focused and full verification commands passed when rerun with approved elevated execution.
- The first Task 2 test draft used jest-dom matchers, but this repo does not configure jest-dom. The test was adjusted to use plain DOM value and disabled property assertions.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None. The slot UI reads from the public slot endpoint, and booking submission writes through the server action path.

## Threat Flags

None - the new public submit action, availability re-check, concurrent submission guard, persistent booking write, and public result messages were all covered by the plan threat model.

## Verification

- `npm.cmd run test:unit -- tests/phase-3/booking-submission.test.ts` - passed
- `npm.cmd run test:unit -- tests/phase-3/public-booking-flow.test.tsx tests/phase-3/booking-submission.test.ts` - passed
- `npm.cmd run test:unit -- tests/phase-3/public-booking-flow.test.tsx tests/phase-3/availability-engine.test.ts tests/phase-3/stylist-eligibility.test.ts tests/phase-3/booking-submission.test.ts` - passed, 4 files and 30 tests
- `npm.cmd run lint` - passed
- Acceptance greps for server action contracts, advisory lock, public slot re-check, booking/event inserts, route-local German copy, and forbidden account/payment scope passed.

## Next Phase Readiness

Phase 3 public booking engine is complete for service selection, conditional stylist preference, server-calculated slots, and guest booking request submission. Later staff operations can now consume persisted bookings and `bookingEvents`.

## Self-Check: PASSED

- Found `.planning/phases/03-public-booking-engine/03-03-SUMMARY.md`.
- Found task commits `db23c03`, `64ba759`, `d1ba372`, and `8b4eebd` in git history.

---
*Phase: 03-public-booking-engine*
*Completed: 2026-04-13*
