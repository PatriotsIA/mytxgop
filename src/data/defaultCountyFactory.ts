import { globalLinks } from "../lib/links";
import { slugifyCounty } from "../lib/slugifyCounty";
import { getCountyCalendarFeedUrl } from "./calendarFeeds";
import type { CountySite } from "./countyTypes";

const defaultContactEmail = import.meta.env.VITE_DEFAULT_CONTACT_TO_EMAIL || "info@mytexasgop.com";

export function createDefaultCountySite(name: string): CountySite {
  const slug = slugifyCounty(name);
  const displayName = `${name} County`;
  const calendarFeedUrl = getCountyCalendarFeedUrl(slug);

  return {
    name,
    slug,
    displayName,
    partyName: `${name} County GOP`,
    email: defaultContactEmail,
    emailSettings: {
      contactToEmail: defaultContactEmail,
      eventSubmissionToEmail: defaultContactEmail,
    },
    hero: {
      eyebrow: "My Texas GOP",
      title: `${name.toLowerCase()} county GOP`,
      subtitle:
        "Empowering our community to stand for conservative values, strengthen local leadership, and make a difference right here at home.",
      imageAlt: `${displayName} patriotic Texas landscape placeholder`,
    },
    intro: {
      heading: "operation show up",
      body: `Welcome to your County Republican Party--where local voices matter and community leadership begins. This is your home base for staying informed, getting involved, and making a real impact right here where you live. Together, we are working to uphold our values, support strong leadership, and ensure a brighter future for ${displayName}, our state, and our nation. We invite you to connect, participate, and stand with us--because real change starts at the local level.`,
    },
    calendar: {
      icsUrl: calendarFeedUrl,
      proxyUrl: calendarFeedUrl ? `/api/calendar?county=${slug}` : undefined,
      submitEventUrl: `/${slug}/submit-event`,
      useInternalSubmitEventForm: true,
    },
    links: {
      ...globalLinks,
      submitEventUrl: `/${slug}/submit-event`,
      weather: `/${slug}/weather`,
      localNews: `/${slug}/local-news`,
      nationalNews: `/${slug}/national-news`,
    },
  };
}
