import { countyCalendarFeedsBySlug, type CountyCalendarSlug } from "../src/data/calendarFeeds";

type VercelRequest = {
  query: {
    county?: string | string[];
  };
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  setHeader: (key: string, value: string) => void;
  send: (body: string) => void;
  json: (body: unknown) => void;
};

function normalizeCalendarFeedUrl(icsUrl: string) {
  const stableUrl = icsUrl.replace(/&(?:nocache|utm_source)=[^&]*/g, "");
  return stableUrl.startsWith("webcal://") ? `https://${stableUrl.slice("webcal://".length)}` : stableUrl;
}

function combineIcsFeeds(icsTexts: string[]) {
  const combinedEvents = icsTexts
    .map((icsText) => icsText.replace(/BEGIN:VCALENDAR|END:VCALENDAR/gi, "").trim())
    .filter(Boolean)
    .join("\n");

  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MyTexasGOP//CountyCalendar//EN\n${combinedEvents}\nEND:VCALENDAR`;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const county = Array.isArray(request.query.county) ? request.query.county[0] : request.query.county;
  const feedUrl = county ? countyCalendarFeedsBySlug[county.toLowerCase() as CountyCalendarSlug] : undefined;

  if (!feedUrl) {
    response.status(404).json({ error: "Calendar feed is not configured for this county." });
    return;
  }

  try {
    const feedResponse = await fetch(normalizeCalendarFeedUrl(feedUrl));
    if (!feedResponse.ok) {
      response
        .status(feedResponse.status === 429 ? 429 : 502)
        .json({ error: `Calendar feed could not be loaded. Upstream status: ${feedResponse.status}.` });
      return;
    }
    const feedText = await feedResponse.text();

    response.setHeader("Content-Type", "text/calendar; charset=utf-8");
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
    response.send(combineIcsFeeds([feedText]));
  } catch {
    response.status(502).json({ error: "Calendar feed could not be loaded." });
  }
}
