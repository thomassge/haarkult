---
phase: 03-public-booking-engine
verified: 2026-04-13T19:15:55Z
status: human_needed
score: "14/14 must-haves verified"
overrides_applied: 0
human_verification:
  - test: "Public booking flow visual and copy UAT"
    expected: "On desktop and mobile, /termin-buchen feels usable, premium, German-only, and exposes no setup/admin wording in booking mode."
    why_human: "Visual quality, responsive layout, copy tone, and full browser feel cannot be proven from static code and unit tests."
  - test: "Stale-slot retry clarity UAT"
    expected: "When a selected slot becomes unavailable, the slot is cleared, contact data remains, same-date slots reload, and the German retry message is understandable."
    why_human: "Automated tests verify state preservation, but product clarity of the retry path needs human review."
---

# Phase 3: Public Booking Engine Verification Report

**Phase Goal:** Deliver a real public booking flow with accurate availability and conflict-safe submission
**Verified:** 2026-04-13T19:15:55Z
**Status:** human_needed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|---|---|---|
| 1 | Client can browse bookable service categories and services on `/termin-buchen` when booking mode is enabled. | VERIFIED | `app/termin-buchen/page.tsx` gates booking mode through `getStaffSetupData()` and renders `BookingFlow`; `service-step.tsx` renders category chips and service rows. |
| 2 | Client can select a catalog-derived service, not a hardcoded Haarkult-only list. | VERIFIED | `booking-flow-options.ts` imports `bookableServices` and `getBookableServiceById()`; `BookingFlow` keeps selected service state and clears downstream selections on service changes. |
| 3 | Stylist step is skipped when exactly one active eligible stylist can perform the selected service. | VERIFIED | `deriveStylistPreferenceOptions()` returns `showStylistStep: false` with `resolvedStaffId`; covered by `stylist-eligibility.test.ts`. |
| 4 | Stylist step offers `Keine Praeferenz` plus named choices when multiple active eligible stylists can perform the service. | VERIFIED | `deriveStylistPreferenceOptions()` prepends `Keine Praeferenz` and named active assigned staff; covered by tests. |
| 5 | Booking-enabled setup-incomplete state remains public-friendly and uses contact fallback actions without technical setup wording. | VERIFIED | `page.tsx` renders `BookingEntryShell` with `setupIncompleteFallbackCopy`; tests assert no setup/admin/technical wording. |
| 6 | Client can request available slots for a selected service, stylist preference, and date. | VERIFIED | `BookingFlow` fetches `/api/booking/slots` after date selection; `app/api/booking/slots/route.ts` validates query params and returns `{ slots }`. |
| 7 | Returned slots are server-calculated from duration, active staff eligibility, schedules, exceptions, bookings, lead time, horizon, and slot step rules. | VERIFIED | `public-queries.ts` loads staff/services/weekly availability/exceptions/bookings and delegates to `calculateAvailableSlots()`; `availability-engine.test.ts` covers these inputs. |
| 8 | `Keine Praeferenz` searches all eligible staff but each returned slot carries one concrete staff id. | VERIFIED | `availability.ts` resolves all eligible staff for `{ kind: "none" }`; tests assert concrete `staffId` and `slotId` values. |
| 9 | Unavailable or out-of-policy dates return no selectable slots instead of client-trusted availability. | VERIFIED | `availability.ts` rejects invalid dates, lead-time violations, horizon violations, inactive/unassigned staff, exceptions, and active booking overlaps. |
| 10 | Client can select a date, see server-calculated time chips, and select a concrete slot. | VERIFIED | `slot-step.tsx` renders date buttons, loading/empty/error states, and slot time chips from fetched server payload. |
| 11 | Client can submit a guest booking with required name, phone, email, and optional note. | VERIFIED | `contact-step.tsx` renders those fields; `publicBookingSubmissionSchema` validates required contact fields and optional note. |
| 12 | Manual confirmation creates pending requests; automatic confirmation creates confirmed bookings with distinct success copy. | VERIFIED | `createPublicBooking()` maps manual to `pending` and other configured modes to `confirmed`; tests cover both headings. |
| 13 | Submission serializes competing writes for the same concrete staff/date and re-checks selected slot before insert. | VERIFIED | `createPublicBooking()` acquires `pg_advisory_xact_lock`, calls `getPublicAvailableSlots()` with the transaction, then inserts booking/event rows only if the slot still matches. |
| 14 | Stale slot conflict preserves service, stylist preference, selected date, contact fields, and note while clearing only the invalid slot. | VERIFIED | `createPublicBooking()` returns typed `slot_conflict`; `BookingFlow` clears `selectedSlot`, preserves contact fields, restores date, and reloads slots. |

