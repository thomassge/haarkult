import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/blocks/site-footer";
import { booking } from "@/content/booking";
import { site } from "@/content/site";
import { getBookingEntryHref } from "@/lib/site-mode";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.seo.title,
  description: site.seo.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bookingHref = getBookingEntryHref(booking) ?? undefined;

  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <SiteFooter
            brandName={site.brand.name}
            city={site.brand.city}
            phone={site.contact.phone}
            email={site.contact.email}
            bookingHref={bookingHref}
          />
        </div>
      </body>
    </html>
  );
}
