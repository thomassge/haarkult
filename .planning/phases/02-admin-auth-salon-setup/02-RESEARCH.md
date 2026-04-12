# Phase 02: Admin Auth & Salon Setup - Research

**Researched:** 2026-04-12
**Domain:** Next.js App Router admin auth, Drizzle/Postgres setup data, server-side validation
**Confidence:** HIGH for repo/schema/test findings; MEDIUM for Auth.js v5 beta because official App Router docs use v5 while npm stable is v4. [VERIFIED: npm registry] [CITED: https://authjs.dev/reference/nextjs]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Implement real email/password admin login backed by `admin_users`.
- D-02: For Haarkult-Maintal, Phase 2 only needs one seeded owner/admin account.
- D-03: Keep the auth system role-ready by using the existing `role` and `active` fields, but do not build admin-user management UI in Phase 2.
- D-04: A logged-in owner/admin can manage all salon setup data. Separate employee/stylist booking records from admin login accounts.
- D-05: The setup checklist is an onboarding state, not the permanent admin UI.
- D-06: First-time setup should be easy enough for self-service salon onboarding, but also suitable for a paid "we set it up for you" onboarding service.
- D-07: After required setup is complete, `/admin` should become a practical dashboard focused on operations and common setup changes, not a checklist shown every time.
- D-08: The admin dashboard should be made of clickable frames/cards for major areas. Editing happens after clicking into a focused setup area.
- D-09: Setup is complete when at least one active stylist exists, every active stylist has at least one assigned service, and every active stylist has weekly working hours.
- D-10: Availability exceptions such as vacation, breaks, and blocked times are optional for setup completion.
- D-11: Booking stylists/staff are managed in the database through the admin area.
- D-12: Public marketing team content stays separate from operational booking staff. A future link between the two is allowed, but booking operations must not depend on `content/team.ts`.
- D-13: Services remain sourced from `content/services.ts`; database assignments should reference service IDs instead of duplicating service titles, prices, or durations.
- D-14: Creating or editing a stylist must support an "all services" checkbox.
- D-15: The admin can also select individual services per stylist for salons where not every stylist performs every service.
- D-16: For Haarkult-Maintal, the expected default is that every stylist can perform all bookable services.
- D-17: Support multiple weekly working-time ranges per stylist per weekday.
- D-18: Support one-off availability exceptions for vacation, break, and blocked time.
- D-19: Exceptions should support all-day or timed windows plus optional label/notes.
- D-20: Exceptions override the normal weekly schedule and must be persisted in the server-owned booking model for Phase 3 availability calculations.
- D-21: The admin UI should be calm, premium, and operational. It should not be a marketing page and should not be a dense enterprise admin panel.
- D-22: Reuse the existing UI primitives where sensible, but prioritize clarity, speed, and low-error forms over visual decoration.
- D-23: Use German user-facing copy throughout the admin UI.
- D-24: Use clickable dashboard frames/cards for the major areas, with focused configuration screens after selection.

### Claude's Discretion
- Exact route names under `/admin`, as long as the dashboard-frame model and protected setup areas are preserved.
- Exact form composition and validation helpers, as long as validation is server-side and the saved data is reliable for Phase 3.
- Exact visual spacing and component breakdown, as long as the calm operational dashboard tone is preserved.
- Exact setup-completion implementation, as long as the required setup criteria in D-09 are enforced.
- Whether the "all services" checkbox disables the individual list or visually selects all individual services, as long as the behavior is clear.

### Deferred Ideas (OUT OF SCOPE)
- Admin-user management UI for creating additional login accounts belongs in a later phase unless required by implementation.
- Booking acceptance, decline, reschedule, booking list, and booking dashboard operations belong to Phase 4.
- Public booking flow, slot display, and booking submission belong to Phase 3.
- Rich calendar UI, drag/drop scheduling, recurring exception rules, and advanced calendar polish are out of scope for Phase 2.
</user_constraints>

## Summary

Phase 2 should keep the current Next.js App Router, Drizzle, Neon, and Vitest architecture instead of adding a separate backend or CMS. [VERIFIED: package.json, db/schema.ts, .planning/PROJECT.md] Admin UI should stay under `app/admin/*`, auth helpers under `lib/auth/*`, and setup domain logic under `lib/booking/*`, preserving the boundary that brochure blocks do not import booking or database internals. [VERIFIED: .planning/codebase/ARCHITECTURE.md, tests/phase-1/content-boundaries.test.ts]

**Primary recommendation:** Use Auth.js v5 beta Credentials Provider for email/password login, validate credentials against `admin_users`, store only minimal id/email/role/active claims in the session, protect `/admin` with `proxy.ts` plus page-level `auth()` checks, and repeat authorization inside every Server Action or Route Handler. [CITED: https://authjs.dev/getting-started/authentication/credentials] [CITED: https://authjs.dev/getting-started/session-management/protecting] [CITED: https://nextjs.org/docs/app/guides/authentication]

The existing schema fits most Phase 2 work, but the planner must add validation and likely DB check constraints for weekdays, minute ranges, and exception windows before Phase 3 availability relies on this data. [VERIFIED: db/schema.ts] [CITED: https://orm.drizzle.team/docs/indexes-constraints]

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ADMN-01 | Salon staff can sign in to a protected admin area | Auth.js Credentials Provider, `admin_users`, session claims, `/admin` route protection, login throttling, and secure cookies. [VERIFIED: .planning/REQUIREMENTS.md] [CITED: https://authjs.dev/getting-started/session-management/protecting] |
| ADMN-06 | Salon staff can update core salon booking setup such as stylists and working hours from the admin area | Route-local admin forms should call authorized Server Actions with Zod validation and Drizzle writes. [VERIFIED: .planning/REQUIREMENTS.md] [CITED: https://nextjs.org/docs/app/guides/authentication] |
| STAF-01 | Salon staff can create and manage stylists who accept bookings | Existing `staff` table supports `name`, `slug`, `active`, timestamps, and unique slug. [VERIFIED: db/schema.ts] |
| STAF-02 | Salon staff can assign which services each stylist can perform | Existing `staff_services` table supports many-to-many staff/service IDs; service IDs must be validated against `bookableServices`. [VERIFIED: db/schema.ts, lib/booking/catalog.ts] |
| STAF-03 | Salon staff can set recurring weekly working hours for each stylist | Existing `weekly_availability` supports multiple rows per stylist/weekday with minute ranges; add overlap and range validation. [VERIFIED: db/schema.ts] |
| STAF-04 | Salon staff can set one-off blocked times, breaks, vacations, or availability exceptions for each stylist | Existing `availability_exceptions` supports `vacation`, `break`, `blocked`, all-day, timed windows, label, and notes. [VERIFIED: db/schema.ts] |
</phase_requirements>

## Project Constraints (from AGENTS.md)

- Hair salons are the only current vertical; do not generalize Phase 2 into non-salon scheduling abstractions. [VERIFIED: AGENTS.md]
- Both `contact_only` and `booking` modes must remain valid; admin/booking code must not force online booking on every salon. [VERIFIED: AGENTS.md, content/booking.ts]
- Salon-specific content stays repo-driven; operational booking setup data belongs in the database. [VERIFIED: AGENTS.md, CODEX_CONTEXT.md]
- Booking/admin logic should be shared across salons and avoid per-salon branches. [VERIFIED: AGENTS.md]
- German-only user-facing copy is required. [VERIFIED: AGENTS.md]
- Customer accounts and online payments are out of scope for v1. [VERIFIED: AGENTS.md]
- Use `npm.cmd` in this PowerShell environment. [VERIFIED: CODEX_CONTEXT.md]

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | Installed 16.1.6; latest 16.2.3 modified 2026-04-11 | App Router, Server Components, Server Actions, Route Handlers, `proxy.ts` protection | Existing framework; Auth.js docs note Next.js 16 uses `proxy.ts`. [VERIFIED: package.json] [VERIFIED: npm registry] [CITED: https://authjs.dev/getting-started/session-management/protecting] |
| `next-auth` / Auth.js | Recommend `5.0.0-beta.30`, modified 2026-03-22 | Credentials Provider, session cookie/JWT handling, `auth()`, `signIn()`, `handlers` | Existing architecture chose Auth.js; official App Router examples use v5-style `auth.ts` exports. [VERIFIED: CODEX_CONTEXT.md] [VERIFIED: npm registry] [CITED: https://authjs.dev/reference/nextjs] |
| `drizzle-orm` | Installed/latest 0.45.2, modified 2026-04-10 | Typed DB access | Existing schema and Neon bootstrap already use Drizzle. [VERIFIED: package.json, db/index.ts] [VERIFIED: npm registry] |
| `@neondatabase/serverless` | Installed/latest 1.0.2, modified 2026-01-29 | Serverless Postgres client | Existing DB bootstrap uses Neon HTTP client. [VERIFIED: db/index.ts] [VERIFIED: npm registry] |
| `zod` | Latest 4.3.6, modified 2026-01-25 | Server-side form/action validation | Add as direct dependency because Phase 2 needs reliable setup data and `zod` only appears transitively. [VERIFIED: package-lock.json] [VERIFIED: npm registry] |
| `vitest` | Installed/latest 4.1.4, modified 2026-04-09 | Unit/component tests | Existing Phase 1 tests and `vitest.config.ts` establish the stack. [VERIFIED: package.json, vitest.config.ts] [VERIFIED: npm registry] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `drizzle-zod` | Latest 0.8.3, modified 2026-03-27 | Generate base Zod schemas from Drizzle tables | Optional; still add domain refinements for weekday, minutes, overlap, service IDs, and exception windows. [VERIFIED: npm registry] [CITED: https://orm.drizzle.team/docs/zod.html] |
| Node `crypto.scrypt` | Node 24.13.1 local | Password hashing without native npm package | Use with OWASP scrypt parameters if avoiding `argon2` native dependency. [VERIFIED: node --version] [CITED: https://nodejs.org/api/crypto.html] [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html] |
| `@testing-library/react` | Installed/latest 16.3.2, modified 2026-01-19 | Admin form/component rendering tests | Existing setup already includes React Testing Library cleanup. [VERIFIED: package.json, tests/setup.ts] [VERIFIED: npm registry] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Auth.js Credentials | Custom `jose` cookie session | Next.js docs show custom sessions are possible, but Auth.js was already chosen and reduces session plumbing. [VERIFIED: CODEX_CONTEXT.md] [CITED: https://nextjs.org/docs/app/guides/authentication] |
| Node `crypto.scrypt` | `argon2@0.44.0` | OWASP prefers Argon2id, but a native package adds deployment/build risk; scrypt is OWASP-approved when Argon2id is unavailable. [VERIFIED: npm registry] [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html] |
| Server Actions | Admin Route Handlers | Server Actions fit internal forms, but Route Handlers are valid for JSON endpoints; both must re-check authorization. [CITED: https://nextjs.org/docs/app/guides/authentication] |

**Installation:**
```bash
npm.cmd install next-auth@5.0.0-beta.30 zod
# Optional if the planner chooses generated base schemas:
npm.cmd install drizzle-zod
```

**Version verification:** Package versions above were checked with `npm.cmd view ... version time.modified` on 2026-04-12. [VERIFIED: npm registry]

## Architecture Patterns

### Recommended Project Structure

```text
auth.ts                         # Auth.js config, handlers, auth/signIn/signOut exports
proxy.ts                        # coarse /admin route protection for Next.js 16
app/api/auth/[...nextauth]/route.ts
app/admin/login/page.tsx        # public login route
app/admin/page.tsx              # protected dashboard
app/admin/stylisten/page.tsx    # staff + service assignment area
app/admin/zeiten/page.tsx       # weekly hours area
app/admin/ausnahmen/page.tsx    # vacation/break/blocked exceptions area
app/admin/_components/          # admin-only UI components
lib/auth/password.ts            # server-only hash/verify helpers
lib/auth/admin-session.ts       # requireAdmin/requireRole helpers
lib/booking/setup-actions.ts    # server actions for setup mutations
lib/booking/setup-validation.ts # Zod schemas + domain refinements
lib/booking/setup-queries.ts    # DTO-returning Drizzle queries
tests/phase-2/                  # focused auth/setup validation tests
```

This keeps admin code route-local and booking-domain logic outside public brochure blocks. [VERIFIED: .planning/codebase/STRUCTURE.md] It follows Next.js guidance to centralize authorization/data access close to the data source rather than relying only on layout UI checks. [CITED: https://nextjs.org/docs/app/guides/authentication]

### Pattern 1: Auth.js Credentials Against `admin_users`

Configure Auth.js Credentials Provider to parse email/password, fetch one active admin user by normalized email, verify `passwordHash`, and return a minimal user object with id, email, role, and active status. [CITED: https://authjs.dev/getting-started/authentication/credentials] [VERIFIED: db/schema.ts]

```typescript
// Source: Auth.js Credentials docs + existing admin_users schema.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(rawCredentials) {
        const credentials = loginSchema.parse(rawCredentials);
        const admin = await findActiveAdminByEmail(credentials.email);
        if (!admin) return null;
        if (!(await verifyPassword(credentials.password, admin.passwordHash))) return null;
        return { id: admin.id, email: admin.email, role: admin.role, active: admin.active };
      },
    }),
  ],
});
```

### Pattern 2: Defense-in-Depth Route Protection

Use `proxy.ts` for coarse `/admin` protection, page-level `auth()`/redirect checks for protected screens, and explicit `requireAdmin()` inside every Server Action or Route Handler. [CITED: https://authjs.dev/getting-started/session-management/protecting] [CITED: https://nextjs.org/docs/app/guides/authentication]

```typescript
// Source: Next.js auth guide, adapted to Phase 2 roles.
"use server";

export async function saveWeeklyAvailability(formData: FormData) {
  const admin = await requireAdmin();
  const input = weeklyAvailabilitySchema.parse(Object.fromEntries(formData));
  await replaceWeeklyAvailability(admin.id, input);
}
```

### Pattern 3: Server-Owned Setup DTOs

Return DTOs that omit `passwordHash`, raw DB internals, and unused columns, and validate service IDs against `bookableServices` from `lib/booking/catalog.ts`. [CITED: https://nextjs.org/docs/app/guides/authentication] [VERIFIED: lib/booking/catalog.ts]

### Anti-Patterns to Avoid

- Layout-only auth: layouts can be stale under partial rendering; enforce authorization near data access and mutations. [CITED: https://nextjs.org/docs/app/guides/authentication]
- Client-only form validation: client validation improves usability but does not protect Server Actions. [CITED: https://nextjs.org/docs/app/guides/authentication]
- Duplicating service titles/prices into `staff_services`: assignments should store service IDs only; bookings later store snapshots for history. [VERIFIED: db/schema.ts, lib/booking/catalog.ts, CONTEXT.md]
- Marketing team dependency: operational staff must not depend on `content/team.ts`. [VERIFIED: CONTEXT.md]
- Admin checklist forever: first-time setup progress is onboarding state; completed setup should show a practical dashboard. [VERIFIED: CONTEXT.md]

## Schema Fit And Gaps

| Area | Existing Fit | Gap Planner Must Address |
|------|--------------|--------------------------|
| Admin users | `admin_users` has id, email, password hash, role, active, timestamps, unique email. [VERIFIED: db/schema.ts] | Need seed script/action for one owner account; normalize email before lookup; do not build account management UI. [VERIFIED: CONTEXT.md] |
| Staff | `staff` has id, name, slug, active, timestamps, unique slug. [VERIFIED: db/schema.ts] | Need slug generation/collision handling and soft-deactivate behavior rather than destructive delete if future bookings exist. [VERIFIED: db/schema.ts] |
| Service assignments | `staff_services` has composite PK and serviceId index. [VERIFIED: db/schema.ts] | Need validate `serviceId` against `bookableServices`; transactionally replace assignments on edit. [VERIFIED: lib/booking/catalog.ts] |
| Weekly hours | `weekly_availability` supports many ranges per staff/day using minutes from midnight. [VERIFIED: db/schema.ts] | Need weekday convention, `startMinutes < endMinutes`, range bounds, slot-step alignment, and no overlaps per staff/day. [VERIFIED: db/schema.ts, content/booking.ts] |
| Exceptions | `availability_exceptions` supports type, label, allDay, startAt, endAt, notes. [VERIFIED: db/schema.ts] | Need all-day normalization in Europe/Berlin and `endAt > startAt`. [VERIFIED: db/schema.ts, CODEX_CONTEXT.md] |
| Setup completion | No table or materialized flag exists. [VERIFIED: db/schema.ts] | Compute from current rows: active staff count > 0, every active staff has services, every active staff has weekly availability. [VERIFIED: CONTEXT.md] |

## Server-Side Validation Strategy

Use Zod schemas as the canonical input layer for all admin forms and reuse the same refinements in tests. [VERIFIED: package-lock.json] [VERIFIED: npm registry] Validate in this order: raw form parse, scalar constraints, existence checks against DB/content, cross-row overlap checks, then transactional write. [VERIFIED: db/schema.ts] [CITED: https://orm.drizzle.team/docs/transactions]

Minimum validation rules:
- Login: lowercase-normalized email, password length policy, generic failure message. [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html]
- Password storage: OWASP recommends Argon2id first and scrypt when Argon2id is unavailable. [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html]
- Staff: required name, unique normalized slug, explicit active state. [VERIFIED: db/schema.ts]
- Services: non-empty assignment for setup completion; every ID must exist in `bookableServices`. [VERIFIED: lib/booking/catalog.ts]
- Weekly hours: documented weekday convention; start/end in `0..1440`; start before end; no overlaps; align to `booking.slotStepMinutes`. [VERIFIED: db/schema.ts, content/booking.ts]
- Exceptions: type in `vacation`, `break`, `blocked`; timed windows require start/end; all-day windows are normalized consistently for Europe/Berlin. [VERIFIED: db/schema.ts] [VERIFIED: CODEX_CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Session cookie/JWT plumbing | Custom unaudited auth/session framework | Auth.js `auth()`, `signIn()`, `handlers`, Credentials Provider | Official docs cover App Router sessions, route protection, API protection, and Next.js 16 proxy integration. [CITED: https://authjs.dev/getting-started/session-management/protecting] |
| Password hashing algorithm | Plain SHA, reversible encryption, or custom KDF | Node `crypto.scrypt` wrapper or `argon2` if deployment supports it | OWASP requires adaptive password hashing and recommends Argon2id/scrypt. [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html] |
| Input validation | Ad hoc string checks inside actions | Zod schemas plus domain refinements | Phase 3 availability will trust Phase 2 setup data. [VERIFIED: content/booking.ts, db/schema.ts] |
| Service catalog lookup | Duplicated DB copy of service titles/prices | `bookableServices` and `getBookableServiceById()` | Existing booking catalog derives bookable services from repo content. [VERIFIED: lib/booking/catalog.ts] |
| Auth-only UI hiding | Hiding buttons in client components | Server-side `requireAdmin()` in actions/routes | Next.js warns UI restrictions alone do not secure Server Actions. [CITED: https://nextjs.org/docs/app/guides/authentication] |

**Key insight:** The hard part is not rendering forms; it is preventing invalid operational setup from becoming Phase 3 availability input. [VERIFIED: .planning/ROADMAP.md, CODEX_CONTEXT.md]

## Common Pitfalls

### Pitfall 1: Auth Boundary Looks Protected But Mutations Are Public
**What goes wrong:** `/admin` redirects unauthenticated users, but a Server Action still accepts direct calls. [CITED: https://nextjs.org/docs/app/guides/authentication]  
**How to avoid:** Every action begins with `await requireAdmin()`. [CITED: https://nextjs.org/docs/app/guides/authentication]

### Pitfall 2: Service Assignments Drift From Content Catalog
**What goes wrong:** Staff assignments reference deleted or non-bookable service IDs. [VERIFIED: content/services.ts, db/schema.ts]  
**How to avoid:** Validate IDs against `bookableServices` on every write and show labels from content. [VERIFIED: lib/booking/catalog.ts]

### Pitfall 3: Weekly Time Ranges Overlap
**What goes wrong:** A stylist has overlapping windows, causing duplicate or invalid Phase 3 slots. [VERIFIED: db/schema.ts]  
**How to avoid:** Sort ranges per weekday and reject `next.startMinutes < previous.endMinutes`. [VERIFIED: db/schema.ts]

### Pitfall 4: Exception Semantics Are Ambiguous
**What goes wrong:** All-day vacations and timed breaks are stored inconsistently. [VERIFIED: db/schema.ts]  
**How to avoid:** Define all-day as local Europe/Berlin day bounds and timed exceptions as exact instants. [VERIFIED: CODEX_CONTEXT.md]

### Pitfall 5: Password Hashing Blocks Deployment
**What goes wrong:** Native hashing package builds locally but fails on the host. [ASSUMED]  
**How to avoid:** Prefer Node `crypto.scrypt` unless the target host is confirmed to support `argon2`; benchmark OWASP parameters. [CITED: https://nodejs.org/api/crypto.html] [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html]

## Code Examples

### Password Hash Format

```typescript
// Source: Node crypto docs + OWASP scrypt guidance.
// Store as: scrypt$N$r$p$saltBase64$hashBase64
const SCRYPT_PARAMS = { N: 2 ** 17, r: 8, p: 1, keylen: 64 };
```

Node exposes `crypto.scrypt` and `crypto.timingSafeEqual`; OWASP lists scrypt as the fallback when Argon2id is not available. [CITED: https://nodejs.org/api/crypto.html] [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html]

### Setup Completion Query Shape

```typescript
type SetupCompletion = {
  hasActiveStaff: boolean;
  staffMissingServices: string[];
  staffMissingWeeklyHours: string[];
  complete: boolean;
};
```

This should be computed from `staff`, `staff_services`, and `weekly_availability`, not stored as a manually editable flag. [VERIFIED: db/schema.ts, CONTEXT.md]

## State Of The Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Next.js `middleware.ts` for route protection | Next.js 16/Auth.js docs use `proxy.ts` and `export { auth as proxy }` | Current Auth.js docs | Planner should create `proxy.ts`, not `middleware.ts`, unless supporting older Next versions. [CITED: https://authjs.dev/getting-started/session-management/protecting] |
| Auth checks in shared layouts only | Verify session close to page/data/action/route handler | Current Next.js auth guide | Admin layout can render chrome, but pages/actions must still check auth. [CITED: https://nextjs.org/docs/app/guides/authentication] |
| Password composition rules | Length-first passphrase-friendly policy | OWASP/NIST-aligned guidance | Avoid arbitrary uppercase/symbol rules; require adequate length and allow password managers. [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html] |

**Deprecated/outdated:**
- `middleware.ts` as the default for this repo's Next.js 16 route protection should be treated as outdated for new work. [CITED: https://authjs.dev/getting-started/session-management/protecting]
- Plain hashes, encrypted passwords, and custom KDFs are not acceptable. [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Next/Auth/Drizzle/Vitest | Yes | 24.13.1 | None needed. [VERIFIED: node --version] |
| npm | Package install/scripts | Yes | 11.12.1 | Use `npm.cmd` in PowerShell. [VERIFIED: npm.cmd --version] |
| DATABASE_URL | Drizzle/Neon setup queries | No in current shell | - | Planner needs env setup or DB-mocked tests for local unit work. [VERIFIED: env probe] |
| AUTH_SECRET | Auth.js session signing | No in current shell | - | Planner must document setup before auth smoke tests. [VERIFIED: env probe, .env.example] |
| Vitest | Phase tests | Yes | 4.1.4 installed | None needed. [VERIFIED: package.json, package-lock.json] |
| Zod | Validation | Transitive only, not direct | 4.3.6 in lockfile | Add direct dependency before importing from app code. [VERIFIED: package-lock.json] |
| Auth.js | Admin auth | No | Recommend 5.0.0-beta.30 | Must install in Plan 02-01. [VERIFIED: package.json] [VERIFIED: npm registry] |

**Missing dependencies with no fallback:**
- `DATABASE_URL` and `AUTH_SECRET` are required for full auth/admin smoke testing against the real DB. [VERIFIED: env probe, lib/booking/env.ts]

**Missing dependencies with fallback:**
- Zod is already present transitively but should be added as a direct dependency before use. [VERIFIED: package-lock.json]
- Auth.js is not installed; Plan 02-01 must install it. [VERIFIED: package.json]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 with jsdom, React Testing Library, `@vitejs/plugin-react`, and `vite-tsconfig-paths`. [VERIFIED: vitest.config.ts, package-lock.json] |
| Config file | `vitest.config.ts`. [VERIFIED: rg --files] |
| Quick run command | `npm.cmd run test:unit -- tests/phase-2/admin-auth.test.ts tests/phase-2/setup-validation.test.ts` |
| Full suite command | `npm.cmd run test:unit` plus `npm.cmd run lint` and `npm.cmd run build` |

### Phase Requirements To Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| ADMN-01 | Inactive/wrong-password admin cannot sign in; active admin can create minimal session DTO | unit | `npm.cmd run test:unit -- tests/phase-2/admin-auth.test.ts` | No - Wave 0 |
| ADMN-06 | Setup dashboard completion derives from staff/services/hours rows | unit | `npm.cmd run test:unit -- tests/phase-2/setup-completion.test.ts` | No - Wave 0 |
| STAF-01 | Staff create/update validation enforces name, slug uniqueness shape, active state | unit | `npm.cmd run test:unit -- tests/phase-2/staff-validation.test.ts` | No - Wave 0 |
| STAF-02 | Service assignment validation accepts all bookable IDs and rejects unknown IDs | unit | `npm.cmd run test:unit -- tests/phase-2/service-assignment.test.ts` | No - Wave 0 |
| STAF-03 | Weekly hours validation rejects invalid weekdays, inverted ranges, and overlaps | unit | `npm.cmd run test:unit -- tests/phase-2/weekly-availability.test.ts` | No - Wave 0 |
| STAF-04 | Exception validation supports all-day and timed vacation/break/blocked windows | unit | `npm.cmd run test:unit -- tests/phase-2/availability-exceptions.test.ts` | No - Wave 0 |

### Sampling Rate

- Per task commit: run the relevant `tests/phase-2/*.test.ts` file plus `npm.cmd run lint`. [VERIFIED: package.json]
- Per wave merge: run `npm.cmd run test:unit` and `npm.cmd run build`. [VERIFIED: package.json]
- Phase gate: full unit suite, lint, build, and a DB-backed manual smoke if `DATABASE_URL`/`AUTH_SECRET` are configured. [VERIFIED: .env.example]

### Wave 0 Gaps

- [ ] `tests/phase-2/admin-auth.test.ts` - covers ADMN-01. [VERIFIED: tests directory]
- [ ] `tests/phase-2/setup-completion.test.ts` - covers ADMN-06. [VERIFIED: tests directory]
- [ ] `tests/phase-2/staff-validation.test.ts` - covers STAF-01. [VERIFIED: tests directory]
- [ ] `tests/phase-2/service-assignment.test.ts` - covers STAF-02. [VERIFIED: tests directory]
- [ ] `tests/phase-2/weekly-availability.test.ts` - covers STAF-03. [VERIFIED: tests directory]
- [ ] `tests/phase-2/availability-exceptions.test.ts` - covers STAF-04. [VERIFIED: tests directory]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | Yes | Auth.js Credentials Provider, active admin lookup, generic login errors, login throttling, OWASP password policy. [CITED: https://authjs.dev/getting-started/authentication/credentials] [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html] |
| V3 Session Management | Yes | Auth.js session cookies/JWT; minimal session payload; `AUTH_SECRET`; HttpOnly/Secure/SameSite expectations. [CITED: https://nextjs.org/docs/app/guides/authentication] |
| V4 Access Control | Yes | `proxy.ts`, page-level `auth()`, `requireAdmin()` in Server Actions and Route Handlers. [CITED: https://authjs.dev/getting-started/session-management/protecting] |
| V5 Input Validation | Yes | Zod schemas and server-side domain refinements before Drizzle writes. [VERIFIED: npm registry] |
| V6 Cryptography | Yes | Node `crypto.scrypt` or Argon2id; no custom crypto. [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html] |
| V7 Error Handling | Yes | Generic login errors and validation messages that do not leak auth state. [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html] |
| V8 Data Protection | Yes | Do not expose `passwordHash`; use DTOs; store minimal personal/admin data in sessions. [CITED: https://nextjs.org/docs/app/guides/authentication] |

### Known Threat Patterns For This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Credential stuffing/brute force | Spoofing | Login throttling/account lockout planning; generic errors; adaptive KDF. [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html] |
| Direct Server Action invocation | Elevation of privilege | `requireAdmin()` inside every action before mutation. [CITED: https://nextjs.org/docs/app/guides/authentication] |
| Session claim tampering | Spoofing | Auth.js signed/encrypted session handling and `AUTH_SECRET`. [CITED: https://nextjs.org/docs/app/guides/authentication] |
| Invalid schedule data poisoning Phase 3 | Tampering | Server-side Zod validation, transactional writes, overlap checks, setup completion tests. [VERIFIED: db/schema.ts] |
| Password hash disclosure to client | Information disclosure | DTOs and server-only DAL; never pass `admin_users.passwordHash` beyond auth verification. [CITED: https://nextjs.org/docs/app/guides/authentication] |

## Risks, Sequencing, And Dependency Ordering

1. Plan 02-01 must land first because Plans 02-02 and 02-03 create protected mutations. [VERIFIED: .planning/ROADMAP.md]
2. Plan 02-01 should install Auth.js/Zod, create auth config/routes/proxy, add password helpers, seed one owner/admin account path, and test active/inactive login logic. [VERIFIED: CONTEXT.md]
3. Plan 02-02 should build staff and service assignment flows after auth exists, because service assignment validation needs `bookableServices` and setup completion needs active staff/services. [VERIFIED: lib/booking/catalog.ts, CONTEXT.md]
4. Plan 02-03 should build weekly hours before optional exceptions because setup completion requires weekly hours but not exceptions. [VERIFIED: CONTEXT.md]
5. Phase 3 depends on Phase 2 data semantics, so 02-03 must document weekday convention, timezone handling, all-day exception normalization, and overlap rules. [VERIFIED: CODEX_CONTEXT.md]

## Admin UI Planning Considerations

- Use existing `Card`, `Container`, `Section`, `Heading`, and typography primitives, but the admin area should feel operational rather than like the brochure homepage. [VERIFIED: app/admin/_components/admin-shell.tsx, CONTEXT.md]
- Keep German labels concise: `Stylisten`, `Leistungen`, `Arbeitszeiten`, `Abwesenheiten`, `Setup abschliessen`, `Alle Leistungen`. [VERIFIED: AGENTS.md]
- Dashboard cards should link to focused areas; forms should be plain, low-error, and quick to scan. [VERIFIED: CONTEXT.md]
- The `all services` path should be the default-friendly option for Haarkult-Maintal, while individual selection remains available. [VERIFIED: CONTEXT.md]
- Avoid rich calendar UI and drag/drop in Phase 2; use structured range rows and exception forms. [VERIFIED: CONTEXT.md]

## Assumptions Log

| # | Claim | Section | Risk If Wrong |
|---|-------|---------|---------------|
| A1 | Native `argon2` may create deployment/build friction, so Node `crypto.scrypt` is the safer first implementation choice. | Common Pitfalls, Standard Stack | If the deployment host fully supports `argon2`, the planner may choose Argon2id instead. |
| A2 | ISO weekday `1..7` with Monday as `1` is the best convention for German salon hours. | Open Questions | If the implementation chooses `0..6`, Phase 3 must use the same convention everywhere. |

## Open Questions

1. **Password seeding path**
   - What we know: Phase 2 needs one seeded owner/admin account. [VERIFIED: CONTEXT.md]
   - What's unclear: Whether the seed should be a one-off script, Drizzle seed, or protected bootstrap command. [VERIFIED: repo search]
   - Recommendation: Plan 02-01 should include a local seed script that reads owner email/password from environment or prompt input outside committed code. [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html]

2. **Weekday numbering**
   - What we know: `weekday` is an integer, but no convention is documented. [VERIFIED: db/schema.ts]
   - What's unclear: Whether 0 means Sunday or Monday. [VERIFIED: db/schema.ts]
   - Recommendation: Use ISO weekday `1..7` with Monday as `1`, because the product locale is Germany/Europe/Berlin; enforce this in Zod and optionally DB checks. [ASSUMED]

3. **Auth.js v5 beta acceptance**
   - What we know: Official Auth.js App Router docs use v5-style exports; npm `next-auth` stable latest is 4.24.13 and beta is 5.0.0-beta.30. [VERIFIED: npm registry] [CITED: https://authjs.dev/reference/nextjs]
   - What's unclear: Whether beta dependency risk is acceptable. [VERIFIED: npm registry]
   - Recommendation: Use v5 beta for this phase unless the planner decides beta risk is unacceptable. [CITED: https://authjs.dev/getting-started/session-management/protecting]

## Sources

### Primary (HIGH confidence)
- `db/schema.ts` - verified admin, staff, availability, booking schema. [VERIFIED: codebase read]
- `content/services.ts`, `lib/booking/catalog.ts`, `content/booking.ts` - verified service catalog and booking rules. [VERIFIED: codebase read]
- `app/admin/page.tsx`, `app/admin/_components/admin-shell.tsx` - verified admin placeholder and primitive use. [VERIFIED: codebase read]
- `package.json`, `package-lock.json`, `vitest.config.ts`, `tests/setup.ts` - verified Vitest/RTL and dependency state. [VERIFIED: codebase read]
- Auth.js credentials/protection docs - Credentials Provider, `auth()`, API protection, Next.js 16 `proxy.ts`. [CITED: https://authjs.dev/getting-started/authentication/credentials] [CITED: https://authjs.dev/getting-started/session-management/protecting]
- Next.js authentication guide - sessions, DTOs, Server Components, Server Actions, Route Handler authorization. [CITED: https://nextjs.org/docs/app/guides/authentication]
- OWASP Authentication and Password Storage Cheat Sheets - password length, login throttling, Argon2id/scrypt guidance. [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html] [CITED: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html]

### Secondary (MEDIUM confidence)
- npm registry lookups on 2026-04-12 for package versions and modified timestamps. [VERIFIED: npm registry]
- Drizzle docs for transactions, constraints, and Zod integration. [CITED: https://orm.drizzle.team/docs/transactions] [CITED: https://orm.drizzle.team/docs/indexes-constraints] [CITED: https://orm.drizzle.team/docs/zod.html]
- Vitest guide for test naming and runner behavior. [CITED: https://vitest.dev/guide/]

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH for existing Next/Drizzle/Neon/Vitest; MEDIUM for Auth.js v5 beta because it is beta but official-doc aligned. [VERIFIED: package.json] [VERIFIED: npm registry] [CITED: https://authjs.dev/reference/nextjs]
- Architecture: HIGH because it follows existing route/content/booking boundaries and Next.js auth guidance. [VERIFIED: .planning/codebase/ARCHITECTURE.md] [CITED: https://nextjs.org/docs/app/guides/authentication]
- Pitfalls: HIGH for auth/action validation and schema validation; MEDIUM for argon2 deployment risk because it is environment-dependent. [CITED: https://nextjs.org/docs/app/guides/authentication] [ASSUMED]

**Research date:** 2026-04-12  
**Valid until:** 2026-04-19 for Auth.js/Next.js package choices; 2026-05-12 for repo architecture and schema findings.
