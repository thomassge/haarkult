# Haarkult Salon Builder

## What This Is

This project starts as the real website for the user's mother's salon, Haarkult-Maintal. It is also becoming a reusable salon website system where most variation between salons comes from swapping structured salon information, services, staff data, booking setup, and assets instead of rebuilding the application.

The current product has a completed brochure/builder foundation, protected admin setup foundation, and public booking engine. The next priority is Phase 4: staff booking operations for reviewing, accepting, declining, rescheduling, and notifying around booking requests.

## Core Value

A salon should be able to run a premium website with either contact-only mode or real booking mode by changing salon-specific content and configuration, not by rewriting the codebase.

## Current State

**Shipped milestone:** v1.2 - Phase 3: Public Booking Engine
**Next milestone:** v1.3 - Phase 4: Staff Booking Operations
**Last updated:** 2026-04-13

Phase 1 is complete. Booking-specific config and copy are isolated in `content/booking.ts`, salon-wide data remains in `content/site.ts`, public mode decisions flow through `lib/site-mode.ts`, and `/termin-buchen` is route-local.

Phase 2 is complete. Admin staff can sign in through protected Auth.js Credentials auth, manage operational stylists, assign services, set recurring weekly working hours, and create one-off availability exceptions. Phase 2 verification passed after a gap closure that repointed the `Leistungen` dashboard card to `/admin/stylisten` and rejected invalid timed exception dates before persistence.

Phase 3 is complete. Clients can browse service categories, choose a service, choose a stylist only when more than one eligible stylist exists, load server-calculated slots, submit a guest booking request, and receive a safe retry path when a selected slot becomes stale. The implementation uses the Phase 2 server-owned setup model and Neon-backed booking tables. Staff booking lifecycle operations and notification flows remain planned for Phase 4.

## Next Milestone Goals

Phase 4 should let salon staff operate the bookings created by Phase 3:

- Staff can view upcoming and pending bookings in the admin area.
- Staff can accept, decline/cancel, and reschedule bookings using valid slots.
- Booking changes create event history.
- Clients and the salon receive booking-related notifications after relevant actions.

## Requirements

### Validated

- Existing premium brochure website for Haarkult-Maintal is live in the repo and already supports salon-specific content, assets, and legal/contact pages - existing
- Reusable prop-driven block architecture already exists for the marketing site - existing
- Service catalog with booking-relevant metadata already exists in the repo content model - existing
- Initial booking database foundation exists with schema, migration, and environment contract - existing
- Builder requirement BUIL-01: structured salon content/config can be replaced without rewriting shared brochure components - v1.0
- Builder requirement BUIL-02: salon-specific brand and media assets can be replaced without editing shared booking or admin logic - v1.0
- Mode requirement MODE-01: site can run in `contact_only` mode - v1.0
- Mode requirement MODE-02: site can run in `booking` mode - v1.0
- Mode requirement MODE-03: contact-only visitors see contact paths and no working public booking flow - v1.0
- Admin requirement ADMN-01: salon staff can sign in to a protected admin area - v1.1
- Admin requirement ADMN-06: salon staff can update core salon booking setup from the admin area - v1.1
- Staff requirement STAF-01: salon staff can create and manage stylists who accept bookings - v1.1
- Staff requirement STAF-02: salon staff can assign which services each stylist can perform - v1.1
- Staff requirement STAF-03: salon staff can set recurring weekly working hours for each stylist - v1.1
- Staff requirement STAF-04: salon staff can set one-off blocked times, breaks, vacations, or availability exceptions for each stylist - v1.1
- Booking requirement BOOK-01: clients can browse bookable services with duration and price context - v1.2
- Booking requirement BOOK-02: clients can start booking from the public website in booking mode - v1.2
- Booking requirement BOOK-03: clients can select a service to book - v1.2
- Booking requirement BOOK-04: stylist selection is skipped when only one eligible stylist exists - v1.2
- Booking requirement BOOK-05: clients can choose a preferred stylist when more than one eligible stylist exists - v1.2
- Booking requirement BOOK-06: clients can see available slots for selected service, stylist choice, and date - v1.2
- Booking requirement BOOK-07: clients can submit a booking using name, phone, email, and optional note - v1.2
- Booking requirement BOOK-08: clients get a clear retry path when the selected slot is no longer available - v1.2
- Staff requirement STAF-05: booking availability is calculated from duration, schedules, exceptions, bookings, lead time, horizon, and slot step rules - v1.2

