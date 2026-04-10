# Stack Research

**Domain:** Reusable hair salon website and booking platform
**Researched:** 2026-04-10
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.x | Marketing site, public booking UI, admin UI, and API surface in one codebase | Fits the existing repo, supports App Router, Route Handlers, and server-first rendering without splitting the product too early |
| React | 19.x | UI composition for public and admin surfaces | Already in use, fits the current component model, and keeps the builder/admin experience in one frontend stack |
| TypeScript | 5.x | Shared typing across content, booking logic, database, and admin features | Critical for keeping reusable salon config and booking contracts consistent as the product grows |
| Drizzle ORM | 0.45.x+ | Typed schema, SQL migrations, and data access | Matches the current repo foundation and keeps the booking data model explicit and close to SQL |
| Neon Postgres serverless driver | 1.x | Managed Postgres access from serverless Next.js runtime | The current repo already uses Neon, and the official docs position the HTTP driver well for one-shot queries and transactional request work in serverless environments |
| Auth.js | 5.x line / current Next.js-compatible release | Admin and staff authentication | First-class Next.js integration, route handler support, and a clean fit for protected admin routes |
| Resend | current stable | Transactional booking emails | Simple email API with clear Next.js/Node support and a lightweight operational model for confirmations and notifications |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | current stable | Input validation for booking and admin payloads | Use at every public and admin mutation boundary |
| Password hashing library (`bcrypt` or `argon2`) | current stable | Secure password storage for admin/staff accounts | Use when implementing credentials-based admin login |
| Date/time timezone library (`date-fns` + `date-fns-tz`, Luxon, or Temporal when practical) | current stable | Slot generation and Europe/Berlin timezone handling | Use in availability calculations, booking normalization, and email formatting |
| React Email or simple templated HTML mail generation | current stable | Booking confirmation and admin notification templates | Use once Resend sending is implemented |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Guard code quality and Next.js rules | Already configured in the repo |
| drizzle-kit | Schema generation and migrations | Already part of the current workflow |
| npm scripts + local build validation | Basic verification loop | Already documented in `README.md` with PowerShell-friendly commands |

## Installation

```bash
# Core additions beyond the existing repo
npm install next-auth resend

# Supporting
npm install zod
npm install argon2
npm install date-fns date-fns-tz

# Optional email templating
npm install @react-email/components
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Next.js Route Handlers + server actions where useful | Separate dedicated backend | Use a separate backend only if salon operations outgrow the monolith or the product starts serving many organizations with very different requirements |
| Drizzle + Neon | Prisma + managed Postgres | Use Prisma if the team strongly prefers its client ergonomics and accepts a heavier abstraction layer |
| Auth.js | Clerk or custom auth stack | Use Clerk if the project later values hosted auth velocity over keeping the auth model fully in-house |
| Resend | Postmark or SES | Use an alternative if deliverability, regional constraints, or pricing become a better fit later |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Building a separate code fork per salon | Reuse collapses quickly and maintenance cost explodes | Keep one configurable codebase with swappable content/assets and shared booking logic |
| Client-side final availability checks | Leads to stale slot decisions and double-booking risk | Re-check availability on the server during booking creation |
| Designing for non-salon businesses now | Over-generalization will slow delivery of the actual salon product | Keep the architecture clean, but optimize for hair salons first |
| Heavy CMS integration in v1 | Adds operational complexity before the booking product is finished | Keep brochure content repo-driven for now |

## Stack Patterns by Variant

**If the salon uses `contact_only`:**
- Keep pages mostly static/server-rendered
- Keep the code path content-driven and minimal
- Do not require booking-specific runtime dependencies at request time

**If the salon uses `booking`:**
- Use Route Handlers for public booking and admin operations
- Keep admin-only mutations behind authenticated server boundaries
- Treat availability calculation and booking creation as server-owned logic

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@16.x` | `react@19.x` | Matches the current repo state |
| `drizzle-orm@0.45.x` | `@neondatabase/serverless@1.x` | Already used in the repo foundation |
| Neon serverless driver 1.x | Node.js 19+ | Official Neon docs call this out explicitly for GA releases |
| Route Handlers in App Router | Next.js App Router | Official Next.js docs position this as the native API surface in `app/` |

## Sources

- Next.js Route Handlers docs - https://nextjs.org/docs/app/api-reference/file-conventions/route
- Auth.js homepage and setup examples - https://authjs.dev/
- Drizzle ORM getting started docs - https://orm.drizzle.team/docs/get-started
- Neon serverless driver docs - https://neon.com/docs/serverless/serverless-driver
- Resend docs - https://resend.com/docs

---
*Stack research for: reusable hair salon website and booking platform*
*Researched: 2026-04-10*
