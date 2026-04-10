---
phase: 01-builder-boundaries-mode-hardening
plan: 01
subsystem: ui
tags: [nextjs, typescript, content-config, booking-mode, builder]
requires: []
provides:
  - booking-domain config isolated in content/booking.ts
  - canonical internal booking mode literal standardized to booking
  - brochure-safe selector layer for booking visibility and fallback contacts
affects: [brochure-routes, termin-buchen, content-model, mode-gating]
tech-stack:
  added: []
  patterns: [single booking-domain config module, brochure-safe selector layer]
key-files:
  created: [content/booking.ts, lib/site-mode.ts]
  modified: [content/site.ts, content/home.ts, lib/home-page.ts, app/page.tsx, app/layout.tsx, app/termin-buchen/page.tsx]
key-decisions:
  - "Booking-specific rules and copy now live in content/booking.ts while content/site.ts stays salon-wide."
  - "Brochure consumers resolve booking visibility through lib/site-mode.ts instead of branching on raw config fields."
patterns-established:
  - "Keep salon-wide identity/contact data separate from booking-domain settings."
  - "Expose booking mode to brochure surfaces only through pure selector helpers."
requirements-completed: [BUIL-01, BUIL-02, MODE-01, MODE-02]
duration: 16 min
completed: 2026-04-10
---

# Phase 01 Plan 01: Builder Boundary Split Summary

**Booking config extracted into `content/booking.ts` with a canonical `booking` mode literal and a shared brochure-safe selector layer for booking visibility**

## Performance

- **Duration:** 16 min
- **Started:** 2026-04-10T15:43:00+02:00
- **Completed:** 2026-04-10T15:58:53+02:00
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Moved booking rules, fallback channel visibility, and booking entry copy into `content/booking.ts`.
- Reduced `content/site.ts` to salon-wide brand, contact, legal, hours, socials, and SEO data only.
- Added `lib/site-mode.ts` and routed homepage, footer, and `/termin-buchen` booking visibility through shared selectors.

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract booking-domain config and canonize mode vocabulary** - `97ca487` (`feat`)
2. **Task 2: Define brochure-safe mode selectors against the new config boundary** - `2252883` (`feat`)
3. **Auto-fix: Narrow booking page copy branches after build validation** - `8c52ce1` (`fix`)

## Files Created/Modified

- `content/booking.ts` - booking-domain config, canonical mode vocabulary, fallback channel rules, and booking page copy
- `content/site.ts` - salon-wide brand, contact, legal, hours, socials, and SEO only
- `content/home.ts` - moved fallback action type import to the booking config boundary
- `lib/site-mode.ts` - shared booking visibility, entry href, and fallback contact selectors
- `lib/home-page.ts` - brochure action resolution now depends on selector helpers instead of raw mode checks
- `app/page.tsx` - homepage action composition now reads the shared booking config boundary
- `app/layout.tsx` - footer booking link now comes from the selector layer
- `app/termin-buchen/page.tsx` - booking entry surface now reads shared mode state and booking copy

## Decisions Made

- Canonical internal mode vocabulary for this phase is `booking`, not `online_booking`, so future plans stop carrying mixed literals.
- `content/booking.ts` owns booking entry copy as well as booking rules, which keeps brochure routes from embedding booking-specific wording.
- `lib/site-mode.ts` remains brochure-safe and does not import `lib/booking/*` or `db/*`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed booking page copy union access after build validation**
- **Found during:** Post-task verification after Task 2
- **Issue:** `/termin-buchen` accessed `pageCopy.subtitle` from a union branch where only the booking copy shape provided that field, which failed `next build` type checking.
- **Fix:** Narrowed the booking and contact-only subtitle branches explicitly in `app/termin-buchen/page.tsx`.
- **Files modified:** `app/termin-buchen/page.tsx`
- **Verification:** `npm.cmd run lint` and `npm.cmd run build`
- **Committed in:** `8c52ce1`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** The fix was required for correctness and did not expand scope.

## Issues Encountered

- `npm.cmd run lint` passed while `npm.cmd run build` still caught a TypeScript branch-narrowing error in `/termin-buchen`. The build check was kept as the final gate and the regression was fixed immediately.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Brochure and booking-mode code now share one config boundary and selector contract, which removes the old mixed `online_booking` terminology from the touched files.
- Phase 01-02 can focus on public mode hardening and route behavior without re-splitting config ownership.

## Self-Check: PASSED

- Summary file exists.
- Task commits `97ca487`, `2252883`, and `8c52ce1` exist in git history.

---
*Phase: 01-builder-boundaries-mode-hardening*
*Completed: 2026-04-10*
