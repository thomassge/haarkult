---
phase: 03-public-booking-engine
plan: 01
subsystem: ui
tags: [nextjs, react, booking-flow, vitest]

requires:
  - phase: 02-admin-auth-salon-setup
    provides: "Server-owned staff setup data, service assignments, and setup completion status"
provides:
  - "Catalog-derived public service category and service options"
  - "Conditional stylist preference options from active assigned setup rows"
  - "Mode-aware /termin-buchen route that renders contact fallback, setup fallback, or guided booking flow"
affects: [public-booking-engine, booking-route, availability-engine]

tech-stack:
  added: []
  patterns:
    - "Route-local DTO derivation under app/termin-buchen/_lib"
    - "Async public route branches on product mode and setup completion"
    - "Client booking shell receives server-owned setup DTOs as props"

key-files:
  created:
    - app/termin-buchen/_lib/booking-flow-options.ts
    - app/termin-buchen/_components/booking-flow.tsx
    - app/termin-buchen/_components/service-step.tsx
    - app/termin-buchen/_components/stylist-step.tsx
    - app/termin-buchen/_components/booking-summary.tsx
    - tests/phase-3/public-booking-flow.test.tsx
    - tests/phase-3/stylist-eligibility.test.ts
  modified:
    - app/termin-buchen/page.tsx
    - app/termin-buchen/_components/booking-entry-shell.tsx
    - tests/phase-1/termin-buchen-page.test.tsx

key-decisions:
  - "Default public service selection is derived from the first catalog service with eligible active staff, not a hardcoded salon service."
  - "The public setup-incomplete branch reuses contact actions and hides setup diagnostics from visitors."

patterns-established:
  - "Public booking route imports setup reads but no admin auth or credential modules."
  - "Stylist selection is displayed only when multiple active assigned staff can perform the selected service."

requirements-completed: [BOOK-01, BOOK-02, BOOK-03, BOOK-04, BOOK-05]

duration: 19 min
completed: 2026-04-13
---

# Phase 03 Plan 01: Public Service And Stylist Selection Summary

**Catalog-backed booking entry with conditional stylist preference selection and public-safe fallback states.**

## Performance

- **Duration:** 19 min
- **Started:** 2026-04-13T15:37:09Z
- **Completed:** 2026-04-13T15:55:57Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Added route-local public booking option DTOs for service categories, service metadata, eligible staff, and stylist preferences.
- Replaced the booking placeholder with an async `/termin-buchen` route that preserves contact-only mode, handles setup-incomplete fallback, and renders the guided booking flow when setup is complete.
- Added Phase 3 regression coverage for catalog-derived services, single-category behavior, conditional stylist selection, inactive/unassigned staff exclusion, and public-safe setup fallback copy.

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Public booking option tests** - `d271595` (test)
2. **Task 1 GREEN: Public booking option contracts** - `7442299` (feat)
3. **Task 2 RED: Booking route flow tests** - `7c6ec8e` (test)
4. **Task 2 GREEN: Guided booking route UI** - `db1cef9` (feat)

**Plan metadata:** committed separately after this summary was created.

## Files Created/Modified

- `app/termin-buchen/_lib/booking-flow-options.ts` - Derives catalog-backed service options, public setup fallback copy, and stylist preference choices from setup DTOs.
- `app/termin-buchen/page.tsx` - Makes the booking route async and branches by product mode plus setup completion.
- `app/termin-buchen/_components/booking-entry-shell.tsx` - Keeps public fallback rendering available with neutral booking-route styling.
- `app/termin-buchen/_components/booking-flow.tsx` - Adds the guided public booking shell with progress, service, stylist, time, contact, and summary areas.
- `app/termin-buchen/_components/service-step.tsx` - Renders category chips and service rows from catalog-derived options.
- `app/termin-buchen/_components/stylist-step.tsx` - Renders `Keine Praeferenz` plus named eligible stylists when needed.
- `app/termin-buchen/_components/booking-summary.tsx` - Shows the current service, stylist, and next-step status.
- `tests/phase-3/public-booking-flow.test.tsx` - Covers service options, setup fallback copy, and route rendering states.
- `tests/phase-3/stylist-eligibility.test.ts` - Covers active assigned staff eligibility and stylist-step skipping.
- `tests/phase-1/termin-buchen-page.test.tsx` - Awaits the async booking page in existing contact-only fallback tests.

## Decisions Made

- The initial selected service is the first bookable catalog service that has at least one active eligible staff assignment. This keeps the first rendered flow useful without hardcoding Haarkult-specific service ids.
- Setup-incomplete booking mode renders public contact fallback copy and existing contact actions only; no setup, admin, database, or credential language is exposed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated existing route tests for async page rendering**
- **Found during:** Task 2 (Replace the booking placeholder with the guided service and stylist UI)
- **Issue:** Making `BookingPage` async caused the existing Phase 1 route tests to render a Promise instead of the resolved server component output.
- **Fix:** Updated `tests/phase-1/termin-buchen-page.test.tsx` to await `BookingPage()` before rendering.
- **Files modified:** `tests/phase-1/termin-buchen-page.test.tsx`
- **Verification:** `npm.cmd run test:unit -- tests/phase-3/public-booking-flow.test.tsx tests/phase-3/stylist-eligibility.test.ts tests/phase-1/termin-buchen-page.test.tsx`
- **Committed in:** `db1cef9`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was required by the planned async route change and did not expand product scope.

## Issues Encountered

- The first sandboxed Vitest run hit a Windows `spawn EPERM` while loading config. The same focused command passed when rerun with approved elevated execution. Later focused verification and lint passed normally.

## Known Stubs

- `app/termin-buchen/_components/booking-flow.tsx` - The time and contact areas are static shell states in this plan. Availability lookup and booking submission are intentionally owned by later Phase 3 plans.
- `app/termin-buchen/_components/booking-summary.tsx` - The summary notes that free times follow in the next step until availability data is wired by the availability plan.

## Threat Flags

None - the new public route surface was already covered by the plan threat model. The implementation imports setup reads only and does not import admin auth, credential modules, or mutation paths.

## Verification

- `npm.cmd run test:unit -- tests/phase-3/public-booking-flow.test.tsx tests/phase-3/stylist-eligibility.test.ts tests/phase-1/termin-buchen-page.test.tsx` - passed
- `npm.cmd run lint` - passed
- Acceptance greps for `getStaffSetupData(`, `bookableServices`, `getBookableServiceById`, `Keine Praeferenz`, and forbidden public admin/team imports passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for the remaining public booking engine plans to connect the time step to server-calculated slot availability and connect the contact step to conflict-safe booking submission.

## Self-Check: PASSED

- Found `.planning/phases/03-public-booking-engine/03-01-SUMMARY.md`.
- Found task commits `d271595`, `7442299`, `7c6ec8e`, and `db1cef9` in git history.

---
*Phase: 03-public-booking-engine*
*Completed: 2026-04-13*
