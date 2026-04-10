# Feature Research

**Domain:** Reusable hair salon website and booking platform
**Researched:** 2026-04-10
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Public service catalog | Clients need to understand what can be booked before they commit | LOW | Already partially present in the repo |
| 24/7 online booking entry point | Modern salon software commonly advertises around-the-clock booking | MEDIUM | Competitor products strongly position after-hours booking as standard |
| Accurate staff availability | Booking without real availability breaks trust immediately | HIGH | Must be server-calculated from staff schedules, exceptions, and existing bookings |
| Confirmation and change communication | Clients expect clear booking status and updates | MEDIUM | Email is enough for v1; SMS can wait |
| Admin/staff calendar management | Salon operators need to manage appointments, not just receive them | HIGH | Core operational requirement, not a nice-to-have |
| Contact fallback paths | Some salons will still prefer contact-first flows, and even booking salons need fallback contact | LOW | Already aligned with the current product direction |
| Staff-specific booking where relevant | Many salons have multiple stylists with different schedules and service coverage | HIGH | Must also handle the one-stylist shortcut cleanly |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Reusable salon-builder architecture | Lets one codebase serve multiple salons with low marginal setup cost | HIGH | This is a business differentiator, not just an engineering preference |
| Clean content/asset swapping | Makes onboarding a new salon faster and safer | MEDIUM | Strong fit with the existing `content/*` and `public/*` structure |
| Conditional stylist choice | Avoids forcing clients through a pointless staff-selection step when the salon only has one stylist | MEDIUM | Small UX detail with strong practical value |
| Premium brochure + operations in one system | Salons get both marketing presence and appointment handling without two disconnected products | MEDIUM | Strong positioning for smaller salons |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Customer accounts in v1 | Feels "more complete" | Adds auth, recovery, privacy, and support burden before the scheduling core is proven | Keep booking guest-first |
| Payments/deposits in the first release | Seems like a way to reduce no-shows immediately | Adds checkout complexity, compliance surface, disputes, and UX friction | Ship a reliable booking/admin core first, then evaluate deposits later |
| Multi-location support now | Feels like future-proofing | Changes the data model and admin UX significantly | Stay single-salon/location for v1 |
| Generalizing to nails, clinics, retail, or other verticals now | Sounds scalable | Forces abstraction before salon-specific needs are finished | Keep the architecture clean, but salon-first in scope |

## Feature Dependencies

```text
Public booking flow
  -> requires service catalog
  -> requires availability engine
      -> requires staff model
      -> requires weekly availability
      -> requires one-off exceptions
      -> requires booking conflict checks

Admin rescheduling
  -> requires admin auth
  -> requires booking event history
  -> requires availability engine

Reusable salon onboarding
  -> requires clean salon config/content boundaries
  -> enhances both contact_only and booking modes

Conditional stylist choice
  -> requires service-to-staff relationship data
```

### Dependency Notes

- **Public booking flow requires the availability engine:** otherwise the UI is only a request form, not real booking
- **Admin rescheduling requires admin auth:** staff operations cannot stay public
- **Conditional stylist choice requires service/staff relationship data:** the booking flow must know whether one or many bookable staff are valid for the chosen service
- **Reusable onboarding depends on strong content boundaries:** without that, every new salon becomes a code customization project

## MVP Definition

### Launch With (v1)

- [ ] `contact_only` and `booking` product modes - core product contract
- [ ] Public service selection - required to anchor booking to real salon offerings
- [ ] Conditional stylist selection - needed for multi-staff salons without hurting single-stylist UX
- [ ] Server-calculated free slot display - core trust requirement
- [ ] Guest booking submission with name, phone, email, and optional note - minimum viable booking intake
- [ ] Admin/staff login - required to protect operational data
- [ ] Admin view to accept, decline, and reschedule bookings - required for real salon operations
- [ ] Staff working-hours and exception management - required to make availability credible
- [ ] Booking confirmation and status emails - closes the operational loop

### Add After Validation (v1.x)

- [ ] Automated reminder emails - add once core confirmations are stable
- [ ] Waitlist or backfill handling - only after the base calendar flow is reliable
- [ ] Better staff reporting and simple business metrics - add after daily operations work
- [ ] Richer brochure trust signals such as reviews and stronger team storytelling - improve conversion after booking basics

### Future Consideration (v2+)

- [ ] Deposits or prepayments - defer until no-show handling becomes a measured problem
- [ ] Client self-service cancellation/reschedule links - useful, but can follow the admin-first release
- [ ] Multi-location support - defer until there is a real salon customer need
- [ ] Broader vertical template system beyond salons - future business direction, not current project scope

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Real booking flow | HIGH | HIGH | P1 |
| Admin/staff appointment management | HIGH | HIGH | P1 |
| Staff schedule and exception management | HIGH | HIGH | P1 |
| Reusable salon content/assets model | HIGH | MEDIUM | P1 |
| Conditional stylist selection | MEDIUM | MEDIUM | P1 |
| Email reminders | MEDIUM | MEDIUM | P2 |
| Waitlist | MEDIUM | MEDIUM | P2 |
| Deposits / payments | MEDIUM | HIGH | P3 |
| Multi-location management | LOW for current scope | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| 24/7 booking | Square Appointments highlights online booking websites and integrations | Phorest emphasizes after-hours booking and website/social entry points | Keep v1 simple: website-first booking entry, reliable public flow |
| Staff management | Square exposes staff calendars, permissions, timecards, and scheduling tools | Phorest exposes staff management, rosters, permissions, and performance tooling | Build only the booking operations needed for a salon admin first |
| Booking rules | Square offers cancellation rules, deposits, and resource controls | Phorest highlights minimum notice, gap prevention, and booking rules | Start with notice, slot steps, buffers, and staff availability; defer deposits/resources |
| Multi-location | Both competitors support it | Both competitors support it | Explicitly defer for v1 |

## Sources

- Square Appointments product page - https://squareup.com/us/en/appointments?library=true
- Square scheduling support article - https://my.squareup.com/help/gb/en/article/5349-schedule-and-accept-appointments
- Phorest salon management features - https://www.phorest.com/ae/features/
- Phorest salon booking app page - https://www.phorest.com/us/features/salon-booking-app/
- User product vision captured during `gsd-new-project` questioning on 2026-04-10

---
*Feature research for: reusable hair salon website and booking platform*
*Researched: 2026-04-10*
