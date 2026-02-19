export const site = {
    name: "Haarkult-Maintal",
    address: {
        street: "Zwerggasse 2",
        zip: "63477",
        city: "Maintal",
        country: "Deutschland",
    },
    phone: "06109-6962322",
    whatsapp: "4915788101539",
    instagram: null as null | string,
    openingHours: [
        {label: "Mo-Fr", hours: "09:00-18:00"},
        {label: "Sa", hours: "08:00-13:30"},
        {label: "So", hours: "Geschlossen"}
    ],
} as const;

export type Site = typeof site;