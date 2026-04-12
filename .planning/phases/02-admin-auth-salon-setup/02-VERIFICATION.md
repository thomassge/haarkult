---
phase: 02-admin-auth-salon-setup
verified: 2026-04-12T19:46:08Z
status: passed
score: 17/17 must-haves verified
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 15/17
  gaps_closed:
    - "Salon staff can manage stylists, service assignments, weekly hours, and one-off availability exceptions: Leistungen dashboard card no longer points to missing /admin/leistungen."
    - "All-day and timed exceptions have clear persisted window semantics for Phase 3 availability: malformed timed strings and impossible Berlin datetime-local values are rejected before persistence."
  gaps_remaining: []
  regressions: []
---

# Phase 2: Admin Auth & Salon Setup Verification Report

**Phase Goal:** Give salon staff protected access to the operational data required for booking
**Verified:** 2026-04-12T19:46:08Z
**Status:** passed
**Re-verification:** Yes - after gap closure plan 02-04

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Salon staff can sign in to a protected admin area | VERIFIED | `auth.ts` uses Auth.js Credentials with JWT sessions, `/admin/login`, login throttling, and minimal session claims; `proxy.ts` protects `/admin`; admin pages call `requireAdmin()` before setup reads. |
| 2 | Salon staff can manage stylists, service assignments, weekly hours, and one-off availability exceptions | VERIFIED | Protected routes exist for `/admin/stylisten`, `/admin/zeiten`, and `/admin/ausnahmen`; Server Actions persist staff, service assignments, weekly ranges, and exceptions after `requireAdmin()`. The previous `/admin/leistungen` navigation gap is closed because `Leistungen` now links to `/admin/stylisten`. |
| 3 | Public booking logic can read salon-managed setup data from the server-owned booking model | VERIFIED | `lib/booking/setup-queries.ts` reads `staff`, `staff_services`, `weekly_availability`, and `availability_exceptions` from Drizzle-backed server-owned rows and exposes DTOs for later booking logic. |
| 4 | Inactive admin users and wrong passwords never create an admin session | VERIFIED | `authorizeAdminCredentials()` requires active users and valid password hashes; `tests/phase-2/admin-auth.test.ts` passed in the full regression suite. |
| 5 | Repeated failed admin login attempts are throttled before another password check runs | VERIFIED | `auth.ts` calls `checkLoginThrottle()` before credential validation and records/clears failures around login; full regression tests passed. |
| 6 | Operational booking staff does not depend on public marketing team content | VERIFIED | Setup validation/actions/queries use booking catalog and DB schema, not `content/team`; `staff-validation` and `content-boundaries` tests passed. |
| 7 | Each stylist can be assigned all bookable services or selected individual bookable services | VERIFIED | `serviceAssignmentInputSchema` supports `allServices` and selected `serviceIds`; `saveStylistAction()` transactionally replaces `staff_services`; service assignment tests passed. |
| 8 | Weekly ranges use ISO weekdays 1..7 with Monday as 1 and reject overlaps | VERIFIED | `WEEKDAYS_ISO`, `weeklyAvailabilityInputSchema`, and `validateNoWeeklyOverlaps()` implement this; weekly availability tests passed. |
| 9 | Authenticated staff can persist vacation, break, and blocked-time exceptions | VERIFIED | `/admin/ausnahmen` calls `requireAdmin()` and reads exception setup data; `saveAvailabilityExceptionAction()` validates, checks staff existence, and writes `availability_exceptions`. |
| 10 | All-day and timed exceptions have clear persisted window semantics for Phase 3 availability | VERIFIED | `parseExceptionDate()` now rejects invalid Date values with `Bitte einen gueltigen Zeitraum angeben.`; Berlin datetime-local conversion round-trips through `Europe/Berlin` and rejects impossible dates before persistence. |
| 11 | Setup completion becomes true only when every active stylist has services and weekly working hours | VERIFIED | `deriveSetupCompletion()` requires active staff, service assignments, and weekly ranges while keeping exceptions optional; setup completion tests passed. |

