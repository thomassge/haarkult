---
phase: 01
slug: builder-boundaries-mode-hardening
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-10
last_audited: 2026-04-12
---

# Phase 01 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4 with jsdom, React Testing Library, `@vitejs/plugin-react`, and `vite-tsconfig-paths` |
| **Config file** | `vitest.config.ts` |
| **Setup file** | `tests/setup.ts` |
| **Quick run command** | `npm.cmd run lint` |
| **Targeted phase command** | `npm.cmd run test:unit -- tests/phase-1/site-mode.test.ts tests/phase-1/content-boundaries.test.ts tests/phase-1/termin-buchen-page.test.tsx` |
| **Full suite command** | `npm.cmd run lint; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; npm.cmd run test:unit; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; npm.cmd run build` |
| **Estimated runtime** | ~90 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm.cmd run lint`
- **After every plan wave:** Run the mapped task test command plus `npm.cmd run lint`; run `npm.cmd run build` for route/layout boundary changes
- **Before `/gsd-verify-work`:** Full suite must be green, plus manual smoke of `/`, `/termin-buchen`, and `/admin` where applicable
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | BUIL-01 | T-01-01 | Brochure surfaces derive booking/contact visibility from shared selectors instead of route-local branching. | unit | `npm.cmd run test:unit -- tests/phase-1/site-mode.test.ts` | yes | green |
| 01-01-02 | 01 | 1 | BUIL-02 | T-01-02 | Moving booking-domain config out of `content/site.ts` does not require changes to brochure blocks beyond prop-safe helper consumption. | unit/integration | `npm.cmd run test:unit -- tests/phase-1/content-boundaries.test.ts` | yes | green |
| 01-02-01 | 02 | 2 | MODE-01 | T-01-03 | `contact_only` hides booking entry points on brochure surfaces and exposes only configured contact channels. | unit | `npm.cmd run test:unit -- tests/phase-1/site-mode.test.ts` | yes | green |
| 01-02-02 | 02 | 2 | MODE-02 | T-01-03 | Booking mode exposes `/termin-buchen` while preserving salon-configured fallback contact visibility. | unit | `npm.cmd run test:unit -- tests/phase-1/site-mode.test.ts` | yes | green |
| 01-02-03 | 02 | 2 | MODE-03 | T-01-03 | Direct visits to `/termin-buchen` in `contact_only` render the friendly fallback page and not a working booking flow. | component/integration | `npm.cmd run test:unit -- tests/phase-1/termin-buchen-page.test.tsx` | yes | green |
| 01-03-01 | 03 | 3 | BUIL-02 | T-01-02 | Brochure code does not import booking/admin internals and secondary navigation uses the same resolved state as primary brochure surfaces. | unit/integration | `npm.cmd run test:unit -- tests/phase-1/content-boundaries.test.ts` | yes | green |
| 01-03-02 | 03 | 3 | BUIL-01, BUIL-02 | T-01-07, T-01-09 | Layout/footer consume shared public action state and brochure files stay free of booking-engine/database imports. | unit/integration | `npm.cmd run test:unit -- tests/phase-1/content-boundaries.test.ts` | yes | green |
| 01-04-01 | 04 | 4 | MODE-03 | T-01-10 | Static contact-only fallback step copy cannot advertise hidden contact channels. | component/integration | `npm.cmd run test:unit -- tests/phase-1/termin-buchen-page.test.tsx` | yes | green |
| 01-04-02 | 04 | 4 | MODE-03 | T-01-12 | A config-mutation regression proves `fallbackActions: ["phone"]` keeps WhatsApp and E-Mail absent from the rendered fallback page. | component/integration | `npm.cmd run test:unit -- tests/phase-1/termin-buchen-page.test.tsx` | yes | green |

*Status: pending | green | red | flaky*

---

## Wave 0 Requirements

- [x] `vitest.config.ts` - fast unit harness for selector and route-surface regression checks
- [x] `tests/setup.ts` - shared jsdom and Testing Library setup
- [x] `tests/phase-1/site-mode.test.ts` - covers BUIL-01, MODE-01, and MODE-02
- [x] `tests/phase-1/content-boundaries.test.ts` - covers BUIL-02 and brochure/booking boundary regressions
- [x] `tests/phase-1/termin-buchen-page.test.tsx` - covers MODE-03 fallback rendering and hidden-channel drift
- [x] `package.json` `test:unit` script - consistent task and wave verification entry point

---

## Requirement Coverage

| Requirement | Status | Automated Evidence |
|-------------|--------|--------------------|
| BUIL-01 | COVERED | `tests/phase-1/site-mode.test.ts`; `tests/phase-1/content-boundaries.test.ts` |
| BUIL-02 | COVERED | `tests/phase-1/content-boundaries.test.ts` |
| MODE-01 | COVERED | `tests/phase-1/site-mode.test.ts` |
| MODE-02 | COVERED | `tests/phase-1/site-mode.test.ts` |
| MODE-03 | COVERED | `tests/phase-1/termin-buchen-page.test.tsx` |

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Browser smoke for `/`, `/termin-buchen`, and `/admin` | Residual UX smoke only; no uncovered requirement | Automated tests cover the mode contract, but they do not replace visual/browser sanity checks | Run the app and inspect the public pages once after major UI/layout changes |

---

## Validation Audit 2026-04-12

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |
| Covered requirements | 5 |
| Automated test files | 3 |

Audit notes:

- Existing `01-VALIDATION.md` was stale: it still described Wave 0 as pending even though the test harness and Phase 1 tests exist.
- `MODE-03` is covered by the Plan 04 hidden-channel regression in `tests/phase-1/termin-buchen-page.test.tsx`.
- One sandboxed Vitest invocation failed with `spawn EPERM`; the same command passed outside the sandbox.

---

## Validation Sign-Off

- [x] All tasks have automated verification or completed Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all original missing references
- [x] No watch-mode flags
- [x] Feedback latency < 120s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** validated
