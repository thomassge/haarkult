import { Fragment, type ReactElement } from "react";
import { Hero } from "@/components/blocks/hero";
import { ContactBlock } from "@/components/blocks/contact";
import { GalleryGrid } from "@/components/blocks/gallery-grid";
import { ServicesGrid } from "@/components/blocks/services-grid";
import { TeamGrid } from "@/components/blocks/team-grid";
import { booking } from "@/content/booking";
import { gallery } from "@/content/gallery";
import { homePage, type HomeSectionId } from "@/content/home";
import { site } from "@/content/site";
import { services, serviceCategoryOrder } from "@/content/services";
import { team } from "@/content/team";
import {
  fillMessageTemplate,
  formatAddressLine,
  getBookingPageAction,
  resolvePageActions,
} from "@/lib/home-page";

export default function Home() {
  const shortAddressLine = formatAddressLine(site.contact.address);
  const fullAddressLine = formatAddressLine(site.contact.address, true);
  const whatsappMessage = fillMessageTemplate(homePage.actionMessages.whatsapp, {
    salonName: site.brand.name,
  });
  const bookingAction = getBookingPageAction(booking);
  const fallbackHeroActions = resolvePageActions(
    homePage.hero.actions,
    site,
    booking,
    whatsappMessage
  );
  const fallbackContactActions = resolvePageActions(
    homePage.contact.actions,
    site,
    booking,
    whatsappMessage
  );
  const heroActions = bookingAction
    ? [bookingAction, ...fallbackHeroActions]
    : fallbackHeroActions;
  const contactActions = bookingAction
    ? [bookingAction, ...fallbackContactActions]
    : fallbackContactActions;

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
        logo={site.brand.logo}
        image={site.brand.heroImage}
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
