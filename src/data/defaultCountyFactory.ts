import { globalLinks } from "../lib/links";
import { countyPagePath } from "../lib/paths";
import { slugifyCounty } from "../lib/slugifyCounty";
import { getCountyCalendarFeedUrl } from "./calendarFeeds";
import type { CountySite, StateSite } from "./countyTypes";

const defaultContactEmail = import.meta.env.VITE_DEFAULT_CONTACT_TO_EMAIL || "info@mytexasgop.com";

export function createDefaultCountySite(name: string, state: StateSite, fips: string): CountySite {
  const slug = slugifyCounty(name);
  const displayName = `${name} County`;
  const calendarFeedUrl = getCountyCalendarFeedUrl(state.slug, slug);
  const draftCounty = { slug, state } as CountySite;

  return {
    name,
    slug,
    state,
    fips,
    displayName,
    partyName: `${name} County GOP`,
    email: defaultContactEmail,
    emailSettings: {
      contactToEmail: defaultContactEmail,
      eventSubmissionToEmail: defaultContactEmail,
    },
    hero: {
      eyebrow: "GOP Connect",
      title: `${displayName} GOP`,
      subtitle:
        "Empowering our community to stand for conservative values, strengthen local leadership, and make a difference right here at home.",
      imageAlt: `${displayName} patriotic Texas landscape placeholder`,
    },
    intro: {
      heading: "operation show up",
      body: `Welcome to your County Republican Party--where local voices matter and community leadership begins. This is your home base for staying informed, getting involved, and making a real impact right here where you live. Together, we are working to uphold our values, support strong leadership, and ensure a brighter future for ${displayName}, ${state.name}, and our nation. We invite you to connect, participate, and stand with us--because real change starts at the local level.`,
    },
    calendar: {
      icsUrl: calendarFeedUrl,
      proxyUrl: calendarFeedUrl ? `/api/calendar?state=${state.slug}&county=${slug}` : undefined,
      submitEventUrl: countyPagePath(draftCounty, "submit-event"),
      useInternalSubmitEventForm: true,
    },
    links: {
      ...globalLinks,
      submitEventUrl: countyPagePath(draftCounty, "submit-event"),
      precinctMap: `https://www.google.com/search?q=${encodeURIComponent(`${displayName} ${state.name} precinct map`)}`,
      votingLocations: `https://www.google.com/search?q=${encodeURIComponent(`${displayName} ${state.name} voting locations`)}`,
      sampleBallot: `https://www.google.com/search?q=${encodeURIComponent(`${displayName} ${state.name} sample ballot`)}`,
      registerToVote: `https://www.google.com/search?q=${encodeURIComponent(`${state.name} register to vote`)}`,
      electedOfficialsLocal: `https://www.google.com/search?q=${encodeURIComponent(`${displayName} ${state.name} elected officials`)}`,
      electedOfficialsState: `https://www.google.com/search?q=${encodeURIComponent(`${state.name} elected officials`)}`,
      countyGop: `https://www.google.com/search?q=${encodeURIComponent(`${displayName} ${state.name} Republican Party`)}`,
      weather: countyPagePath(draftCounty, "weather"),
      localNews: countyPagePath(draftCounty, "local-news"),
      nationalNews: countyPagePath(draftCounty, "national-news"),
    },
  };
}
