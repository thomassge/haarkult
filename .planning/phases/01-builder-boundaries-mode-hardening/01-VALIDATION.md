---
phase: 01
slug: builder-boundaries-mode-hardening
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 01 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Current: none committed. Wave 0 installs `vitest`, `@testing-library/react`, `jsdom`, `@vitejs/plugin-react`, and `vite-tsconfig-paths`. |
| **Config file** | `vitest.config.ts` (Wave 0) |
| **Quick run command** | `npm.cmd run lint` |
| **Full suite command** | `npm.cmd run lint && npm.cmd run build` until Wave 0 lands, then extend to `npm.cmd run lint && npm.cmd run test:unit && npm.cmd run build` |
| **Estimated runtime** | ~90 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm.cmd run lint`
- **After every plan wave:** Run `npm.cmd run lint && npm.cmd run build`
- **Before `/gsd-verify-work`:** Full suite must be green, plus manual smoke of `/` and `/termin-buchen` in both `contact_only` and `online_booking`
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | BUIL-01 | T-01-01 | Brochure surfaces derive booking/contact visibility from shared selectors instead of route-local branching. | unit | `npm.cmd run test:unit -- tests/phase-1/site-mode.test.ts` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | BUIL-02 | T-01-02 | Moving booking-domain config out of `content/site.ts` does not require changes to brochure blocks beyond prop-safe helper consumption. | unit/integration | `npm.cmd run test:unit -- tests/phase-1/content-boundaries.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 2 | MODE-01 | T-01-03 | `contact_only` hides booking entry points on brochure surfaces and exposes only configured contact channels. | unit | `npm.cmd run test:unit -- tests/phase-1/site-mode.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 2 | MODE-02 | T-01-03 | Booking mode exposes `/termin-buchen` while preserving salon-configured fallback contact visibility. | unit | `npm.cmd run test:unit -- tests/phase-1/site-mode.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 2 | MODE-03 | T-01-03 | Direct visits to `/termin-buchen` in `contact_only` render the friendly fallback page and not a working booking flow. | component/integration | `npm.cmd run test:unit -- tests/phase-1/termin-buchen-page.test.tsx` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 3 | BUIL-02 | T-01-02 | Brochure code does not import booking/admin internals and secondary navigation uses the same resolved state as primary brochure surfaces. | unit/integration | `npm.cmd run test:unit -- tests/phase-1/content-boundaries.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` - establish a fast unit harness for selector and route-surface regression checks
- [ ] `tests/setup.ts` - shared jsdom and Testing Library setup
- [ ] `tests/phase-1/site-mode.test.ts` - covers BUIL-01, MODE-01, and MODE-02
- [ ] `tests/phase-1/content-boundaries.test.ts` - covers BUIL-02 and brochure/booking boundary regressions
- [ ] `tests/phase-1/termin-buchen-page.test.tsx` - covers MODE-03 fallback rendering
- [ ] `package.json` `test:unit` script - consistent task and wave verification entry point

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Homepage and footer respect the same visible contact actions in both modes | BUIL-01, MODE-01, MODE-02 | No committed browser test harness exists before Wave 0 | Toggle salon config between `contact_only` and `online_booking`, run the app, inspect `/` and confirm hero/contact/footer actions match the configured visible channels |
| `/termin-buchen` shows the friendly non-booking fallback in `contact_only` and the booking-entry copy in booking mode | MODE-03, MODE-02 | Route-level behavior is only manually smoke-testable until Wave 0 tests are added | Run the app in each mode, open `/termin-buchen`, and confirm the copy and actions reflect the configured mode and visible contact channels |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
