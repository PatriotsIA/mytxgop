import { organizationContact } from "./contact";

export const legalOrganization = {
  name: "My Local GOP",
  email: organizationContact.email,
  phone: organizationContact.phone,
  mailingAddress: organizationContact.mailingAddress,
  privacyEffectiveDate: "June 22, 2026",
  termsLastRevised: "June 22, 2026",
} as const;
