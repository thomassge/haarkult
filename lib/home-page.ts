import type { HomeAction } from "@/content/home";
import type { SiteConfig } from "@/content/site";
import { mailtoHref, telHref, whatsappHref } from "@/lib/links";

export type ResolvedPageAction = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
  external: boolean;
};

type SiteAddress = SiteConfig["contact"]["address"];

export function formatAddressLine(address: SiteAddress, includeCountry = false) {
  const base = `${address.street}, ${address.zip} ${address.city}`;
  return includeCountry ? `${base}, ${address.country}` : base;
}

export function fillMessageTemplate(
  template: string,
  variables: Record<string, string>
) {
  return Object.entries(variables).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, value),
    template
  );
}

export function resolvePageActions(
  actions: readonly HomeAction[],
  site: SiteConfig,
  whatsappMessage?: string
) {
  const fallbackActions = new Set(site.booking.fallbackActions);

  return actions.flatMap<ResolvedPageAction>((action) => {
    if (action.enabled === false) {
      return [];
    }

    if (
      (action.kind === "phone" || action.kind === "whatsapp" || action.kind === "email") &&
      !fallbackActions.has(action.kind)
    ) {
      return [];
    }

    if (action.kind === "phone") {
      return [
        {
          label: action.label,
          href: telHref(site.contact.phone),
          variant: action.variant ?? "secondary",
          external: true,
        },
      ];
    }

    if (action.kind === "whatsapp") {
      if (!site.contact.whatsapp) {
        return [];
      }

      return [
        {
          label: action.label,
          href: whatsappHref(site.contact.whatsapp, whatsappMessage),
          variant: action.variant ?? "secondary",
          external: true,
        },
      ];
    }

    if (action.kind === "email") {
      return [
        {
          label: action.label,
          href: mailtoHref(site.contact.email),
          variant: action.variant ?? "secondary",
          external: true,
        },
      ];
    }

    if (action.kind === "maps") {
      return [
        {
          label: action.label,
          href: site.contact.mapsUrl,
          variant: action.variant ?? "secondary",
          external: true,
        },
      ];
    }

    if (!site.socials.instagram) {
      return [];
    }

    return [
      {
        label: action.label,
        href: site.socials.instagram,
        variant: action.variant ?? "secondary",
        external: true,
      },
    ];
  });
}
