import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function readWorkspaceFile(relativePath: string) {
  return readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

function routeFileForAdminHref(href: string) {
  const routePath = href.replace(/^\/admin\/?/, "");

  return path.resolve(process.cwd(), "app/admin", routePath, "page.tsx");
}

describe("admin dashboard navigation", () => {
  it("routes Leistungen to its own service-assignment setup page", () => {
    const source = readWorkspaceFile("app/admin/_components/admin-shell.tsx");

    expect(source).toMatch(/title:\s*"Leistungen"/);
    expect(source).toMatch(
      /title:\s*"Leistungen"[\s\S]*?href:\s*"\/admin\/leistungen"/
    );
  });

  it("keeps dashboard status logic wired to the real Leistungen route", () => {
    const source = readWorkspaceFile("app/admin/page.tsx");

    expect(source).toMatch(/\/admin\/leistungen/);
  });

  it("links every static dashboard card href to an existing admin setup route file", () => {
    const source = readWorkspaceFile("app/admin/_components/admin-shell.tsx");
    const hrefs = Array.from(source.matchAll(/href:\s*"([^"]+)"/g), (match) => match[1])
      .filter((href) => href.startsWith("/admin/"));

    expect(hrefs).toEqual([
      "/admin/stylisten",
      "/admin/leistungen",
      "/admin/zeiten",
      "/admin/ausnahmen",
    ]);
    expect(hrefs).toContain("/admin/stylisten");
    expect(hrefs).toContain("/admin/leistungen");
    expect(hrefs).toContain("/admin/zeiten");
    expect(hrefs).toContain("/admin/ausnahmen");

    for (const href of hrefs) {
      expect(existsSync(routeFileForAdminHref(href)), `${href} route exists`).toBe(true);
    }
  });
});