**Score:** 17/17 must-haves verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `auth.ts` | Auth.js Credentials provider backed by admin users | VERIFIED | Substantive and wired through `app/api/auth/[...nextauth]/route.ts` and `proxy.ts`; minimal JWT/session claims only. |
| `proxy.ts` | Coarse `/admin` route protection | VERIFIED | Exports `auth as proxy`; matcher protects `/admin` while excluding login. |
| `lib/auth/admin-session.ts` | Protected admin session helpers | VERIFIED | `getAdminSession()` accepts only active admin session claims; `requireAdmin()` redirects unauthenticated users. |
| `lib/auth/login-throttle.ts` | Failed-login throttling | VERIFIED | Covered by admin auth tests in the full regression suite. |
| `scripts/seed-admin-user.mjs` | One-owner seed path | VERIFIED | Previously verified; no regression in gap closure. |
| `app/admin/_components/admin-shell.tsx` | Admin dashboard cards with real setup targets | VERIFIED | `Stylisten` and `Leistungen` both route to `/admin/stylisten`; other cards route to `/admin/zeiten` and `/admin/ausnahmen`; no `/admin/leistungen` source reference remains under active `app` or `tests`. |
| `app/admin/page.tsx` | Protected setup dashboard and status mapping | VERIFIED | Calls `requireAdmin()` and `getAdminSetupOverview()`; `requiredSetupRoutes` contains only existing Phase 2 setup routes. |
| `app/admin/stylisten/page.tsx` | Protected stylist/service setup | VERIFIED | Calls `requireAdmin()` and `getStaffSetupData()`. |
| `app/admin/zeiten/page.tsx` | Protected weekly-hours setup | VERIFIED | Calls `requireAdmin()` and `getWeeklyAvailabilitySetupData()`. |
| `app/admin/ausnahmen/page.tsx` | Protected exception setup | VERIFIED | Calls `requireAdmin()` and `getAvailabilityExceptionSetupData()`. |
| `lib/booking/setup-validation.ts` | Staff/service/weekly/exception validation | VERIFIED | Contains service validation, weekly overlap validation, exception normalization, invalid Date checks, and Berlin datetime-local round-trip checks. |
| `lib/booking/setup-actions.ts` | Authorized setup persistence actions | VERIFIED | Stylist, deactivate, weekly, exception save, and exception delete mutations call `requireAdmin()` before persistence. |
| `lib/booking/setup-queries.ts` | Setup DTO reads and completion derivation | VERIFIED | Reads server-owned setup rows and derives setup completion. |
| `db/schema.ts` | Booking setup schema constraints | VERIFIED | Check constraints exist for weekday/minute windows and exception `endAt > startAt`. |
| `tests/phase-2/admin-dashboard-navigation.test.ts` | Regression coverage for real dashboard targets | VERIFIED | Passed; asserts `Leistungen` resolves to `/admin/stylisten` and every static dashboard card href has a route file. |
| `tests/phase-2/availability-exceptions.test.ts` | Regression coverage for malformed timed exception input | VERIFIED | Passed; asserts malformed strings and impossible Berlin datetime-local values throw the controlled German error while valid Berlin inputs normalize. |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| `app/admin/page.tsx` | `lib/auth/admin-session.ts` | `requireAdmin()` before dashboard render | VERIFIED | `const admin = await requireAdmin();` runs before setup query/render. |
| `app/admin/page.tsx` | `lib/booking/setup-queries.ts` | `getAdminSetupOverview()` | VERIFIED | Dashboard setup state comes from server-owned setup rows. |
| `app/admin/_components/admin-shell.tsx` | `app/admin/stylisten/page.tsx` | Leistungen card href | VERIFIED | `Leistungen` card uses `href: "/admin/stylisten"`; build route inventory includes `/admin/stylisten`. |
| `lib/booking/setup-validation.ts` | `lib/booking/setup-actions.ts` | `normalizeAvailabilityException()` before save | VERIFIED | `parseAvailabilityExceptionFormData()` calls `normalizeAvailabilityException()` before `saveAvailabilityExceptionAction()` persists. |
| `lib/booking/setup-actions.ts` | `lib/auth/admin-session.ts` | `requireAdmin()` at start of mutations | VERIFIED | All setup mutation actions are guarded. |
| `lib/booking/setup-validation.ts` | `lib/booking/catalog.ts` | service id validation against `bookableServices` | VERIFIED | Service assignments validate known bookable service IDs and persist service IDs only. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|---|---|---|---|---|
| `app/admin/page.tsx` | `overview` | `getAdminSetupOverview()` -> `getStaffSetupData()` -> Drizzle selects | Yes | VERIFIED |
| `app/admin/stylisten/page.tsx` | `setupData.staff`, `serviceOptions` | `getStaffSetupData()` reads `staff`, `staff_services`, `weekly_availability` | Yes | VERIFIED |
| `app/admin/zeiten/page.tsx` | `setupData.staff`, `weeklyRanges` | `getWeeklyAvailabilitySetupData()` derives active staff weekly rows | Yes | VERIFIED |
| `app/admin/ausnahmen/page.tsx` | `setupData.exceptions` | `getAvailabilityExceptionSetupData()` reads `availability_exceptions` | Yes | VERIFIED |
| `app/admin/_components/admin-shell.tsx` | `cards` | Page-provided card data and exported `adminDashboardCards` | Yes | VERIFIED; every static href resolves to an existing route. |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|---|---|---|---|
| Focused gap-closure contracts pass | `npm.cmd run test:unit -- tests/phase-2/admin-dashboard-navigation.test.ts tests/phase-2/availability-exceptions.test.ts tests/phase-2/service-assignment.test.ts tests/phase-2/weekly-availability.test.ts tests/phase-2/setup-completion.test.ts` | 5 files, 26 tests passed | PASS |
| Full Phase 2 regression contracts pass | `npm.cmd run test:unit -- tests/phase-2/admin-auth.test.ts tests/phase-2/staff-validation.test.ts tests/phase-2/service-assignment.test.ts tests/phase-2/setup-completion.test.ts tests/phase-2/weekly-availability.test.ts tests/phase-2/availability-exceptions.test.ts tests/phase-2/admin-dashboard-navigation.test.ts tests/phase-1/content-boundaries.test.ts` | Sandboxed run hit Windows `spawn EPERM`; rerun with escalation passed: 8 files, 44 tests | PASS |
| Static quality gate | `npm.cmd run lint` | passed | PASS |
| Production build and route inventory | `npm.cmd run build` | passed; route inventory includes `/admin`, `/admin/stylisten`, `/admin/zeiten`, `/admin/ausnahmen`, and no `/admin/leistungen` route is required | PASS |
| Missing route reference check | `rg '"/admin/leistungen"' app tests --glob '!*.md'` | no results | PASS |
| Scoped anti-pattern scan | `rg "TODO|FIXME|XXX|HACK|PLACEHOLDER|placeholder|coming soon|not yet implemented|return null|return \\[\\]|return \\{\\}|console\\.log" app/admin lib/booking/setup-validation.ts lib/booking/setup-queries.ts lib/booking/setup-actions.ts tests/phase-2/admin-dashboard-navigation.test.ts tests/phase-2/availability-exceptions.test.ts -n -i` | no results | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| ADMN-01 | 02-01 | Salon staff can sign in to a protected admin area | SATISFIED | Auth.js Credentials, seed path, proxy, `requireAdmin()`, and admin auth tests. |
| ADMN-06 | 02-02, 02-03, 02-04 | Salon staff can update core salon booking setup from admin | SATISFIED | Dashboard links only to existing setup routes; protected setup pages and guarded Server Actions manage staff, services, weekly hours, and exceptions. |
| STAF-01 | 02-02 | Salon staff can create and manage stylists who accept bookings | SATISFIED | `/admin/stylisten`, `saveStylistAction()`, `deactivateStylistAction()`, and DB `staff` rows. |
| STAF-02 | 02-02, 02-04 | Salon staff can assign services each stylist can perform | SATISFIED | Service assignment persists in `staff_services`; the `Leistungen` dashboard card routes to the existing `/admin/stylisten` service-assignment setup. |
| STAF-03 | 02-03 | Salon staff can set recurring weekly working hours | SATISFIED | `/admin/zeiten`, weekly validation, and transactional `weekly_availability` replacement. |
| STAF-04 | 02-03, 02-04 | Salon staff can set blocked times, breaks, vacations, exceptions | SATISFIED | `/admin/ausnahmen`, guarded exception actions, DB window constraint, malformed timed string rejection, and Berlin datetime-local validation. |

No orphaned Phase 2 requirements were found in `.planning/REQUIREMENTS.md`; all six listed Phase 2 IDs are claimed by plan frontmatter.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---:|---|---|---|
| None | - | - | - | Scoped scan found no TODO/FIXME/placeholders, empty return stubs, or console-only implementations in the verified Phase 2 files. |

### Human Verification Required

None for this automated goal-verification pass. DB-backed smoke remains useful before launch, but the phase goal and the two prior verification gaps were verified through source traces, unit contracts, lint, and production build.

### Gaps Summary

No gaps remain.

The previous dashboard navigation gap is resolved: no active source/test reference points to `/admin/leistungen`, `Leistungen` routes to `/admin/stylisten`, and the production build confirms the existing admin setup routes.

The previous exception validation gap is resolved: malformed timed `startAt`/`endAt` strings, invalid Date values, and impossible Berlin datetime-local inputs are rejected before `saveAvailabilityExceptionAction()` can persist them, while valid ISO and valid Berlin local datetime inputs still normalize.

---

_Verified: 2026-04-12T19:46:08Z_
_Verifier: Claude (gsd-verifier)_
