# Phase 03: Public Booking Engine - Research

**Researched:** 2026-04-13 [VERIFIED: system date]
**Domain:** Next.js App Router public booking flow, server-side availability, conflict-safe booking writes [VERIFIED: .planning/ROADMAP.md]
**Confidence:** HIGH for repo architecture and validation plan, MEDIUM for database race-condition strategy until tested against the production Postgres provider [VERIFIED: codebase grep] [ASSUMED]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

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
- **D-10:** The chosen slot must still persist the concrete staff member attached to that slot, even when the client selected `Keine PrÃ¤ferenz`.

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

### Claude's Discretion
- Exact component breakdown, client/server state shape, and endpoint naming.
- Exact visual spacing, as long as the flow stays calm, premium, German, and mobile-friendly.
- Whether nearby alternatives are shown as a first-class block or simple same-date refreshed slots, depending on implementation complexity.
- Exact validation copy, as long as client-facing errors are clear and German.

### Deferred Ideas (OUT OF SCOPE)
- Allow salon staff to modify the duration of an incoming appointment after submission because repeat customers may need less time than new customers for the same service. This belongs to Phase 4 staff booking operations or a later advanced admin operation, not Phase 3 public booking submission.
- Updating Haarkult's new price list should be handled as a separate content update against `content/services.ts` so Phase 3 displays current prices from the catalog.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BOOK-01 | Client can browse bookable services with duration and price context before starting a booking [VERIFIED: .planning/REQUIREMENTS.md] | Use `bookableServices` and category grouping from `content/services.ts` and `lib/booking/catalog.ts`; do not duplicate service lists. [VERIFIED: codebase grep] |
| BOOK-02 | Client can start a booking from the public website when booking mode is enabled [VERIFIED: .planning/REQUIREMENTS.md] | Keep `/termin-buchen` as the single route and branch through `getBookingPresentationState`. [VERIFIED: app/termin-buchen/page.tsx] |
| BOOK-03 | Client can select a service to book [VERIFIED: .planning/REQUIREMENTS.md] | Add client state for selected service ID and validate it server-side against `getBookableServiceById`. [VERIFIED: lib/booking/catalog.ts] |
| BOOK-04 | Client is not asked to choose a stylist when only one eligible stylist exists [VERIFIED: .planning/REQUIREMENTS.md] | Query active staff assignments for the selected service and auto-resolve one eligible staff member. [VERIFIED: db/schema.ts] |
| BOOK-05 | Client can choose a preferred stylist when more than one eligible stylist exists [VERIFIED: .planning/REQUIREMENTS.md] | Return eligible staff plus a `no_preference` option only when count > 1. [VERIFIED: 03-CONTEXT.md] |
| BOOK-06 | Client can see available appointment slots for the selected service, stylist choice, and date [VERIFIED: .planning/REQUIREMENTS.md] | Build `lib/booking/availability.ts` for candidate starts from weekly ranges, exceptions, bookings, lead time, horizon, and slot step. [VERIFIED: content/booking.ts] |
| BOOK-07 | Client can submit a booking using name, phone, email, and optional note [VERIFIED: .planning/REQUIREMENTS.md] | Add Zod public input schemas and a public submit server action. [VERIFIED: lib/booking/setup-validation.ts] [CITED: https://zod.dev] |
| BOOK-08 | Client gets a clear retry path when the selected slot is no longer available during submission [VERIFIED: .planning/REQUIREMENTS.md] | Submission must re-run slot validation in a transaction and return a typed conflict result that preserves form data. [VERIFIED: lib/booking/setup-actions.ts] |
| STAF-05 | Availability uses service duration, staff schedules, exceptions, bookings, lead time, horizon, and slot step rules [VERIFIED: .planning/REQUIREMENTS.md] | Availability should be pure enough for unit tests and isolate DB reads in a query adapter. [VERIFIED: tests/phase-2/*] |
</phase_requirements>

## Summary

Phase 3 should stay inside the existing stack: Next.js App Router, React client components only for the guided booking state, Route Handlers for slot lookup, Server Actions for final submission, Zod for validation, Drizzle for Postgres reads/writes, and Vitest for tests. [VERIFIED: package.json] [CITED: https://nextjs.org/docs/app/getting-started/updating-data] [CITED: https://nextjs.org/docs/app/building-your-application/routing/route-handlers]

The central planning risk is availability correctness, not UI complexity. [VERIFIED: .planning/ROADMAP.md] The planner should make the availability engine a pure domain module with explicit inputs and tests before wiring it to the public route. [VERIFIED: tests/phase-2/setup-completion.test.ts] Submission must call the same availability logic again on the server, choose a concrete staff member for `Keine Praeferenz`, and insert only after the slot remains free. [VERIFIED: 03-CONTEXT.md] [CITED: https://orm.drizzle.team/docs/transactions]

**Primary recommendation:** Use one route-local booking app under `app/termin-buchen`, backed by `lib/booking/availability.ts`, `lib/booking/public-queries.ts`, `lib/booking/public-actions.ts`, and focused `tests/phase-3/*` coverage before UI polish. [VERIFIED: codebase architecture]

## Project Constraints (from AGENTS.md)

- Hair salons are the only supported vertical for this project phase. [VERIFIED: AGENTS.md]
- Both `contact_only` and `booking` modes must remain supported. [VERIFIED: AGENTS.md]
- Salon-specific content and assets must stay swappable through structured content/config. [VERIFIED: AGENTS.md]
- Booking and admin logic must be shared across salons and avoid Haarkult-only branching. [VERIFIED: AGENTS.md]
- Stylist selection must be conditional and skipped when only one eligible stylist exists. [VERIFIED: AGENTS.md]
- User-facing content must be German only. [VERIFIED: AGENTS.md]
- No CMS, no customer accounts, and no online payments are in v1 scope. [VERIFIED: AGENTS.md]
- Code style should follow existing conventions: kebab-case files, named exports for reusable modules, `content/*` as salon data, `lib/booking/*` as booking domain boundary, 2-space indentation, double quotes, semicolons, strict TypeScript, and sparse comments. [VERIFIED: AGENTS.md]
- GSD workflow requires planning artifacts before repo edits; this research artifact is part of that workflow. [VERIFIED: AGENTS.md]

## Standard Stack

### Core

| Library | Installed Version | Registry Latest Checked | Purpose | Why Standard |
|---------|-------------------|-------------------------|---------|--------------|
| Next.js | 16.1.6 [VERIFIED: npm list] | 16.2.3, modified 2026-04-12 [VERIFIED: npm registry] | App Router route, Route Handlers, Server Actions, cache revalidation [CITED: https://nextjs.org/docs/app/getting-started/updating-data] | Already the app shell; no routing framework change is needed. [VERIFIED: package.json] |
| React | 19.2.3 [VERIFIED: npm list] | 19.2.5, modified 2026-04-09 [VERIFIED: npm registry] | Client booking state and form UX [CITED: https://react.dev/reference/react/useActionState] | Already installed and required by Next; use route-local client components rather than adding state libraries. [VERIFIED: package.json] |
| Drizzle ORM | 0.45.2 [VERIFIED: npm list] | 0.45.2, modified 2026-04-10 [VERIFIED: npm registry] | Typed Postgres reads, writes, transactions [CITED: https://orm.drizzle.team/docs/transactions] | Existing schema and admin setup actions already use Drizzle transactions. [VERIFIED: db/schema.ts] [VERIFIED: lib/booking/setup-actions.ts] |
| Neon serverless driver | 1.0.2 [VERIFIED: npm list] | 1.0.2, modified 2026-01-29 [VERIFIED: npm registry] | Serverless Postgres connection for Drizzle [CITED: https://neon.com/docs/serverless/serverless-driver] | Existing `db/index.ts` uses `neon()` and `drizzle({ client, schema })`. [VERIFIED: db/index.ts] |
| Zod | 4.3.6 [VERIFIED: npm list] | 4.3.6, modified 2026-01-25 [VERIFIED: npm registry] | Public booking input schemas and typed validation [CITED: https://zod.dev] | Existing setup validation uses Zod and tests its schemas. [VERIFIED: lib/booking/setup-validation.ts] |

### Supporting

| Library | Installed Version | Registry Latest Checked | Purpose | When to Use |
|---------|-------------------|-------------------------|---------|-------------|
| Vitest | 4.1.4 [VERIFIED: npm list] | 4.1.4, modified 2026-04-09 [VERIFIED: npm registry] | Unit and component regression tests [CITED: https://vitest.dev] | Use for availability math, eligibility, route fallback, validation, and conflict-return tests. [VERIFIED: vitest.config.ts] |
| Testing Library React | 16.3.0 [VERIFIED: package.json] | Not registry-checked in this session [ASSUMED] | Public route component assertions [VERIFIED: tests/phase-1/termin-buchen-page.test.tsx] | Use only for component behavior; keep availability as pure unit tests. [VERIFIED: tests/phase-1/termin-buchen-page.test.tsx] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Server Actions for slot lookup | Route Handlers returning JSON | Use Route Handlers for availability lookup because date/service/staff changes are naturally query-like and should not mutate data. [CITED: https://nextjs.org/docs/app/building-your-application/routing/route-handlers] |
| Adding a form/state library | React local state plus `useActionState` where useful | Existing scope is a single guided form, so a new dependency adds complexity without solving a current repo problem. [VERIFIED: package.json] [CITED: https://react.dev/reference/react/useActionState] |
| Database exclusion constraint in Phase 3 | Transactional re-check plus indexed overlap query | A Postgres exclusion constraint is robust for overlap prevention, but it likely requires schema/migration work not already present; use a transactional re-check now and add DB-level exclusion if UAT finds real concurrent write risk. [CITED: https://www.postgresql.org/docs/current/ddl-constraints.html] [ASSUMED] |

**Installation:** No new runtime packages are recommended for Phase 3. [VERIFIED: package.json]

```bash
npm install
```

**Version verification command used:** [VERIFIED: npm registry]

```bash
npm.cmd view next version time.modified
npm.cmd view react version time.modified
npm.cmd view drizzle-orm version time.modified
npm.cmd view @neondatabase/serverless version time.modified
npm.cmd view zod version time.modified
npm.cmd view vitest version time.modified
```

## Architecture Patterns

### Recommended Project Structure

```text
app/
  termin-buchen/
    page.tsx                         # server route entry and mode/setup gate [VERIFIED: app/termin-buchen/page.tsx]
    _components/
      booking-flow.tsx               # client guided booking app [ASSUMED]
      service-step.tsx               # category-first service selection [ASSUMED]
      stylist-step.tsx               # conditional stylist preference [ASSUMED]
      slot-step.tsx                  # dates and time chips [ASSUMED]
      contact-step.tsx               # guest contact fields [ASSUMED]
      booking-result.tsx             # success/conflict/fallback states [ASSUMED]
    api/
      slots/route.ts                 # JSON slot query endpoint [CITED: https://nextjs.org/docs/app/building-your-application/routing/route-handlers]
lib/
  booking/
    availability.ts                  # pure slot engine [ASSUMED]
    public-queries.ts                # DB reads for public setup, eligibility, bookings [ASSUMED]
    public-actions.ts                # submission Server Action [CITED: https://nextjs.org/docs/app/getting-started/updating-data]
    public-validation.ts             # Zod schemas for public inputs [CITED: https://zod.dev]
tests/
  phase-3/
    public-booking-flow.test.tsx     # route and UI branching [VERIFIED: tests/phase-1/termin-buchen-page.test.tsx]
    availability-engine.test.ts      # core STAF-05 math [ASSUMED]
    booking-submission.test.ts       # validation and conflict behavior [ASSUMED]
```

### Pattern 1: Thin Server Route, Route-Local Client App

**What:** Keep `app/termin-buchen/page.tsx` responsible for metadata, booking mode, setup completeness, and initial data; move interactive steps into route-local `_components`. [VERIFIED: app/termin-buchen/page.tsx]

**When to use:** Use this for the public guided flow because the route stays one URL and the UI needs local step state. [VERIFIED: 03-CONTEXT.md]

**Example:**

```tsx
// Source: existing route pattern in app/termin-buchen/page.tsx [VERIFIED: codebase grep]
export default async function BookingPage() {
  const entryContent = getBookingEntryContent();
  const setup = await getPublicBookingSetup();

  if (!entryContent.isBookingEnabled || !setup.complete) {
    return <BookingEntryShell {...entryContent} brandName={site.brand.name} />;
  }

  return <BookingFlow initialCatalog={setup.catalog} />;
}
```

### Pattern 2: Pure Availability Engine With DB Adapter

**What:** Put time math in a pure function that accepts service duration, booking config, staff schedules, exceptions, existing bookings, selected date, and stylist preference. [VERIFIED: 03-CONTEXT.md]

**When to use:** Use for STAF-05 because pure inputs make edge cases testable without a live database. [VERIFIED: tests/phase-2/weekly-availability.test.ts]

**Example:**

```ts
// Source: planned repo-local pattern derived from setup validation tests. [VERIFIED: tests/phase-2/*]
export function getAvailableSlots(input: AvailabilityInput): AvailabilitySlot[] {
  const eligibleStaff = resolveEligibleStaff(input);
  const candidateStarts = createCandidateStarts(input.date, input.bookingRules);

  return candidateStarts.flatMap((startAt) =>
    eligibleStaff
      .filter((staffRow) => canFitSlot(staffRow, startAt, input))
      .map((staffRow) => ({
        staffId: staffRow.id,
        startAt,
        endAt: addMinutes(startAt, input.durationMinutes),
      }))
  );
}
```

### Pattern 3: Re-Check Before Insert

**What:** Submission validates public fields, resolves the service snapshot, computes available slots again, confirms the chosen concrete slot is still available, then inserts `bookings` and a `booking_events.created` row in one transaction. [VERIFIED: db/schema.ts] [CITED: https://orm.drizzle.team/docs/transactions]

**When to use:** Always use this for public booking submission because public slot data can become stale between lookup and submit. [VERIFIED: BOOK-08 in .planning/REQUIREMENTS.md]

**Example:**

```ts
// Source: Drizzle transaction pattern already used in lib/booking/setup-actions.ts. [VERIFIED: codebase grep]
await db.transaction(async (tx) => {
  const slots = await queryAvailableSlots(tx, submitInput);
  const selectedSlot = slots.find((slot) => slot.slotId === submitInput.slotId);

  if (!selectedSlot) {
    return { status: "slot_conflict" as const };
  }

  await tx.insert(bookings).values(createBookingValues(selectedSlot, submitInput));
  await tx.insert(bookingEvents).values(createCreatedEventValues(bookingId));
  return { status: "created" as const, bookingId };
});
```

### Anti-Patterns to Avoid

- **Duplicating services in UI state:** Use `bookableServices` and service snapshots so bookings preserve service data while the UI remains reusable. [VERIFIED: lib/booking/catalog.ts]
- **Client-only availability checks:** Availability must be server-calculated because staff schedules, exceptions, existing bookings, lead time, and conflict checks are server-owned. [VERIFIED: db/schema.ts]
- **Persisting `Keine Praeferenz` as staff:** Store the concrete `staffId` chosen by the slot engine; `Keine Praeferenz` is only a search preference. [VERIFIED: 03-CONTEXT.md]
- **Treating setup-incomplete as an error:** Public users should see contact fallback, not setup/admin wording. [VERIFIED: 03-CONTEXT.md]
- **Hardcoding Berlin offset math casually:** Existing code already handles Europe/Berlin conversion carefully for exceptions; reuse or centralize that logic before adding slot math. [VERIFIED: lib/booking/setup-validation.ts]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Public form validation | Custom string checks scattered in components | Zod schemas in `lib/booking/public-validation.ts` [CITED: https://zod.dev] | Existing admin setup uses Zod and tests schema behavior. [VERIFIED: lib/booking/setup-validation.ts] |
| Service catalog | New arrays inside booking components | `content/services.ts`, `bookableServices`, `createBookingServiceSnapshot()` [VERIFIED: lib/booking/catalog.ts] | Catalog reuse is a project constraint and avoids Haarkult-only branching. [VERIFIED: AGENTS.md] |
| Database writes | Ad hoc SQL strings | Drizzle inserts/transactions [CITED: https://orm.drizzle.team/docs/transactions] | Existing schema and setup actions already use Drizzle. [VERIFIED: db/schema.ts] |
| Slot conflict detection | Client-side disabled buttons only | Server re-check against current bookings before insert [VERIFIED: BOOK-08] | Slot data can stale between lookup and submit. [VERIFIED: 03-CONTEXT.md] |
| Authentication/account flow | Customer login or account prompts | Guest-first contact fields only [VERIFIED: AGENTS.md] | Customer accounts are out of v1 scope. [VERIFIED: AGENTS.md] |

**Key insight:** The only custom logic Phase 3 should own is salon-specific availability composition; validation, routing, persistence, and tests should reuse the existing stack. [VERIFIED: package.json] [VERIFIED: db/schema.ts]

## Common Pitfalls

### Pitfall 1: Availability Uses Local UI State As Truth

**What goes wrong:** The user sees a slot that is no longer valid and the app inserts it anyway. [VERIFIED: BOOK-08]
**Why it happens:** Slot lookup and submission use different logic or submission trusts the client. [ASSUMED]
**How to avoid:** Put the shared availability calculation in `lib/booking/availability.ts` and call it from both the slot endpoint and submit action. [ASSUMED]
**Warning signs:** Tests mock slot availability separately from submit availability. [ASSUMED]

### Pitfall 2: One-Stylist Rule Implemented Globally Instead Of Per Service

**What goes wrong:** The UI skips stylist selection because the salon has one active stylist overall, even though eligibility should be based on the selected service. [VERIFIED: STAF-02, BOOK-04, BOOK-05]
**Why it happens:** Counting active staff instead of active staff assigned to the selected service. [VERIFIED: db/schema.ts]
**How to avoid:** Resolve eligible staff from `staff.active` plus `staff_services.service_id`. [VERIFIED: db/schema.ts]
**Warning signs:** Tests only cover one global staff member and not one eligible staff among multiple active staff. [ASSUMED]

### Pitfall 3: Exception Overlap Boundaries Are Off By One

**What goes wrong:** A slot ending exactly when a break begins or starting exactly when a break ends is incorrectly blocked, or a slot overlapping by one minute is incorrectly allowed. [ASSUMED]
**Why it happens:** Overlap logic often uses inconsistent boundary operators. [ASSUMED]
**How to avoid:** Use half-open intervals: overlap exists when `slotStart < blockEnd && slotEnd > blockStart`. [ASSUMED]
**Warning signs:** No tests for exact boundary cases. [ASSUMED]

### Pitfall 4: DST And Europe/Berlin Date Handling

**What goes wrong:** Slots around daylight-saving transitions render on the wrong local date or fail round-trip validation. [VERIFIED: lib/booking/setup-validation.ts]
**Why it happens:** Raw `Date` parsing of local strings can depend on runtime timezone assumptions. [ASSUMED]
**How to avoid:** Centralize local-date conversion and use explicit `Europe/Berlin` formatting logic already proven in exception validation. [VERIFIED: lib/booking/setup-validation.ts]
**Warning signs:** Availability tests use only UTC ISO strings and not local date inputs. [ASSUMED]

### Pitfall 5: Manual And Instant Confirmation Diverge Too Early

**What goes wrong:** Manual and instant modes get separate booking code paths and later admin operations must handle inconsistent records. [ASSUMED]
**Why it happens:** Treating confirmation copy as a separate persistence model. [ASSUMED]
**How to avoid:** Use the same insert path and derive only initial `status` and success copy from `booking.confirmationMode`. [VERIFIED: content/booking.ts]
**Warning signs:** Two submit actions or two booking DTO shapes. [ASSUMED]

## Code Examples

### Route Handler For Slot Lookup

```ts
// Source: Next.js Route Handlers support exported HTTP method functions. [CITED: https://nextjs.org/docs/app/building-your-application/routing/route-handlers]
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = slotQuerySchema.parse(Object.fromEntries(searchParams));
  const result = await getPublicAvailableSlots(input);

  return Response.json(result);
}
```

### Server Action For Final Submission

```ts
// Source: Next.js Server Actions use "use server" and existing repo actions use this style. [CITED: https://nextjs.org/docs/app/getting-started/updating-data] [VERIFIED: lib/booking/setup-actions.ts]
"use server";

export async function submitPublicBookingAction(
  _previousState: PublicBookingState,
  formData: FormData
) {
  const input = publicBookingInputSchema.parse(Object.fromEntries(formData));
  return createPublicBooking(input);
}
```

### Conflict Predicate

```ts
// Source: standard half-open interval overlap predicate; planner should test exact boundaries. [ASSUMED]
export function overlaps(left: TimeWindow, right: TimeWindow) {
  return left.startAt < right.endAt && left.endAt > right.startAt;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages API routes for all server operations | App Router Route Handlers and Server Actions [CITED: https://nextjs.org/docs/app/building-your-application/routing/route-handlers] [CITED: https://nextjs.org/docs/app/getting-started/updating-data] | Current docs checked 2026-04-13 [VERIFIED: web docs] | Use Route Handlers for slot JSON and Server Actions for submit mutation. [ASSUMED] |
| Manual form parsing only | Zod schemas at server boundaries [CITED: https://zod.dev] | Current repo already uses Zod 4 [VERIFIED: package.json] | Keep public validation consistent with Phase 2 setup validation. [VERIFIED: lib/booking/setup-validation.ts] |
| Custom SQL everywhere | Drizzle schema, query builder, and transactions [CITED: https://orm.drizzle.team/docs/transactions] | Existing Phase 2 code uses Drizzle [VERIFIED: lib/booking/setup-actions.ts] | Keep typed persistence and avoid SQL string drift. [VERIFIED: db/schema.ts] |

**Deprecated/outdated:**
- Splitting the guided flow across pages is out of scope because D-01 and D-02 lock one URL. [VERIFIED: 03-CONTEXT.md]
- Customer accounts and online payment flows are out of v1 scope. [VERIFIED: AGENTS.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Transactional re-check is enough for Phase 3 without a database exclusion constraint. | Standard Stack / Alternatives | Concurrent public submissions for the same staff/time could double-book under unlucky timing; planner should test and consider DB-level constraint if risk is unacceptable. |
| A2 | Route-local React state is sufficient without adding a form/state dependency. | Standard Stack / Alternatives | If the flow becomes more complex than planned, state bugs could accumulate; keep component boundaries small. |
| A3 | Half-open interval overlap is the intended booking semantics. | Common Pitfalls / Code Examples | If business rules require buffers or closed boundaries, slots at exact edges may be wrong; include buffer tests. |
| A4 | No new package is needed for timezone handling. | Common Pitfalls | DST bugs may appear if local date conversion is not centralized and tested; planner may add a date library only if tests expose unacceptable complexity. |

## Open Questions

1. **Should Phase 3 add a database-level overlap guard?**
   - What we know: The schema has indexes on staff and start/status, but no exclusion constraint. [VERIFIED: db/schema.ts]
   - What's unclear: Whether production concurrency risk warrants a migration now. [ASSUMED]
   - Recommendation: Plan transactional re-check first; add a Wave 0 spike or schema task if double-submit tests show a real race. [ASSUMED]

2. **What date range should the UI initially show?**
   - What we know: `maxAdvanceDays` is 60 and `leadTimeHours` is 12. [VERIFIED: content/booking.ts]
   - What's unclear: The exact number of visible date buttons is discretionary. [VERIFIED: 03-CONTEXT.md]
   - Recommendation: Show a compact initial range such as 7-14 dates and allow moving forward within horizon. [ASSUMED]

3. **Should nearby alternatives be first-class in Phase 3?**
   - What we know: D-20 allows them if they fit naturally. [VERIFIED: 03-CONTEXT.md]
   - What's unclear: Whether this fits without delaying the required conflict path. [ASSUMED]
   - Recommendation: Treat alternatives as optional after same-date reload works. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Next.js, Vitest, Drizzle CLI [VERIFIED: package.json] | Yes [VERIFIED: shell] | v24.13.1 [VERIFIED: shell] | None needed |
| npm | Scripts and package registry [VERIFIED: README/AGENTS.md] | Yes [VERIFIED: shell] | 11.12.1 [VERIFIED: shell] | None needed |
| Next CLI | Build/dev validation [VERIFIED: package.json] | Yes [VERIFIED: shell] | 16.1.6 installed [VERIFIED: shell] | None needed |
| Vitest | Phase 3 regression tests [VERIFIED: package.json] | Yes [VERIFIED: shell] | 4.1.4 installed [VERIFIED: shell] | None needed |
| DATABASE_URL | Live Drizzle/Neon DB reads and writes [VERIFIED: lib/booking/env.ts] | No in current shell [VERIFIED: shell] | N/A | Unit-test pure availability without DB; DB-backed tests require env setup. [ASSUMED] |

**Missing dependencies with no fallback:**
- A reachable `DATABASE_URL` is required to manually test real booking writes through `db/index.ts`. [VERIFIED: lib/booking/env.ts]

**Missing dependencies with fallback:**
- Live database is not needed for pure availability unit tests if query adapters are mocked or input DTOs are passed directly. [ASSUMED]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 with jsdom [VERIFIED: npm list] |
| Config file | `vitest.config.ts` [VERIFIED: shell] |
| Quick run command | `npm.cmd run test:unit -- tests/phase-3/availability-engine.test.ts` [ASSUMED] |
| Full suite command | `npm.cmd run test:unit` [VERIFIED: package.json] |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| BOOK-01 | Service catalog groups categories and shows duration/price | component/unit | `npm.cmd run test:unit -- tests/phase-3/public-booking-flow.test.tsx` | No - Wave 0 |
| BOOK-02 | Booking mode shows the real flow and contact-only keeps fallback | component | `npm.cmd run test:unit -- tests/phase-3/public-booking-flow.test.tsx` | No - Wave 0 |
| BOOK-03 | Service selection updates downstream flow state | component/unit | `npm.cmd run test:unit -- tests/phase-3/public-booking-flow.test.tsx` | No - Wave 0 |
| BOOK-04 | One eligible stylist skips stylist step | unit/component | `npm.cmd run test:unit -- tests/phase-3/stylist-eligibility.test.ts` | No - Wave 0 |
| BOOK-05 | Multiple eligible stylists show named choices and `Keine Praeferenz` | unit/component | `npm.cmd run test:unit -- tests/phase-3/stylist-eligibility.test.ts` | No - Wave 0 |
| BOOK-06 | Slots reflect selected service, staff/date, and booking rules | unit | `npm.cmd run test:unit -- tests/phase-3/availability-engine.test.ts` | No - Wave 0 |
| BOOK-07 | Submit validates name, phone, email, optional note and writes booking DTO | unit/action | `npm.cmd run test:unit -- tests/phase-3/booking-submission.test.ts` | No - Wave 0 |
| BOOK-08 | Stale selected slot returns conflict and preserves user data | unit/action | `npm.cmd run test:unit -- tests/phase-3/booking-submission.test.ts` | No - Wave 0 |
| STAF-05 | Availability considers duration, schedules, exceptions, bookings, lead time, horizon, and step | unit | `npm.cmd run test:unit -- tests/phase-3/availability-engine.test.ts` | No - Wave 0 |

### Sampling Rate

- **Per task commit:** Run the relevant Phase 3 focused test file. [ASSUMED]
- **Per wave merge:** Run focused Phase 3 tests for availability, eligibility, submission, and public flow. [ASSUMED]
- **Phase gate:** Run `npm.cmd run test:unit` and `npm.cmd run lint`. [VERIFIED: package.json]

### Wave 0 Gaps

- [ ] `tests/phase-3/availability-engine.test.ts` - covers STAF-05 and BOOK-06. [ASSUMED]
- [ ] `tests/phase-3/stylist-eligibility.test.ts` - covers BOOK-04 and BOOK-05. [ASSUMED]
- [ ] `tests/phase-3/public-booking-flow.test.tsx` - covers BOOK-01 through BOOK-03 and setup fallback. [ASSUMED]
- [ ] `tests/phase-3/booking-submission.test.ts` - covers BOOK-07 and BOOK-08. [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | No for public booking; admin auth remains Phase 2 [VERIFIED: AGENTS.md] | Do not add customer accounts. [VERIFIED: AGENTS.md] |
| V3 Session Management | No for public clients [VERIFIED: AGENTS.md] | Keep guest-first flow. [VERIFIED: AGENTS.md] |
| V4 Access Control | Yes for admin/public boundary [VERIFIED: AGENTS.md] | Public actions must not require `requireAdmin`; admin setup actions must keep `requireAdmin`. [VERIFIED: lib/booking/setup-actions.ts] |
| V5 Input Validation | Yes [VERIFIED: BOOK-07] | Zod schemas for slot query and booking submit input. [CITED: https://zod.dev] |
| V6 Cryptography | No new crypto in Phase 3 [VERIFIED: AGENTS.md] | Use platform/DB IDs via `randomUUID`; do not hand-roll tokens. [VERIFIED: lib/booking/setup-actions.ts] |
| V7 Error Handling | Yes [VERIFIED: BOOK-08] | Return German, non-technical conflict/validation messages; do not expose stack traces or setup internals. [VERIFIED: 03-CONTEXT.md] |
| V14 Configuration | Yes [VERIFIED: lib/booking/env.ts] | Required DB env stays centralized in `getBookingEnv`. [VERIFIED: lib/booking/env.ts] |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Double booking through stale slot | Tampering / Race condition [ASSUMED] | Server-side availability re-check plus transaction before insert. [CITED: https://orm.drizzle.team/docs/transactions] |
| Invalid service or staff IDs submitted by client | Tampering [ASSUMED] | Validate IDs against catalog and active staff-service assignments server-side. [VERIFIED: lib/booking/catalog.ts] [VERIFIED: db/schema.ts] |
| Personal data over-collection | Privacy [VERIFIED: COMM-03 later requirement] | Phase 3 collects only name, phone, email, optional note as required. [VERIFIED: BOOK-07] |
| Setup information leak | Information Disclosure [VERIFIED: D-25/D-26] | Public setup-incomplete state shows contact fallback, not technical setup status. [VERIFIED: 03-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/03-public-booking-engine/03-CONTEXT.md` - locked user decisions, phase boundary, canonical refs. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - BOOK-01 through BOOK-08 and STAF-05 definitions. [VERIFIED: file read]
- `.planning/ROADMAP.md` - Phase 3 scope, success criteria, and plan breakdown. [VERIFIED: file read]
- `.planning/STATE.md` - current project state and Phase 3 blockers. [VERIFIED: file read]
- `AGENTS.md` - project constraints, stack, conventions, architecture, GSD workflow. [VERIFIED: file read]
- `package.json`, `npm list`, `npm view` - installed and current package versions. [VERIFIED: shell] [VERIFIED: npm registry]
- `db/schema.ts` - booking, staff, availability, and event schema. [VERIFIED: codebase grep]
- `lib/booking/setup-queries.ts`, `lib/booking/setup-actions.ts`, `lib/booking/setup-validation.ts` - Phase 2 server-owned setup patterns. [VERIFIED: codebase grep]
- `content/booking.ts`, `content/services.ts`, `lib/booking/catalog.ts` - booking config and reusable catalog source. [VERIFIED: codebase grep]

### Primary Web / Official Docs

- Next.js App Router forms and Server Actions: https://nextjs.org/docs/app/getting-started/updating-data [CITED]
- Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers [CITED]
- React `useActionState`: https://react.dev/reference/react/useActionState [CITED]
- Drizzle transactions: https://orm.drizzle.team/docs/transactions [CITED]
- Zod docs: https://zod.dev [CITED]
- Neon serverless driver docs: https://neon.com/docs/serverless/serverless-driver [CITED]
- PostgreSQL constraints and exclusion constraints: https://www.postgresql.org/docs/current/ddl-constraints.html [CITED]
- Vitest docs: https://vitest.dev [CITED]

### Secondary (MEDIUM confidence)

- None used beyond official docs and local verification. [VERIFIED: research log]

### Tertiary (LOW confidence)

- Assumptions listed in the Assumptions Log. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - package versions, installed versions, and project usage were verified locally and against npm registry. [VERIFIED: npm registry]
- Architecture: HIGH - follows existing route/content/lib/db/test boundaries and locked decisions. [VERIFIED: AGENTS.md]
- Pitfalls: MEDIUM - most are grounded in requirements and schema, but concurrency and DST risk require implementation tests. [ASSUMED]
- Security: MEDIUM - public validation and boundary needs are clear, but final legal/privacy alignment is deferred to Phase 5. [VERIFIED: ROADMAP.md]

**Research date:** 2026-04-13 [VERIFIED: system date]
**Valid until:** 2026-04-20 for package currency and App Router docs; 2026-05-13 for repo architecture assumptions. [ASSUMED]
