# Codex Project Context

This file is the handoff and working brief for future Codex agents working on this repository.

The goal is that a new agent can read this file and continue the project without needing the earlier chat context.

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

## Scope Decisions

Current product decisions:

- No CMS for now
- Content is maintained directly in the repo
- Language is German only
- MVP contact methods are:
  - `tel:`
  - WhatsApp link
  - optional inquiry form later if needed
- Full booking is explicitly postponed until the website builder is stable

Booking later can be:

- self-hosted open source booking
- custom booking flow

But not yet.

## Technical Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion only for specific places, not everywhere

Important:

- Use `use client` only when interaction or animation actually requires it
- Keep most of the app server-rendered/static where possible

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

Preferred structure:

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

## Current Status

The repo is no longer just a prototype. Several foundational refactors are already done.

### Already completed

1. Site metadata and locale were centralized
2. Homepage content was split out from block implementations
3. Homepage blocks were converted to prop-driven reusable sections
4. A first shared design system pass was implemented
5. The hero now uses an actual salon image instead of a placeholder

### Key commits already in the repo

- `aac998e`
  - `refactor: centralize site metadata and locale`
- `8c23166`
  - `refactor: make homepage blocks content-driven`
- `d711cd0`
  - `feat: establish shared homepage design system`

### What these commits changed

`aac998e`

- Moved salon identity/config into a more builder-friendly shape in `content/site.ts`
- Added grouped sections like `brand`, `contact`, `hours`, `socials`, `seo`
- Replaced default metadata in `app/layout.tsx`
- Set `<html lang="de">`

`8c23166`

- Added `content/home.ts` for homepage copy and CTA labels
- Added reusable `Hero` block
- Changed homepage composition so `app/page.tsx` imports content and passes props to blocks
- Removed temporary builder placeholder section from the homepage

`d711cd0`

- Added real shared UI primitives
- Introduced a warmer visual system and better surfaces/shadows
- Reworked blocks to use shared UI components

## Current Design Intent

The current visual direction is:

- warm light background instead of plain white
- premium neutral palette
- soft glass/surface cards
- strong headline scale
- restrained buttons and section rhythm

This should continue to evolve, but do not revert to generic create-next-app styling or default "flat Tailwind demo" aesthetics.

## User Workflow Preference

The user explicitly wants Codex to implement changes, stage them, and commit them.

Important working style:

- do not stop at advice only
- implement the change
- keep commits small and clean
- explain changes in simple language when asked
- maintain momentum step-by-step

The user originally described a workflow where architecture is explained first and then implemented step-by-step. In practice, they later clarified that they want the agent to actually make the changes and commit them.

So the best way to work is:

1. understand the next architectural step
2. implement it cleanly
3. run lint/build
4. commit it with a focused message
5. explain it clearly afterward

## Important Development Rules

- German content only
- No CMS
- No booking system yet beyond contact CTAs
- Keep content separate from reusable components
- Prefer static/server components
- Only use `use client` when truly required
- Use Framer Motion later only in carefully chosen places
- Avoid animation noise
- Keep the project cloneable for future salons

## Current Commands

Useful commands:

