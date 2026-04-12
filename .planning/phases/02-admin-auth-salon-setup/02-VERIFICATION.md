---
phase: 02-admin-auth-salon-setup
verified: 2026-04-12T19:20:07Z
status: gaps_found
score: 15/17 must-haves verified
overrides_applied: 0
gaps:
  - truth: "Salon staff can manage stylists, service assignments, weekly hours, and one-off availability exceptions"
    status: partial
    reason: "Service assignments are editable inside /admin/stylisten, but the dashboard's Leistungen card links to /admin/leistungen, which has no route and 404s."
    artifacts:
      - path: "app/admin/_components/admin-shell.tsx"
        issue: "adminDashboardCards contains href /admin/leistungen"
      - path: "app/admin/page.tsx"
        issue: "dashboard deliberately keeps the missing /admin/leistungen card"
    missing:
      - "Either add app/admin/leistungen/page.tsx or repoint/remove the Leistungen card so every admin setup navigation target exists."
  - truth: "All-day and timed exceptions have clear persisted window semantics for Phase 3 availability"
    status: partial
    reason: "Malformed timed exception strings can become Invalid Date and reach persistence instead of failing as controlled validation."
    artifacts:
      - path: "lib/booking/setup-validation.ts"
        issue: "parseExceptionDate returns new Date(input) without checking Number.isNaN(parsedDate.getTime())"
    missing:
      - "Reject invalid parsed dates in parseExceptionDate, including Berlin datetime-local conversions."
      - "Add a test proving malformed timed exception input fails validation before persistence."
deferred: []
---

# Phase 2: Admin Auth & Salon Setup Verification Report

**Phase Goal:** Give salon staff protected access to the operational data required for booking
**Verified:** 2026-04-12T19:20:07Z
**Status:** gaps_found
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Salon staff can sign in to a protected admin area | VERIFIED | `auth.ts` uses Auth.js Credentials, JWT sessions, `/admin/login`, login throttling, and minimal session claims. `app/admin/page.tsx`, `/stylisten`, `/zeiten`, and `/ausnahmen` call `requireAdmin()` before reading setup data. |
| 2 | Salon staff can manage stylists, service assignments, weekly hours, and one-off availability exceptions | FAILED | Core forms/actions exist and persist real rows, but the admin dashboard links `Leistungen` to `/admin/leistungen`; the build route list has no such page, so one setup navigation card 404s. |
| 3 | Public booking logic can read salon-managed setup data from the server-owned booking model | VERIFIED | `lib/booking/setup-queries.ts` reads `staff`, `staff_services`, `weekly_availability`, and `availability_exceptions`; DTOs derive service labels from the catalog while persistence stores server-owned operational rows. |
| 4 | Inactive admin users and wrong passwords never create an admin session | VERIFIED | `authorizeAdminCredentials()` requires `active === true`, verifies `passwordHash`, and returns only `id`, `email`, `role`, `active`; tests cover inactive and wrong-password rejection. |
| 5 | Repeated failed admin login attempts are throttled before another password check runs | VERIFIED | `auth.ts` calls `checkLoginThrottle()` before `authorizeAdminCredentials()` and records/clears failures; tests cover the sixth failed attempt within 15 minutes. |
| 6 | Operational booking staff does not depend on public marketing team content | VERIFIED | Setup validation/actions/queries import DB schema and booking catalog, not `content/team`; tests assert no `content/team` import in setup queries. |
| 7 | Each stylist can be assigned all bookable services or selected individual bookable services | VERIFIED | `serviceAssignmentInputSchema` supports `allServices` and selected `serviceIds`; `saveStylistAction()` transactionally replaces `staff_services`. |
| 8 | Weekly ranges use ISO weekdays 1..7 with Monday as 1 and reject overlaps | VERIFIED | `WEEKDAYS_ISO`, `weekdayLabelByIsoDay`, `weeklyAvailabilityInputSchema`, and `validateNoWeeklyOverlaps()` implement the convention; tests cover 0/8 rejection and adjacent/overlap behavior. |
| 9 | Authenticated staff can persist vacation, break, and blocked-time exceptions | VERIFIED | `/admin/ausnahmen` calls `requireAdmin()` and `getAvailabilityExceptionSetupData()`; `saveAvailabilityExceptionAction()` requires admin, validates type, verifies staff, and writes `availability_exceptions`. |
| 10 | All-day and timed exceptions have clear persisted window semantics | FAILED | All-day Europe/Berlin normalization exists, but malformed timed strings are accepted by `dateTimeSchema` and `parseExceptionDate()` returns `Invalid Date` without a validity check. |
| 11 | Setup completion becomes true only when every active stylist has services and weekly working hours | VERIFIED | `deriveSetupCompletion()` uses active staff, assigned service IDs, and weekly ranges; tests prove exceptions are optional and weekly hours are required. |

