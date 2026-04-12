---
phase: 01-builder-boundaries-mode-hardening
verified: 2026-04-12T13:49:00.156Z
status: passed
score: 7/7 must-haves verified
overrides_applied: 0
gaps: []
refresh_reason: "Post-Plan-04 documentation refresh: the previous report still described the MODE-03 hidden-channel gap that Plan 04 fixed."
---

# Phase 1: Builder Boundaries & Mode Hardening Verification Report

**Phase Goal:** Protect the reusable salon builder architecture before booking and admin complexity grow
**Verified:** 2026-04-12T13:49:00.156Z
**Status:** passed
**Re-verification:** Yes - refreshed after Plan 04 closed the MODE-03 hidden-channel gap

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Maintainer can swap salon content/config and assets without rewriting shared brochure components | VERIFIED | `content/site.ts` is salon-wide only, `content/booking.ts` owns booking config and copy, and brochure routes still compose shared blocks from props rather than importing booking internals. |
| 2 | A maintainer can switch between `contact_only` and `booking` from one booking-domain config module, and brochure code consumes one shared selector contract | VERIFIED | `content/booking.ts` defines `bookingModes = ["contact_only", "booking"]`; `lib/site-mode.ts` exports shared booking visibility, entry href, visible contact, presentation-state, and public-action selectors. |
| 3 | `contact_only` brochure surfaces do not expose a working booking CTA | VERIFIED | `app/page.tsx` only prepends the booking action when shared presentation state provides a booking entry href; `tests/phase-1/site-mode.test.ts` covers the `contact_only` branch. |
| 4 | `booking` mode exposes `/termin-buchen` while preserving configured fallback contact options | VERIFIED | Homepage and footer action visibility derive from `getBookingPresentationState()` and `resolvePublicSiteActions()`; selector tests cover booking-mode contact preservation. |
| 5 | Direct visits to `/termin-buchen` in `contact_only` render a fully config-driven fallback page with configured contact channels instead of a working booking flow | VERIFIED | Plan 04 replaced the static channel-specific fallback step with channel-agnostic copy in `content/booking.ts`; `app/termin-buchen/_lib/booking-entry-content.ts` derives named channels from `visibleContactKinds`; `tests/phase-1/termin-buchen-page.test.tsx` mocks `fallbackActions: ["phone"]` and asserts WhatsApp and E-Mail stay absent. |
| 6 | Booking entry and admin boundaries are explicit and separate from brochure-only components | VERIFIED | `/termin-buchen` is a thin route over route-local `_components` and `_lib` modules; `/admin` is isolated under `app/admin/*` with its own shell. |
| 7 | Brochure layout/footer and brochure entrypoints use shared public-action rules and stay free of booking-engine/database imports | VERIFIED | `app/layout.tsx` resolves footer actions through `resolvePublicSiteActions(site, booking)`, `SiteFooter` renders passed `publicActions`, and `tests/phase-1/content-boundaries.test.ts` guards `@/lib/booking` and `@/db` leakage. |

**Score:** 7/7 truths verified

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `content/booking.ts` | Booking-domain config, copy, canonical mode vocabulary | VERIFIED | Exists, substantive, and consumed by route/layout/selector code. |
| `content/site.ts` | Salon-wide brand, contact, hours, socials, SEO only | VERIFIED | Exists, substantive, and no booking-rule fields remain. |
| `lib/site-mode.ts` | Brochure-safe mode and public-action selectors | VERIFIED | Exists, substantive, imported by brochure/layout/booking code. |
| `vitest.config.ts` | Phase 1 unit harness | VERIFIED | Exists and is used by `npm.cmd run test:unit`. |
| `tests/phase-1/site-mode.test.ts` | Selector coverage for both modes | VERIFIED | Exists and covers `contact_only`, `booking`, and contact-channel filtering. |
| `tests/phase-1/termin-buchen-page.test.tsx` | `/termin-buchen` fallback coverage | VERIFIED | Exists and now includes the hidden-channel regression from Plan 04. |
| `app/termin-buchen/page.tsx` | Mode-aware booking entry/fallback route | VERIFIED | Thin route composition using route-local modules. |
| `app/termin-buchen/_components/booking-entry-shell.tsx` | Non-routable booking-entry presentation component | VERIFIED | Exists, substantive, and used by the route. |
| `app/admin/page.tsx` | Explicit admin boundary placeholder | VERIFIED | Exists, substantive for Phase 1, and isolated from brochure imports. |
| `tests/phase-1/content-boundaries.test.ts` | Brochure/booking separation regression checks | VERIFIED | Exists, substantive, and guards import boundaries plus shared footer/layout selector usage. |

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `content/booking.ts` | `lib/site-mode.ts` | typed booking config imports | WIRED | `lib/site-mode.ts` imports `booking` and `BookingConfig` from `@/content/booking`. |
| `lib/site-mode.ts` | `lib/home-page.ts` | shared selector consumption | WIRED | `lib/home-page.ts` imports `getBookingPresentationState` and uses it in `resolvePageActions()`. |
| `app/page.tsx` | `lib/site-mode.ts` | shared booking CTA resolution | WIRED | `app/page.tsx` gates the booking action from shared presentation state. |
| `app/termin-buchen/page.tsx` | `app/termin-buchen/_lib/booking-entry-content.ts` | route-local content assembly | WIRED | The route delegates copy, subtitle, and action assembly to a non-routable route-local helper. |
| `app/termin-buchen/_lib/booking-entry-content.ts` | `content/booking.ts` and `lib/site-mode.ts` | fallback copy and visible channels | WIRED | The helper combines booking copy with selector-derived `visibleContactKinds`. |
| `app/layout.tsx` | `lib/site-mode.ts` | shared footer action resolution | WIRED | Layout resolves footer actions through `resolvePublicSiteActions(site, booking)`. |
| `components/blocks/site-footer.tsx` | `app/layout.tsx` | resolved public-action props | WIRED | Footer only renders `publicActions` passed from layout. |
| `tests/phase-1/content-boundaries.test.ts` | brochure entrypoints | import-boundary assertions | WIRED | Test reads brochure sources and asserts no `@/lib/booking` or `@/db` imports. |

