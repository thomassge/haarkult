# Retrospective

## Milestone: v1.0 - Phase 1 Builder Boundaries & Mode Hardening

**Shipped:** 2026-04-12
**Phases:** 1
**Plans:** 4

### What Was Built

- Reusable salon content and booking-domain boundaries.
- Shared public mode selectors for brochure, footer, and booking entry surfaces.
- Phase 1 Vitest coverage for mode gating, `/termin-buchen`, and import boundaries.
- Explicit `/termin-buchen` and `/admin` route boundaries.

### What Worked

- Closing the architecture boundaries before adding real booking/admin complexity reduced future coupling risk.
- Adding the Wave 0 test harness early made the MODE-03 gap easy to pin down and close.
- The Plan 04 follow-up kept the fix narrowly focused on the actual drift instead of redesigning the selector layer.

### What Was Inefficient

- `01-VERIFICATION.md` became stale after Plan 04 and had to be refreshed before milestone completion.
- Some planning state still reflected the broader v1 product as one milestone, while the practical workflow is phase-as-milestone.

### Patterns Established

- Treat each roadmap phase as a milestone slice for this project.
- Keep static fallback steps channel-agnostic; derive channel-specific wording from selectors.
- Keep admin and booking route trees physically separate from brochure blocks.

### Key Lessons

- Verification artifacts should be refreshed immediately after gap-closure plans.
- Requirements archives should close only the phase-scoped requirements and carry forward the remaining product backlog.

## Cross-Milestone Trends

| Trend | Observation |
|-------|-------------|
| Milestone scope | The project is easier to manage when each phase is treated as a milestone-sized delivery checkpoint. |
