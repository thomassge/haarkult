import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { FinePrint } from "@/components/ui/typography";
import { LegalPage, LegalSection } from "@/components/blocks/legal-page";
import { legalContent } from "@/content/legal";
import { site } from "@/content/site";
import { mailtoHref, telHref } from "@/lib/links";

export const metadata: Metadata = {
  title: `Impressum | ${site.brand.name}`,
  description: `Impressum und Anbieterkennzeichnung von ${site.brand.name}.`,
};

export default function ImpressumPage() {
  const ownerNames = site.legal.owners.join(" & ");

  return (
    <LegalPage
      eyebrow={legalContent.eyebrow}
      title={legalContent.impressum.title}
      intro={legalContent.impressum.intro}
      links={legalContent.quickLinks}
      sidebar={
        <Card padded className="space-y-4">
          <FinePrint>{legalContent.impressum.providerTitle}</FinePrint>
          <div className="space-y-1 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            <p className="font-medium text-zinc-950 dark:text-zinc-50">
              {site.legal.businessName}
            </p>
            <p>{ownerNames}</p>
            <p>{site.contact.address.street}</p>
            <p>
              {site.contact.address.zip} {site.contact.address.city}
            </p>
          </div>
        </Card>
      }
    >
      <LegalSection title={legalContent.impressum.providerTitle}>
        <div className="space-y-1">
          <p className="font-medium text-zinc-950 dark:text-zinc-50">
            {site.legal.businessName}
          </p>
          <p>Inhaberinnen: {ownerNames}</p>
          <p>{site.contact.address.street}</p>
          <p>
            {site.contact.address.zip} {site.contact.address.city}
          </p>
        </div>

        <div className="space-y-1">
          <p>
            Telefon:{" "}
            <a className="underline decoration-[var(--line-strong)] underline-offset-4" href={telHref(site.contact.phone)}>
              {site.contact.phone}
            </a>
          </p>
          {site.contact.fax ? <p>Fax: {site.contact.fax}</p> : null}
          <p>
            E-Mail:{" "}
            <a
              className="underline decoration-[var(--line-strong)] underline-offset-4"
              href={mailtoHref(site.contact.email)}
            >
              {site.contact.email}
            </a>
          </p>
        </div>
      </LegalSection>

      <LegalSection title={legalContent.impressum.contentResponsibilityTitle}>
        <div className="space-y-1">
          <p>{ownerNames}</p>
          <p>{site.contact.address.street}</p>
          <p>
            {site.contact.address.zip} {site.contact.address.city}
          </p>
        </div>
      </LegalSection>

      <LegalSection title={legalContent.impressum.disputeResolutionTitle}>
        <p>{legalContent.impressum.disputeResolution}</p>
      </LegalSection>
    </LegalPage>
  );
}
