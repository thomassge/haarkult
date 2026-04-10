import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { PublicSiteAction } from "@/lib/site-mode";

type SiteFooterProps = {
  brandName: string;
  city: string;
  publicActions: PublicSiteAction[];
};

export function SiteFooter({
  brandName,
  city,
  publicActions,
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
            {publicActions.map((action) =>
              action.external ? (
                <a
                  key={`${action.kind}-${action.href}`}
                  className="transition hover:text-zinc-950 dark:hover:text-zinc-50"
                  href={action.href}
                >
                  {action.label}
                </a>
              ) : (
                <Link
                  key={`${action.kind}-${action.href}`}
                  className="transition hover:text-zinc-950 dark:hover:text-zinc-50"
                  href={action.href}
                >
                  {action.label}
                </Link>
              )
            )}
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
