# External Integrations

**Analysis Date:** 2026-04-10

## APIs & External Services

**Contact / outbound link integrations:**
- Google Maps - Salon location is exposed as an external link from `content/site.ts`
  - Integration method: direct URL string in `site.contact.mapsUrl`
  - Usage points: consumed through the shared action resolver in `lib/home-page.ts`
- WhatsApp - Contact CTA deep links are generated in `lib/links.ts`
  - Integration method: `https://wa.me/...` link generation
  - Auth: none from this codebase; handled by the external app/site after redirect
- Email / phone - `mailto:` and `tel:` links are generated in `lib/links.ts`
  - Integration method: browser / device handlers, not an API SDK

**Planned but not yet implemented:**
- Resend - Placeholder email provider for booking notifications
  - Evidence: `RESEND_API_KEY`, `BOOKING_FROM_EMAIL`, and `BOOKING_NOTIFICATION_EMAIL` in `.env.example` and `lib/booking/env.ts`
  - Current state: no SDK import and no email-sending code found
- Auth.js or equivalent admin auth - Mentioned in `CODEX_CONTEXT.md`
  - Current state: no auth library in `package.json` and no auth routes in `app/`

## Data Storage

**Databases:**
- Neon Postgres - Primary planned operational datastore for booking/admin data
  - Connection: `DATABASE_URL` env var
  - Client: `@neondatabase/serverless` + `drizzle-orm/neon-http` in `db/index.ts`
  - Schema: `db/schema.ts`
  - Migrations: generated SQL in `drizzle/` via `drizzle.config.ts`

**File Storage:**
- Repository-hosted static assets - Images and icons live in `public/brand/`, `public/gallery/`, `public/team/`, and `app/favicon.ico`
  - Current state: no upload flow, CDN SDK, or object storage client in code

**Caching:**
- None found

## Authentication & Identity

**Auth Provider:**
- None implemented yet
  - Evidence: no auth dependency in `package.json`, no middleware, no `app/admin/*`, no session logic
  - Planned secret surface: `AUTH_SECRET` exists in `.env.example` and `lib/booking/env.ts`

**OAuth Integrations:**
- None found

## Monitoring & Observability

**Error Tracking:**
- None found

**Analytics:**
- None found

**Logs:**
- No structured logging layer found in `app/`, `lib/`, or `db/`

## CI/CD & Deployment

**Hosting:**
- No platform-specific deployment config is committed
  - No `vercel.json`, Dockerfile, or infrastructure manifests were found
  - Inference: intended for a standard Next.js deployment target

**CI Pipeline:**
- None found
  - No `.github/workflows/` directory
  - No test/build automation config outside local npm scripts

## Environment Configuration

**Development:**
- Booking foundation requires `DATABASE_URL` when `db/index.ts` or Drizzle commands are used
- Optional planned vars: `AUTH_SECRET`, `RESEND_API_KEY`, `BOOKING_FROM_EMAIL`, `BOOKING_NOTIFICATION_EMAIL`
- The repo does not document a committed secret store; local `.env.local` or shell env vars are implied

**Staging:**
- No staging-specific configuration found

**Production:**
- No committed secrets-management or environment-doc strategy found
- Any production booking deployment will need secure injection of the same env vars listed above

## Webhooks & Callbacks

**Incoming:**
- None found

**Outgoing:**
- None implemented yet
  - The app currently redirects users to external destinations (Maps, WhatsApp, phone, mail) instead of making server-to-server calls

---
*Integration audit: 2026-04-10*
*Update when adding or removing external services*
