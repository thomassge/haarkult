export type OpeningHour = {
  label: string;
  hours: string;
};

export type BrandAsset = {
  src: string;
  alt: string;
};

export type SiteConfig = {
  brand: {
    name: string;
    city: string;
    country: string;
    logo?: BrandAsset | null;
    heroImage?: BrandAsset | null;
  };
  contact: {
    phone: string;
    fax?: string | null;
    email: string;
    whatsapp: string | null;
    address: {
      street: string;
      zip: string;
      city: string;
      country: string;
    };
    mapsUrl: string;
  };
  legal: {
    businessName: string;
    owners: string[];
  };
  hours: OpeningHour[];
  socials: {
    instagram: string | null;
  };
  seo: {
    title: string;
    description: string;
  };
};

export const site: SiteConfig = {
  brand: {
    name: "Haarkult-Maintal",
    city: "Maintal",
    country: "Deutschland",
    logo: {
      src: "/brand/haarkult-logo.png",
      alt: "Logo von Haarkult-Maintal",
    },
    heroImage: {
      src: "/brand/haarkult-titelbild.png",
      alt: "Innenansicht des Salons Haarkult-Maintal",
    },
  },
  contact: {
    phone: "06109-6962322",
    fax: "06109-6962333",
    email: "haarkult-maintal@t-online.de",
    whatsapp: "4915788101539",
    address: {
      street: "Zwerggasse 2",
      zip: "63477",
      city: "Maintal",
      country: "Deutschland",
    },
    mapsUrl:
      "https://www.google.com/maps/place/Haarkult-Maintal/@50.152117,8.8045167,17z/data=!3m1!4b1!4m6!3m5!1s0x47bd103bb988b69f:0xad9ecf6dcf6099ce!8m2!3d50.152117!4d8.8045167!16s%2Fg%2F11c5wygkc9?entry=ttu&g_ep=EgoyMDI2MDIxNi4wIKXMDSoASAFQAw%3D%3D",
  },
  legal: {
    businessName: "haarkult",
    owners: ["Maria Samartzidou", "Sonia Duarte da Luz"],
  },
  hours: [
    { label: "Mo-Fr", hours: "09:00-18:00" },
    { label: "Sa", hours: "08:00-13:30" },
    { label: "So", hours: "Geschlossen" },
  ],
  socials: {
    instagram: null,
  },
  seo: {
    title: "Haarkult-Maintal | Friseur in Maintal",
    description:
      "Haarkult-Maintal ist dein Friseursalon in Maintal mit Haarschnitten, Colorationen, Beauty-Services und persönlicher Beratung.",
  },
};
