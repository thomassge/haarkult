# Codex Project Context

This file is the handoff and working brief for future Codex agents working on this repository.

The goal is that a new agent can read this file and continue the project without needing earlier chat context.

## Project Summary

This repository is meant to become two things at the same time:

1. A high-quality website for the salon `Haarkult-Maintal`
2. A reusable template/builder for future hair salon websites, where each salon gets its own repo and domain

The current repo already works as a real salon site, but the long-term intention is a reusable builder architecture, not a one-off implementation.

## Product Goal

Build a modern premium salon website with these characteristics:

- clean and calm layout
- lots of whitespace
- strong typography
- high-quality photography
- subtle, selective motion
- minimal clutter
- German language only

The user described the desired feeling as close to an "Apple style", but that should be interpreted in practical UI rules:

- restrained visual system
- large, confident type
- spacious composition
- polished but quiet motion
- premium photography
- no noisy UI

## Product Modes

This project now needs to support two valid product modes:

1. `contact_only`
2. `online_booking`

`contact_only` must remain a first-class supported mode. A salon that does not want online booking must be able to disable it with config and still have a complete production-ready website offering only:

- phone
- WhatsApp
- email
- optionally maps / Instagram

`online_booking` means a real backend-powered booking flow, not a fake CTA and not a WhatsApp message generator.

## Scope Decisions

Current product decisions:

- No CMS for now
- Content is maintained directly in the repo
- Language is German only
- The marketing site remains content-driven and repo-driven
- Online booking is now approved as the next major product track
- Online booking must be optional per salon and easy to disable
- Customer accounts are not required for v1
- Admin/staff authentication is required once booking mode is enabled
- Payments are out of scope for v1
- Multi-location support is out of scope for v1
- Packages, memberships, gift-card redemption, and marketplace complexity are out of scope for v1

## Technical Stack

Current stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion only for selected places, not everywhere

Recommended backend additions for booking mode:

- relational database, preferably PostgreSQL
- typed schema + migrations via Prisma or Drizzle
- admin authentication via Auth.js or equivalent
- transactional email provider such as Resend or equivalent

Important:

- Use `use client` only when interaction actually requires it
- Keep most of the marketing site server-rendered/static where possible
- Keep booking-specific server logic isolated from presentational blocks
- Do not hard-wire vendor SDK logic through reusable UI components

## Architectural Rules

This is the most important structural rule:

Blocks must be reusable and prop-driven.

That means:

- `app/*` composes the page
- `content/*` provides salon-specific data and copy
- `components/blocks/*` receives props and renders reusable sections
- `components/ui/*` is the shared design system
- `public/*` contains salon-specific brand and image assets

Do not let reusable blocks import salon content directly unless there is a very strong reason.

Booking adds one more architectural rule:

- booking must be isolated behind explicit config and module boundaries

That means:

- the public marketing site must not assume booking is always enabled
- booking-disabled salons should not need code deletion to remove booking
- public booking UI, booking APIs, admin routes, and availability logic should be separate modules
- if booking is disabled, public booking routes should be hidden from navigation and fail safely

Preferred structure today:

- `components/ui`
  - shared visual primitives
  - buttons, typography, cards, section wrappers, layout helpers
- `components/blocks`
  - Hero
  - ServicesGrid
  - GalleryGrid
  - TeamGrid
  - ContactBlock
- `content`
  - `site.ts`
  - `home.ts`
  - `services.ts`
  - `team.ts`
  - `gallery.ts`

Likely additions for booking mode:

- `content/booking.ts`
  - booking-specific copy and salon config if `content/site.ts` becomes too crowded
- `app/termin-buchen/*`
  - public booking flow
- `app/admin/*`
  - protected admin/staff area
- `app/api/booking/*` or server actions
  - booking endpoints and mutations
- `lib/booking/*`
  - availability logic, validation, booking helpers
- `lib/auth/*`
  - admin auth helpers
- `db/*` or equivalent
  - schema, migrations, typed queries

## Current Repository Structure

Relevant files today:

