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
    googleMapsPlaceUrl: "https://www.google.com/maps/place/Haarkult-Maintal/@50.152117,8.8045167,17z/data=!3m1!4b1!4m6!3m5!1s0x47bd103bb988b69f:0xad9ecf6dcf6099ce!8m2!3d50.152117!4d8.8045167!16s%2Fg%2F11c5wygkc9?entry=ttu&g_ep=EgoyMDI2MDIxNi4wIKXMDSoASAFQAw%3D%3D",
    openingHours: [
        {label: "Mo-Fr", hours: "09:00-18:00"},
        {label: "Sa", hours: "08:00-13:30"},
        {label: "So", hours: "Geschlossen"}
    ],
} as const;

export type Site = typeof site;