import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  authorizeAdminCredentials,
  normalizeAdminEmail,
} from "@/lib/auth/admin-users";
import {
  checkLoginThrottle,
  clearLoginThrottle,
  recordLoginFailure,
} from "@/lib/auth/login-throttle";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

const validPassword = "ein-sicheres-admin-passwort";

function readWorkspaceFile(relativePath: string) {
  return readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

afterEach(() => {
  vi.useRealTimers();
});

describe("admin password hashing", () => {
  it("stores hashes in the planned scrypt envelope and verifies the password", async () => {
    const storedHash = await hashPassword(validPassword);

    expect(storedHash).toMatch(/^scrypt\$131072\$8\$1\$/);
    expect(storedHash.split("$")).toHaveLength(6);
    await expect(verifyPassword(validPassword, storedHash)).resolves.toBe(true);
    await expect(verifyPassword("falsches-passwort", storedHash)).resolves.toBe(false);
  });
});

describe("admin login throttling", () => {
  it("blocks a sixth failed attempt within the 15-minute window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-12T10:00:00Z"));

    const key = "owner@haarkult.de|127.0.0.1";

    expect(checkLoginThrottle(key)).toBe(true);

    for (let attempt = 0; attempt < 5; attempt += 1) {
      recordLoginFailure(key);
    }

    expect(checkLoginThrottle(key)).toBe(false);
  });

  it("resets after a successful login or an expired window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-12T10:00:00Z"));

    const successKey = "owner@haarkult.de|127.0.0.1";
    const expiredKey = "owner@haarkult.de|192.0.2.1";

    for (let attempt = 0; attempt < 5; attempt += 1) {
      recordLoginFailure(successKey);
      recordLoginFailure(expiredKey);
    }

    clearLoginThrottle(successKey);
    expect(checkLoginThrottle(successKey)).toBe(true);

    vi.setSystemTime(new Date("2026-04-12T10:16:00Z"));
    expect(checkLoginThrottle(expiredKey)).toBe(true);
  });
});

describe("admin auth route protection source contracts", () => {
  it("protects the admin page with requireAdmin before rendering the dashboard", () => {
    const source = readWorkspaceFile("app/admin/page.tsx");

    expect(source).toMatch(/requireAdmin\(\)/);
    expect(source).toMatch(/<AdminShell/);
  });

  it("configures Auth.js with credentials, jwt sessions, minimal claims, and generic sign-in page", () => {
    const source = readWorkspaceFile("auth.ts");

    expect(source).toMatch(/Credentials/);
    expect(source).toMatch(/authorizeAdminCredentials/);
    expect(source).toMatch(/strategy:\s*"jwt"/);
    expect(source).toMatch(/pages:\s*{\s*signIn:\s*"\/admin\/login"\s*}/);
    expect(source).toMatch(/checkLoginThrottle/);
    expect(source).toMatch(/recordLoginFailure/);
    expect(source).toMatch(/clearLoginThrottle/);
    expect(source).toMatch(/id/);
    expect(source).toMatch(/email/);
    expect(source).toMatch(/role/);
    expect(source).toMatch(/active/);
    expect(source).not.toMatch(/passwordHash/);
  });

  it("uses proxy matching for admin paths while leaving login and Auth.js routes reachable", () => {
    const source = readWorkspaceFile("proxy.ts");

    expect(source).toMatch(/export\s+{\s*auth\s+as\s+proxy\s+}/);
    expect(source).toMatch(/\/admin/);
    expect(source).toMatch(/admin\/login/);
    expect(source).toMatch(/api\/auth/);
  });

  it("renders German clickable admin setup frames", () => {
    const source = readWorkspaceFile("app/admin/_components/admin-shell.tsx");

    expect(source).toMatch(/Stylisten/);
    expect(source).toMatch(/Leistungen/);
    expect(source).toMatch(/Arbeitszeiten/);
    expect(source).toMatch(/Abwesenheiten/);
    expect(source).toMatch(/href:\s*"\/admin\/stylisten"/);
    expect(source).toMatch(/href:\s*"\/admin\/zeiten"/);
    expect(source).toMatch(/href:\s*"\/admin\/ausnahmen"/);
  });

  it("provides a one-owner seed script without printing seed secrets", () => {
    const packageJson = readWorkspaceFile("package.json");
    const source = readWorkspaceFile("scripts/seed-admin-user.mjs");

    expect(packageJson).toMatch(/"admin:seed":\s*"node scripts\/seed-admin-user\.mjs"/);
    expect(source).toMatch(/ADMIN_SEED_EMAIL/);
    expect(source).toMatch(/ADMIN_SEED_PASSWORD/);
    expect(source).toMatch(/admin_users/);
    expect(source).toMatch(/role/);
    expect(source).toMatch(/'owner'/);
    expect(source).toMatch(/active\s*=\s*true|true/);
    expect(source).not.toMatch(/console\.(log|error)\([^)]*seedPassword/);
  });
});

describe("admin credential authorization", () => {
  it("normalizes email before lookup and returns only minimal active session claims", async () => {
    const passwordHash = await hashPassword(validPassword);
    let lookedUpEmail = "";

    const sessionUser = await authorizeAdminCredentials(
      { email: "  OWNER@HAARKULT.DE ", password: validPassword },
      async (email) => {
        lookedUpEmail = email;

        return {
          id: "admin-1",
          email,
          passwordHash,
          role: "owner",
          active: true,
        };
      }
    );

    expect(lookedUpEmail).toBe("owner@haarkult.de");
    expect(sessionUser).toEqual({
      id: "admin-1",
      email: "owner@haarkult.de",
      role: "owner",
      active: true,
    });
    expect(sessionUser).not.toHaveProperty("passwordHash");
  });

  it("rejects wrong passwords without returning a session DTO", async () => {
    const passwordHash = await hashPassword(validPassword);

    const sessionUser = await authorizeAdminCredentials(
      { email: "owner@haarkult.de", password: "falsches-passwort" },
      async (email) => ({
        id: "admin-1",
        email,
        passwordHash,
        role: "owner",
        active: true,
      })
    );

    expect(sessionUser).toBeNull();
  });

  it("rejects inactive admin users without returning a session DTO", async () => {
    const passwordHash = await hashPassword(validPassword);

    const sessionUser = await authorizeAdminCredentials(
      { email: "owner@haarkult.de", password: validPassword },
      async (email) => ({
        id: "admin-1",
        email,
        passwordHash,
        role: "owner",
        active: false,
      })
    );

    expect(sessionUser).toBeNull();
  });

  it("uses a stable lowercase trimmed email representation", () => {
    expect(normalizeAdminEmail("  Salon@Haarkult.DE ")).toBe("salon@haarkult.de");
  });
});
