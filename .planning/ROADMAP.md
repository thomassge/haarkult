# Roadmap: Haarkult Salon Builder

## Overview

This roadmap tracks the salon-builder product as phase-sized milestones. The full product still aims to deliver reusable salon websites with both contact-only and real booking modes, but each phase is closed and archived independently once its requirements are verified.

## Milestones

- [x] **v1.0 - Phase 1: Builder Boundaries & Mode Hardening** - shipped 2026-04-12 ([archive](./milestones/v1.0-ROADMAP.md))
- [x] **v1.1 - Phase 2: Admin Auth & Salon Setup** - shipped 2026-04-12
- [ ] **v1.2 - Phase 3: Public Booking Engine** - next
- [ ] **v1.3 - Phase 4: Staff Booking Operations** - planned
- [ ] **v1.4 - Phase 5: Launch Hardening & Reuse Proof** - planned

## Phase Numbering

- Integer phases (1, 2, 3): planned milestone work
- Decimal phases (2.1, 2.2): urgent insertions, marked as INSERTED
- Each phase is treated as a milestone-sized delivery checkpoint for this project

## Completed

<details>
<summary>v1.0 - Phase 1: Builder Boundaries & Mode Hardening - SHIPPED 2026-04-12</summary>

- [x] Phase 1: Builder Boundaries & Mode Hardening - 4/4 plans complete
- Requirements completed: BUIL-01, BUIL-02, MODE-01, MODE-02, MODE-03
- Audit: passed
- Archive: [v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md)

</details>

<details>
<summary>v1.1 - Phase 2: Admin Auth & Salon Setup - SHIPPED 2026-04-12</summary>

- [x] Phase 2: Admin Auth & Salon Setup - 4/4 plans complete
- Requirements completed: ADMN-01, ADMN-06, STAF-01, STAF-02, STAF-03, STAF-04
- Verification: passed after gap closure
- Report: [02-VERIFICATION.md](./phases/02-admin-auth-salon-setup/02-VERIFICATION.md)

</details>

## Active / Planned Phases

### Phase 2: Admin Auth & Salon Setup

**Goal**: Give salon staff protected access to the operational data required for booking
**Depends on**: Phase 1
**Requirements**: ADMN-01, ADMN-06, STAF-01, STAF-02, STAF-03, STAF-04
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. Salon staff can sign in to a protected admin area
  2. Salon staff can manage stylists, service assignments, weekly hours, and one-off availability exceptions
  3. Public booking logic can read salon-managed setup data from the server-owned booking model
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md - Implement admin authentication shell and route protection
- [x] 02-02-PLAN.md - Build salon setup flows for stylists and service assignments
- [x] 02-03-PLAN.md - Build working-hours and exception management with persisted validation
- [x] 02-04-PLAN.md - Close admin navigation and timed exception validation gaps

### Phase 3: Public Booking Engine

**Goal**: Deliver a real public booking flow with accurate availability and conflict-safe submission
**Depends on**: Phase 2
**Requirements**: BOOK-01, BOOK-02, BOOK-03, BOOK-04, BOOK-05, BOOK-06, BOOK-07, BOOK-08, STAF-05
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. Client can browse services and start a booking from the public website in booking mode
  2. Client sees only valid free slots based on service, stylist choice, schedules, exceptions, and booking rules
  3. The booking flow skips stylist selection when only one eligible stylist exists and shows the choice when more than one exists
  4. Booking submission re-checks slot availability on the server and gives a clear retry path when a slot is no longer valid
**Plans**: 3 plans

Plans:
- [ ] 03-01-PLAN.md - Build public service and stylist selection flow
- [ ] 03-02-PLAN.md - Implement server-side availability engine and slot query endpoints
- [ ] 03-03-PLAN.md - Implement booking submission, conflict handling, and public success/error states

### Phase 4: Staff Booking Operations

**Goal**: Let salon staff manage the full booking lifecycle after bookings exist
**Depends on**: Phase 3
**Requirements**: ADMN-02, ADMN-03, ADMN-04, ADMN-05, COMM-01, COMM-02
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. Salon staff can review upcoming bookings in the admin area
  2. Salon staff can accept, decline/cancel, and reschedule bookings using valid slots
  3. Clients and the salon receive booking-related notifications after relevant booking actions
**Plans**: 3 plans

Plans:
- [ ] 04-01: Build admin booking list, detail, and filtering views
- [ ] 04-02: Implement accept, cancel, and reschedule workflows with booking event tracking
- [ ] 04-03: Implement client and salon notification triggers and templates

### Phase 5: Launch Hardening & Reuse Proof

**Goal**: Make the product launch-safe and prove that the shared booking/admin system can be reused for another salon
**Depends on**: Phase 4
**Requirements**: BUIL-03, COMM-03
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Public legal and privacy content matches the booking data the product actually stores and communicates
  2. Maintainer can prove another salon could reuse the same booking/admin code paths through content/config changes
  3. Both `contact_only` and `booking` modes pass launch-readiness checks without special-case code forks
**Plans**: 2 plans

Plans:
- [ ] 05-01: Align legal/privacy content and launch-hardening checks with real booking behavior
- [ ] 05-02: Validate reuse with a second-salon onboarding dry run and builder checklist

## Progress

**Execution Order:** 2 -> 3 -> 4 -> 5

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Builder Boundaries & Mode Hardening | v1.0 | 4/4 | Complete | 2026-04-12 |
| 2. Admin Auth & Salon Setup | v1.1 | 4/4 | Complete | 2026-04-12 |
| 3. Public Booking Engine | v1.2 | 0/3 | Next | - |
| 4. Staff Booking Operations | v1.3 | 0/3 | Planned | - |
| 5. Launch Hardening & Reuse Proof | v1.4 | 0/2 | Planned | - |
