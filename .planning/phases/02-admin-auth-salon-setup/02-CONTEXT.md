# Phase 2: Admin Auth & Salon Setup - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 2 gives salon staff protected access to the operational setup data that the public booking engine will need later. It covers admin sign-in, protected admin routes, stylist setup, service assignments, recurring weekly working hours, and one-off availability exceptions. It does not cover public booking, booking submission, booking lifecycle operations, notifications, customer accounts, or payments.

</domain>

<decisions>
## Implementation Decisions

### Admin Access
- **D-01:** Implement real email/password admin login backed by `admin_users`.
- **D-02:** For Haarkult-Maintal, Phase 2 only needs one seeded owner/admin account.
- **D-03:** Keep the auth system role-ready by using the existing `role` and `active` fields, but do not build admin-user management UI in Phase 2.
- **D-04:** A logged-in owner/admin can manage all salon setup data. Separate employee/stylist booking records from admin login accounts.

### Setup Workflow
- **D-05:** The setup checklist is an onboarding state, not the permanent admin UI.
- **D-06:** First-time setup should be easy enough for self-service salon onboarding, but also suitable for a paid "we set it up for you" onboarding service.
- **D-07:** After required setup is complete, `/admin` should become a practical dashboard focused on operations and common setup changes, not a checklist shown every time.
- **D-08:** The admin dashboard should be made of clickable frames/cards for major areas. Editing happens after clicking into a focused setup area.
- **D-09:** Setup is complete when at least one active stylist exists, every active stylist has at least one assigned service, and every active stylist has weekly working hours.
- **D-10:** Availability exceptions such as vacation, breaks, and blocked times are optional for setup completion.

### Staff And Service Assignment
- **D-11:** Booking stylists/staff are managed in the database through the admin area.
- **D-12:** Public marketing team content stays separate from operational booking staff. A future link between the two is allowed, but booking operations must not depend on `content/team.ts`.
- **D-13:** Services remain sourced from `content/services.ts`; database assignments should reference service IDs instead of duplicating service titles, prices, or durations.
- **D-14:** Creating or editing a stylist must support an "all services" checkbox.
- **D-15:** The admin can also select individual services per stylist for salons where not every stylist performs every service.
- **D-16:** For Haarkult-Maintal, the expected default is that every stylist can perform all bookable services.

### Working Hours And Exceptions
- **D-17:** Support multiple weekly working-time ranges per stylist per weekday.
- **D-18:** Support one-off availability exceptions for vacation, break, and blocked time.
- **D-19:** Exceptions should support all-day or timed windows plus optional label/notes.
- **D-20:** Exceptions override the normal weekly schedule and must be persisted in the server-owned booking model for Phase 3 availability calculations.

### Admin UI Tone
- **D-21:** The admin UI should be calm, premium, and operational. It should not be a marketing page and should not be a dense enterprise admin panel.
- **D-22:** Reuse the existing UI primitives where sensible, but prioritize clarity, speed, and low-error forms over visual decoration.
- **D-23:** Use German user-facing copy throughout the admin UI.
- **D-24:** Use clickable dashboard frames/cards for the major areas, with focused configuration screens after selection.

### the agent's Discretion
- Exact route names under `/admin`, as long as the dashboard-frame model and protected setup areas are preserved.
- Exact form composition and validation helpers, as long as validation is server-side and the saved data is reliable for Phase 3.
- Exact visual spacing and component breakdown, as long as the calm operational dashboard tone is preserved.
- Exact setup-completion implementation, as long as the required setup criteria in D-09 are enforced.
- Whether the "all services" checkbox disables the individual list or visually selects all individual services, as long as the behavior is clear.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product And Phase Scope
- `.planning/ROADMAP.md` - Phase 2 goal, requirements, success criteria, and planned work breakdown.
- `.planning/PROJECT.md` - Core builder value, constraints, current state, and key decisions affecting booking/admin work.
- `.planning/REQUIREMENTS.md` - Active Phase 2 requirements ADMN-01, ADMN-06, STAF-01, STAF-02, STAF-03, and STAF-04.
- `.planning/STATE.md` - Current project state and notes that Phase 2 must decide auth mechanism and persisted setup data.
- `CODEX_CONTEXT.md` - Existing handoff context including approved booking stack direction, auth direction, and operational data ownership.

