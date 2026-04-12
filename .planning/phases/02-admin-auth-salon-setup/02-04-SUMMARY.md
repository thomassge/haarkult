---
phase: 02-admin-auth-salon-setup
plan: 04
subsystem: admin-setup
tags: [admin, navigation, validation, availability, vitest]

requires:
  - phase: 02-admin-auth-salon-setup
    provides: Protected admin setup routes, service assignment under stylists, and availability exception persistence
provides:
  - Dashboard navigation with no missing Phase 2 setup route targets
  - Leistungen dashboard card routed to the existing stylist service-assignment setup
  - Controlled validation errors for malformed timed availability exception dates
  - Berlin datetime-local round-trip validation before UTC persistence
affects: [phase-02-verification, phase-03-public-booking-engine, phase-04-staff-operations]

tech-stack:
  added: []
  patterns:
    - Source-level dashboard navigation regression tests for route existence
    - Exception date parsing validates Date.getTime before returning persistence values
    - Berlin datetime-local conversion round-trips through Europe/Berlin parts

key-files:
  created:
    - tests/phase-2/admin-dashboard-navigation.test.ts
  modified:
    - app/admin/_components/admin-shell.tsx
    - app/admin/page.tsx
    - lib/booking/setup-validation.ts
    - tests/phase-2/availability-exceptions.test.ts

key-decisions:
  - "Keep service assignment under /admin/stylisten instead of adding a duplicate /admin/leistungen route."
  - "Use card title, not href, to keep separate Stylisten and Leistungen dashboard statuses when both route to /admin/stylisten."
  - "Reject invalid timed exception dates at the validation boundary with the existing controlled German error."

patterns-established:
  - "Dashboard cards may share a real setup route, but their React keys and status mapping must stay card-specific."
  - "Validation helpers that produce Date objects must reject Invalid Date before Server Actions can persist them."

requirements-completed: [ADMN-06, STAF-02, STAF-04]

duration: 7 min
completed: 2026-04-12
---

# Phase 02 Plan 04: Gap Closure Summary

**Admin setup navigation now targets existing routes, and timed availability exception input rejects malformed or impossible dates before persistence**

## Performance

- **Duration:** 7 min
- **Started:** 2026-04-12T19:33:55Z
- **Completed:** 2026-04-12T19:40:13Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Repointed the `Leistungen` dashboard card from the missing `/admin/leistungen` route to the existing `/admin/stylisten` setup screen.
- Preserved separate `Stylisten` and `Leistungen` dashboard statuses even though both cards open the same setup route.
- Added regression coverage proving dashboard card hrefs resolve to existing admin route files.
- Hardened timed exception normalization so malformed strings, invalid `Date` instances, and impossible Berlin `datetime-local` values throw `Bitte einen gueltigen Zeitraum angeben.` before persistence.

## Task Commits

1. **Task 1 RED: admin dashboard navigation regression** - `7eb5cf2` (test)
2. **Task 1 GREEN: repoint Leistungen dashboard card** - `7da8121` (fix)
3. **Task 2 RED: malformed exception date regressions** - `64253c8` (test)
4. **Task 2 GREEN: invalid exception date validation** - `0c5528a` (fix)

## Files Created/Modified

- `tests/phase-2/admin-dashboard-navigation.test.ts` - Regression tests for dashboard route targets and the Leistungen `/admin/stylisten` href.
- `app/admin/_components/admin-shell.tsx` - Repointed Leistungen to `/admin/stylisten` and made card keys stable when hrefs are shared.
- `app/admin/page.tsx` - Removed `/admin/leistungen` status/filter logic and mapped shared-route card statuses by title.
- `tests/phase-2/availability-exceptions.test.ts` - Added malformed timed string, impossible Berlin local date, and valid Berlin local date coverage.
- `lib/booking/setup-validation.ts` - Added `Date.getTime()` validity checks and Berlin local datetime round-trip validation.

