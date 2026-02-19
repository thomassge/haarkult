import Image from "next/image";

import { site } from "@/content/site";
import { telHref, whatsappHref } from "@/lib/links";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {site.name}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {site.address.street}, {site.address.zip} {site.address.city}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-white transition-colors hover:bg-zinc-800 md:w-[158px]"
            href={telHref(site.phone)}
          >
            Anrufen
          </a>

          {site.whatsapp && (
            <a
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.12] px-5 transition-colors hover:bg-black/[.04] dark:border-white/[.18] dark:hover:bg-[#1a1a1a] md:w-[158px]"
              href={whatsappHref(site.whatsapp, `Hi! Ich würde gern einen Termin bei ${site.name} machen.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
