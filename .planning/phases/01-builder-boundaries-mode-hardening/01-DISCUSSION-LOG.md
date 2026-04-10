# Phase 1: Builder Boundaries & Mode Hardening - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 01-builder-boundaries-mode-hardening
**Areas discussed:** Configuration boundaries, contact_only fallback behavior, fallback contact visibility, brochure versus booking boundaries

---

## Configuration boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| Keep everything in `content/site.ts` | Simplest short-term layout, but booking config keeps growing inside the salon-wide object | |
| Keep salon-wide config in `content/site.ts` and move booking-specific config into `content/booking.ts` | Clean domain split without over-fragmenting the builder config | x |
| Split brand, contact, SEO, and booking into many separate files now | Maximum separation, but more ceremony than value for the current codebase | |

**User's choice:** Approve the recommended split: keep salon-wide config in `content/site.ts` and move booking-specific config into `content/booking.ts`.
**Notes:** The user asked for the most sensible and professional structure and explicitly delegated the best-practice call here.

---

## contact_only fallback behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Friendly fallback page on `/termin-buchen` | Keep the route safe for bookmarks or direct visits and explain that the salon does not offer online booking, then show contact options | x |
| Redirect to `/` | Remove the route experience entirely and send the visitor back to the homepage | |

**User's choice:** Friendly fallback page on `/termin-buchen`.
**Notes:** The user wants copy in the spirit of: this salon does not offer online booking, but here are the available contact options.

---

## Fallback contact visibility

| Option | Description | Selected |
|--------|-------------|----------|
| Hard-hide WhatsApp in `online_booking` | Booking mode suppresses WhatsApp regardless of salon preference | |
| Salon-configured channels in both modes | The salon chooses whether phone, email, and WhatsApp appear; booking mode may still show booking only if no channels are enabled | x |
| Always show all channels in both modes | Ignore salon-level per-channel visibility choices | |

**User's choice:** Salon-configured channels in both modes.
**Notes:** The user wants the salon to decide whether phone, email, and WhatsApp appear. In booking mode, the site may show only booking or booking plus any configured fallback contacts.

---

## Brochure versus booking boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| Strict separation | Brochure pages stay brochure-only; the real booking flow lives under `/termin-buchen` and does not spread into brochure surfaces | x |
| Brochure teaser allowed | Brochure pages may preview some booking-specific content while the flow still starts elsewhere | |
| Embed real booking flow into brochure pages | The homepage or other brochure surfaces can host real booking steps directly | |

**User's choice:** Strict separation.
**Notes:** The user explicitly wants the real flow to stay under `Termin buchen`.

---

## the agent's Discretion

- Exact type shapes and helper names for the booking config split
- Exact helper boundaries used to centralize mode checks

## Deferred Ideas

None