```powershell
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

Use `npm.cmd` instead of plain `npm` in PowerShell on this machine, because PowerShell execution policy can block `npm.ps1`.

## Verified State

At the time this file was written:

- `npm.cmd run lint` passes
- `npm.cmd run build` passes

## Current Product Review

Review date: `2026-04-04`

The current site already has a solid one-page structure, real salon imagery, a warm visual system, and clean reusable blocks. It is not yet at the point where it clearly maximizes trust and appointment conversion within the first 30 seconds.

Important context update:

- the earlier button focus and `BodyText` override review items appear resolved in the current codebase
- the main blockers are now product-level gaps around booking clarity, trust signals, contact completeness, and image/performance quality

### Salon Criteria Assessment

1. Great first impression right away: partially implemented

- already present:
  - warm premium visual system
  - strong spacing and low clutter
  - real hero image and real salon branding
- still missing:
  - sharper salon value proposition in the hero
  - stronger immediate booking cue
  - higher-quality image set for a more premium first impression

2. Mobile first: partially implemented

- already present:
  - responsive section layout
  - mobile-friendly stacked buttons
  - image sizing via `next/image`
- still missing:
  - explicit mobile QA on real devices
  - a persistent or very obvious mobile booking CTA
  - validation that the first screen feels conversion-focused on phones

3. Booking an appointment without friction: not implemented well enough

- current state:
  - the hero exposes `Anrufen` and `WhatsApp`
  - there is no explicit `Termin buchen` or `Termin anfragen` primary CTA
  - booking is still framed as generic contact rather than the main user outcome
- priority:
  - highest

4. Clearly display prices and services: partially implemented

- already present:
  - concrete service list in [content/services.ts](/C:/Users/neyma/dev/haarkult/content/services.ts)
  - prices and short descriptions are already modeled
- still missing:
  - rough duration per service
  - quicker scanability without requiring so many taps
  - stronger visibility for the most booked services

5. Build trust: partially implemented

- already present:
  - real salon photos in [public/gallery](/C:/Users/neyma/dev/haarkult/public/gallery)
  - real team photos in [public/team](/C:/Users/neyma/dev/haarkult/public/team)
  - friendly and concise copy
- still missing:
  - reviews or testimonials
  - before-and-after results
  - richer salon/team credibility copy

6. Personality over generic: partially implemented

- already present:
  - warmer and calmer design direction than a default template
- still missing:
  - a more explicit brand identity decision
  - more distinctive hero copy
  - stronger visual/editorial cues that make this salon feel memorable rather than just clean

7. Contact information should be easy to find: partially implemented

- already present:
  - address, opening hours, phone, WhatsApp, and maps link
  - contact block at the end of the page
- still missing:
  - Instagram is not configured yet in [content/site.ts](/C:/Users/neyma/dev/haarkult/content/site.ts)
  - no persistent quick-access layer for mobile users

8. Keep text brief, but make it count: mostly implemented

- already present:
  - concise section copy
  - compact descriptions instead of long text blocks
- still missing:
  - more persuasive and more characteristic top-level messaging

9. Speed: partially implemented

- already present:
  - static Next.js output
  - successful production build
  - image rendering via `next/image`
- still missing:
  - image optimization work
  - mobile-focused performance validation
- evidence:
  - the current hero image in [public/brand/haarkult-titelbild.png](/C:/Users/neyma/dev/haarkult/public/brand/haarkult-titelbild.png) is `640x1120` at about `960 KB`
  - several gallery images are small PNG assets, which limits both perceived quality and optimization headroom

10. Integrate Instagram sensibly: not implemented

- current state:
  - Instagram is supported by the CTA system
  - the actual profile URL is not configured, so the CTA does not render

11. Good photos instead of stock photos: mostly implemented, but quality needs improvement

- already present:
  - the site uses real salon/team/gallery assets instead of stock imagery
- still missing:
  - more premium source images
  - more result-focused photography, not just interior shots

12. Clear structure: mostly implemented

- already present:
  - the page already follows a good salon order:
    hero, services, team, gallery, contact
  - the structure is simple and low-clutter
- still missing:
  - explicit wayfinding or anchor navigation
  - a dedicated booking entry point in the structure itself

### Current Must-Do TODOs

1. Make booking the unmistakable primary action.

- update [content/home.ts](/C:/Users/neyma/dev/haarkult/content/home.ts) so the hero uses a primary `Termin buchen` or `Termin anfragen` CTA
- repeat that booking action later on the page
- consider a sticky mobile CTA if the first fold still feels too passive

2. Add duration metadata to services and render it in the UI.

- extend [content/services.ts](/C:/Users/neyma/dev/haarkult/content/services.ts) with rough timing per service
- show duration next to price in [services-grid.tsx](/C:/Users/neyma/dev/haarkult/components/blocks/services-grid.tsx)

3. Reduce service discovery friction.

- rework the all-accordion presentation in [services-grid.tsx](/C:/Users/neyma/dev/haarkult/components/blocks/services-grid.tsx)
- expose the most booked services faster, especially on mobile

4. Add stronger trust signals.

- add reviews or testimonials as structured content
- add before-and-after results
- strengthen the salon/team story beyond role labels in [content/team.ts](/C:/Users/neyma/dev/haarkult/content/team.ts)

5. Complete the contact layer.

- add the real Instagram URL in [content/site.ts](/C:/Users/neyma/dev/haarkult/content/site.ts)
- consider surfacing key contact details more persistently on mobile

6. Upgrade photography quality.

- replace low-resolution gallery/team assets in [public/gallery](/C:/Users/neyma/dev/haarkult/public/gallery) and [public/team](/C:/Users/neyma/dev/haarkult/public/team)
- ensure the hero image is strong enough for premium positioning

7. Optimize image performance.

- convert oversized PNG assets where appropriate
- reduce transfer size of the hero image in [public/brand](/C:/Users/neyma/dev/haarkult/public/brand)
- run a real mobile performance check after asset changes

8. Run real mobile QA.

- verify first-screen clarity, thumb reach, CTA visibility, scroll stability, and overall loading feel on an actual phone

9. Sharpen brand personality.

- decide the intended identity more explicitly:
  elegant, modern, family-friendly, urban, luxurious, or similar
- align hero copy, typography choices, and image art direction to that decision

10. Add clearer wayfinding.

- consider section anchors or a simple top-level navigation so users can jump straight to services, team, gallery, contact, and booking

## Suggested Next Steps

Recommended order now:

1. Redesign the booking CTA flow
2. Add service durations and improve scanability
3. Add trust content: reviews, before/after, stronger salon/team copy
4. Complete Instagram/contact visibility
5. Replace and optimize images
6. Run real mobile QA
7. Add lightweight wayfinding if still needed

## Builder Direction

Long-term, the repo should support this workflow:

1. Copy the repository for a new salon
2. Replace content files and public assets
3. Adjust brand/SEO/contact settings
4. Keep the shared block/design system mostly unchanged

That means future work should optimize for:

- a stable design system
- a stable set of reusable blocks
- a clear content contract
- minimal salon-specific logic inside the engine

## What Not To Do

- Do not move toward a CMS yet
- Do not introduce complex booking flows yet
- Do not let reusable blocks start importing salon content directly again
- Do not fill the UI with unnecessary animation
- Do not fall back to generic default Tailwind styling
- Do not switch the project away from German-only content

## Definition Of Good Progress

A good next change in this repo should usually satisfy most of these:

- improves reuse across salons
- reduces coupling between content and engine
- improves visual polish without increasing noise
- keeps the code easy to understand
- passes lint and build
- lands in a small, focused commit

## Short Handoff Summary

If you are a new Codex agent, start here:

1. Read the current product review and must-do TODOs in this file
2. Prioritize booking clarity, trust signals, and contact completeness first
3. Keep the architecture prop-driven and content-driven
4. Maintain the premium, calm visual direction
5. Commit changes in small logical steps