**Score:** 15/17 must-haves verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `auth.ts` | Auth.js Credentials provider backed by admin users | VERIFIED | Substantive and wired through `app/api/auth/[...nextauth]/route.ts` and `proxy.ts`. |
| `proxy.ts` | Coarse `/admin` route protection | VERIFIED | Exports `auth as proxy`; matcher protects `/admin` except login. |
| `lib/auth/admin-session.ts` | Protected admin session helpers | VERIFIED with advisory | `requireAdmin()` gates pages; WR-02 notes stale JWT revocation debt. |
| `lib/auth/login-throttle.ts` | Failed-login throttling | VERIFIED | 5 attempts / 15 minutes with expiry pruning. |
| `scripts/seed-admin-user.mjs` | One-owner seed path | VERIFIED | Seeds `owner`, `active=true`, and avoids printing password/hash. |
| `app/admin/stylisten/page.tsx` | Protected stylist/service setup | VERIFIED | Calls `requireAdmin()` and reads `getStaffSetupData()`. |
| `app/admin/zeiten/page.tsx` | Protected weekly-hours setup | VERIFIED | Calls `requireAdmin()` and reads `getWeeklyAvailabilitySetupData()`. |
| `app/admin/ausnahmen/page.tsx` | Protected exception setup | VERIFIED | Calls `requireAdmin()` and reads `getAvailabilityExceptionSetupData()`. |
| `lib/booking/setup-validation.ts` | Staff/service/weekly/exception validation | PARTIAL | Core schemas exist; malformed timed exception date validation is missing. |
| `lib/booking/setup-actions.ts` | Authorized setup persistence actions | VERIFIED | Stylist, weekly, and exception mutations call `requireAdmin()` and write through Drizzle. |
| `lib/booking/setup-queries.ts` | Setup DTO reads and completion derivation | VERIFIED | Reads server-owned setup rows and derives setup completion. |
| `db/schema.ts` | Booking setup schema constraints | VERIFIED | Check constraints exist for weekday, minute windows, and exception end/start ordering. |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| `app/admin/page.tsx` | `lib/auth/admin-session.ts` | `requireAdmin()` before dashboard render | VERIFIED | Manual trace confirms `const admin = await requireAdmin();` before setup queries/render. |
| `auth.ts` | `db/schema.ts` | admin user lookup through `lib/auth/admin-users.ts` | VERIFIED | `authorizeAdminCredentials()` uses `findAdminUserByEmail()`, which queries `adminUsers`. |
| `lib/booking/setup-validation.ts` | `lib/booking/catalog.ts` | service id validation against `bookableServices` | VERIFIED | Service IDs are validated against `bookableServices`. |
| `lib/booking/setup-actions.ts` | `lib/auth/admin-session.ts` | `requireAdmin()` at start of mutations | VERIFIED | Stylist, deactivate, weekly, exception save, and exception delete actions all start with `await requireAdmin()`. |
| `lib/booking/setup-validation.ts` | `content/booking.ts` | `slotStepMinutes` alignment | VERIFIED | Weekly minutes are checked against `booking.slotStepMinutes`. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|---|---|---|---|---|
| `app/admin/page.tsx` | `overview` | `getAdminSetupOverview()` -> `getStaffSetupData()` -> Drizzle selects | Yes | VERIFIED |
| `app/admin/stylisten/page.tsx` | `setupData.staff`, `serviceOptions` | `getStaffSetupData()` reads `staff`, `staff_services`, `weekly_availability` | Yes | VERIFIED |
| `app/admin/zeiten/page.tsx` | `setupData.staff`, `weeklyRanges` | `getWeeklyAvailabilitySetupData()` from setup rows | Yes | VERIFIED |
| `app/admin/ausnahmen/page.tsx` | `setupData.exceptions` | `getAvailabilityExceptionSetupData()` reads `availability_exceptions` | Yes | VERIFIED |
| `app/admin/_components/admin-shell.tsx` | `cards` | Page-provided dashboard card data | Partial | One card points to missing `/admin/leistungen`. |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|---|---|---|---|
| Phase 2 unit contracts pass | `npm.cmd run test:unit -- tests/phase-2/admin-auth.test.ts tests/phase-2/staff-validation.test.ts tests/phase-2/service-assignment.test.ts tests/phase-2/setup-completion.test.ts tests/phase-2/weekly-availability.test.ts tests/phase-2/availability-exceptions.test.ts tests/phase-1/content-boundaries.test.ts` | 7 files, 39 tests passed after sandbox EPERM rerun outside sandbox | PASS |
| Static quality gate | `npm.cmd run lint` | passed | PASS |
| Production build and route inventory | `npm.cmd run build` | passed; routes include `/admin`, `/admin/stylisten`, `/admin/zeiten`, `/admin/ausnahmen`, but not `/admin/leistungen` | PASS with gap evidence |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| ADMN-01 | 02-01 | Salon staff can sign in to a protected admin area | SATISFIED | Auth.js Credentials, seed path, proxy, `requireAdmin()`, tests. |
| ADMN-06 | 02-02, 02-03 | Salon staff can update core salon booking setup from admin | PARTIAL | Core update flows exist; dashboard includes a broken setup navigation target. |
| STAF-01 | 02-02 | Salon staff can create and manage stylists who accept bookings | SATISFIED | `/admin/stylisten`, `saveStylistAction()`, `deactivateStylistAction()`, DB `staff` rows. |
| STAF-02 | 02-02 | Salon staff can assign services each stylist can perform | PARTIAL | Persistence and form exist under `/admin/stylisten`; `/admin/leistungen` card is missing its route. |
| STAF-03 | 02-03 | Salon staff can set recurring weekly working hours | SATISFIED | `/admin/zeiten`, weekly validation, transactionally replaced `weekly_availability`. |
| STAF-04 | 02-03 | Salon staff can set blocked times, breaks, vacations, exceptions | PARTIAL | CRUD path exists; invalid timed date validation gap remains before persistence. |