### Active

- [ ] Complete real booking mode for hair salons on top of the existing website foundation
- [ ] Let salon staff review, accept, decline, and reschedule appointments
- [ ] Keep the booking and admin logic reusable across multiple salons without splitting into per-salon custom implementations

### Out of Scope

- Nail salons, sunglasses businesses, and other business verticals - future expansion idea, not part of the current salon-first project
- Customer accounts and customer portal - not required for v1 booking
- Online payments, memberships, packages, and marketplace features - not part of the first booking release
- CMS-driven content management - repo-driven content remains the current operating model
- Multi-location salon support - not needed for the current first product version

## Context

The original motivation is personal and practical: build a better website for the user's mother's salon, then turn that work into a reusable system that can be offered to other hair salons later.

The repo is a brownfield Next.js codebase. The marketing site is established with a shared design system, reusable content-driven blocks, a typed service catalog, and a clear salon-specific content layer. Phase 1 hardened the product-mode and builder boundaries so Phase 2 can add protected admin operations without leaking booking/admin details into brochure components.

The business direction is salon-first. The broader idea of supporting other appointment- or information-driven businesses should influence architecture decisions only when it does not weaken the current focus on hair salons.

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
- **Milestone Scope**: Treat each roadmap phase as a milestone-sized delivery checkpoint

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start with the real site for the user's mother's salon | Gives the project a concrete first customer and real-world validation target | Good |
| Keep the system reusable for multiple hair salons | The repo should become a productizable salon website system, not only a one-off site | Good |
| Support two product modes: `contact_only` and `booking` | Different salons need different operational complexity, and contact-only mode is already mostly complete | Good |
| Prioritize booking mode and salon admin next | Contact-only mode is mostly there; the biggest product gap is real appointment operations | Good |
| Keep salon-specific content and assets easily swappable | Reuse depends on changing data and branding rather than rewriting code | Good |
| Use one shared booking/admin logic across salons | Core scheduling behavior should stay consistent and reusable | Good |
| Only ask users to choose a stylist when the salon has more than one | The booking UX should match the real salon setup and avoid unnecessary choices | Good - v1.2 |
| Keep non-salon verticals out of current scope | Future expansion matters, but current execution must stay focused on hair salons | Good |
| Move booking rules and booking-page copy to `content/booking.ts` | Keeps salon-wide identity/contact data separate from booking-domain behavior | Good - v1.0 |
| Resolve brochure mode behavior through `lib/site-mode.ts` | Avoids duplicate mode branching across homepage, footer, and booking route surfaces | Good - v1.0 |
| Keep `/termin-buchen` and `/admin` in separate route-local trees | Preserves clean boundaries for future booking and protected admin work | Good - v1.0 |
| Treat each roadmap phase as a milestone | Keeps completion, archive, and planning loops small while the broader product backlog remains active | Good - v1.0 |
| Use Auth.js Credentials with scrypt-hashed owner seed accounts for admin v1 | Provides protected salon-admin access without customer accounts or external auth complexity | Good - v1.1 |
| Store operational staff and availability separately from marketing team content | Public team content stays brochure-oriented while booking logic consumes server-owned setup rows | Good - v1.1 |
| Add `/admin/leistungen` as a distinct service-assignment entry point | Phase 3 UAT showed that routing both Stylisten and Leistungen to the same page was confusing, even if the underlying model still assigns services per stylist | Good - v1.2 |
| Validate timed availability exceptions before persistence | Phase 3 availability needs reliable exception windows and controlled validation errors | Good - v1.1 |
| Use Neon serverless pool adapter for app DB access | Public booking submission and admin writes need Drizzle transactions, which the previous neon-http adapter does not support | Good - v1.2 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase/milestone completion:**

1. Move completed phase requirements to Validated.
2. Keep remaining product requirements in Active until their phase ships.
3. Update current state and next milestone goals.
4. Add decisions discovered during the milestone.
5. Confirm the core value and constraints still match the project.

---
*Last updated: 2026-04-13 after v1.2 milestone completion*