## Decisions Made

- Kept the smallest coherent navigation fix: service assignment remains inside `/admin/stylisten`, matching the completed Phase 2 service-assignment flow.
- Used card titles for dashboard status mapping because `Stylisten` and `Leistungen` now intentionally share the same real route.
- Kept the existing all-day Europe/Berlin semantics while applying stricter validation to the UTC instants produced by the conversion helper.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Prevented duplicate React keys after route repointing**
- **Found during:** Task 1 (Repoint the Leistungen dashboard card to the existing setup route)
- **Issue:** Repointing `Leistungen` to `/admin/stylisten` made two dashboard cards share the same `href`, which was also used as the React list key.
- **Fix:** Changed the card key to combine `card.title` and `card.href`.
- **Files modified:** `app/admin/_components/admin-shell.tsx`
- **Verification:** `npm.cmd run test:unit -- tests/phase-2/admin-dashboard-navigation.test.ts tests/phase-2/service-assignment.test.ts tests/phase-2/setup-completion.test.ts`; `npm.cmd run lint`
- **Committed in:** `7da8121`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** The fix was required by the planned shared-route navigation change and did not expand scope.

## Issues Encountered

- Vitest repeatedly hit a Windows `spawn EPERM` while loading config inside the sandbox. Each affected command was rerun with approved escalation and then produced the expected RED or passing result.
- The pre-existing `.planning/HANDOFF.json` deletion and `.planning/STATE.md` modification were left untouched as instructed.

## Known Stubs

None. Stub scan of the created/modified plan files found only normal JSX attributes such as `className=""`, not placeholder data, TODOs, or unwired mock content.

## Threat Flags

None beyond the planned dashboard navigation and exception validation trust boundaries in the plan threat model.

## User Setup Required

None - no external service configuration required.

## Verification

- `npm.cmd run test:unit -- tests/phase-2/admin-dashboard-navigation.test.ts` - RED failed before the Task 1 fix as expected.
- `npm.cmd run test:unit -- tests/phase-2/admin-dashboard-navigation.test.ts tests/phase-2/service-assignment.test.ts tests/phase-2/setup-completion.test.ts` - passed, 16 tests.
- `npm.cmd run test:unit -- tests/phase-2/availability-exceptions.test.ts` - RED failed before the Task 2 fix as expected.
- `npm.cmd run test:unit -- tests/phase-2/availability-exceptions.test.ts tests/phase-2/weekly-availability.test.ts tests/phase-2/setup-completion.test.ts` - passed, 18 tests.
- `npm.cmd run test:unit -- tests/phase-2/admin-dashboard-navigation.test.ts tests/phase-2/availability-exceptions.test.ts tests/phase-2/service-assignment.test.ts tests/phase-2/weekly-availability.test.ts tests/phase-2/setup-completion.test.ts` - passed, 26 tests.
- `npm.cmd run lint` - passed.
- `npm.cmd run build` - passed.
- `rg '"/admin/leistungen"' app tests --glob '!*.md'` - no active source/test references.

## Next Phase Readiness

Phase 2 verification can re-run against the closed gaps: the dashboard no longer links to a missing setup route, and availability exception normalization rejects invalid timed windows before Server Actions persist them.

## State Updates

Skipped by user instruction. The orchestrator owns `.planning/STATE.md` and `.planning/ROADMAP.md` updates after verification.

## Self-Check: PASSED

- Summary file exists.
- Task commits exist: `7eb5cf2`, `7da8121`, `64253c8`, `0c5528a`.
- Key files exist: `app/admin/_components/admin-shell.tsx`, `app/admin/page.tsx`, `lib/booking/setup-validation.ts`, `tests/phase-2/admin-dashboard-navigation.test.ts`, and `tests/phase-2/availability-exceptions.test.ts`.

---
*Phase: 02-admin-auth-salon-setup*
*Completed: 2026-04-12*
