---
phase: 02-admin-auth-salon-setup
plan: 01
subsystem: auth
tags: [next-auth, credentials, scrypt, admin, nextjs, drizzle, neon]

requires:
  - phase: 01-builder-boundaries-mode-hardening
    provides: Admin route boundary, booking mode boundaries, and Phase 1 boundary tests
provides:
  - Auth.js v5 Credentials login backed by admin_users
  - Protected /admin route, page, and session guard foundation
  - Scrypt password hashing and owner seed command
  - Phase 2 admin auth regression tests
affects: [phase-02-admin-setup, phase-03-public-booking-engine, phase-04-staff-operations]

tech-stack:
  added: [next-auth@5.0.0-beta.30, zod@4.3.6]
  patterns:
    - Auth.js root auth.ts with JWT session claims
    - Lazy DB access in auth helpers for unit-test injection
    - In-process login throttling for single-salon v1

key-files:
  created:
    - auth.ts
    - proxy.ts
    - app/api/auth/[...nextauth]/route.ts
    - app/admin/login/page.tsx
    - lib/auth/password.ts
    - lib/auth/admin-users.ts
    - lib/auth/login-throttle.ts
    - lib/auth/admin-session.ts
    - scripts/seed-admin-user.mjs
    - tests/phase-2/admin-auth.test.ts
  modified:
    - package.json
    - package-lock.json
    - .env.example
    - app/admin/page.tsx
    - app/admin/_components/admin-shell.tsx

key-decisions:
  - "Use Auth.js v5 Credentials with JWT sessions and minimal admin claims."
  - "Use Node scrypt instead of a native password hashing dependency for deployment simplicity."
  - "Keep admin account creation to an env-driven one-owner seed script."

patterns-established:
  - "Admin DTOs expose only id, email, role, and active."
  - "Protected admin pages call requireAdmin() in addition to proxy-level protection."
  - "Admin auth tests use repository injection to avoid requiring DATABASE_URL in unit tests."

requirements-completed: [ADMN-01]

duration: 16 min
completed: 2026-04-12
---

# Phase 02 Plan 01: Admin Auth Foundation Summary

**Auth.js Credentials login with scrypt admin passwords, protected admin dashboard, login throttling, and env-driven owner seeding**

## Performance

- **Duration:** 16 min
- **Started:** 2026-04-12T13:41:40Z
- **Completed:** 2026-04-12T13:57:26Z
- **Tasks:** 3
- **Files modified:** 15

## Accomplishments

- Added Auth.js v5 Credentials login backed by `admin_users`, with JWT sessions containing only `id`, `email`, `role`, and `active`.
- Added `requireAdmin()` and `proxy.ts` protection so `/admin` is guarded at both route and page-helper layers.
- Replaced the placeholder admin shell with a German operational dashboard linking to `Stylisten`, `Leistungen`, `Arbeitszeiten`, and `Abwesenheiten`.
- Added scrypt password hashing, active-admin credential validation, login throttling, and a one-owner seed command.

## Task Commits

1. **Task 1 RED: failing credential tests** - `593863c` (test)
2. **Task 1 GREEN: password helpers and credential validation** - `8a1799e` (feat)
3. **Task 2 RED: failing route protection tests** - `455e9e3` (test)
4. **Task 2 GREEN: protected admin auth wiring** - `a88c0c2` (feat)
5. **Task 3: owner seed command** - `4076184` (feat)

## Files Created/Modified

- `auth.ts` - Auth.js configuration, Credentials provider, JWT/session callbacks, and admin route authorization.
- `proxy.ts` - Next.js 16 proxy export for Auth.js admin protection.
- `app/api/auth/[...nextauth]/route.ts` - Auth.js route handler exports.
- `app/admin/login/page.tsx` - German email/password admin login form.
- `app/admin/page.tsx` - Protected admin dashboard page using `requireAdmin()`.
- `app/admin/_components/admin-shell.tsx` - German clickable setup dashboard frames.
- `lib/auth/password.ts` - Scrypt hash and verify helpers using `scrypt$N$r$p$saltBase64$hashBase64`.
- `lib/auth/admin-users.ts` - Normalized admin lookup, active-user credential validation, and minimal session DTO mapping.
- `lib/auth/login-throttle.ts` - In-process 5-failure/15-minute login throttling.
- `lib/auth/admin-session.ts` - `getAdminSession()` and `requireAdmin()` helpers.
- `scripts/seed-admin-user.mjs` - Env-driven owner upsert script for `admin_users`.
- `tests/phase-2/admin-auth.test.ts` - Phase 2 auth, throttling, route protection, and seed source tests.

## Decisions Made

- Used Auth.js v5 beta because the phase research selected it for the App Router and Next.js 16 `proxy.ts` pattern.
- Kept DB access lazy in `lib/auth/admin-users.ts` so unit tests can inject a repository and avoid requiring real `DATABASE_URL`.
- Duplicated the scrypt envelope logic in the plain Node seed script instead of adding a TypeScript runtime just for seeding.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed scrypt helper TypeScript build failure**
- **Found during:** Task 2 (Wire Auth.js, route protection, login, and protected admin dashboard shell)
- **Issue:** `promisify(scrypt)` did not preserve the TypeScript overload that accepts scrypt options, so `next build` failed.
- **Fix:** Replaced promisification with a small typed Promise wrapper around `crypto.scrypt`.
- **Files modified:** `lib/auth/password.ts`
- **Verification:** `npm.cmd run build`
- **Committed in:** `a88c0c2`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Build correctness improved without expanding scope.

## Issues Encountered

- Initial `npm.cmd install next-auth@5.0.0-beta.30 zod` was blocked by npm cache permissions in the sandbox. It succeeded after approved escalation.
- `npm.cmd audit --omit=dev` reports known advisories against the pinned `next@16.1.6` dependency, with npm reporting no fix available for this version line. This was not changed inside the auth plan because it requires a framework dependency decision outside 02-01.

## Known Stubs

None.

## Threat Flags

None beyond the planned auth, session, and seed trust boundaries in the plan threat model.

## User Setup Required

Manual DB smoke requires local secrets:

- `DATABASE_URL`
- `AUTH_SECRET`
- `ADMIN_SEED_EMAIL`
- `ADMIN_SEED_PASSWORD`

After those are configured, the documented smoke path is `npm.cmd run admin:seed`, start the app, visit `/admin`, confirm redirect to `/admin/login`, then sign in with the seeded owner.

## Verification

- `npm.cmd run test:unit -- tests/phase-2/admin-auth.test.ts tests/phase-1/content-boundaries.test.ts` - passed, 14 tests.
- `npm.cmd run lint` - passed.
- `npm.cmd run build` - passed.
- DB-backed smoke was not run because this execution environment does not include real `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_SEED_EMAIL`, and `ADMIN_SEED_PASSWORD` values.

## Next Phase Readiness

Plan 02-02 can build protected stylist and service setup flows on top of `requireAdmin()`. Any new admin Server Actions or Route Handlers should call `requireAdmin()` before reading or mutating operational booking setup data.

## Self-Check: PASSED

- Summary file exists.
- Task commits exist: `593863c`, `8a1799e`, `455e9e3`, `a88c0c2`, `4076184`.
- Key files exist: `auth.ts`, `proxy.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/admin/login/page.tsx`, `lib/auth/admin-session.ts`, `scripts/seed-admin-user.mjs`, `tests/phase-2/admin-auth.test.ts`.

---
*Phase: 02-admin-auth-salon-setup*
*Completed: 2026-04-12*
