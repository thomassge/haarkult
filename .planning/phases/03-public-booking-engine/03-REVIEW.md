---
phase: 03-public-booking-engine
reviewed: 2026-04-13T19:11:46Z
depth: standard
files_reviewed: 20
files_reviewed_list:
  - app/api/booking/slots/route.ts
  - app/termin-buchen/_components/booking-entry-shell.tsx
  - app/termin-buchen/_components/booking-flow.tsx
  - app/termin-buchen/_components/booking-result.tsx
  - app/termin-buchen/_components/booking-summary.tsx
  - app/termin-buchen/_components/contact-step.tsx
  - app/termin-buchen/_components/service-step.tsx
  - app/termin-buchen/_components/slot-step.tsx
  - app/termin-buchen/_components/stylist-step.tsx
  - app/termin-buchen/_lib/booking-flow-options.ts
  - app/termin-buchen/page.tsx
  - lib/booking/availability.ts
  - lib/booking/public-actions.ts
  - lib/booking/public-queries.ts
  - lib/booking/public-validation.ts
  - tests/phase-1/termin-buchen-page.test.tsx
  - tests/phase-3/availability-engine.test.ts
  - tests/phase-3/booking-submission.test.ts
  - tests/phase-3/public-booking-flow.test.tsx
  - tests/phase-3/stylist-eligibility.test.ts
findings:
  critical: 0
  warning: 2
  info: 0
  total: 2
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-04-13T19:11:46Z
**Depth:** standard
**Files Reviewed:** 20
**Status:** issues_found

## Summary

Reviewed the public booking route, client booking flow, availability engine, booking submission path, validation helpers, and the listed phase tests. The core slot re-check and advisory lock path is covered, and the scoped test suite passes. Two behavioral issues remain: the initial service can be hidden behind the wrong category, and failed server-action submissions can leave the form stuck in a pending state.

Verification note: `npm.cmd run test:unit -- tests/phase-3/public-booking-flow.test.tsx tests/phase-3/stylist-eligibility.test.ts tests/phase-3/booking-submission.test.ts tests/phase-3/availability-engine.test.ts tests/phase-1/termin-buchen-page.test.tsx` passed with 5 files / 32 tests. The first sandboxed run failed during Vitest startup with Windows `spawn EPERM`, then passed when rerun outside the sandbox.

## Warnings

### WR-01: Initial service can be selected from a hidden category

**File:** `app/termin-buchen/_components/booking-flow.tsx:60`
**Issue:** `selectedCategory` is initialized from `serviceOptions.initialCategory`, while `selectedServiceId` is independently initialized by `findInitialServiceId()`. If the first category in catalog order has no active assigned staff but a later category does, the summary and slot lookup use the later service while the service step still renders the first category. The selected service is then not visible in the service list, and the user can proceed with a service they did not see selected. The existing public-flow tests cover the normal catalog order but not this cross-category eligibility case.
**Fix:**
```tsx
const initialServiceId = findInitialServiceId(allServices, staffRows);
const initialService = allServices.find((service) => service.id === initialServiceId);
const [selectedCategory, setSelectedCategory] = useState(
  initialService?.category ?? serviceOptions.initialCategory
);
const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
```

Also add a test where the only active assigned service is outside the first catalog category and assert that the rendered active category contains the selected service.

### WR-02: Submit failures leave the booking form permanently pending

**File:** `app/termin-buchen/_components/booking-flow.tsx:192`
**Issue:** `handleSubmit()` sets `submitPending` to `true`, awaits `submitPublicBookingAction()`, and only resets pending after the await succeeds. Unexpected server-action failures are rethrown by `createPublicBooking()` in `lib/booking/public-actions.ts:244`, so a transient database/runtime error rejects this await and skips `setSubmitPending(false)`. The submit button remains disabled as "Wird gesendet..." with no recovery path.
**Fix:**
```tsx
setSubmitPending(true);

try {
  const result = await submitPublicBookingAction(submitResult, formData);
  setSubmitResult(result);

  if (result.status === "slot_conflict") {
    setConflictMessage(result.message || staleSlotConflictCopy);
    setSelectedSlot(null);
    setContact({
      name: result.preservedInput.name,
      phone: result.preservedInput.phone,
      email: result.preservedInput.email,
      note: result.preservedInput.note ?? "",
    });
    setSelectedDate(result.preservedInput.date);
    await loadSlots(result.preservedInput.date);
  }
} catch {
  setSubmitResult({
    status: "validation_error",
    message: "Bitte pruefe deine Angaben.",
    fieldErrors: {
      _form: ["Die Anfrage konnte nicht gesendet werden. Bitte versuche es noch einmal."],
    },
    preservedInput: {
      serviceId: selectedServiceId,
      date: selectedDate,
      slotId: selectedSlot.slotId,
      staffId: selectedSlot.staffId,
      startAt: selectedSlot.startAt,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      note: contact.note,
    },
  });
} finally {
  setSubmitPending(false);
}
```

Consider adding a form-level error result type instead of overloading validation errors, and add a client-flow test that mocks `submitPublicBookingAction` rejection and verifies the button becomes enabled again with user input preserved.

---

_Reviewed: 2026-04-13T19:11:46Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
