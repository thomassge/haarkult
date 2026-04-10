# Requirements: Haarkult Salon Builder

**Defined:** 2026-04-10
**Core Value:** A salon should be able to run a premium website with either contact-only mode or real booking mode by changing salon-specific content and configuration, not by rewriting the codebase.

## v1 Requirements

### Builder

- [x] **BUIL-01**: Maintainer can create a new salon website by replacing structured salon content and configuration without rewriting shared brochure components
- [x] **BUIL-02**: Maintainer can replace salon-specific brand and media assets without editing shared booking or admin logic
- [ ] **BUIL-03**: Maintainer can reuse the same booking and admin code paths across multiple salons with salon-specific data differences

### Modes

- [x] **MODE-01**: Maintainer can configure a salon website to run in `contact_only` mode
- [x] **MODE-02**: Maintainer can configure a salon website to run in `booking` mode
- [ ] **MODE-03**: Visitor in `contact_only` mode sees contact paths and does not get a working public booking flow

### Public Booking

- [ ] **BOOK-01**: Client can browse bookable services with duration and price context before starting a booking
- [ ] **BOOK-02**: Client can start a booking from the public website when booking mode is enabled
- [ ] **BOOK-03**: Client can select a service to book
- [ ] **BOOK-04**: Client is not asked to choose a stylist when only one eligible stylist exists for the booking
- [ ] **BOOK-05**: Client can choose a preferred stylist when more than one eligible stylist exists
- [ ] **BOOK-06**: Client can see available appointment slots for the selected service, stylist choice, and date
- [ ] **BOOK-07**: Client can submit a booking using name, phone, email, and an optional note
- [ ] **BOOK-08**: Client gets a clear retry path when the selected slot is no longer available during submission

### Staff Setup

- [ ] **STAF-01**: Salon staff can create and manage stylists who accept bookings
- [ ] **STAF-02**: Salon staff can assign which services each stylist can perform
- [ ] **STAF-03**: Salon staff can set recurring weekly working hours for each stylist
- [ ] **STAF-04**: Salon staff can set one-off blocked times, breaks, vacations, or availability exceptions for each stylist
- [ ] **STAF-05**: The booking system calculates availability from service duration, staff schedules, exceptions, existing bookings, lead time, booking horizon, and slot step rules

### Admin Operations

- [ ] **ADMN-01**: Salon staff can sign in to a protected admin area
- [ ] **ADMN-02**: Salon staff can view upcoming bookings in the admin area
- [ ] **ADMN-03**: Salon staff can accept pending bookings
- [ ] **ADMN-04**: Salon staff can decline or cancel bookings
- [ ] **ADMN-05**: Salon staff can move a booking to another valid free slot
- [ ] **ADMN-06**: Salon staff can update core salon booking setup such as stylists and working hours from the admin area

### Communication & Compliance

- [ ] **COMM-01**: Client receives an email confirmation or status update after booking actions
- [ ] **COMM-02**: Salon receives a notification about new or changed bookings
- [ ] **COMM-03**: Public legal and privacy content reflects the booking-related personal data the site actually stores and sends before launch

## v2 Requirements

### Booking Experience

- **BKX-01**: Client can cancel or reschedule a booking through a self-service link
- **BKX-02**: Client receives reminder emails before the appointment
- **BKX-03**: Client can join a waitlist for unavailable time periods

### Admin & Operations

- **ADM2-01**: Salon staff can create bookings manually on behalf of a client
- **ADM2-02**: Salon staff can see richer reporting and performance views
- **ADM2-03**: Salon staff can configure more advanced booking policies without code changes

### Expansion

- **EXP-01**: The product supports multi-location salon setups
- **EXP-02**: The product supports non-salon business templates such as nail salons or other service categories

## Out of Scope

| Feature | Reason |
|---------|--------|
| Customer accounts / customer portal | v1 stays guest-first to keep booking scope focused |
| Online payments / deposits | defer until booking and admin operations are reliable |
| Memberships, packages, gift-card workflows | adds commerce complexity outside the current booking goal |
| Multi-location support | not needed for the current first product version |
| Non-salon business verticals | future direction, but current execution stays hair-salon-first |
| CMS-driven content editing | repo-driven content remains the current operating model |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUIL-01 | Phase 1 | Complete |
| BUIL-02 | Phase 1 | Complete |
| BUIL-03 | Phase 5 | Pending |
| MODE-01 | Phase 1 | Complete |
| MODE-02 | Phase 1 | Complete |
| MODE-03 | Phase 1 | Pending |
| BOOK-01 | Phase 3 | Pending |
| BOOK-02 | Phase 3 | Pending |
| BOOK-03 | Phase 3 | Pending |
| BOOK-04 | Phase 3 | Pending |
| BOOK-05 | Phase 3 | Pending |
| BOOK-06 | Phase 3 | Pending |
| BOOK-07 | Phase 3 | Pending |
| BOOK-08 | Phase 3 | Pending |
| STAF-01 | Phase 2 | Pending |
| STAF-02 | Phase 2 | Pending |
| STAF-03 | Phase 2 | Pending |
| STAF-04 | Phase 2 | Pending |
| STAF-05 | Phase 3 | Pending |
| ADMN-01 | Phase 2 | Pending |
| ADMN-02 | Phase 4 | Pending |
| ADMN-03 | Phase 4 | Pending |
| ADMN-04 | Phase 4 | Pending |
| ADMN-05 | Phase 4 | Pending |
| ADMN-06 | Phase 2 | Pending |
| COMM-01 | Phase 4 | Pending |
| COMM-02 | Phase 4 | Pending |
| COMM-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---
*Requirements defined: 2026-04-10*
*Last updated: 2026-04-10 after initial definition*
