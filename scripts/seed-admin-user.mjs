import "dotenv/config";

import { randomBytes, randomUUID, scrypt } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const SCRYPT_N = 131072;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SCRYPT_MAXMEM = 256 * 1024 * 1024;

function readRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Fehlende Umgebungsvariable: ${name}`);
  }

  return value;
}

function normalizeAdminEmail(email) {
  return email.trim().toLowerCase();
}

function deriveScryptKey(password, salt, keylen) {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      keylen,
      {
        N: SCRYPT_N,
        r: SCRYPT_R,
        p: SCRYPT_P,
        maxmem: SCRYPT_MAXMEM,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      }
    );
  });
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await deriveScryptKey(password, salt, SCRYPT_KEYLEN);

  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64"),
    derivedKey.toString("base64"),
  ].join("$");
}

async function seedAdminUser() {
  const databaseUrl = readRequiredEnv("DATABASE_URL");
  const seedEmail = normalizeAdminEmail(readRequiredEnv("ADMIN_SEED_EMAIL"));
  const seedPassword = readRequiredEnv("ADMIN_SEED_PASSWORD");
  const passwordHash = await hashPassword(seedPassword);
  const sql = neon(databaseUrl);

  await sql`
    insert into admin_users (id, email, password_hash, role, active, created_at, updated_at)
    values (${randomUUID()}, ${seedEmail}, ${passwordHash}, 'owner', true, now(), now())
    on conflict (email) do update set
      password_hash = excluded.password_hash,
      role = 'owner',
      active = true,
      updated_at = now()
  `;

  console.log(`Admin-Zugang fuer ${seedEmail} wurde als owner aktiv gesetzt.`);
}

seedAdminUser().catch((error) => {
  console.error("Admin-Seed fehlgeschlagen.");
  console.error(error instanceof Error ? error.message : "Unbekannter Fehler.");
  process.exit(1);
});
