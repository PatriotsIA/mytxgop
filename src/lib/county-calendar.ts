import { fetchCalendarFeed, fetchCombinedCalendarFeeds, parseIcsEvents } from "./calendar";
import { fetchSpaceEvents, mightyIsConfigured, normalizeMightyEvents } from "./mighty";

export async function loadCountyCalendar({
  spaceId,
  proxyUrl,
  feedUrls,
  mockIcsText,
}: {
  spaceId?: string;
  proxyUrl?: string;
  feedUrls: string[];
  mockIcsText?: string;
}) {
  if (mockIcsText) return parseIcsEvents(mockIcsText);

  if (spaceId && mightyIsConfigured()) {
    try {
      // A successful empty response is an empty calendar, not a broken connection.
      return normalizeMightyEvents(await fetchSpaceEvents(spaceId, 100));
    } catch {
      // Try the configured ICS source only after an actual Mighty failure.
    }
  }

  // Amplify serves a static SPA: its relative /api path is not a calendar proxy.
  if (proxyUrl && (import.meta.env.DEV || /^https?:\/\//i.test(proxyUrl))) {
    try {
      return parseIcsEvents(await fetchCalendarFeed(proxyUrl));
    } catch {
      // A failed proxy must not prevent the direct configured fallback.
    }
  }

  if (feedUrls.length) return parseIcsEvents(await fetchCombinedCalendarFeeds(feedUrls));
  throw new Error("The county calendar could not be loaded.");
}
