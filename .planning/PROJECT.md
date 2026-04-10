# Haarkult Salon Builder

## What This Is

This project starts as the real website for the user's mother's salon, Haarkult-Maintal. It is also intended to become a reusable salon website system where most variation between salons comes from swapping structured salon information, services, staff data, and assets instead of rebuilding the application.

The current priority is to complete the salon-specific booking and admin product on top of the existing brochure site, while keeping the architecture reusable for other hair salons later.

## Core Value

A salon should be able to run a premium website with either contact-only mode or real booking mode by changing salon-specific content and configuration, not by rewriting the codebase.

## Requirements

### Validated

- Existing premium brochure website for Haarkult-Maintal is live in the repo and already supports salon-specific content, assets, and legal/contact pages - existing
- Reusable prop-driven block architecture already exists for the marketing site - existing
- Booking mode and contact-only mode are already modeled in config and visible CTA behavior - existing
- Service catalog with booking-relevant metadata already exists in the repo content model - existing
- Initial booking database foundation exists with schema, migration, and environment contract - existing

### Active

- [ ] Complete real booking mode for hair salons on top of the existing website foundation
- [ ] Let clients choose a service from the salon catalog and create an appointment
- [ ] Let clients choose a stylist only when the salon has more than one stylist; skip that choice automatically when there is only one
- [ ] Show only valid free time slots based on the selected service, stylist availability, and booking rules
- [ ] Build an admin area where salon staff can review, accept, decline, and reschedule appointments
- [ ] Let salon staff manage salon setup such as stylists, working hours, and related booking availability inputs
- [ ] Keep salon-specific contact content, services, staff data, and assets easy to swap for another salon
- [ ] Keep the booking and admin logic reusable across multiple salons without splitting into per-salon custom implementations

### Out of Scope

- Nail salons, sunglasses businesses, and other business verticals - future expansion idea, not part of the current salon-first project
- Customer accounts and customer portal - not required for v1 booking
- Online payments, memberships, packages, and marketplace features - not part of the first booking release
- CMS-driven content management - repo-driven content remains the current operating model
- Multi-location salon support - not needed for the current first product version

## Context

The original motivation is personal and practical: build a better website for the user's mother's salon, then turn that work into a reusable system that can be offered to other hair salons later.

The repo is already a brownfield codebase. The marketing site is mostly established with a shared design system, reusable content-driven blocks, a typed service catalog, and a clear salon-specific content layer. Booking work has started with a mode-aware `/termin-buchen` shell, booking configuration in `content/site.ts`, and a first Drizzle/Neon schema foundation, but there is still no real booking flow, admin area, availability engine, or booking API.

The business direction is salon-first. The broader idea of supporting other appointment- or information-driven businesses should influence architecture decisions only to the extent that it does not weaken the current focus on hair salons.

## Constraints

- **Scope**: Hair salons only for the current project - future vertical expansion must not dilute the salon-first delivery
- **Product Modes**: Support both `contact_only` and `booking` - some salons only need an informational/contact website
- **Content Model**: Salon-specific content and assets must be easy to replace - reuse depends on structured, swappable salon data
- **Booking Reuse**: Booking and admin logic should be shared across salons - avoid per-salon branching in the core booking engine
- **UX Rule**: Stylist selection must be conditional - if there is only one stylist, clients should not be asked to choose
- **Language**: German content only - matches the current target market and existing product direction
- **Content Operations**: No CMS for now - repo-driven content is simpler and already aligned with the current architecture
- **Auth/Product Scope**: Customer accounts are out of scope for v1 - booking remains guest-first
- **Payments**: No online payments in the first booking release - focus on scheduling and salon operations first

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with the real site for the user's mother's salon | Gives the project a concrete first customer and real-world validation target | Pending |
| Keep the system reusable for multiple hair salons | The repo should become a productizable salon website system, not only a one-off site | Pending |
| Support two product modes: `contact_only` and `booking` | Different salons need different operational complexity, and contact-only mode is already mostly complete | Pending |
| Prioritize booking mode and salon admin next | Contact-only mode is mostly there; the biggest product gap is real appointment operations | Pending |
| Keep salon-specific content and assets easily swappable | Reuse depends on changing data and branding rather than rewriting code | Pending |
| Use one shared booking/admin logic across salons | Core scheduling behavior should stay consistent and reusable | Pending |
| Only ask users to choose a stylist when the salon has more than one | The booking UX should match the real salon setup and avoid unnecessary choices | Pending |
| Keep non-salon verticals out of current scope | Future expansion matters, but current execution must stay focused on hair salons | Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-10 after initialization*