**Score:** 14/14 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `app/termin-buchen/_components/booking-flow.tsx` | Guided one-route booking shell | VERIFIED | 330 lines, imports service/stylist option helpers, slot endpoint fetch, and public submit action. |
| `app/termin-buchen/_components/service-step.tsx` | Category-first service selection | VERIFIED | Renders catalog-derived categories/services with duration and price labels. |
| `app/termin-buchen/_components/stylist-step.tsx` | Conditional stylist preference selection | VERIFIED | Renders only when caller passes multiple eligible choices. |
| `app/termin-buchen/_lib/booking-flow-options.ts` | Catalog and staff option DTO derivation | VERIFIED | Uses `bookableServices`, `getBookableServiceById()`, active staff, and service assignments. |
| `lib/booking/availability.ts` | Pure availability engine | VERIFIED | Calculates slots from rules, schedules, exceptions, bookings, and staff eligibility. |
| `lib/booking/public-queries.ts` | Public slot data adapter | VERIFIED | Loads DB/injected-client rows and passes real input to the engine. |
| `lib/booking/public-validation.ts` | Public query and submit schemas | VERIFIED | Zod schemas for slot lookup and booking submission. |
| `app/api/booking/slots/route.ts` | Public JSON endpoint | VERIFIED | Validates params, calls `getPublicAvailableSlots()`, returns public-safe 400s. |
| `app/termin-buchen/_components/slot-step.tsx` | Date-first and time-chip slot UI | VERIFIED | Renders date buttons, server-returned slots, retry, loading, empty, and conflict states. |
| `app/termin-buchen/_components/contact-step.tsx` | Guest contact form | VERIFIED | Renders required name/phone/email, optional note, validation slots, and no-account trust copy. |
| `app/termin-buchen/_components/booking-result.tsx` | Success/result states | VERIFIED | Renders manual/confirmed status copy and appointment summary. |
| `tests/phase-3/*.test.*` | Focused Phase 3 coverage | VERIFIED | Current run: 4 files, 30 tests passed. |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| `app/termin-buchen/page.tsx` | `lib/booking/setup-queries.ts` | `getStaffSetupData()` setup gate | WIRED | Import at line 4; awaited at line 27 before rendering booking flow. |
| `booking-flow-options.ts` | `lib/booking/catalog.ts` | `bookableServices`, `getBookableServiceById()` | WIRED | Imports at lines 2-3; used in service and stylist derivation. |
| `app/api/booking/slots/route.ts` | `lib/booking/public-queries.ts` | `getPublicAvailableSlots()` | WIRED | Route calls slot query adapter and returns JSON. |
| `lib/booking/public-queries.ts` | `lib/booking/availability.ts` | `calculateAvailableSlots()` | WIRED | Adapter returns calculated availability input into pure engine. |
| `lib/booking/public-actions.ts` | `lib/booking/public-queries.ts` | Submit-time `getPublicAvailableSlots()` re-check | WIRED | Default availability path reuses public query with transaction client. |
| `lib/booking/public-actions.ts` | `db/schema.ts` | `bookings` and `bookingEvents` inserts | WIRED | Successful transaction inserts booking row and creation event. |
| `booking-flow.tsx` | `/api/booking/slots` | Fetch after date selection | WIRED | Uses URLSearchParams from selected service/date/stylist. |
| `booking-flow.tsx` | `lib/booking/public-actions.ts` | `submitPublicBookingAction` | WIRED | FormData submission uses selected service/date/slot/contact state. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|---|---|---|---|---|
| `BookingPage` | `setupData.staff` | `getStaffSetupData()` database-backed setup query | Yes | FLOWING |
| `BookingFlow` service options | `serviceOptions` | `derivePublicBookingServiceOptions()` from `bookableServices` | Yes | FLOWING |
| `BookingFlow` stylist options | `stylistOptions` | `deriveStylistPreferenceOptions(selectedServiceId, staffRows)` | Yes | FLOWING |
| `SlotStep` slots | `slots` | `/api/booking/slots` fetch result | Yes | FLOWING |
| `/api/booking/slots` | `slots` | `getPublicAvailableSlots()` -> `calculateAvailableSlots()` | Yes | FLOWING |
| `createPublicBooking()` | booking/event rows | submit schema, transaction lock, availability re-check, DB inserts | Yes | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|---|---|---|---|
| Phase 3 focused tests pass | `npm.cmd run test:unit -- tests/phase-3/public-booking-flow.test.tsx tests/phase-3/availability-engine.test.ts tests/phase-3/stylist-eligibility.test.ts tests/phase-3/booking-submission.test.ts` | 4 files, 30 tests passed | PASS |
| Lint passes | `npm.cmd run lint` | ESLint completed with exit 0 | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| BOOK-01 | 03-01 | Client can browse bookable services with duration and price context before starting a booking | SATISFIED | Service step renders catalog services with duration and price; test covers metadata. |
| BOOK-02 | 03-01 | Client can start a booking from the public website when booking mode is enabled | SATISFIED | `/termin-buchen` renders `BookingFlow` when booking mode and setup are complete. |
| BOOK-03 | 03-01 | Client can select a service to book | SATISFIED | `selectedServiceId` state updates via service buttons and drives downstream slot/submission state. |
| BOOK-04 | 03-01 | Client is not asked to choose a stylist when only one eligible stylist exists | SATISFIED | `showStylistStep` false for one active eligible stylist; tests cover it. |
| BOOK-05 | 03-01 | Client can choose a preferred stylist when more than one eligible stylist exists | SATISFIED | Multiple eligible staff render `Keine Praeferenz` and named choices; tests cover it. |
| BOOK-06 | 03-02 | Client can see available appointment slots for selected service, stylist choice, and date | SATISFIED | Slot endpoint and UI are wired; tests cover slot fetch and JSON shape. |
| BOOK-07 | 03-03 | Client can submit a booking using name, phone, email, and optional note | SATISFIED | Contact UI and submit schema/action validate and persist required/optional fields. |
| BOOK-08 | 03-03 | Client gets a clear retry path when the selected slot is no longer available during submission | SATISFIED | Typed `slot_conflict` preserves input, clears slot, reloads same-date slots; tests cover behavior. |
| STAF-05 | 03-02 | Booking system calculates availability from service duration, schedules, exceptions, bookings, lead time, horizon, and slot step rules | SATISFIED | `availability.ts` implements these rules; `availability-engine.test.ts` covers each. |

