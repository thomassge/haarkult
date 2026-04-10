# Project Research Summary

**Project:** Haarkult Salon Builder
**Domain:** Reusable hair salon website and booking platform
**Researched:** 2026-04-10
**Confidence:** MEDIUM

## Executive Summary

This product is best treated as a salon-first monolith: one Next.js codebase that serves the premium brochure site, the public booking flow, and the staff/admin interface. That keeps delivery fast, matches the current repo structure, and avoids prematurely splitting the product before the core scheduling workflow is proven.

The research points to a clear recommendation: keep the existing content-driven brochure foundation, preserve the two-mode product contract (`contact_only` and `booking`), and focus the next major work on the real booking engine plus admin operations. Competitor products consistently emphasize online booking, staff management, and schedule control as the core value surface. That matches the user's clarified vision closely.

The main risks are also clear: a fake booking mode, double bookings from stale slot logic, per-salon branching that destroys reuse, and admin scope creep before the booking core is stable. The roadmap should therefore move from reusable salon boundaries to booking correctness, then to staff operations, then to launch hardening.

## Key Findings

### Recommended Stack

The existing stack is the right direction for this product. Next.js App Router, React, TypeScript, Drizzle, and Neon already form a workable foundation for a unified public site plus admin product. Research does not suggest replacing that foundation; it suggests completing it with authenticated admin routes, validation, email delivery, and strong server-side scheduling logic.

**Core technologies:**
- Next.js - public site, booking UI, and route handlers in one stack
- Drizzle + Neon Postgres - explicit booking data model with transactional server-side operations
- Auth.js - admin/staff authentication that fits the Next.js architecture
- Resend - lightweight transactional email for confirmations and updates

### Expected Features

For salon booking products, the must-have layer is straightforward: clients need a service catalog, a real booking entry point, accurate free slots, communication about booking state, and staff/admin handling on the salon side. For this project specifically, the one-stylist shortcut and reusable per-salon setup are also core, not optional polish.

**Must have (table stakes):**
- Public service selection and booking entry
- Accurate availability and conflict-safe booking creation
- Admin/staff appointment management
- Staff schedule and exception management
- Contact fallback even when booking mode exists

**Should have (competitive):**
- Reusable salon onboarding through clean content/assets swapping
- Conditional stylist selection that respects one-stylist salons
- Premium brochure plus operations in one coherent product

**Defer (v2+):**
- Payments and deposits
- Multi-location support
- Non-salon business verticals
- Customer accounts

### Architecture Approach

The right architecture is a mode-gated, salon-first monolith with strong boundaries: `content/*` for swappable salon-specific data, `lib/booking/*` for server-owned scheduling rules, `app/admin/*` for protected staff workflows, and a shared persistence layer for staff, availability, bookings, and booking events.

**Major components:**
1. Public marketing site - salon presentation, trust, and contact surface
2. Public booking flow - service/staff/date selection and booking intake
3. Availability engine - central source of slot truth
4. Admin dashboard - staff login, appointment management, and schedule setup
5. Notification layer - confirmation and status emails

### Critical Pitfalls

1. **Fake booking mode** - only count booking mode as done when the real backend workflow exists
2. **Double bookings** - prevent with server-side revalidation at write time
3. **Per-salon branching explosion** - keep differences in config/content, not booking logic forks
4. **Over-generalizing beyond salons** - keep current execution salon-first
5. **Admin scope creep** - prioritize appointment operations before analytics or broader business tooling

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Harden reusable salon boundaries
**Rationale:** Reuse is part of the product promise, and it should be protected before booking complexity grows.
**Delivers:** Clear content/config boundaries, builder-safe salon swapping rules, and booking/admin module boundaries.
**Addresses:** Reusability requirements from `PROJECT.md`
**Avoids:** Per-salon branching explosion

### Phase 2: Build booking engine and public flow core
**Rationale:** The main product gap is that booking mode is still only a shell.
**Delivers:** Public booking flow, server-side availability, and conflict-safe booking creation.
**Uses:** Next.js Route Handlers, Drizzle, Neon, validation
**Implements:** Public booking layer plus scheduling domain layer

### Phase 3: Build admin/staff operations
**Rationale:** A salon booking product is not complete until staff can manage appointments and schedules.
**Delivers:** Admin auth shell, appointment management, working hours, and exceptions.
**Implements:** Protected admin layer and scheduling operations

### Phase 4: Notifications, hardening, and launch readiness
**Rationale:** Once bookings and admin workflows work, the product needs communication, privacy alignment, and operational hardening.
**Delivers:** Email confirmations/updates, legal/privacy updates, and production hardening.
**Avoids:** "Looks done but isn't" launch risk

### Phase Ordering Rationale

- Reusable salon boundaries come before heavier booking work so reuse does not degrade under time pressure.
- Public booking comes before richer admin extras because it is the main unresolved product promise.
- Admin schedule management follows immediately because availability quality depends on staff operations.
- Notifications and launch hardening come after core workflow correctness, not before it.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** availability algorithm, timezone handling, and conflict-safe writes
- **Phase 3:** Auth.js credentials flow, role boundaries, and admin UX shape
- **Phase 4:** legal/privacy updates and operational notification rules

Phases with standard patterns:
- **Phase 1:** content/config refactors and builder-safe structure work

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Strongly aligned with the current repo and official documentation |
| Features | MEDIUM | Clear competitor signals plus direct user vision, but still needs exact v1 scoping in requirements |
| Architecture | MEDIUM | Strong fit for current size and goals; exact module boundaries will evolve during implementation |
| Pitfalls | MEDIUM | Well-supported by domain patterns and current repo risks |

**Overall confidence:** MEDIUM

### Gaps to Address

- Exact admin permissions and roles still need final requirement-level wording
- Booking confirmation semantics (`manual` vs `instant`) exist in config, but launch behavior still needs explicit requirement coverage
- The single-salon v1 scope is clear, but the onboarding workflow for future salons should be phrased carefully so it does not imply multi-tenant support yet

## Sources

### Primary (HIGH confidence)
- Next.js Route Handlers docs - https://nextjs.org/docs/app/api-reference/file-conventions/route
- Auth.js - https://authjs.dev/
- Drizzle docs - https://orm.drizzle.team/docs/get-started
- Neon serverless driver docs - https://neon.com/docs/serverless/serverless-driver
- Resend docs - https://resend.com/docs

### Secondary (MEDIUM confidence)
- Square Appointments product and support pages
- Phorest feature and booking pages
- Existing repo state and `.planning/PROJECT.md`

---
*Research completed: 2026-04-10*
*Ready for roadmap: yes*
