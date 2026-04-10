# Codebase Concerns

**Analysis Date:** 2026-04-10

## Tech Debt

**Booking route is enabled before the real booking system exists:**
- Files: `content/site.ts`, `app/termin-buchen/page.tsx`, `lib/booking/catalog.ts`, `db/schema.ts`
- Issue: `site.booking.mode` is currently set to `online_booking`, but `/termin-buchen` is still a placeholder with no slot lookup, submission, admin flow, or email confirmation
- Why: the repo has laid down the data model and UI shell first
- Impact: user expectations and implementation state can drift; the public CTA promises more than the backend currently delivers
- Fix approach: either finish the booking flow end-to-end or switch the site back to `contact_only` until the workflow is operational

**Service catalog and future operational data can drift apart:**
- Files: `content/services.ts`, `lib/booking/catalog.ts`, `db/schema.ts`
- Issue: marketing services live in repo content, while operational assignment data is modeled in the DB (`staff_services`, booking snapshots)
- Why: the builder wants repo-driven content while booking needs runtime data
- Impact: price, duration, or service availability can diverge unless one source of truth is enforced
- Fix approach: keep `content/services.ts` authoritative, seed operational relationships from those IDs, and snapshot only what must remain historical on bookings

## Known Bugs / Product Gaps

**No completed booking workflow despite booking-first UI state:**
- Symptoms: `/termin-buchen` explains an upcoming flow but cannot take a booking
- Trigger: visit `/termin-buchen` while `booking.mode === "online_booking"`
- Files: `app/termin-buchen/page.tsx`, `content/site.ts`
- Workaround: users must still rely on fallback contact channels
- Root cause: staged rollout has only delivered config, route shell, and schema groundwork

## Security Considerations

**Admin/auth surface is planned but not implemented:**
- Files: `.env.example`, `lib/booking/env.ts`, `db/schema.ts`, `CODEX_CONTEXT.md`
- Risk: the schema anticipates `admin_users`, but there is no route protection, session management, input validation, or rate limiting yet
- Current mitigation: no booking/admin API routes are live in the repo
- Recommendations: add auth, server-side validation, and rate limiting before exposing any booking mutations

**Database bootstrap eagerly reads secrets at import time:**
- Files: `db/index.ts`, `lib/booking/env.ts`
- Risk: any future accidental import from a client boundary or an env-misconfigured server context will throw immediately on module evaluation
- Current mitigation: the DB module is not imported by the public routes yet
- Recommendations: mark DB modules server-only, keep imports isolated to server code, and consider lazy initialization if build-time failures become noisy

## Performance Bottlenecks

**Marketing pages hydrate more client code than strictly necessary:**
- Files: `components/ui/reveal.tsx`, `components/blocks/services-grid.tsx`, `components/blocks/gallery-grid.tsx`
- Problem: mostly static brochure content still ships client JavaScript for reveal motion, accordion state, and gallery fallback handling
- Measurement: no committed performance traces were found
- Cause: interactive polish is currently bundled into section components rather than isolated to smaller islands
- Improvement path: keep only the genuinely interactive pieces client-side and measure the homepage bundle before adding more booking UI

**Large static image set is unoptimized at the source level:**
- Files: `public/brand/*`, `public/gallery/*`, `public/team/*`
- Problem: the repo stores multiple PNG/JPG/WebP variants directly, which can grow quickly as more salons/assets are added
- Measurement: no image budget or Lighthouse baseline is documented
- Cause: assets are manually managed in-repo without an optimization pipeline
- Improvement path: standardize source asset sizes/formats and audit the heaviest images before expanding gallery/team content

## Fragile Areas

**Booking mode branching is spread across several modules:**
- Files: `content/site.ts`, `lib/home-page.ts`, `app/page.tsx`, `app/layout.tsx`, `app/termin-buchen/page.tsx`
- Why fragile: a new CTA location or booking-related route can easily forget to respect `contact_only` vs `online_booking`
- Common failures: inconsistent CTA labels, hidden fallback actions, or links that appear in one place but not another
- Safe modification: route all action decisions through shared helpers and verify both booking modes after each change
- Test coverage: none

**Legal copy must track product changes manually:**
- Files: `content/legal.ts`, `app/datenschutz/page.tsx`, `app/impressum/page.tsx`
- Why fragile: privacy/legal text is handwritten in content files and can lag behind actual data handling as booking features are added
- Common failures: shipping new personal-data flows without updating the privacy page
- Safe modification: review legal copy whenever booking/auth/email features materially change
- Test coverage: none

## Dependencies at Risk

**Node runtime is not pinned in the repo:**
- Files: `package.json`, `README.md`
- Risk: local, CI, and hosting environments may run different Node versions even though `next@16.1.6` expects a modern runtime
- Impact: subtle build/runtime differences are harder to diagnose
- Migration plan: add an `engines` field and optionally an `.nvmrc` or `.node-version`

## Missing Critical Features

**No automated test safety net:**
- Files: `package.json`, repository-wide
- Problem: lint/build are the only automated checks
- Current workaround: manual smoke testing and careful incremental edits
- Blocks: safe evolution of booking logic, auth, availability calculations, and route branching
- Implementation complexity: Medium; start with unit tests around helpers and route-level smoke coverage

**No booking API, admin UI, or availability engine yet:**
- Files: `app/termin-buchen/page.tsx`, `lib/booking/*`, `db/*`
- Problem: the public booking page cannot progress beyond explanatory content
- Current workaround: contact actions remain the fallback
- Blocks: actual online appointment booking, confirmation flow, and admin operations
- Implementation complexity: High; this is the main product track after the current foundation

## Test Coverage Gaps

**Booking mode behavior is untested:**
- What's not tested: `contact_only` vs `online_booking` branching in `lib/home-page.ts`, `app/page.tsx`, and `app/termin-buchen/page.tsx`
- Risk: future refactors can silently break one mode while fixing the other
- Priority: High
- Difficulty to test: Low to Medium

**Database and booking foundations are untested:**
- What's not tested: `lib/booking/env.ts`, `lib/booking/catalog.ts`, `db/schema.ts`, and future DB bootstrap usage in `db/index.ts`
- Risk: regressions in env handling, schema assumptions, or booking snapshots will only surface at runtime
- Priority: High
- Difficulty to test: Medium

---
*Concerns audit: 2026-04-10*
*Update as issues are fixed or new ones are discovered*
