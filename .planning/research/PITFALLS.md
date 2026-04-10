# Pitfalls Research

**Domain:** Reusable hair salon website and booking platform
**Researched:** 2026-04-10
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: "Booking mode" that is only a nicer contact page

**What goes wrong:**
The product advertises booking but does not actually validate availability, create bookings safely, or support real salon operations.

**Why it happens:**
It is tempting to stop after the public flow looks convincing in the UI.

**How to avoid:**
Define booking mode as incomplete until it includes server-side slot validation, booking creation, admin handling, and notifications.

**Warning signs:**
- The public page exists, but there is no booking API
- Staff still have to manually reconstruct every request
- No booking status model exists in daily operations

**Phase to address:**
Phase 1 and Phase 2

---

### Pitfall 2: Double bookings from client-side slot trust

**What goes wrong:**
Two users or one user plus an admin claim the same slot because the UI is treated as the source of truth.

**Why it happens:**
Developers calculate slots once, show them in the browser, and skip a final transactional re-check at write time.

**How to avoid:**
Treat visible availability as provisional and re-check slot validity inside booking creation before committing.

**Warning signs:**
- Booking writes do not occur inside a conflict-safe check
- Availability code and booking creation code use different rules
- "Rare" double booking reports start appearing

**Phase to address:**
Phase 2 and Phase 3

---

### Pitfall 3: Per-salon branching explosion

**What goes wrong:**
Each new salon adds custom conditions throughout the app, and the reusable product becomes a collection of exceptions.

**Why it happens:**
The fastest way to onboard a salon is often to patch a special case directly in UI or business logic.

**How to avoid:**
Keep differences in config, content, assets, and narrowly scoped capability flags. Keep the booking/admin core shared.

**Warning signs:**
- New salon onboarding requires code edits outside config/content
- The same component contains salon-name-specific logic
- Booking rules differ because of hardcoded special cases, not data

**Phase to address:**
Phase 1 and all later phases

---

### Pitfall 4: Over-generalizing to non-salon businesses too early

**What goes wrong:**
The system becomes abstract enough to support everything, but no longer fits salons especially well.

**Why it happens:**
Future expansion sounds strategically smart, so the architecture is generalized before the current market is validated.

**How to avoid:**
Design clean boundaries, but keep vocabulary, flows, and admin behavior salon-first until the salon product works.

**Warning signs:**
- Data models stop reflecting real salon workflows
- New abstractions appear without an immediate salon use case
- Product discussions spend more time on future verticals than current salon operations

**Phase to address:**
Phase 1 and roadmap review

---

### Pitfall 5: Admin scope creep before the booking core is stable

**What goes wrong:**
Reporting, payroll, CRM, and staff-performance features crowd out the core calendar and schedule-management work.

**Why it happens:**
Salon software products often market many adjacent operations features, so it is easy to copy the whole surface too early.

**How to avoid:**
Restrict v1 admin to auth, appointment management, staff schedule management, and salon setup required for booking correctness.

**Warning signs:**
- Admin routes outnumber booking-domain modules before booking is live
- Reporting work starts before rescheduling works cleanly
- More time is spent on dashboard chrome than booking correctness

**Phase to address:**
Phase 3 and later

---

### Pitfall 6: Legal and privacy pages lag behind actual data handling

**What goes wrong:**
The product starts storing and emailing booking data, but legal copy still reflects a brochure-only website.

**Why it happens:**
Legal pages are often treated as static content and forgotten during backend feature work.

**How to avoid:**
Update legal/privacy content as part of the booking-launch scope, not as a post-launch cleanup.

**Warning signs:**
- Booking stores personal data but privacy text still says there is no booking flow
- Notification emails are shipped before retention/cancellation language is reviewed

