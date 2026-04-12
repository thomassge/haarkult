import { describe, expect, it } from "vitest";

import {
  authorizeAdminCredentials,
  normalizeAdminEmail,
} from "@/lib/auth/admin-users";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

const validPassword = "ein-sicheres-admin-passwort";

describe("admin password hashing", () => {
  it("stores hashes in the planned scrypt envelope and verifies the password", async () => {
    const storedHash = await hashPassword(validPassword);

    expect(storedHash).toMatch(/^scrypt\$131072\$8\$1\$/);
    expect(storedHash.split("$")).toHaveLength(6);
    await expect(verifyPassword(validPassword, storedHash)).resolves.toBe(true);
    await expect(verifyPassword("falsches-passwort", storedHash)).resolves.toBe(false);
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
