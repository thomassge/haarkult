import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function readWorkspaceFile(relativePath: string) {
  return readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

describe("brochure content boundaries", () => {
  it("keeps brochure entrypoints free of booking engine and database imports", () => {
    const brochureFiles = [
      "app/page.tsx",
      "app/layout.tsx",
      "components/blocks/site-footer.tsx",
    ];

    for (const file of brochureFiles) {
      const source = readWorkspaceFile(file);

      expect(source).not.toMatch(/@\/lib\/booking/);
      expect(source).not.toMatch(/@\/db/);
    }
  });

  it("routes footer visibility through shared site-mode selectors", () => {
    const layoutSource = readWorkspaceFile("app/layout.tsx");
    const footerSource = readWorkspaceFile("components/blocks/site-footer.tsx");

    expect(layoutSource).toMatch(/from "@\/lib\/site-mode"/);
    expect(layoutSource).toMatch(/resolvePublicSiteActions\(site,\s*booking\)/);
    expect(layoutSource).not.toMatch(/bookingHref/);
    expect(footerSource).toMatch(/publicActions/);
    expect(footerSource).not.toMatch(/bookingHref/);
    expect(footerSource).not.toMatch(/telHref|mailtoHref/);
  });
});
