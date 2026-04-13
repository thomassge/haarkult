import "dotenv/config";

import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const serviceIds = [
  "damen-neuschnitt",
  "damen-haarschnitt",
  "damen-foehnen",
  "damen-farbe-foehnen",
  "damen-inoa-foehnen",
  "damen-straehnen",
  "damen-glossing",
  "damen-toenung",
  "damen-painting",
  "damen-dauerwelle",
  "herren-haarschnitt-trocken",
  "herren-haarschnitt-waschen-foehnen",
  "herren-maschinenschnitt",
  "herren-bartschnitt",
  "jugend-haarschnitt-waschen-foehnen",
  "jugend-haarschnitt-trocken",
  "kinder-haarschnitt",
  "beauty-wimpern-faerben",
  "beauty-augenbrauen-faerben",
  "beauty-augenbrauen-zupfen",
];

const stylists = [
  {
    name: "Sonia Duarte da Luz",
    slug: "sonia-duarte-da-luz",
  },
  {
    name: "Maria Samartzidou",
    slug: "maria-samartzidou",
  },
];

function readRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Fehlende Umgebungsvariable: ${name}`);
  }

  return value;
}

async function seedBookingSetup() {
  const sql = neon(readRequiredEnv("DATABASE_URL"));

  for (const stylist of stylists) {
    await sql`
      insert into staff (id, name, slug, active, created_at, updated_at)
      values (${randomUUID()}, ${stylist.name}, ${stylist.slug}, true, now(), now())
      on conflict (slug) do update set
        name = excluded.name,
        active = true,
        updated_at = now()
    `;

    const [staffRow] = await sql`
      select id from staff where slug = ${stylist.slug}
    `;

    for (const serviceId of serviceIds) {
      await sql`
        insert into staff_services (staff_id, service_id, created_at)
        values (${staffRow.id}, ${serviceId}, now())
        on conflict do nothing
      `;
    }

    await sql`
      delete from weekly_availability where staff_id = ${staffRow.id}
    `;

    for (const weekday of [2, 3, 4, 5, 6]) {
      await sql`
        insert into weekly_availability (
          id,
          staff_id,
          weekday,
          start_minutes,
          end_minutes,
          created_at,
          updated_at
        )
        values (${randomUUID()}, ${staffRow.id}, ${weekday}, 540, 1080, now(), now())
      `;
    }
  }

  console.log(
    `Booking-Setup fuer ${stylists.length} Stylistinnen und ${serviceIds.length} Leistungen je Stylistin wurde gesetzt.`
  );
}

seedBookingSetup().catch((error) => {
  console.error("Booking-Setup-Seed fehlgeschlagen.");
  console.error(error instanceof Error ? error.message : "Unbekannter Fehler.");
  process.exit(1);
});
