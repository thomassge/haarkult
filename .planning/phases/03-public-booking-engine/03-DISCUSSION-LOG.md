# Phase 3: Public Booking Engine - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-04-13T16:22:09.0055679+02:00
**Phase:** 03-public-booking-engine
**Areas discussed:** Booking Flow Shape, Service Browsing And Selection, Stylist Choice Behavior, Slot Display, Booking Submission And Confirmation, Conflict And Retry UX, Customer Data And Trust Copy, Setup-Incomplete Public State

---

## Booking Flow Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Guided multi-step page | One route acts like a step-by-step booking app. | yes |
| Single compact form | Everything appears in one form. | |
| Separate URLs/screens | Each step has its own route/screen. | |

**User's choice:** Guided multi-step booking app on one URL.
**Notes:** User explicitly confirmed the one-URL model for `/termin-buchen`.

---

## Service Browsing And Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Grouped bookable catalog | Group services by category and show service details. | yes |
| Compact flat list | Show all bookable services in one list. | |
| Category first, then services | Client chooses a category, then sees services in that category. | yes |
| Search/filter | Search/filter services before selecting. | |

**User's choice:** Category-first grouped booking catalog.
**Notes:** The category selector should appear in the header area. After category selection, show all services in that category with price and duration. If only one category exists, skip category selection and show services directly.

---

## Stylist Choice Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Named stylists plus Keine Praeferenz | Client can pick a stylist or no preference. | yes |
| Required named stylist choice | Client must choose a specific stylist. | |
| Hide stylist choice even with multiple stylists | Client never chooses a stylist. | |

**User's choice:** Client can choose a stylist or `Keine Praeferenz`.
**Notes:** The established project rule still applies: skip stylist selection when only one eligible stylist exists.

---

## Slot Display

| Option | Description | Selected |
|--------|-------------|----------|
| Selected date with time chips | Client selects a date and sees free time buttons. | yes |
| Week overview | Show multiple days and slots together. | |
| First available suggestions first | Show next available appointments first. | |
| Morning/afternoon grouping | Group times within the selected date. | |

**User's choice:** Show different dates, client selects a date, then free slots appear as time chips.
**Notes:** User also raised a staff-side idea: the salon should later be able to modify appointment duration after submission for repeat customers who need less time.

---

## Booking Submission And Confirmation

| Option | Description | Selected |
|--------|-------------|----------|
| Manual request confirmation | Booking starts pending and the salon confirms. | yes |
| Instant booking confirmation | Booking is immediately confirmed. | yes |
| Config-based wording and status | Salon decides which mode to use. | yes |

**User's choice:** Support both manual and automatic confirmation modes.
**Notes:** User expects different salons to prefer different modes. Haarkult can use manual mode, but the reusable product should support automatic confirmation too.

---

## Conflict And Retry UX

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve details and reload same date | Keep user input and refresh same-date slots. | yes |
| Preserve details and suggest nearby slots | Also offer nearby alternatives when feasible. | yes |
| Restart slot selection only | Keep earlier choices but reset slot. | |
| Generic error | Show a generic failure. | |

**User's choice:** Preserve entered details, reload same-date slots, and include nearby suggestions if feasible.
**Notes:** User confirmed the recommendation as perfect.

---

## Customer Data And Trust Copy

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal form only | Labels and required fields without extra explanation. | |
| Short trust copy | Brief German reassurance near the contact fields. | yes |
| Detailed privacy block | Longer privacy/legal explanation. | |

**User's choice:** Short trust copy.
**Notes:** The flow remains guest-first with no account prompt.

---

## Setup-Incomplete Public State

| Option | Description | Selected |
|--------|-------------|----------|
| Friendly public fallback to contact | Show public-friendly message and contact actions. | yes |
| Technical/admin warning shown publicly | Expose setup issue details. | |
| Hide booking page or redirect | Remove public booking page. | |
| Stay in booking flow for normal no-slot cases | For complete setup but unavailable slots, let client try alternatives. | yes |

**User's choice:** Friendly contact fallback for incomplete setup, and stay in the booking flow for normal no-slot cases.
**Notes:** User confirmed both.

---

## the agent's Discretion

- Exact component breakdown and state structure.
- Exact endpoint naming.
- Exact visual spacing and validation copy.
- Nearby alternative slot presentation if feasible.

## Deferred Ideas

- Staff can modify the duration of an incoming appointment after submission for repeat customers who need less time. This belongs to Phase 4 or later staff booking operations.
- New Haarkult prices should be updated in `content/services.ts` as a separate content task.