- [app/page.tsx](/C:/Users/neyma/dev/haarkult/app/page.tsx)
- [app/layout.tsx](/C:/Users/neyma/dev/haarkult/app/layout.tsx)
- [app/globals.css](/C:/Users/neyma/dev/haarkult/app/globals.css)
- [content/site.ts](/C:/Users/neyma/dev/haarkult/content/site.ts)
- [content/home.ts](/C:/Users/neyma/dev/haarkult/content/home.ts)
- [content/services.ts](/C:/Users/neyma/dev/haarkult/content/services.ts)
- [content/team.ts](/C:/Users/neyma/dev/haarkult/content/team.ts)
- [content/gallery.ts](/C:/Users/neyma/dev/haarkult/content/gallery.ts)
- [components/ui/button.tsx](/C:/Users/neyma/dev/haarkult/components/ui/button.tsx)
- [components/ui/card.tsx](/C:/Users/neyma/dev/haarkult/components/ui/card.tsx)
- [components/ui/container.tsx](/C:/Users/neyma/dev/haarkult/components/ui/container.tsx)
- [components/ui/heading.tsx](/C:/Users/neyma/dev/haarkult/components/ui/heading.tsx)
- [components/ui/section.tsx](/C:/Users/neyma/dev/haarkult/components/ui/section.tsx)
- [components/ui/typography.tsx](/C:/Users/neyma/dev/haarkult/components/ui/typography.tsx)
- [components/blocks/hero.tsx](/C:/Users/neyma/dev/haarkult/components/blocks/hero.tsx)
- [components/blocks/services-grid.tsx](/C:/Users/neyma/dev/haarkult/components/blocks/services-grid.tsx)
- [components/blocks/team-grid.tsx](/C:/Users/neyma/dev/haarkult/components/blocks/team-grid.tsx)
- [components/blocks/gallery-grid.tsx](/C:/Users/neyma/dev/haarkult/components/blocks/gallery-grid.tsx)
- [components/blocks/contact.tsx](/C:/Users/neyma/dev/haarkult/components/blocks/contact.tsx)
- [components/blocks/site-footer.tsx](/C:/Users/neyma/dev/haarkult/components/blocks/site-footer.tsx)
- [lib/home-page.ts](/C:/Users/neyma/dev/haarkult/lib/home-page.ts)
- [lib/links.ts](/C:/Users/neyma/dev/haarkult/lib/links.ts)

## Current Status

The repo is no longer just a prototype. Several foundational refactors are already done.

Already completed:

1. Site metadata and locale were centralized
2. Homepage content was split out from block implementations
3. Homepage blocks were converted to prop-driven reusable sections
4. A first shared design system pass was implemented
5. The hero now uses an actual salon image instead of a placeholder
6. Service durations are already modeled in [content/services.ts](/C:/Users/neyma/dev/haarkult/content/services.ts)

Key commits already in the repo:

- `aac998e`
  - `refactor: centralize site metadata and locale`
- `8c23166`
  - `refactor: make homepage blocks content-driven`
- `d711cd0`
  - `feat: establish shared homepage design system`

Current live code state:

- the homepage still uses contact CTAs, not a real booking flow
- CTAs currently support phone / WhatsApp / maps / Instagram, but not email as a first-class `HomeAction`
- no booking backend exists yet
- no admin area exists yet
- Instagram is still not configured in [content/site.ts](/C:/Users/neyma/dev/haarkult/content/site.ts)

## User Workflow Preference

The user explicitly wants Codex to implement changes, stage them, and commit them.

Important working style:

- do not stop at advice only
- implement the change
- keep commits small and clean
- explain changes in simple language when asked
- maintain momentum step-by-step

Best working loop:

1. understand the next architectural step
2. implement it cleanly
3. run lint/build/tests as appropriate
4. commit it with a focused message
5. explain it clearly afterward

## Important Development Rules

- German content only
- Keep content separate from reusable components
- Prefer static/server components outside booking/admin flows
- Only use `use client` when truly required
- Use Framer Motion only in carefully chosen places
- Avoid animation noise
- Keep the project cloneable for future salons
- Do not force online booking on every salon
- Do not require customer login in v1
- Preserve a clean fallback contact-only experience

## Current Commands

Useful commands:

```powershell
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

Use `npm.cmd` instead of plain `npm` in PowerShell on this machine, because PowerShell execution policy can block `npm.ps1`.

## Verified State

Verified on `2026-04-04`:

- `npm.cmd run lint` passes
- `npm.cmd run build` passes

## Booking Direction (Approved)

### Core product rule

The project now needs a real backend-powered appointment booking system.

Important:

- this is not a WhatsApp message generator
- this is not a fake CTA
- this is not a customer-account product in v1

At the same time, the builder must support salons that do not want online booking at all.

### Builder requirement: booking must be optional

Booking must be controlled by one clear salon-level config contract.

Recommended high-level shape:

```ts
type BookingMode = "contact_only" | "online_booking";