### Existing Booking/Admin Foundation
- `db/schema.ts` - Existing Drizzle schema for `admin_users`, `staff`, `staff_services`, `weekly_availability`, `availability_exceptions`, `bookings`, and `booking_events`.
- `drizzle/0000_previous_oracle.sql` - Generated migration matching the existing booking/admin schema.
- `db/index.ts` - Current Drizzle/Neon bootstrap and env access pattern.
- `lib/booking/env.ts` - Booking environment contract including `DATABASE_URL` and optional `AUTH_SECRET`.
- `lib/booking/catalog.ts` - Existing helper for deriving bookable services and booking service snapshots from the repo-owned service catalog.
- `content/services.ts` - Source of truth for service IDs, categories, durations, and price labels.
- `content/booking.ts` - Booking mode, booking rules, fallback actions, and German booking copy.
- `app/admin/page.tsx` - Existing admin boundary placeholder.
- `app/admin/_components/admin-shell.tsx` - Existing admin shell component and visual starting point.

### Architecture And Quality Constraints
- `.planning/codebase/ARCHITECTURE.md` - Layering and boundaries for routes, blocks, UI primitives, content/config, booking helpers, and DB code.
- `.planning/codebase/STRUCTURE.md` - Where new admin, booking-domain, route, and test code should live.
- `.planning/codebase/INTEGRATIONS.md` - Current integration state: Neon/Drizzle exists, Auth.js or equivalent is planned but not implemented.
- `.planning/codebase/CONCERNS.md` - Security and boundary risks around admin/auth, DB bootstrap, and public booking state.
- `.planning/codebase/TESTING.md` - Existing test state and recommendations for booking/admin safety coverage.
- `tests/phase-1/content-boundaries.test.ts` - Existing regression guard that brochure code must not import booking engine or database internals.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/card.tsx` - Useful for the dashboard frame/card model.
- `components/ui/container.tsx`, `components/ui/section.tsx`, `components/ui/heading.tsx`, `components/ui/typography.tsx` - Existing primitives for a calm, consistent admin shell.
- `app/admin/_components/admin-shell.tsx` - Existing placeholder shell that can evolve into the protected dashboard surface.
- `lib/booking/catalog.ts` - Should be used so admin service assignments reference known bookable service IDs from `content/services.ts`.
- `db/schema.ts` - Already contains most operational tables Phase 2 needs.

### Established Patterns
- Route files are thin and compose reusable components.
- Salon-specific public content stays in `content/*`; booking/admin operational data belongs in the database.
- Booking-specific logic should stay in `lib/booking/*`, `app/termin-buchen/*`, `app/admin/*`, API route handlers, or server-only modules rather than reusable brochure blocks.
- German user-facing copy is required.
- Existing Phase 1 tests protect booking mode and brochure/content boundaries.

### Integration Points
- `/admin` should become the protected entry point for admin login/dashboard work.
- `admin_users` is the persistence target for admin credentials, role, and active status.
- `staff`, `staff_services`, `weekly_availability`, and `availability_exceptions` are the persistence targets for setup data.
- `content/services.ts` and `lib/booking/catalog.ts` are the source for bookable service choices in staff assignment UI.
- Future Phase 3 public booking logic must be able to read Phase 2 setup data from the server-owned model.

</code_context>

<specifics>
## Specific Ideas

- The first salon can operate with one owner/admin login, but the implementation should not block future salons from having multiple admin users later.
- A new salon should be able to choose between paid setup by the builder/operator or self-service setup by the salon owner.
- The first-time admin view may show setup progress, but after setup is complete the default admin view should be a normal dashboard.
- The dashboard should use frames/cards for areas like stylists, service assignments, working hours, and vacation/blocked times.
- For Haarkult-Maintal, every stylist can perform every bookable service, so "all services" should be the easy path.

</specifics>

<deferred>
## Deferred Ideas

- Admin-user management UI for creating additional login accounts belongs in a later phase unless required by implementation.
- Booking acceptance, decline, reschedule, booking list, and booking dashboard operations belong to Phase 4.
- Public booking flow, slot display, and booking submission belong to Phase 3.
- Rich calendar UI, drag/drop scheduling, recurring exception rules, and advanced calendar polish are out of scope for Phase 2.

</deferred>

---

*Phase: 02-admin-auth-salon-setup*
*Context gathered: 2026-04-12*
