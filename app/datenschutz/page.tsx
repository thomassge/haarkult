import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { FinePrint } from "@/components/ui/typography";
import { LegalPage, LegalSection } from "@/components/blocks/legal-page";
import { legalContent } from "@/content/legal";
import { site } from "@/content/site";
import { mailtoHref, telHref } from "@/lib/links";

export const metadata: Metadata = {
  title: `Datenschutz | ${site.brand.name}`,
  description: `Datenschutzhinweise für die Website von ${site.brand.name}.`,
};

export default function DatenschutzPage() {
  return (
    <LegalPage
      eyebrow={legalContent.eyebrow}
      title={legalContent.privacy.title}
      intro={legalContent.privacy.intro}
      updatedAt={legalContent.privacy.updatedAt}
      links={legalContent.quickLinks}
      sidebar={
        <Card padded className="space-y-4">
          <FinePrint>Verantwortliche Stelle</FinePrint>
          <div className="space-y-1 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            <p className="font-medium text-zinc-950 dark:text-zinc-50">
              {site.legal.businessName}
            </p>
            <p>{site.legal.owners.join(" & ")}</p>
            <p>{site.contact.address.street}</p>
            <p>
              {site.contact.address.zip} {site.contact.address.city}
            </p>
            <p>
              Telefon:{" "}
              <a className="underline decoration-[var(--line-strong)] underline-offset-4" href={telHref(site.contact.phone)}>
                {site.contact.phone}
              </a>
            </p>
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
        </Card>
      }
    >
      {legalContent.privacy.sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {section.title === "5. Kontakt über WhatsApp" ? (
            <p>
              Weitere Informationen finden Sie in der{" "}
              <a
                className="underline decoration-[var(--line-strong)] underline-offset-4"
                href={legalContent.privacy.whatsappPrivacyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Datenschutzerklärung von WhatsApp
              </a>
              .
            </p>
          ) : null}

          {section.bullets ? (
            <ul className="list-disc space-y-2 pl-5">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}

          {section.title === "9. Beschwerderecht" ? (
            <p>
              Zuständige Aufsichtsbehörde:{" "}
              <a
                className="underline decoration-[var(--line-strong)] underline-offset-4"
                href={legalContent.privacy.complaintUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Der Hessische Beauftragte für Datenschutz und Informationsfreiheit
              </a>
              .
            </p>
          ) : null}
        </LegalSection>
      ))}
    </LegalPage>
  );
}
