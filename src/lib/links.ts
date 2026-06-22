import type { CountySite } from "../data/countyTypes";
import { countyPagePath } from "./paths";

export const globalLinks: CountySite["links"] = {
  communityUrl: "https://community.patriotsinaction.com/",
  electedOfficialsState: "https://wrm.capitol.texas.gov/",
  electedOfficialsFederal: "https://wrm.capitol.texas.gov/",
  registerToVote: "https://www.texas.gov/living-in-texas/texas-voter-registration/",
  merch: "https://shop.patriotsinaction.com/",
  partnerWithUs: "https://patriotsinaction.com/",
  patriotRewards: "https://patriotsinaction.com/",
};

export const legalLinks = {
  privacyPolicyUrl: "https://patriotsforaction.org/privacy/",
  termsOfServiceUrl: "https://patriotsforaction.org/terms",
} as const;

export function isExternalUrl(url?: string) {
  return Boolean(url && /^https?:\/\//i.test(url));
}

export function getSubmitEventUrl(county: CountySite) {
  if (county.calendar.useInternalSubmitEventForm) {
    return countyPagePath(county, "submit-event");
  }

  return county.calendar.submitEventUrl || county.links.submitEventUrl || countyPagePath(county, "submit-event");
}

export function getElectedOfficialsUrl(county: CountySite) {
  return (
    county.links.electedOfficialsLocal ||
    county.links.electedOfficialsState ||
    county.links.electedOfficialsFederal ||
    "https://wrm.capitol.texas.gov/"
  );
}
