export const legalOrganization = {
  name: "My Local GOP",
  email: import.meta.env.VITE_DEFAULT_CONTACT_TO_EMAIL || "info@mytexasgop.com",
  phone: "806.351.0884",
  mailingAddress: "1000 S. Jefferson Street, Amarillo, TX 79101",
  privacyEffectiveDate: "June 22, 2026",
  termsLastRevised: "June 22, 2026",
} as const;
