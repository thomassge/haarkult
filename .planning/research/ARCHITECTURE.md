# Architecture Research

**Domain:** Reusable hair salon website and booking platform
**Researched:** 2026-04-10
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```text
+-----------------------------------------------------------+
|                  Public Website Layer                     |
|  Marketing pages, salon profile, services, legal pages    |
+--------------------------+--------------------------------+
                           |
                           v
+-----------------------------------------------------------+
|                   Public Booking Layer                    |
|  Service selection, optional stylist choice, slot search, |
|  booking form, booking confirmation state                 |
+--------------------------+--------------------------------+
                           |
                           v
+-----------------------------------------------------------+
|              Booking Application / Domain Layer           |
|  Availability engine, booking rules, conflict checks,     |
|  service snapshots, notifications, status transitions     |
+--------------------+-------------------+------------------+
                     |                   |
                     v                   v
+--------------------------------+   +----------------------+
|         Admin Layer            |   |   Notification Layer |
|  Staff login, calendar,        |   |  Email confirmations |
|  accept/decline/reschedule,    |   |  and admin alerts    |
|  schedule management           |   +----------------------+
+--------------------------+--------------------------------+
                           |
                           v
+-----------------------------------------------------------+
|                  Persistence Layer                        |
|  Postgres tables for staff, availability, bookings,       |
|  booking events, and admin users                          |
+-----------------------------------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Marketing website | Present salon brand, services, trust, and contact information | Server-rendered routes plus content-driven reusable blocks |
| Public booking flow | Collect service/stylist/date choices and booking details | Route segments under `app/termin-buchen/*` plus booking API handlers |
| Availability engine | Produce valid slots and prevent double bookings | Server-side domain module under `lib/booking/*` |
| Admin dashboard | Let staff manage appointments, schedules, and settings | Protected routes under `app/admin/*` |
| Notification service | Send booking confirmations and updates | Server-side email module calling Resend |
| Persistence model | Store schedules, bookings, and audit history | Drizzle schema in `db/schema.ts` plus queries/repositories |

## Recommended Project Structure

```text
app/
|- (marketing)/ or page.tsx    # Brochure routes
|- termin-buchen/              # Public booking flow UI
|- admin/                      # Protected staff/admin UI
|- api/
|  \- booking/                 # Public booking endpoints
|  \- admin/                   # Admin operations if not handled by server actions
content/
|- site.ts                     # Per-salon brand, contact, booking mode
|- services.ts                 # Source-of-truth service catalog
|- booking.ts                  # Optional booking-specific copy/config as this grows
components/
|- blocks/                     # Marketing sections
|- ui/                         # Shared UI primitives
|- booking/                    # Public booking UI pieces
|- admin/                      # Admin UI pieces
lib/
|- booking/
|  |- availability.ts          # Slot generation
|  |- rules.ts                 # Lead time, buffers, horizon
|  |- snapshots.ts             # Booking snapshot helpers
|  |- validation.ts            # Input validation and domain checks
|  \- notifications.ts         # Email triggers
|- auth/                       # Auth.js helpers and guards
|- salons/                     # Reusable salon setup helpers when needed
db/
|- schema.ts
|- queries/
|  |- bookings.ts
|  |- staff.ts
|  \- availability.ts
```

### Structure Rationale

- **`content/` stays the swappable salon boundary:** this preserves the builder goal and keeps brochure data repo-driven
- **`lib/booking/` owns scheduling rules:** booking correctness should not leak into route files or UI components
- **`app/admin/*` stays separate from marketing routes:** different auth, different risk profile, different workflows
- **`db/queries/*` or equivalent keeps data access explicit:** useful once admin and public booking both hit the same data model

## Architectural Patterns

### Pattern 1: Config-gated product modes

**What:** The same codebase supports `contact_only` and `booking` based on salon config.
**When to use:** Everywhere a route, CTA, or booking feature may or may not exist.
**Trade-offs:** Keeps reuse high, but requires discipline to avoid scattered conditional logic.

**Example:**
```typescript
if (site.booking.mode === "contact_only") {
  // show fallback contact actions
} else {
  // show booking CTA / booking flow
}
```

### Pattern 2: Server-owned availability and booking creation

**What:** Final slot calculation and booking conflict checks happen only on the server.
**When to use:** Any booking lookup or mutation that could be invalidated by concurrent changes.
**Trade-offs:** Slightly more backend work, but avoids trust-destroying double bookings.

**Example:**
```typescript
const slots = await getAvailableSlots({ serviceId, staffId, date });
const booking = await createBookingWithConflictCheck(input);
```

### Pattern 3: Content source of truth plus booking snapshots

**What:** Service definitions live in repo content, but bookings store snapshots of title, duration, and price.
**When to use:** Whenever operational records must survive future catalog edits.
**Trade-offs:** Some duplication at write time, but historical bookings stay correct.

## Data Flow

### Request Flow

```text
Client chooses service
  -> public booking UI
  -> validate request input
  -> availability service
  -> bookings/staff/exception queries
  -> return filtered slots

Client submits booking
  -> booking API
  -> validate input
  -> re-check slot in transaction
  -> write booking + event
  -> send confirmation emails
  -> return success state
```

### State Management

```text
Repo content/config
  -> drives brochure rendering and salon-specific booking rules

Database state
  -> staff
  -> recurring availability
  -> one-off exceptions
  -> bookings
  -> booking events

Admin actions
  -> update DB state
  -> next slot query reflects changes
```

### Key Data Flows

1. **Public slot discovery:** service and optional staff selection feed the availability engine, which reads schedules, exceptions, and existing bookings
2. **Admin rescheduling:** admin selects an appointment, asks for a new slot, the same availability engine proposes valid alternatives, then the booking is updated with an audit event
3. **Salon reuse:** new salon data swaps through `content/*`, assets, and configuration; the booking engine stays shared

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-10 salons | Single Next.js monolith plus Postgres is enough |
| 10-100 salons | Add stronger indexing, operational monitoring, and clearer per-salon configuration boundaries |
| 100+ salons | Re-evaluate tenancy model, background jobs, and admin/reporting boundaries before splitting services |

### Scaling Priorities

1. **First bottleneck:** availability queries over large date ranges - solve with tighter query windows, indexes, and pre-validated rule evaluation
2. **Second bottleneck:** admin and notification operational complexity - solve with background jobs and clearer service boundaries only after proven need

## Anti-Patterns

### Anti-Pattern 1: Per-salon business logic forks

**What people do:** Add `if salon === X` branching across the app.
**Why it's wrong:** Reuse disappears and onboarding a new salon becomes custom development.
**Do this instead:** Keep salon differences in structured config, content, assets, and carefully bounded feature flags.

### Anti-Pattern 2: Client-side slot truth

**What people do:** Treat displayed availability as final and write bookings without server revalidation.
**Why it's wrong:** Concurrent bookings and stale UI create conflicts and broken trust.
**Do this instead:** Treat UI slots as provisional and re-check on the server before commit.

### Anti-Pattern 3: Generalizing to every service business too early

**What people do:** Abstract away salon-specific concepts before the salon product works.
**Why it's wrong:** It weakens delivery speed and produces fuzzy data models.
**Do this instead:** Keep the core architecture clean but optimize the language, flows, and admin model for salons first.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Neon Postgres | Drizzle-backed server access | Keep booking writes transactional |
| Auth.js | Protected admin sessions | Scope to staff/admin only in v1 |
| Resend | Transactional email send on booking events | Keep templates and triggers in one server-owned module |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Marketing UI <-> booking UI | Shared config and shared design system | Keep brochure blocks free of booking-side DB logic |
| Public booking routes <-> booking domain layer | Direct function calls on the server | Route handlers should stay thin |
| Admin UI <-> booking domain layer | Authenticated actions or API calls | Reuse the same booking rules rather than creating admin-only scheduling logic |
| Booking domain layer <-> persistence layer | Typed DB queries | Important for auditability and conflict handling |

## Sources

- Next.js Route Handlers docs - https://nextjs.org/docs/app/api-reference/file-conventions/route
- Auth.js - https://authjs.dev/
- Drizzle docs - https://orm.drizzle.team/docs/get-started
- Neon serverless docs - https://neon.com/docs/serverless/serverless-driver
- Project context from `.planning/PROJECT.md` and existing codebase map

---
*Architecture research for: reusable hair salon website and booking platform*
*Researched: 2026-04-10*
