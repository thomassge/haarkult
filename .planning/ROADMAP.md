# Roadmap: Haarkult Salon Builder

## Overview

This roadmap takes the project from today's brownfield brochure site and partial booking foundation to a reusable, salon-first product with real booking mode, protected staff operations, and launch-ready compliance. The phase order is intentionally conservative: protect the reusable salon boundaries first, then make booking correct, then make staff operations practical, then harden the product for launch and reuse.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Builder Boundaries & Mode Hardening** - Lock reusable salon boundaries and enforce the two-mode product contract
- [ ] **Phase 2: Admin Auth & Salon Setup** - Add protected admin access and salon-operated staff/schedule management
- [ ] **Phase 3: Public Booking Engine** - Turn booking mode into a real client-facing booking flow with server-owned availability
- [ ] **Phase 4: Staff Booking Operations** - Let salon staff manage booking lifecycle and notifications
- [ ] **Phase 5: Launch Hardening & Reuse Proof** - Align compliance, verify both modes, and prove reuse against another salon setup

## Phase Details

### Phase 1: Builder Boundaries & Mode Hardening
**Goal**: Protect the reusable salon builder architecture before booking and admin complexity grow
**Depends on**: Nothing (first phase)
**Requirements**: BUIL-01, BUIL-02, MODE-01, MODE-02, MODE-03
**UI hint**: no
**Success Criteria** (what must be TRUE):
  1. Maintainer can swap salon content/config and assets without rewriting shared brochure components
  2. `contact_only` mode exposes contact paths and does not expose a working public booking flow
  3. `booking` mode keeps booking/admin boundaries explicit and separate from brochure-only components
**Plans**: 3 plans

Plans:
- [ ] 01-01: Normalize reusable salon content and configuration boundaries
- [ ] 01-02: Harden mode gating for public booking entry points and fallback contact behavior
- [ ] 01-03: Isolate shared booking/admin module boundaries from brochure components

### Phase 2: Admin Auth & Salon Setup
**Goal**: Give salon staff protected access to the operational data required for booking
**Depends on**: Phase 1
**Requirements**: ADMN-01, ADMN-06, STAF-01, STAF-02, STAF-03, STAF-04
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. Salon staff can sign in to a protected admin area
  2. Salon staff can manage stylists, service assignments, weekly hours, and one-off availability exceptions
  3. Public booking logic can read salon-managed setup data from the server-owned booking model
**Plans**: 3 plans

Plans:
- [ ] 02-01: Implement admin authentication shell and route protection
- [ ] 02-02: Build salon setup flows for stylists and service assignments
- [ ] 02-03: Build working-hours and exception management with persisted validation

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
- [ ] 03-01: Build public service and stylist selection flow
- [ ] 03-02: Implement server-side availability engine and slot query endpoints
- [ ] 03-03: Implement booking submission, conflict handling, and public success/error states

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

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Builder Boundaries & Mode Hardening | 0/3 | Not started | - |
| 2. Admin Auth & Salon Setup | 0/3 | Not started | - |
| 3. Public Booking Engine | 0/3 | Not started | - |
| 4. Staff Booking Operations | 0/3 | Not started | - |
| 5. Launch Hardening & Reuse Proof | 0/2 | Not started | - |
