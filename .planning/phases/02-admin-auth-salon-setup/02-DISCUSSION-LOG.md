# Phase 2: Admin Auth & Salon Setup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-04-12T14:52:51+02:00
**Phase:** 02-Admin Auth & Salon Setup
**Areas discussed:** Admin Access Shape, Salon Setup Workflow, Staff And Service Assignment Rules, Working Hours And Exceptions Semantics, Admin UI Tone, Agent Discretion

---

## Admin Access Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Single seeded admin | One manually created admin user, login/logout, route protection, no account-management UI. | |
| Multiple staff users with roles | Multiple admin users and explicit role management UI. | |
| Email/password, role-ready, minimal UI | Real admin login backed by `admin_users`, one owner account now, role/active checks ready underneath. | yes |

**User's choice:** One access is enough for the mother's salon, but the system should be sensible for future salons.
**Notes:** The user confirmed that the admin should sign in with email and password and then be able to manage setup now and later accept/decline bookings. We clarified that admin users and booking stylists are separate concepts.

---

## Salon Setup Workflow

| Option | Description | Selected |
|--------|-------------|----------|
| Simple checklist | Permanent checklist-style setup UI. | |
| Separate management pages | Normal admin sections with distinct screens. | |
| Setup onboarding plus dashboard frames | First-time setup progress only until configured, then a practical dashboard with clickable frames. | yes |

**User's choice:** Setup help should exist only for the first configuration. After setup, the admin should show a small dashboard and common operations.
**Notes:** The user wants setup to support either paid onboarding by the builder/operator or self-service onboarding by the salon. The dashboard should show frames/cards on one page, and clicking a frame opens configuration.

---

## Staff And Service Assignment Rules

| Option | Description | Selected |
|--------|-------------|----------|
| Runtime booking staff only | Create operational booking staff in the database, separate from public team content. | yes |
| Seed directly from public team content | Derive booking staff from `content/team.ts`. | |
| Hybrid with optional link later | Keep content and DB separate now, allow a later relationship if useful. | yes |

**User's choice:** Follow the recommendation: booking staff in admin/database, public team content separate.
**Notes:** The user specifically requested an "all services" checkbox when creating a new employee/stylist, because Haarkult-Maintal stylists can perform all services. Individual service selection must still exist for other salons or new employees with limited services.

---

## Working Hours And Exceptions Semantics

| Option | Description | Selected |
|--------|-------------|----------|
| Simple one range per day | One weekly working-time range per day and one-off blocked/vacation entries. | |
| Multiple ranges plus exceptions | Multiple weekly ranges per day plus vacation, break, and blocked exceptions. | yes |
| Rich calendar model | Calendar-style scheduling with advanced recurring rules and polish. | |

**User's choice:** Multiple weekly working-time ranges plus exceptions is perfect.
**Notes:** Exceptions should support vacation, break, blocked time, all-day or timed windows, and optional label/notes.

---

## Admin UI Tone

| Option | Description | Selected |
|--------|-------------|----------|
| Premium public-site style | More visual, spacious, marketing-like admin. | |
| Pure utilitarian admin | Dense internal tool with minimal brand. | |
| Calm operational dashboard | Clickable frames/cards, clear German labels, focused forms, minimal decoration. | yes |

**User's choice:** Calm operational dashboard with clickable frames/cards is exactly what the user meant.
**Notes:** The admin should not feel like a permanent checklist or a marketing page. It should have a dashboard overview and focused configuration screens.

---

## Agent Discretion

| Option | Description | Selected |
|--------|-------------|----------|
| User decides all details | User specifies exact routes, forms, spacing, validation, and component structure. | |
| Agent decides implementation details | User locks product behavior; downstream agents choose code-level details. | yes |

**User's choice:** Let agents decide implementation details that do not change product behavior.
**Notes:** User confirmed the recommended setup-completion criteria: at least one active stylist, at least one assigned service for every active stylist, and weekly working hours for every active stylist. Exceptions are optional.

---

## Deferred Ideas

- Admin-user management UI for additional login accounts.
- Booking list, accepting/declining, and rescheduling appointments.
- Public booking flow and booking submission.
- Rich calendar UI and advanced scheduling polish.