booking: {
  mode: BookingMode;
  fallbackActions: Array<"phone" | "whatsapp" | "email">;
  confirmationMode: "manual" | "instant";
  allowStylistSelection: boolean;
  leadTimeHours: number;
  maxAdvanceDays: number;
  slotStepMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
}
```

This config can start in `content/site.ts`. If it grows too large, move booking-specific parts into `content/booking.ts`.

The config must control all of the following:

- hero CTA label, priority, and destination
- whether a booking page/section renders at all
- whether booking links appear in nav/footer/contact blocks
- whether public booking APIs/routes are reachable
- whether admin booking routes are relevant for the salon
- which fallback contact methods are shown when booking is disabled

### Contact-only mode requirements

If `booking.mode === "contact_only"`:

- the website must not advertise online booking
- the public booking route should not be linked and should fail safely if accessed
- the hero and contact areas should use the configured fallback actions only
- fallback actions must support at least:
  - phone
  - WhatsApp
  - email

Current code already supports phone and WhatsApp, but email still needs to become a first-class CTA/action type.

### Online-booking mode requirements

If `booking.mode === "online_booking"`:

- the primary CTA should clearly lead into `Termin buchen`
- fallback contact options should still remain visible
- the site needs a real public booking flow backed by server-side slot validation
- the salon needs a protected admin/staff area

### V1 booking scope

Approved v1 scope:

- guest booking only
- one service per booking
- service duration is required
- optional stylist selection
- server-generated availability
- customer provides at least:
  - name
  - phone
  - email
- optional note field
- booking confirmation by email
- admin/staff login
- admin/staff can confirm, cancel, and reschedule bookings
- manual or instant confirmation must be configurable

Explicitly out of scope for v1:

- customer accounts / customer portal
- online payments
- subscriptions / memberships
- package bookings
- multi-location support
- complex resource planning beyond staff + time
- marketplace features

### Public booking flow

Recommended public flow:

1. Choose service
2. Optionally choose stylist or "any available"
3. Choose date
4. View available times
5. Enter contact details and optional note
6. Confirm booking summary
7. Show success state
8. Send confirmation email

Required UX behavior:

- all final availability validation must happen server-side
- if a slot becomes unavailable during submission, the user must get a clear retry path
- even in booking mode, contact alternatives should remain available

### Admin/staff flow

Required admin/staff capabilities:

- protected login
- view upcoming bookings
- day/week agenda view
- confirm / cancel / reschedule bookings
- create bookings manually
- define recurring weekly availability
- define blocked times / vacations / exceptions
- assign which staff can perform which services

Nice to have later, not required for v1:

- analytics
- customer history
- advanced reporting
- drag-and-drop calendar polish

### Data ownership: repo config vs database

Important builder principle:

- brochure/marketing content should stay repo-driven
- operational booking data should live in the database

Recommended split:

- repo config:
  - booking mode
  - fallback actions
  - booking copy/UI labels
  - base service definitions and marketing copy
  - which services are online-bookable
- database:
  - admin users
  - staff schedules
  - schedule exceptions / vacations
  - bookings
  - operational staff-service assignments if they need runtime editing

Service data should not become duplicated in uncontrolled ways.

Recommended v1 approach:

- keep services in [content/services.ts](/C:/Users/neyma/dev/haarkult/content/services.ts) as the marketing/source-of-truth catalog
- extend the service contract with booking-specific metadata such as:
  - `onlineBookable`
  - `staffIds` or equivalent if needed
- when persisting bookings, store service snapshots alongside the service id:
  - service title
  - duration snapshot
  - price snapshot

This protects historic bookings even if the service catalog changes later.

### Required data model

Minimum operational entities:

- `admin_users`
  - id
  - email
  - password hash or auth provider identity
  - role
  - active
- `staff`
  - id
  - name
  - slug
  - active
- `staff_services`
  - staff id
  - service id
- `weekly_availability`
  - staff id
  - weekday
  - start time
  - end time
- `availability_exceptions`
  - staff id
  - date
  - start/end
  - type such as vacation / break / blocked
- `bookings`
  - id
  - status
  - service id
  - service title snapshot
  - duration snapshot
  - price snapshot
  - staff id nullable if "any available"
  - customer name
  - customer phone
  - customer email
  - note
  - start datetime
  - end datetime
  - source
  - created at
  - updated at
- `booking_events` or audit log
  - booking id
  - event type
  - actor
  - timestamp
  - metadata

Potential optional entity:

- `booking_settings`
  - only if runtime admin-editable settings are required early

### Availability engine requirements

This is the technically critical part.

The availability engine must calculate valid slots from:

- service duration
- business rules from config
- staff weekly availability
- staff exceptions / vacations
- existing bookings
- lead time
- booking horizon
- slot step
- buffers before/after appointments
- timezone `Europe/Berlin`

Rules:

- slot calculation must happen on the server
- booking creation must re-check availability transactionally
- double booking must be prevented even under concurrent requests
- daylight saving time transitions must be handled correctly

### Backend / API requirements

Public requirements:

- get bookable services
- get eligible staff for a service
- get available dates/times for a service and optionally a staff member
- create booking
- optionally cancel booking through a signed link or token

Admin requirements:

- list bookings
- update booking status
- reschedule booking
- create manual booking
- manage staff availability and blocked times

Implementation note:

- server actions are acceptable if they stay well-structured
- route handlers are acceptable if the API surface is cleaner that way
- schema validation is required for all inputs
- rate limiting is required on public booking submission

### Notifications

Minimum notification requirements:

- confirmation email to customer
- notification email to salon/admin
- cancellation/reschedule email where applicable

Nice to have later:

- reminder emails
- SMS reminders

WhatsApp should remain a contact option, but it must not be the booking backend.

### Security, ops, and legal

Required:

- admin authentication
- server-side validation for all booking inputs
- rate limiting / abuse protection
- audit logging for admin booking changes
- secure secret management
- minimal personal-data storage
- GDPR-conscious privacy handling
- retention policy defined before going live

Do not ship booking mode without:

- conflict-safe booking creation
- admin access control
- clear cancellation behavior
- updated privacy/legal pages if personal data handling changes materially

### Suggested implementation order

Recommended order now:

1. Add booking-mode config and fallback-action contract
2. Add email as a first-class CTA/action option for contact-only mode
3. Define the booking data model and choose DB/auth/email tooling
4. Add DB schema + migrations
5. Add protected admin auth shell
6. Implement availability engine
7. Implement booking creation with conflict protection
8. Build public booking flow at a dedicated route such as `/termin-buchen`
9. Build admin booking management UI
10. Add confirmations / cancellations / rescheduling
11. QA both modes:
    - `contact_only`
    - `online_booking`

### Default assumptions unless the user overrides them

Use these defaults if future implementation work starts before new product answers are provided:

- booking mode is salon-configurable, not hardcoded
- customers book as guests
- one service per booking in v1
- email is required in booking mode
- phone is required in booking mode
- stylist selection is optional and configurable
- confirmation mode should default to `manual` for the first live version, unless the user explicitly prefers `instant`
- no payment step
- no customer dashboard

## Current Product Review

Review date: `2026-04-04`

The current site already has:

- a solid one-page structure
- real salon imagery
- a warm visual system
- clean reusable blocks
- service durations in the content model

The biggest remaining product gaps are now:

1. real booking capability or a much sharper booking CTA strategy
2. stronger trust signals such as reviews / before-after / richer team story
3. contact completeness, especially Instagram and better fallback CTA coverage including email
4. image quality and performance improvement

## Current Must-Do TODOs

1. Introduce a builder-friendly booking mode config:
   - `contact_only`
   - `online_booking`

2. Add `email` as a first-class action type alongside phone / WhatsApp / maps / Instagram.

3. Decide and implement the booking data boundary:
   - which service fields remain repo-driven
   - which operational data lives in the database

4. Design and implement the booking backend foundation:
   - DB schema
   - admin auth
   - availability engine
   - booking creation with conflict protection

5. Build the public booking flow without breaking the contact-only path.

6. Build the admin/staff booking management UI.

7. Keep improving trust and contact completeness:
   - add Instagram URL
   - add reviews / before-after / richer team copy

8. Replace and optimize images after the booking foundation is clear.

## Builder Direction

Long-term, the repo should support this workflow:

1. Copy the repository for a new salon
2. Replace content files and public assets
3. Adjust brand/SEO/contact settings
4. Choose booking mode:
   - `contact_only`
   - `online_booking`
5. If booking is enabled, provision database/auth/email and configure booking rules
6. Keep the shared block/design system mostly unchanged

Future work should optimize for:

- a stable design system
- a stable set of reusable blocks
- a clear content contract
- minimal salon-specific logic inside the engine
- a booking module that can be enabled or disabled cleanly

## What Not To Do

- Do not move toward a CMS yet
- Do not force online booking on every salon
- Do not require customer accounts in v1
- Do not add payments in the first booking iteration
- Do not let reusable blocks start importing salon content directly again
- Do not couple presentational marketing components directly to booking DB logic
- Do not fill the UI with unnecessary animation
- Do not fall back to generic default Tailwind styling
- Do not switch the project away from German-only content

## Definition Of Good Progress

A good next change in this repo should usually satisfy most of these:

- improves reuse across salons
- reduces coupling between content and engine
- keeps booking optional rather than mandatory
- improves visual polish without increasing noise
- keeps the code easy to understand
- passes lint and build
- lands in a small, focused commit

## Short Handoff Summary

If you are a new Codex agent, start here:

1. Understand that this is both a real salon site and a reusable builder
2. Preserve two valid modes:
   - `contact_only`
   - `online_booking`
3. Treat booking as the next approved major product track
4. Do not require customer login in v1
5. Add email CTA support and booking-mode config first
6. Then design the DB/auth/availability foundation before building booking UI
7. Keep the architecture prop-driven and content-driven
8. Maintain the premium, calm visual direction
9. Commit changes in small logical steps