No orphaned Phase 2 requirements were found in `.planning/REQUIREMENTS.md`; all six listed Phase 2 IDs are claimed by plan frontmatter.

### Code Review Warning Assessment

| Warning | Classification | Verification Impact |
|---|---|---|
| WR-01 Dashboard links to missing `/admin/leistungen` | Verification gap | Blocks clean goal achievement for admin setup navigation and service-assignment management. |
| WR-02 Revoked admin accounts can keep using existing JWT sessions | Advisory debt | Real security hardening issue, but admin-user revocation UI is out of scope and the stated must-have covers login/session creation for inactive users, which is satisfied. |
| WR-03 Invalid timed exception strings accepted until persistence/runtime failure | Verification gap | Violates controlled validation expectations for exception window semantics. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|---|---:|---|---|---|
| `app/admin/_components/admin-shell.tsx` | 25 | Missing route target `/admin/leistungen` | Blocker | Admin card 404s. |
| `lib/booking/setup-validation.ts` | 210 | `new Date(input)` without validity check | Warning -> Gap | Invalid exception dates can reach persistence. |
| `lib/auth/admin-session.ts` | 10 | JWT `active` claim trusted without DB re-check | Advisory | Revoked admins may remain active until JWT expiry; not blocking current phase contract. |

### Human Verification Required

Not gating while status is `gaps_found`, but DB-backed smoke remains needed after gaps close:

1. Seed an owner with real env vars, visit `/admin`, confirm redirect to `/admin/login`, sign in, and confirm the dashboard renders.
2. Create/edit a stylist, assign services, add weekly ranges, add exceptions, reload each page, and confirm persisted rows render.
3. Confirm the setup dashboard has no 404 navigation targets and setup completion changes only after active stylists have services and weekly hours.

### Gaps Summary

Phase 2 is mostly implemented and wired to real server-owned setup rows. The phase is not verified complete because one dashboard card routes to a nonexistent service page, and timed exception validation can pass malformed date strings through to persistence/runtime failure instead of rejecting them at validation.

There were no deferred items: Phase 3 consumes this setup data, but it does not explicitly cover fixing broken Phase 2 admin navigation or Phase 2 exception input validation.

---

_Verified: 2026-04-12T19:20:07Z_
_Verifier: Claude (gsd-verifier)_
