import type { CountySite } from "../data/countyTypes";

export const globalLinks: CountySite["links"] = {
  donateUrl: "https://secure.anedot.com/patriots-for-action/donate",
  communityUrl: "https://community.patriotsinaction.com/",
  electedOfficialsState: "https://wrm.capitol.texas.gov/",
  electedOfficialsFederal: "https://wrm.capitol.texas.gov/",
  registerToVote: "https://www.texas.gov/living-in-texas/texas-voter-registration/",
  merch: "https://shop.patriotsinaction.com/",
  partnerWithUs: "https://patriotsinaction.com/",
  patriotRewards: "https://patriotsinaction.com/",
};

export function isExternalUrl(url?: string) {
  return Boolean(url && /^https?:\/\//i.test(url));
}

export function getSubmitEventUrl(county: CountySite) {
  if (county.calendar.useInternalSubmitEventForm) {
    return `/${county.slug}/submit-event`;
  }

  return county.calendar.submitEventUrl || county.links.submitEventUrl || `/${county.slug}/submit-event`;
}

export function getElectedOfficialsUrl(county: CountySite) {
  return (
    county.links.electedOfficialsLocal ||
    county.links.electedOfficialsState ||
    county.links.electedOfficialsFederal ||
    "https://wrm.capitol.texas.gov/"
  );
}