No Phase 3 requirements are orphaned: the plan frontmatter claims BOOK-01 through BOOK-08 and STAF-05, matching `.planning/REQUIREMENTS.md` traceability.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---:|---|---|---|
| `app/termin-buchen/_components/booking-flow.tsx` | 60 | Initial category can differ from first eligible service category | Warning | Review warning WR-01. Does not block the phase goal because users can still browse/select services, but initial state can be confusing when the first catalog category has no eligible service. |
| `app/termin-buchen/_components/booking-flow.tsx` | 192 | Unexpected submit rejection lacks `finally` pending reset | Warning | Review warning WR-02. Does not block verified conflict-safe booking behavior, but transient runtime failures can leave the button pending. |

No blocker stub patterns were found in phase implementation files. The `return []` and `return null` matches are valid empty-result/conditional-render branches, not placeholder implementations.

### Human Verification Required

### 1. Public Booking Flow Visual And Copy UAT

**Test:** Run the app, open `/termin-buchen` on desktop and mobile, and complete service, stylist, slot, and contact steps.
**Expected:** The route feels usable and premium, all user-facing copy is German, and no setup/admin/internal wording leaks.
**Why human:** Responsive visual quality, copy tone, and full browser interaction feel cannot be fully verified by code inspection or unit tests.

### 2. Stale-Slot Retry Clarity UAT

**Test:** Simulate or trigger a stale selected slot during submission.
**Expected:** The invalid slot clears, contact data remains, same-date slots reload, and the German retry message is understandable.
**Why human:** Tests verify state mechanics, but product clarity of the recovery path requires human review.

### Gaps Summary

No automated goal-achievement gaps found. Phase 3 satisfies the roadmap success criteria and all listed requirement IDs at the code and unit-test level. Status is `human_needed` only because the verifier rules require human review for visual flow quality and user-facing retry clarity.

---

_Verified: 2026-04-13T19:15:55Z_
_Verifier: Claude (gsd-verifier)_
