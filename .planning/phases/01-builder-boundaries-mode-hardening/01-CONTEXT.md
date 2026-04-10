# Phase 1: Builder Boundaries & Mode Hardening - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 protects the reusable salon builder architecture before booking and admin complexity grow. The phase covers salon config boundaries, public mode gating, and the separation between brochure surfaces and booking or admin modules. It does not add the real booking flow or admin features yet.

</domain>

<decisions>
## Implementation Decisions

### Configuration boundaries
- **D-01:** `content/site.ts` remains the primary salon-level config for brand, contact, opening hours, socials, and SEO.
- **D-02:** Booking-specific rules, fallback contact visibility, and booking-specific copy move into a dedicated `content/booking.ts` instead of continuing to grow inside `content/site.ts`.
- **D-03:** Phase 1 should not split the salon config into many tiny files such as `brand.ts`, `contact.ts`, or `seo.ts`; only the booking domain earns its own config module now.

### Mode gating and fallback behavior
- **D-04:** In `contact_only`, the site must not advertise a working online booking flow.
- **D-05:** Direct visits to `/termin-buchen` in `contact_only` should render a friendly fallback page that explains online booking is unavailable for this salon and shows the enabled contact options, rather than redirecting away.
- **D-06:** Contact channel visibility is salon-configurable in both modes. The salon decides whether phone, email, and WhatsApp are shown, and that shared config drives rendering consistently across brochure and booking entry surfaces.
- **D-07:** In `online_booking`, the salon may choose booking only or booking plus any configured fallback contact channels. No contact channel should be hard-hidden purely because booking mode is enabled.

### Brochure vs booking boundaries
- **D-08:** Brochure pages may expose simple navigation entry points to booking, but they must not host real booking flow steps, booking state, or server-backed booking interactions.
- **D-09:** The real public booking flow stays under `app/termin-buchen/*`, admin stays under `app/admin/*`, and operational logic stays under `lib/booking/*` plus `db/*`.
- **D-10:** Phase 1 should replace scattered one-off mode checks with shared mode-aware helpers so new brochure surfaces cannot accidentally drift from the configured salon mode.

### the agent's Discretion
- Exact type names and object shape for `content/booking.ts`
- Exact helper layout for centralizing mode-aware route and CTA decisions
- Whether the booking entry link is resolved through one helper or a small set of shared helpers

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and phase contract
- `.planning/ROADMAP.md` - Phase 1 goal, success criteria, and plan split
- `.planning/REQUIREMENTS.md` - BUIL-01, BUIL-02, MODE-01, MODE-02, and MODE-03 requirements
- `.planning/PROJECT.md` - salon-first scope, builder constraints, and the two-mode product contract

### Builder and booking architecture guidance
- `CODEX_CONTEXT.md` - current builder direction, optional booking model, and preferred brochure versus booking boundaries

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/home-page.ts` - already resolves shared CTAs and is the strongest place to centralize mode-aware booking entry and fallback contact decisions
- `app/termin-buchen/page.tsx` - existing mode-aware shell can become the canonical `contact_only` fallback surface and later the booking flow host
- `content/site.ts` and `content/home.ts` - already hold typed, repo-driven salon config and CTA definitions without coupling blocks to booking internals
- `app/page.tsx` and `components/blocks/site-footer.tsx` - brochure surfaces already consume derived props rather than direct booking logic

### Established Patterns
- Brochure UI is content-driven and prop-driven; routes compose blocks from `content/*`
- Booking-specific helpers are expected to live under `lib/booking/*`, while DB-backed operational code lives under `db/*`
- Mode gating is currently spread across `app/layout.tsx`, `app/page.tsx`, `app/termin-buchen/page.tsx`, and `lib/home-page.ts`; Phase 1 should centralize that branching instead of adding more duplicate checks

### Integration Points
- `app/page.tsx` needs a shared source of truth for whether a booking entry appears on brochure surfaces
- `app/layout.tsx` and `components/blocks/site-footer.tsx` need the same shared decision for footer-level booking visibility
- `app/termin-buchen/page.tsx` is the stable public entry point that should reflect both `contact_only` and `online_booking` safely
- Future `app/admin/*` routes should remain separate from brochure rendering and follow the same config boundary

</code_context>

<specifics>
## Specific Ideas

- In `contact_only`, the `/termin-buchen` page should explain that this salon does not offer online booking and then show the configured contact paths.
- The user explicitly prefers the real booking flow to remain under `Termin buchen` instead of creeping into brochure pages.
- The user prefers the simplest professional config split rather than over-fragmenting salon config files early.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 01-builder-boundaries-mode-hardening*
*Context gathered: 2026-04-10*
