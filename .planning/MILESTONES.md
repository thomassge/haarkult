# Milestones

## v1.0 - Phase 1: Builder Boundaries & Mode Hardening

**Shipped:** 2026-04-12
**Status:** Complete
**Phases:** 1
**Plans:** 4
**Tasks:** 8

### Delivered

Phase 1 locked the reusable salon content, booking-mode, and brochure/admin boundaries so Phase 2 can add protected operational setup without weakening the salon-builder architecture.

### Key Accomplishments

- Booking-domain config moved to `content/booking.ts`.
- Salon-wide config in `content/site.ts` is no longer mixed with booking-rule fields.
- Brochure mode behavior flows through `lib/site-mode.ts`.
- `contact_only` and `booking` public surfaces are covered by Vitest tests.
- `/termin-buchen` and `/admin` route boundaries are isolated from brochure components.
- MODE-03 hidden-channel fallback drift is fixed and covered by regression tests.

### Archives

- [Roadmap archive](./milestones/v1.0-ROADMAP.md)
- [Requirements archive](./milestones/v1.0-REQUIREMENTS.md)
- [Milestone audit](./milestones/v1.0-MILESTONE-AUDIT.md)

### Next

Continue with Phase 2: Admin Auth & Salon Setup.
