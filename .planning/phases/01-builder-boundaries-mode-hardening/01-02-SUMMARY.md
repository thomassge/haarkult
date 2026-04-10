---
phase: 01-builder-boundaries-mode-hardening
plan: 02
subsystem: testing
tags: [vitest, nextjs, react-testing-library, booking-mode, ui]
requires:
  - phase: 01-01
    provides: booking config split and site mode selectors
provides:
  - phase 1 unit harness for mode-gating regressions
  - homepage booking CTA resolution from shared selector state
  - config-driven contact-only fallback rendering on /termin-buchen
affects: [brochure-routes, termin-buchen, testing, mode-gating]
tech-stack:
  added: [vitest, @testing-library/react, jsdom, @vitejs/plugin-react, vite-tsconfig-paths]
  patterns: [selector-driven brochure CTA visibility, config-driven fallback copy tests]
key-files:
  created: [vitest.config.ts, tests/setup.ts, tests/phase-1/site-mode.test.ts, tests/phase-1/termin-buchen-page.test.tsx]
  modified: [package.json, package-lock.json, .gitignore, app/page.tsx, app/termin-buchen/page.tsx, lib/home-page.ts]
key-decisions:
  - "Phase 1 now uses a small Vitest jsdom harness so mode behavior can be checked without spinning up the full app."
  - "Homepage booking entry visibility is resolved from lib/site-mode.ts at the route level instead of a helper-owned inline branch."
patterns-established:
  - "Brochure routes prepend the booking CTA only when getBookingPresentationState() exposes a booking entry href."
  - "The contact-only /termin-buchen page formats visible channels from selector output instead of embedding fixed channel text."
requirements-completed: [MODE-01, MODE-02, MODE-03]
duration: 8 min
completed: 2026-04-10
---

# Phase 01 Plan 02: Public Mode Contract Summary

**Vitest-backed mode regression coverage plus selector-driven homepage and /termin-buchen behavior for booking and contact-only salons**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-10T16:00:00+02:00
- **Completed:** 2026-04-10T16:07:37+02:00
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Added a fast Phase 1 unit harness with jsdom coverage for selector behavior and the `/termin-buchen` fallback surface.
- Locked booking and contact-only mode behavior in executable tests instead of relying on manual route inspection alone.
- Rewired homepage booking CTA insertion and `/termin-buchen` fallback subtitle generation to shared selector state.

## Task Commits

Each task was committed atomically:

1. **Task 1: Establish Wave 0 automated coverage for mode gating and fallback rendering** - `d4104e9` (`test`)
2. **Task 2: Rewire homepage and `/termin-buchen` to the shared mode contract** - `d6f2c65` (`feat`)

## Files Created/Modified

- `package.json` - added the `test:unit` script and test harness dev dependencies
- `package-lock.json` - captured the installed unit-test toolchain
- `.gitignore` - ignores generated `.npm-cache/` output from local npm runs
- `vitest.config.ts` - configures the Phase 1 Vitest jsdom runner with path resolution
- `tests/setup.ts` - central cleanup hook for component tests
- `tests/phase-1/site-mode.test.ts` - covers selector behavior for `contact_only`, `booking`, and channel filtering
- `tests/phase-1/termin-buchen-page.test.tsx` - covers the config-driven contact-only fallback rendering
- `app/page.tsx` - resolves booking CTA insertion from `getBookingPresentationState()`
- `app/termin-buchen/page.tsx` - formats the fallback subtitle from visible channel labels instead of a fixed sentence
- `lib/home-page.ts` - adds shared inline-list formatting and removes the old route CTA helper branch

## Decisions Made

- Used a narrow Vitest + jsdom harness for Phase 1 because the required regressions are synchronous selector and component checks.
- Kept fallback channel wording derived from selector output in the route so the rendered copy follows configured channel visibility.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Ignored generated npm cache output**
- **Found during:** Task 1 (Establish Wave 0 automated coverage for mode gating and fallback rendering)
- **Issue:** `npm install` created a repo-local `.npm-cache/` directory, which would have left generated runtime output untracked in the worktree.
- **Fix:** Added `.npm-cache/` to `.gitignore`.
- **Files modified:** `.gitignore`
- **Verification:** `git status --short` no longer reported `.npm-cache/`
- **Committed in:** `d4104e9`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix kept the task commit clean and did not expand plan scope.

## Issues Encountered

- `npm.cmd install` initially failed in the sandbox with an `EPERM` cache-path error and was rerun with approval outside the sandbox.
- `vitest` also needed an escalated run on this machine because the config loader could not spawn correctly inside the sandbox.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 01-03 can build on executable mode-contract coverage instead of manual-only verification.
- Homepage and `/termin-buchen` now read the same selector contract, reducing public booking-mode drift.
- Manual browser smoke in both modes still has not been run in this execution.

## Self-Check: PASSED

- Summary file exists.
- Task commits `d4104e9` and `d6f2c65` exist in git history.

---
*Phase: 01-builder-boundaries-mode-hardening*
*Completed: 2026-04-10*
