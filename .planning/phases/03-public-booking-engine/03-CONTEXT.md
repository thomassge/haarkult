# Phase 3: Public Booking Engine - Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 3 turns `/termin-buchen` from a booking placeholder into a real public booking flow. It covers public service/category selection, conditional stylist preference, availability lookup, slot selection, guest contact details, conflict-safe booking submission, and public success/retry/fallback states. It must consume the Phase 2 server-owned setup model for staff, service assignments, weekly hours, and exceptions. It does not cover staff booking list/detail operations, staff-side accept/decline/reschedule screens, notifications, customer accounts, online payments, or legal/privacy finalization.

</domain>

<decisions>
## Implementation Decisions

### Booking Flow Shape
- **D-01:** Use a guided multi-step booking app on one URL. Keep `/termin-buchen` as the single public booking route and move clients through service, stylist preference, slot, contact details, and submit states inside that route.
- **D-02:** Do not split the public booking journey across separate URLs in Phase 3.

### Service Browsing And Selection
- **D-03:** Use a category-first grouped booking catalog. The service step first shows bookable service categories as clear selectable tabs/chips in the header area.
- **D-04:** After a category is selected, show all bookable services in that category with service name, price hint, and duration.
- **D-05:** If a salon has only one bookable service category, skip category selection and show services directly.
- **D-06:** Service data must derive from the reusable service catalog and booking catalog helpers, not hardcoded Haarkult-only lists.

### Stylist Choice Behavior
- **D-07:** If only one eligible stylist can perform the selected service, skip stylist selection entirely.
- **D-08:** If multiple eligible stylists can perform the selected service, let the client choose either a named stylist or `Keine Praeferenz`.
- **D-09:** `Keine Praeferenz` searches availability across all eligible stylists.
- **D-10:** The chosen slot must still persist the concrete staff member attached to that slot, even when the client selected `Keine Präferenz`.

### Slot Display
- **D-11:** Show multiple selectable dates first.
- **D-12:** When the client selects a date, display available free slots for that date as time chips/buttons.
- **D-13:** Slot availability must be calculated from selected service duration, stylist preference, schedules, exceptions, existing bookings, lead time, booking horizon, and slot step rules.

### Booking Submission And Confirmation
- **D-14:** Support two salon-configurable confirmation modes.
- **D-15:** In manual mode, public submission creates a pending booking request and the success copy says the salon will confirm personally.
- **D-16:** In automatic mode, public submission creates an immediately confirmed booking and the success copy says the appointment is booked.
- **D-17:** The salon decides which confirmation mode it uses through booking configuration. Haarkult can keep the current manual default.

### Conflict And Retry UX
- **D-18:** If the selected slot is no longer available during submission, preserve selected service, stylist preference, name, phone, email, and optional note.
- **D-19:** Clear only the invalid selected slot, show a clear German message that the time is no longer available, and reload available slots for the same selected date.
- **D-20:** Include nearby alternative slot suggestions in Phase 3 if they fit naturally into the availability implementation.

### Customer Data And Trust Copy
- **D-21:** Use short German trust copy around the contact fields.
- **D-22:** Keep the flow guest-first with no account prompt.
- **D-23:** Require name, phone, and email.
- **D-24:** Include an optional note field with helpful German helper text for wishes, special context, or preferred contact time.

### Setup-Incomplete Public State
- **D-25:** If booking mode is enabled but required operational setup is incomplete, keep `/termin-buchen` public-friendly and show a calm German contact fallback with phone, WhatsApp, and email actions.
- **D-26:** Do not expose technical/admin setup wording to public visitors in the setup-incomplete state.
- **D-27:** If setup is complete but no free slots exist for the selected service, stylist preference, or date, keep the client inside the booking flow and let them try another date, stylist preference, or service.

### the agent's Discretion
- Exact component breakdown, client/server state shape, and endpoint naming.
- Exact visual spacing, as long as the flow stays calm, premium, German, and mobile-friendly.
- Whether nearby alternatives are shown as a first-class block or simple same-date refreshed slots, depending on implementation complexity.
- Exact validation copy, as long as client-facing errors are clear and German.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product And Phase Scope
- `.planning/ROADMAP.md` - Phase 3 goal, requirement IDs, success criteria, and planned work breakdown.
- `.planning/REQUIREMENTS.md` - Public booking requirements BOOK-01 through BOOK-08 and STAF-05.
- `.planning/PROJECT.md` - Core value, constraints, current state, and key decisions affecting booking reuse and salon-first scope.
- `.planning/STATE.md` - Current project state and Phase 3 blockers/concerns.