**Phase to address:**
Phase 4 before launch

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding a salon exception in booking logic | Fast onboarding for one salon | Reuse breaks for every new salon | Only for a short-lived local prototype, not for committed product code |
| Using displayed slots without final revalidation | Faster initial implementation | Double bookings and loss of trust | Never |
| Mixing admin queries directly into UI files | Fewer layers initially | Harder testing and reuse | Acceptable only briefly while scaffolding, then extract |
| Implementing deposits/payments before booking reliability | Stronger sales story | Delays the core booking/admin product | Not acceptable for this v1 |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Auth.js | Assuming credentials auth is the whole solution | Pair auth with password hashing, role checks, rate limiting, and protected admin routes |
| Neon + serverless driver | Treating every flow like a simple read without planning transaction boundaries | Use a conflict-safe booking write path and keep DB access server-side |
| Resend | Sending emails as the only source of booking truth | Write the booking first, then send notifications from the committed state |
| Next.js Route Handlers | Forgetting caching/dynamic behavior on booking endpoints | Treat booking and availability endpoints as dynamic server work |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Calculating availability across huge date ranges | Slow slot searches and heavy DB reads | Restrict search windows and paginate/narrow date requests | Usually once booking volume or search horizon grows |
| Loading every staff calendar for every request | Admin pages and public availability slow down quickly | Query only the staff and date range needed | Breaks as staff count and bookings grow |
| Leaving image optimization until last | Strong brochure pages become slower as more salons/assets are added | Standardize formats and monitor image size early | Breaks as content volume grows |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Plaintext or weakly handled admin passwords | Account compromise | Use proper password hashing and limited auth surface |
| Missing rate limits on public booking submission | Spam and abuse | Add rate limiting and validation on all public booking mutations |
| Over-logging booking payloads | PII leakage | Keep logs minimal and structured; avoid raw payload dumps |
| Unprotected admin routes | Unauthorized appointment access | Enforce server-side auth and role checks everywhere in admin |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Forcing stylist selection when there is only one stylist | Unnecessary friction | Skip the choice automatically in that case |
| Showing every mathematically possible slot | Calendar looks noisy or creates awkward gaps | Apply booking rules that keep schedules sane and understandable |
| Hiding all contact alternatives in booking mode | Users feel trapped when booking is unclear | Keep fallback contact paths visible |
| Building admin around generic dashboard widgets first | Real salon tasks stay awkward | Start from appointment and schedule workflows |

## "Looks Done But Isn't" Checklist

- [ ] **Booking flow:** Often missing final server-side conflict check - verify booking creation re-checks the slot
- [ ] **Admin shell:** Often missing role protection - verify unauthorized users cannot access it
- [ ] **Availability:** Often missing exception handling - verify vacations, breaks, and one-off changes block slots correctly
- [ ] **Multi-staff booking:** Often missing service-to-staff compatibility - verify only valid stylists appear for a chosen service
- [ ] **One-stylist salons:** Often missing the no-choice shortcut - verify the flow skips stylist selection when appropriate
- [ ] **Launch readiness:** Often missing legal/privacy updates - verify booking data handling is reflected in legal content

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Double-booking bug | HIGH | Freeze affected slot writes, audit overlaps, patch transactional checks, notify affected clients manually |
| Per-salon branching spread | MEDIUM | Pull differences back into config/content, remove hardcoded exceptions, add regression checks for onboarding |
| Admin scope creep | MEDIUM | Re-baseline to P1 workflows, defer dashboards/reports, prune roadmap phases |
| Legal/privacy drift | LOW to MEDIUM | Update legal copy before launch, review stored data and notification flows |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Fake booking mode | Phase 1-2 | Booking mode is only considered complete once the real flow exists |
| Double bookings | Phase 2-3 | Conflict-safe booking creation test and manual concurrency verification |
| Per-salon branching explosion | Phase 1+ | New salon onboarding changes config/content more than business logic |
| Over-generalizing beyond salons | Phase 1 roadmap | Out-of-scope section remains enforced in requirements and roadmap |
| Admin scope creep | Phase 3 | Admin v1 stays limited to scheduling operations |
| Legal/privacy drift | Final launch phase | Legal pages match actual booking data handling |

## Sources

- Square Appointments product/support pages
- Phorest booking and feature pages
- Next.js Route Handler docs
- Project context captured during `gsd-new-project` questioning on 2026-04-10

---
*Pitfalls research for: reusable hair salon website and booking platform*
*Researched: 2026-04-10*
