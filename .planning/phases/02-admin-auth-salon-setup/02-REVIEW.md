---
phase: 02-admin-auth-salon-setup
reviewed: 2026-04-12T19:14:52Z
depth: standard
files_reviewed: 31
files_reviewed_list:
  - .env.example
  - app/admin/_components/admin-shell.tsx
  - app/admin/page.tsx
  - app/admin/login/page.tsx
  - app/admin/stylisten/page.tsx
  - app/admin/stylisten/_components/stylist-setup-form.tsx
  - app/admin/zeiten/page.tsx
  - app/admin/zeiten/_components/weekly-hours-form.tsx
  - app/admin/ausnahmen/page.tsx
  - app/admin/ausnahmen/_components/availability-exception-form.tsx
  - app/api/auth/[...nextauth]/route.ts
  - auth.ts
  - proxy.ts
  - db/schema.ts
  - drizzle/0001_weekly_exception_constraints.sql
  - drizzle/meta/0001_snapshot.json
  - drizzle/meta/_journal.json
  - lib/auth/password.ts
  - lib/auth/admin-users.ts
  - lib/auth/login-throttle.ts
  - lib/auth/admin-session.ts
  - lib/booking/setup-validation.ts
  - lib/booking/setup-queries.ts
  - lib/booking/setup-actions.ts
  - scripts/seed-admin-user.mjs
  - tests/phase-2/admin-auth.test.ts
  - tests/phase-2/staff-validation.test.ts
  - tests/phase-2/service-assignment.test.ts
  - tests/phase-2/setup-completion.test.ts
  - tests/phase-2/weekly-availability.test.ts
  - tests/phase-2/availability-exceptions.test.ts
findings:
  critical: 0
  warning: 3
  info: 0
  total: 3
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-04-12T19:14:52Z
**Depth:** standard
**Files Reviewed:** 31
**Status:** issues_found

## Summary

Reviewed the listed admin auth, salon setup, validation, schema, seed, and phase test files at standard depth. The implementation is mostly coherent, but I found three issues: one broken admin navigation target, one stale-session authorization gap, and one validation hole that can let invalid exception dates reach persistence.

## Warnings

### WR-01: Dashboard links to a missing Leistungen route

**File:** `app/admin/_components/admin-shell.tsx:25`
**Issue:** The admin dashboard includes a card for `/admin/leistungen`, and `app/admin/page.tsx:31` intentionally keeps that card in the setup dashboard. No `app/admin/leistungen/page.tsx` route exists, so clicking the card leads admins to a 404. This is also confusing because service assignment already lives inside the stylist setup form.
**Fix:** Either add the missing `/admin/leistungen` route, or remove/repoint the card. If service assignment remains inside the stylist form, the smallest fix is:

```tsx
{
  title: "Leistungen",
  description: "Leistungen pro Stylistin oder Stylist zuordnen.",
  href: "/admin/stylisten",
}
```

Alternatively, remove the Leistungen card from `adminDashboardCards` and from the `app/admin/page.tsx` filter/status handling.

### WR-02: Revoked admin accounts can keep using existing JWT sessions

**File:** `lib/auth/admin-session.ts:10`
**Issue:** `requireAdmin()` trusts the `active` claim stored in the JWT session. `authorizeAdminCredentials()` rejects inactive admins at login, but if an admin user is deactivated after a session is issued, the stale token can still pass `user.active === true` until the session expires. That weakens the `admin_users.active` revocation control.
**Fix:** Re-check the database in `getAdminSession()` before accepting an admin session, and require the stored user to still exist, match the token id, and be active:

```ts
import { findAdminUserByEmail, toAdminSessionUser } from "@/lib/auth/admin-users";

export async function getAdminSession() {
  const session = await auth();
  const user = session?.user as Partial<AdminSessionUser> | undefined;

  if (!user?.id || !user.email || !user.role) {
    return null;
  }

  const admin = await findAdminUserByEmail(user.email);

  if (!admin || admin.id !== user.id || admin.active !== true) {
    return null;
  }

  return toAdminSessionUser(admin);
}
```

Add a unit/source-contract test that covers a previously active token becoming inactive in storage.

### WR-03: Invalid timed exception strings are accepted until database/runtime failure

**File:** `lib/booking/setup-validation.ts:210`
**Issue:** `dateTimeSchema` accepts any non-empty string, and `parseExceptionDate()` returns `new Date(input)` without checking `getTime()`. A malformed non-empty `startAt` or `endAt` such as `not-a-date` becomes an `Invalid Date`; the `endAt <= startAt` comparison does not catch it, so the server action can reach Drizzle/Neon with an invalid timestamp and fail as a persistence error instead of a controlled validation error.
**Fix:** Validate parsed dates before returning them:

```ts
function parseExceptionDate(input: string | Date | undefined) {
  if (!input) {
    throw new Error("Bitte den Zeitraum vollstaendig angeben.");
  }

  const parsedDate =
    input instanceof Date ? input : new Date(input);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Bitte einen gueltigen Zeitraum angeben.");
  }

  return parsedDate;
}
```

Keep the existing `datetime-local` conversion branch, but run the same `getTime()` check on the returned Berlin-local conversion. Add a test asserting that malformed timed exceptions throw a validation error before persistence.

---

_Reviewed: 2026-04-12T19:14:52Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
