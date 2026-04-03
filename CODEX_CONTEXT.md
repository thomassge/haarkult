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

## Known Open Issues

There is already review feedback that must be addressed next.

### Review issue 1

Dark mode button focus state is not visible enough.

Affected file:

- [button.tsx](/C:/Users/neyma/dev/haarkult/components/ui/button.tsx)

Problem:

- the current custom focus ring becomes too weak in dark mode
- keyboard users may not be able to clearly see which button is focused

Required fix:

- provide a clearly visible light/dark-appropriate focus ring before removing the native outline

### Review issue 2

`BodyText` color overrides do not work as intended.

Affected file:

- [typography.tsx](/C:/Users/neyma/dev/haarkult/components/ui/typography.tsx)

Problem:

- `BodyText` hard-codes a text color
- callers try to override the color via `className`
- the built-in class wins, so the shared primitive is less reusable than intended

Required fix:

- make color overrides predictable
- either remove default color from `BodyText`, or restructure the class order/API so caller intent can win

These two issues should be fixed before moving further into new visual or feature work.

## Suggested Next Steps

Recommended order:

1. Fix the two review findings
2. Re-run lint and build
3. Commit that fix cleanly
4. Continue turning the homepage into a true builder system

After the review fixes, the next meaningful product steps are:

### Step A: make sections configurable/optional

Goal:

- allow a salon to enable or disable sections without editing component internals

Possible direction:

- add section flags and ordering in `content/home.ts` or a dedicated page config

### Step B: improve the content contract

Goal:

- make it easier to swap salons by changing only content and assets

Possible additions:

- optional logo path
- hero image path
- optional Instagram URL
- optional CTA variants
- optional testimonials or featured services later

### Step C: add selective motion

Goal:

- introduce a little more premium polish without making the site feel noisy

Rules:

- use Framer Motion selectively
- good candidates:
  - hero image entrance
  - section reveal
  - card stagger on scroll
- avoid:
  - animating everything
  - repeated decorative motion
  - generic "AI-looking" UI movement

### Step D: template hygiene

Still worth checking later:

- README is still likely too generic and should become project-specific
- repo onboarding should eventually explain how to clone this for a new salon

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

1. Read the review issues in this file
2. Fix those first
3. Keep the architecture prop-driven and content-driven
4. Maintain the premium, calm visual direction
5. Commit changes in small logical steps

