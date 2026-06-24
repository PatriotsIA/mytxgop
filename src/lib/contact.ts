export const organizationContact = {
  email: import.meta.env.VITE_DEFAULT_CONTACT_TO_EMAIL || "info@mytexasgop.com",
  phone: "(866) 756 1776",
  mailingAddress: "1000 S. Jefferson Street, Amarillo, TX 79101",
} as const;

export function phoneHref(phone: string = organizationContact.phone) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

export function organizationPhone(countyPhone?: string) {
  return countyPhone || organizationContact.phone;
}
