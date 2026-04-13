import { describe, expect, it } from "vitest";

import { bookingEvents, bookings } from "@/db/schema";
import { formatSlotId, type AvailabilitySlot } from "@/lib/booking/availability";
import {
  createPublicBooking,
  type PublicBookingDeps,
  type PublicBookingTransaction,
} from "@/lib/booking/public-actions";
import { publicBookingSubmissionSchema } from "@/lib/booking/public-validation";

const serviceId = "damen-haarschnitt";
const staffId = "staff-anna";
const date = "2026-06-15";
const startAt = "2026-06-15T07:00:00.000Z";
const endAt = "2026-06-15T07:45:00.000Z";
const slot = createSlot();

const validSubmission = {
  serviceId,
  date,
  slotId: slot.slotId,
  staffId,
  startAt,
  stylistPreferenceStaffId: staffId,
  name: "Mira Mustermann",
  phone: "06181 12345",
  email: "mira@example.test",
  note: "Bitte vorher kurz anrufen.",
};

describe("public booking submission validation", () => {
  it("requires guest contact fields with public German validation copy", () => {
    const result = publicBookingSubmissionSchema.safeParse({
      serviceId,
      date,
      slotId: slot.slotId,
      staffId,
      startAt,
      name: "",
      phone: "",
      email: "keine-mail",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        "Bitte gib deinen Namen ein.",
        "Bitte gib eine Telefonnummer fuer Rueckfragen ein.",
        "Bitte gib eine gueltige E-Mail-Adresse ein.",
      ])
    );
  });

  it("normalizes optional stylist preference and note fields", () => {
    expect(
      publicBookingSubmissionSchema.parse({
        ...validSubmission,
        stylistPreferenceStaffId: "",
        note: "",
      })
    ).toMatchObject({
      stylistPreferenceStaffId: undefined,
      note: undefined,
    });
  });
});

describe("createPublicBooking", () => {
  it("locks a staff day, re-checks availability, and writes booking plus creation event", async () => {
    const deps = createDeps({ slots: [slot] });

    const result = await createPublicBooking(validSubmission, deps);

    expect(result).toMatchObject({
      status: "success",
      bookingStatus: "pending",
      heading: "Deine Anfrage ist angekommen",
    });
    expect(deps.records).toEqual([
      `lock:public-booking:${staffId}:${date}`,
      "availability",
      "insert:bookings",
      "insert:bookingEvents",
    ]);
    expect(deps.bookingRows).toHaveLength(1);
    expect(deps.bookingRows[0]).toMatchObject({
      status: "pending",
      serviceId,
      staffId,
      customerName: "Mira Mustermann",
      customerPhone: "06181 12345",
      customerEmail: "mira@example.test",
      customerNote: "Bitte vorher kurz anrufen.",
      source: "online",
    });
    expect(deps.eventRows[0]).toMatchObject({
      bookingId: deps.bookingRows[0]?.id,
      eventType: "created",
      actorType: "customer",
    });
  });

  it("uses confirmed success copy for instant confirmation mode", async () => {
    const result = await createPublicBooking(validSubmission, {
      ...createDeps({ slots: [slot] }),
      confirmationMode: "instant",
    });

    expect(result).toMatchObject({
      status: "success",
      bookingStatus: "confirmed",
      heading: "Dein Termin ist gebucht",
    });
  });

  it("returns a stale slot conflict without inserting and preserves user input", async () => {
    const deps = createDeps({ slots: [] });

    const result = await createPublicBooking(validSubmission, deps);

    expect(result).toEqual({
      status: "slot_conflict",
      message:
        "Diese Zeit ist gerade nicht mehr verfuegbar. Deine Angaben bleiben erhalten. Bitte waehle eine neue Uhrzeit.",
      preservedInput: validSubmission,
      clearSlot: true,
    });
    expect(deps.records).toEqual([
      `lock:public-booking:${staffId}:${date}`,
      "availability",
    ]);
    expect(deps.bookingRows).toEqual([]);
    expect(deps.eventRows).toEqual([]);
  });

  it("serializes duplicate same-staff same-date submissions so only one booking wins", async () => {
    const deps = createDeps({ slots: [slot], hideSlotAfterFirstInsert: true });

    const [firstResult, secondResult] = await Promise.all([
      createPublicBooking(validSubmission, deps),
      createPublicBooking(validSubmission, deps),
    ]);

    expect(firstResult.status).toBe("success");
    expect(secondResult).toMatchObject({
      status: "slot_conflict",
      clearSlot: true,
    });
    expect(deps.bookingRows).toHaveLength(1);
    expect(deps.eventRows).toHaveLength(1);
    expect(deps.records).toEqual([
      `lock:public-booking:${staffId}:${date}`,
      "availability",
      "insert:bookings",
      "insert:bookingEvents",
      `lock:public-booking:${staffId}:${date}`,
      "availability",
    ]);
  });
});

function createSlot(overrides: Partial<AvailabilitySlot> = {}): AvailabilitySlot {
  const candidate = {
    staffId,
    staffName: "Anna",
    startAt: new Date(startAt),
    endAt: new Date(endAt),
    ...overrides,
  };

  return {
    ...candidate,
    slotId: formatSlotId(candidate),
  };
}

function createDeps(options: {
  slots: AvailabilitySlot[];
  hideSlotAfterFirstInsert?: boolean;
}) {
  const records: string[] = [];
  const bookingRows: Record<string, unknown>[] = [];
  const eventRows: Record<string, unknown>[] = [];
  let transactionQueue = Promise.resolve();

  const deps: PublicBookingDeps & {
    records: string[];
    bookingRows: Record<string, unknown>[];
    eventRows: Record<string, unknown>[];
  } = {
    records,
    bookingRows,
    eventRows,
    now: new Date("2026-06-14T08:00:00.000Z"),
    confirmationMode: "manual",
    generateId: (() => {
      let index = 0;

      return () => {
        index += 1;

        return `generated-${index}`;
      };
    })(),
    getAvailableSlots: async (_input, { client }) => {
      expect(client).toBeTruthy();
      records.push("availability");

      if (options.hideSlotAfterFirstInsert && bookingRows.length > 0) {
        return [];
      }

      return options.slots;
    },
    db: {
      transaction: async (callback) => {
        const result = transactionQueue.then(() => callback(createTransaction()));

        transactionQueue = result.then(
          () => undefined,
          () => undefined
        );

        return result;
      },
    },
    acquireLock: async (_tx, input) => {
      const lockKey = `public-booking:${input.staffId}:${input.date}`;
      records.push(`lock:${lockKey}`);
    },
  };

  function createTransaction(): PublicBookingTransaction {
    return {
      execute: async () => undefined,
      insert: (table) => ({
        values: (row) => ({
          returning: async () => {
            if (table === bookings) {
              records.push("insert:bookings");
              bookingRows.push(row as Record<string, unknown>);

              return [row];
            }

            if (table === bookingEvents) {
              records.push("insert:bookingEvents");
              eventRows.push(row as Record<string, unknown>);

              return [row];
            }

            return [row];
          },
        }),
      }),
    };
  }

  return deps;
}
