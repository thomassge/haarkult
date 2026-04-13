---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: planning
stopped_at: Phase 3 UI-SPEC approved
last_updated: "2026-04-13T14:54:17.847Z"
last_activity: 2026-04-12 -- Phase 02 complete after gap closure
progress:
  total_phases: 4
  completed_phases: 1
  total_plans: 4
  completed_plans: 4
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-12)

**Core value:** A salon should be able to run a premium website with either contact-only mode or real booking mode by changing salon-specific content and configuration, not by rewriting the codebase.
**Current focus:** Phase 03 - public-booking-engine

## Current Position

Phase: 03 (public-booking-engine) - READY
Plan: Not started
Status: Ready to plan
Last activity: 2026-04-12 -- Phase 02 complete after gap closure

Progress: [##########] 100% for v1.0

## Completed Milestones

| Milestone | Phase | Status | Completed | Archive |
|-----------|-------|--------|-----------|---------|
| v1.0 | Phase 1: Builder Boundaries & Mode Hardening | Complete | 2026-04-12 | .planning/milestones/v1.0-ROADMAP.md |
| v1.1 | Phase 2: Admin Auth & Salon Setup | Complete | 2026-04-12 | .planning/phases/02-admin-auth-salon-setup/02-VERIFICATION.md |

## Next Milestone

**v1.2 - Phase 3: Public Booking Engine**

Requirements:

- BOOK-01
- BOOK-02
- BOOK-03
- BOOK-04
- BOOK-05
- BOOK-06
- BOOK-07
- BOOK-08
- STAF-05

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Treat each roadmap phase as a milestone-sized delivery checkpoint.
- Booking-specific rules and copy live in `content/booking.ts`; `content/site.ts` stays salon-wide.
- Brochure consumers resolve booking visibility through `lib/site-mode.ts`.
- Phase 1 uses Vitest coverage for selector, fallback, and boundary regressions.
- `/termin-buchen` and `/admin` are explicit route boundaries for later booking/admin work.
- Contact-only fallback steps stay channel-agnostic; channel names come from selector-driven visible contacts.
- Phase 2 admin setup stores operational staff, services, weekly hours, and exceptions in server-owned booking tables.
- Service assignment remains under `/admin/stylisten`; the `Leistungen` dashboard card routes there instead of a separate `/admin/leistungen` route.
- Timed availability exceptions reject invalid or impossible date values before persistence.

### Pending Todos

None yet.

### Blockers/Concerns

- Phase 3 must consume the Phase 2 setup model for public availability without reintroducing salon-specific branching.
- Booking mode is still not publicly usable until Phase 3 adds service selection, slot lookup, and submission flows.

## Session Continuity

Last session: 2026-04-13T14:54:17.843Z
Stopped at: Phase 3 UI-SPEC approved
Resume file: .planning/phases/03-public-booking-engine/03-UI-SPEC.md
