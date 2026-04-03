import { Fragment, type ReactElement } from "react";
import { gallery } from "@/content/gallery";
import { homePage, type HomeSectionId } from "@/content/home";
import { site } from "@/content/site";
import { services, serviceCategoryOrder } from "@/content/services";
import { team } from "@/content/team";
import { telHref, whatsappHref } from "@/lib/links";
import { Hero } from "@/components/blocks/hero";
import { ServicesGrid } from "@/components/blocks/services-grid";
import { TeamGrid } from "@/components/blocks/team-grid";
import { GalleryGrid } from "@/components/blocks/gallery-grid";
import { ContactBlock } from "@/components/blocks/contact";

type PageAction = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
  external: boolean;
};

export default function Home() {
  const shortAddressLine = `${site.contact.address.street}, ${site.contact.address.zip} ${site.contact.address.city}`;
  const fullAddressLine = `${site.contact.address.street}, ${site.contact.address.zip} ${site.contact.address.city}, ${site.contact.address.country}`;
  const whatsappMessage = `Hi! Ich würde gern einen Termin bei ${site.brand.name} machen.`;
  const heroActions: PageAction[] = [
    {
      label: homePage.hero.primaryActionLabel,
      href: telHref(site.contact.phone),
      variant: "primary",
      external: true,
    },
  ];
  const contactActions: PageAction[] = [
    {
      label: homePage.contact.mapsActionLabel,
      href: site.contact.mapsUrl,
      variant: "secondary",
      external: true,
    },
    {
      label: homePage.contact.phoneActionLabel,
      href: telHref(site.contact.phone),
      variant: "primary",
      external: true,
    },
  ];

  if (site.contact.whatsapp) {
    heroActions.push({
      label: homePage.hero.secondaryActionLabel,
      href: whatsappHref(site.contact.whatsapp, whatsappMessage),
      variant: "secondary",
      external: true,
    });

    contactActions.push({
      label: homePage.contact.whatsappActionLabel,
      href: whatsappHref(site.contact.whatsapp, whatsappMessage),
      variant: "secondary",
      external: true,
    });
  }

  const sectionBlocks: Record<HomeSectionId, ReactElement> = {
    hero: (
      <Hero
        eyebrow={`${homePage.hero.eyebrowPrefix} ${site.brand.city}`}
        title={site.brand.name}
        subtitle={homePage.hero.subtitle}
        meta={shortAddressLine}
        actions={heroActions}
        hoursTitle={homePage.hero.hoursTitle}
        openingHours={site.hours}
        image={homePage.hero.image}
      />
    ),
    services: (
      <ServicesGrid
        eyebrow={homePage.services.eyebrow}
        title={homePage.services.title}
        subtitle={homePage.services.subtitle}
        categories={serviceCategoryOrder}
        items={services}
      />
    ),
    team: (
      <TeamGrid
        eyebrow={homePage.team.eyebrow}
        title={homePage.team.title}
        subtitle={homePage.team.subtitle}
        members={team}
      />
    ),
    gallery: (
      <GalleryGrid
        eyebrow={homePage.gallery.eyebrow}
        title={homePage.gallery.title}
        subtitle={homePage.gallery.subtitle}
        images={gallery}
      />
    ),
    contact: (
      <ContactBlock
        eyebrow={homePage.contact.eyebrow}
        title={homePage.contact.title}
        subtitle={homePage.contact.subtitle}
        addressLabel={homePage.contact.addressLabel}
        siteName={site.brand.name}
        addressLine={fullAddressLine}
        actions={contactActions}
        hoursTitle={homePage.contact.hoursTitle}
        openingHours={site.hours}
      />
    ),
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-zinc-950 dark:text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(248,242,233,0.92),transparent_42%),radial-gradient(circle_at_top_right,rgba(217,198,168,0.55),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(89,68,47,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(72,56,40,0.22),transparent_26%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-72 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-white/30 blur-3xl dark:bg-white/[0.03]"
      />
      <main className="relative">
        {homePage.sections
          .filter((section) => section.enabled !== false)
          .map((section) => (
            <Fragment key={section.id}>{sectionBlocks[section.id]}</Fragment>
          ))}
      </main>
    </div>
  );
}
