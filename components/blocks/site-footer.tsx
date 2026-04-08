import Link from "next/link";
import { Container } from "@/components/ui/container";
import { mailtoHref, telHref } from "@/lib/links";

type SiteFooterProps = {
  brandName: string;
  city: string;
  phone: string;
  email: string;
  bookingHref?: string;
};

export function SiteFooter({
  brandName,
  city,
  phone,
  email,
  bookingHref,
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)] bg-white/30 backdrop-blur-sm dark:bg-white/[0.02]">
      <Container className="py-8 sm:py-10">
        <div className="flex flex-col gap-5 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-300">
          <div className="space-y-1">
            <p className="font-medium text-zinc-950 dark:text-zinc-50">
              {brandName}
            </p>
            <p>{city}</p>
            <p>© {year}</p>
          </div>

          <nav
            aria-label="Rechtliche, Kontakt- und Service-Links"
            className="flex flex-wrap gap-x-5 gap-y-3"
          >
            {bookingHref ? (
              <Link
                className="transition hover:text-zinc-950 dark:hover:text-zinc-50"
                href={bookingHref}
              >
                Termin buchen
              </Link>
            ) : null}
            <a className="transition hover:text-zinc-950 dark:hover:text-zinc-50" href={telHref(phone)}>
              Telefon
            </a>
            <a
              className="transition hover:text-zinc-950 dark:hover:text-zinc-50"
              href={mailtoHref(email)}
            >
              E-Mail
            </a>
            <Link className="transition hover:text-zinc-950 dark:hover:text-zinc-50" href="/impressum">
              Impressum
            </Link>
            <Link
              className="transition hover:text-zinc-950 dark:hover:text-zinc-50"
              href="/datenschutz"
            >
              Datenschutz
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