## Data-Flow Trace

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `app/page.tsx` | `presentationState.bookingEntryHref` | `getBookingPresentationState()` -> `getBookingEntryHref()` -> `content/booking.ts` mode/entry config | Yes, from current booking config | FLOWING |
| `app/layout.tsx` | `publicActions` | `resolvePublicSiteActions()` -> `visibleContactKinds` + `site.contact` | Yes, from current site and booking config | FLOWING |
| `app/termin-buchen/_lib/booking-entry-content.ts` | `subtitle` | `visibleContactKinds` -> label map -> `formatInlineList()` | Yes, selector-driven | FLOWING |
| `content/booking.ts` | `contactOnly.steps` | Static booking copy | Yes, channel-agnostic after Plan 04 | SAFE |

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Phase 1 selector, route, and boundary tests run | `npm.cmd run test:unit -- tests/phase-1/site-mode.test.ts tests/phase-1/content-boundaries.test.ts tests/phase-1/termin-buchen-page.test.tsx` | 3 files passed, 7 tests passed | PASS |
| Contact-only fallback copy no longer contains the old hardcoded channel sentence | `rg -n 'Terminwunsch telefonisch, per WhatsApp oder per E-Mail senden' content/booking.ts` | No matches | PASS |
| Contact-only fallback has channel-agnostic step copy | `rg -n 'Terminwunsch ueber einen der verfuegbaren Kontaktwege senden' content/booking.ts` | 1 match | PASS |
| Hidden channel regression exists | `rg -n 'fallbackActions: \\["phone"\\]|queryByText\\(/WhatsApp/i\\)|queryByText\\(/E-Mail/i\\)' tests/phase-1/termin-buchen-page.test.tsx` | Matches found | PASS |

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| `BUIL-01` | `01-01`, `01-03` | Maintainer can create a new salon website by replacing structured salon content/config without rewriting shared brochure components | SATISFIED | Salon-wide data remains in `content/site.ts`; brochure entrypoints consume shared config/selectors and shared blocks. |
| `BUIL-02` | `01-01`, `01-03` | Maintainer can replace salon-specific brand and media assets without editing shared booking/admin logic | SATISFIED | Brand/media live in `content/site.ts`; booking/admin boundaries are isolated under `content/booking.ts`, `app/termin-buchen/*`, and `app/admin/*`. |
| `MODE-01` | `01-01`, `01-02` | Maintainer can configure a salon website to run in `contact_only` mode | SATISFIED | Canonical mode vocabulary exists in `content/booking.ts`, selectors support `contact_only`, and tests cover the branch. |
| `MODE-02` | `01-01`, `01-02` | Maintainer can configure a salon website to run in `booking` mode | SATISFIED | `booking` is the canonical literal in config and selectors; homepage/layout honor it via shared selector output. |
| `MODE-03` | `01-02`, `01-04` | Visitor in `contact_only` mode sees contact paths and does not get a working public booking flow | SATISFIED | `/termin-buchen` in `contact_only` renders selector-derived contact actions and channel-agnostic fallback steps; the Plan 04 regression proves hidden WhatsApp and E-Mail channels stay absent when `fallbackActions` is `["phone"]`. |

## Anti-Patterns Found

None in the current Phase 1 scope.

## Gaps Summary

No current Phase 1 blockers remain. The previous MODE-03 gap was closed by Plan 04:

- `content/booking.ts` no longer contains the old hardcoded fallback sentence that named WhatsApp and E-Mail.
- `tests/phase-1/termin-buchen-page.test.tsx` now mutates booking config with `fallbackActions: ["phone"]` and asserts hidden WhatsApp and E-Mail text and links are absent.
- `01-VALIDATION.md` marks the phase Nyquist-compliant.

Deferred work remains intentionally outside Phase 1:

- `/admin` is only a boundary placeholder until Phase 2 adds auth and setup operations.
- Real public booking, availability, stylist selection, and booking submission begin in later phases.

---

_Verified: 2026-04-12T13:49:00.156Z_
_Verifier: Codex (documentation refresh after Plan 04)_
