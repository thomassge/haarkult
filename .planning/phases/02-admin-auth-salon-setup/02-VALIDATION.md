---
phase: 02
slug: admin-auth-salon-setup
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-12
---

# Phase 02 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.4 with jsdom, React Testing Library, `@vitejs/plugin-react`, and `vite-tsconfig-paths` |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm.cmd run test:unit -- tests/phase-2/admin-auth.test.ts tests/phase-2/setup-validation.test.ts` |
| **Full suite command** | `npm.cmd run test:unit && npm.cmd run lint && npm.cmd run build` |
| **Estimated runtime** | ~90 seconds |

---

## Sampling Rate

- **After every task commit:** Run the task-specific `tests/phase-2/*.test.ts` command listed below plus `npm.cmd run lint` when UI or route files change.
- **After every plan wave:** Run `npm.cmd run test:unit && npm.cmd run lint && npm.cmd run build`.
- **Before `/gsd-verify-work`:** Full suite must be green.
- **Max feedback latency:** 120 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | ADMN-01 | T-02-01 | Wrong-password/inactive admins cannot authenticate; active admin resolves to minimal session DTO | unit | `npm.cmd run test:unit -- tests/phase-2/admin-auth.test.ts` | No - W0 | pending |
| 02-01-02 | 01 | 1 | ADMN-01 | T-02-02 | Protected admin pages and actions require authenticated active admin access | unit | `npm.cmd run test:unit -- tests/phase-2/admin-auth.test.ts` | No - W0 | pending |
| 02-02-01 | 02 | 2 | STAF-01 | T-02-03 | Staff validation rejects malformed names/slugs and preserves active-state semantics | unit | `npm.cmd run test:unit -- tests/phase-2/staff-validation.test.ts` | No - W0 | pending |
| 02-02-02 | 02 | 2 | STAF-02 | T-02-04 | Service assignment validation accepts only known bookable service IDs and supports all-services mode | unit | `npm.cmd run test:unit -- tests/phase-2/service-assignment.test.ts` | No - W0 | pending |
| 02-02-03 | 02 | 2 | ADMN-06 | T-02-05 | Setup completion is derived from active staff, service assignments, and weekly hours | unit | `npm.cmd run test:unit -- tests/phase-2/setup-completion.test.ts` | No - W0 | pending |
| 02-03-01 | 03 | 3 | STAF-03 | T-02-06 | Weekly hours reject invalid weekdays, out-of-range minutes, inverted ranges, and overlaps | unit | `npm.cmd run test:unit -- tests/phase-2/weekly-availability.test.ts` | No - W0 | pending |
| 02-03-02 | 03 | 3 | STAF-04 | T-02-07 | Exceptions support vacation, break, and blocked windows while rejecting invalid all-day/timed combinations | unit | `npm.cmd run test:unit -- tests/phase-2/availability-exceptions.test.ts` | No - W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `tests/phase-2/admin-auth.test.ts` - covers ADMN-01 auth success/failure and protection helpers.
- [ ] `tests/phase-2/setup-completion.test.ts` - covers ADMN-06 setup completeness derivation.
- [ ] `tests/phase-2/staff-validation.test.ts` - covers STAF-01 staff input rules.
- [ ] `tests/phase-2/service-assignment.test.ts` - covers STAF-02 catalog-backed service assignment rules.
- [ ] `tests/phase-2/weekly-availability.test.ts` - covers STAF-03 weekday/minute/overlap rules.
- [ ] `tests/phase-2/availability-exceptions.test.ts` - covers STAF-04 vacation/break/blocked exception rules.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| DB-backed login smoke with real `DATABASE_URL` and `AUTH_SECRET` | ADMN-01 | Current shell may not have production-like secrets or database access | Configure `.env.local`, seed one owner/admin, start the app, verify `/admin` redirects to login and then reaches the dashboard after valid login |
| Admin setup form smoke against real database writes | ADMN-06, STAF-01, STAF-02, STAF-03, STAF-04 | Unit tests can validate rules, but persistence needs a reachable Postgres database | Create one stylist, assign all services, add weekly hours, add one exception, reload admin pages, and verify saved values render |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all MISSING references.
- [x] No watch-mode flags.
- [x] Feedback latency < 120s.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved 2026-04-12