### Prior Phase Decisions
- `.planning/phases/02-admin-auth-salon-setup/02-CONTEXT.md` - Locked Phase 2 decisions about operational staff, service assignments, weekly hours, exceptions, and admin/public boundaries.
- `.planning/phases/02-admin-auth-salon-setup/02-VERIFICATION.md` - Verified Phase 2 setup model and guarantees that Phase 3 can consume.

### Booking Data And Public Route
- `content/booking.ts` - Booking mode, confirmation mode, lead time, horizon, slot step, fallback actions, and German booking copy.
- `content/services.ts` - Source of truth for service IDs, categories, duration, and price labels.
- `lib/booking/catalog.ts` - Bookable service derivation and booking service snapshot helper.
- `app/termin-buchen/page.tsx` - Current public booking/contact route entry point.
- `app/termin-buchen/_lib/booking-entry-content.ts` - Current mode-aware public booking copy/action derivation.
- `db/schema.ts` - Existing staff, availability, bookings, and booking events schema.
- `lib/booking/setup-queries.ts` - Existing server-owned setup DTO reads for staff, assigned services, weekly hours, exceptions, and setup completion.

### Architecture And Quality Constraints
- `.planning/codebase/ARCHITECTURE.md` - Existing route/block/UI/content/domain/data layering.
- `.planning/codebase/STRUCTURE.md` - Where new public booking, API, domain, and test code should live.
- `.planning/codebase/TESTING.md` - Existing and recommended testing patterns.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `content/services.ts` - Already contains service categories, service IDs, durations, and price labels for booking display.
- `content/booking.ts` - Already contains `confirmationMode`, `leadTimeHours`, `maxAdvanceDays`, `slotStepMinutes`, and fallback contact actions.
- `lib/booking/catalog.ts` - Provides bookable service filtering and booking snapshots; Phase 3 should build on this rather than duplicating service data.
- `lib/booking/setup-queries.ts` - Provides staff setup, assigned services, weekly ranges, exceptions, and setup completion data from server-owned rows.
- `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/container.tsx`, `components/ui/heading.tsx`, `components/ui/section.tsx`, `components/ui/typography.tsx` - Existing UI primitives for the public booking screen.

### Established Patterns
- Public route files are thin and compose route-local components/helpers.
- Booking-specific public code belongs under `app/termin-buchen/*`, `lib/booking/*`, and API/server modules rather than brochure components.
- Salon-specific public content remains in `content/*`; operational booking data belongs in the database.
- German user-facing copy is required.
- The system already has Vitest-based regression tests in `tests/phase-1` and `tests/phase-2`; Phase 3 should continue with focused tests for availability, mode boundaries, route behavior, and conflict handling.

### Integration Points
- `/termin-buchen` becomes the single public booking app route.
- Availability must join service catalog data with DB-backed active staff, staff service assignments, weekly availability, availability exceptions, and existing bookings.
- Booking submission writes `bookings` and should write an initial `booking_events` record when practical.
- Contact fallback actions should continue to resolve through existing site-mode/home-page action helpers where possible.

</code_context>

<specifics>
## Specific Ideas

- The service step should feel like a grouped booking catalog, but category-first: choose a category, then choose a service.
- Category choice should disappear automatically when there is only one category, such as a salon that only offers men-focused services.
- Multiple eligible stylists should show `Keine Praeferenz` alongside named stylists.
- Slot display should show multiple dates, then time chips for the selected date.
- Haarkult should be able to use manual request confirmation, but the product should also support salons that want automatic confirmation.
- The contact form should include short reassurance text, not a full legal block.

</specifics>

<deferred>
## Deferred Ideas

- Allow salon staff to modify the duration of an incoming appointment after submission because repeat customers may need less time than new customers for the same service. This belongs to Phase 4 staff booking operations or a later advanced admin operation, not Phase 3 public booking submission.
- Updating Haarkult's new price list should be handled as a separate content update against `content/services.ts` so Phase 3 displays current prices from the catalog.

</deferred>

---

*Phase: 03-public-booking-engine*
*Context gathered: 2026-04-13*
