---
phase: 01-builder-boundaries-mode-hardening
plan: 04
subsystem: testing
tags: [vitest, mode-hardening, contact-only, fallback-copy]
requires:
  - phase: 01-builder-boundaries-mode-hardening
    provides: builder-safe booking mode selectors and isolated /termin-buchen fallback rendering
provides:
  - channel-agnostic contact-only fallback step copy in booking config
  - regression coverage for hidden contact channels on /termin-buchen
affects: [phase-02-staff-setup-admin-foundations, phase-03-public-booking, verifier-followup]
tech-stack:
  added: []
  patterns: [selector-driven channel wording, per-test vi.doMock config overrides]
key-files:
  created: []
  modified: [content/booking.ts, tests/phase-1/termin-buchen-page.test.tsx]
key-decisions:
  - "Keep contact-channel naming in selector-driven subtitle and action rendering, not in static fallback step copy."
  - "Use per-test vi.doMock loading so /termin-buchen regressions can mutate booking config without changing route architecture."
patterns-established:
  - "Contact-only fallback steps stay channel-agnostic while visibleContactKinds drives named channels."
  - "Route-level config mutation tests load mocked content modules before importing the page under test."
requirements-completed: [MODE-03]
duration: 5 min
completed: 2026-04-10
---

# Phase 01 Plan 04: MODE-03 Fallback Drift Closure Summary

**Channel-agnostic contact-only fallback copy and regression coverage that proves hidden WhatsApp and E-Mail channels stay off `/termin-buchen`**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-10T16:54:00+02:00
- **Completed:** 2026-04-10T16:59:31+02:00
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Removed the last static contact-only fallback sentence that could leak hidden channels from [content/booking.ts](/Users/neyma/dev/haarkult/content/booking.ts).
- Added a per-test mocked `/termin-buchen` regression harness in [tests/phase-1/termin-buchen-page.test.tsx](/Users/neyma/dev/haarkult/tests/phase-1/termin-buchen-page.test.tsx) so `fallbackActions` can be changed inside each case.
- Proved the phone-only fallback keeps `WhatsApp` and `E-Mail` text and links out of the rendered page while preserving the visible phone path.

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove static hidden-channel drift from contact-only fallback copy** - `77938bc` (fix)
2. **Task 2: Add a regression test that hides channels and proves they stay hidden** - `1ef183c` (test)

## Files Created/Modified
- [content/booking.ts](/Users/neyma/dev/haarkult/content/booking.ts) - Replaced the hardcoded multi-channel fallback step with channel-agnostic copy.
- [tests/phase-1/termin-buchen-page.test.tsx](/Users/neyma/dev/haarkult/tests/phase-1/termin-buchen-page.test.tsx) - Switched to per-test module mocking and added the `fallbackActions: ["phone"]` regression.

## Decisions Made
- Kept channel-specific wording limited to the selector-driven subtitle and rendered contact actions, which already follow `visibleContactKinds`.
- Tested config mutation at the module boundary with `vi.doMock()` instead of adding new runtime branches or config fields.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `npm.cmd run test:unit -- tests/phase-1/termin-buchen-page.test.tsx` hit a sandbox `spawn EPERM` during Vitest startup. Re-running the same command outside the sandbox resolved verification without changing repo code.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `MODE-03` is now covered by config-safe fallback copy and a regression test that mutates `fallbackActions`.
- Phase-level verification can be rerun without reopening the Phase 1 architecture boundaries work.

## Self-Check: PASSED

- Found `.planning/phases/01-builder-boundaries-mode-hardening/01-04-SUMMARY.md` on disk.
- Verified task commits `77938bc` and `1ef183c` in git history.

---
*Phase: 01-builder-boundaries-mode-hardening*
*Completed: 2026-04-10*
