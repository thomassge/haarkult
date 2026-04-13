---
phase: 03
slug: public-booking-engine
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-13
---

# Phase 03 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.4 with jsdom |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm.cmd run test:unit -- tests/phase-3/availability-engine.test.ts` |
| **Full suite command** | `npm.cmd run test:unit` |
| **Estimated runtime** | ~30-90 seconds for focused files; full suite depends on accumulated phase tests |

---

## Sampling Rate

- **After every task commit:** Run the focused Phase 3 test file for the behavior touched by the task.
- **After every plan wave:** Run all Phase 3 focused tests.
- **Before `/gsd-verify-work`:** `npm.cmd run test:unit` and `npm.cmd run lint` must pass.
- **Max feedback latency:** 90 seconds for focused checks.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | BOOK-01, BOOK-02, BOOK-03 | T-03-02 | Public flow uses catalog data and validates selected service server-side. | component/unit | `npm.cmd run test:unit -- tests/phase-3/public-booking-flow.test.tsx` | No - W0 | pending |
| 03-01-02 | 01 | 1 | BOOK-04, BOOK-05 | T-03-02 | Stylist choices derive from active staff-service eligibility and never trust client-only state. | unit/component | `npm.cmd run test:unit -- tests/phase-3/stylist-eligibility.test.ts` | No - W0 | pending |
| 03-02-01 | 02 | 1 | BOOK-06, STAF-05 | T-03-01 | Slots respect schedules, exceptions, existing bookings, lead time, horizon, duration, and step rules. | unit | `npm.cmd run test:unit -- tests/phase-3/availability-engine.test.ts` | No - W0 | pending |
| 03-02-02 | 02 | 1 | BOOK-06, BOOK-08 | T-03-01 | Slot query endpoint returns only server-calculated available slots. | unit/API | `npm.cmd run test:unit -- tests/phase-3/availability-engine.test.ts` | No - W0 | pending |
| 03-03-01 | 03 | 2 | BOOK-07 | T-03-02, T-03-03 | Public submission validates required contact fields and avoids over-collection. | unit/action | `npm.cmd run test:unit -- tests/phase-3/booking-submission.test.ts` | No - W0 | pending |
| 03-03-02 | 03 | 2 | BOOK-08 | T-03-01 | Submission re-checks availability before insert and preserves user data on conflict. | unit/action | `npm.cmd run test:unit -- tests/phase-3/booking-submission.test.ts` | No - W0 | pending |

*Status: pending, green, red, flaky*

---

## Wave 0 Requirements

- [ ] `tests/phase-3/availability-engine.test.ts` - covers STAF-05 and BOOK-06.
- [ ] `tests/phase-3/stylist-eligibility.test.ts` - covers BOOK-04 and BOOK-05.
- [ ] `tests/phase-3/public-booking-flow.test.tsx` - covers BOOK-01 through BOOK-03 and setup fallback.
- [ ] `tests/phase-3/booking-submission.test.ts` - covers BOOK-07 and BOOK-08.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mobile booking flow feels calm, premium, and German-only | BOOK-01, BOOK-02, BOOK-07 | Visual quality and copy tone need human review beyond unit tests. | Run the app, open `/termin-buchen` on mobile and desktop viewports, complete service, stylist, slot, and contact steps. Confirm all user-facing copy is German and no setup/admin wording leaks. |
| Same-date conflict retry path is understandable | BOOK-08 | Automated tests can verify state preservation, but wording clarity needs product review. | Simulate a stale selected slot and confirm the selected slot is cleared, contact data remains, and the retry message is clear in German. |

---

## Threat Model References

| Ref | Threat | Required Mitigation |
|-----|--------|---------------------|
| T-03-01 | Double booking through stale or concurrent slot selection | Recompute availability server-side during submission, insert only after conflict check, and test stale slot behavior. |
| T-03-02 | Tampered service, staff, or slot identifiers from the browser | Validate all submitted IDs against catalog, active staff assignments, and server-generated slots. |
| T-03-03 | Personal data over-collection or technical information leak | Collect only name, phone, email, optional note; return German public-safe errors and fallback copy. |

---

## Validation Sign-Off

- [x] All planned behaviors have automated verify coverage or Wave 0 dependencies.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing references.
- [x] No watch-mode flags.
- [x] Feedback latency target is under 90 seconds for focused checks.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending
