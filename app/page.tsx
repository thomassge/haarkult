import { gallery } from "@/content/gallery";
import { homePage } from "@/content/home";
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

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main>
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
        <ServicesGrid
          eyebrow={homePage.services.eyebrow}
          title={homePage.services.title}
          subtitle={homePage.services.subtitle}
          categories={serviceCategoryOrder}
          items={services}
        />
        <TeamGrid
          eyebrow={homePage.team.eyebrow}
          title={homePage.team.title}
          subtitle={homePage.team.subtitle}
          members={team}
        />
        <GalleryGrid
          eyebrow={homePage.gallery.eyebrow}
          title={homePage.gallery.title}
          subtitle={homePage.gallery.subtitle}
          images={gallery}
        />
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
      </main>
    </div>
  );
}
