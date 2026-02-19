// lib/links.ts
export function telHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

export function whatsappHref(phone: string, text?: string) {
  const cleaned = phone.replace(/[^\d]/g, "");
  const base = `https://wa.me/${cleaned}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}


export function mapsHref(addressLine: string) {
    return 'https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}';
}