---
created: 2026-04-13T20:19:25.235Z
title: Refine admin services and stylist setup UX
area: ui
files:
  - app/admin/leistungen/page.tsx
  - app/admin/stylisten/page.tsx
  - app/admin/stylisten/_components/stylist-setup-form.tsx
---

## Problem

During Phase 3 UAT, the admin setup UI still has confusing service/stylist boundaries.
The Services page should manage the salon catalog at the service level, where admins can
add and remove services from the catalog. It should not primarily list stylists or expose
stylist assignment forms there. Service IDs should not be visible to salon admins.

The Stylisten page should also make the create action feel smaller and calmer: the
"Create New Stylist" control should be a small button in the top-right area, not a large
expanded setup card.

## Solution

Plan a focused admin setup UX phase or gap task:
- Split catalog service management from stylist service assignment.
- Hide internal service IDs from admin-facing forms.
- Replace the large new-stylist disclosure card with a compact "Create New Stylist" action
  in the page header or right-hand toolbar.
- Keep existing stylist edit panels collapsed by default.
