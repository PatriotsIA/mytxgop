import ICAL from "ical.js";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  eventLink?: string;
  location?: string;
  description?: string;
  isAllDay?: boolean;
};

const twoYearsFromNow = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 2);
  return date;
};

export async function fetchCalendarFeed(icsUrl: string): Promise<string> {
  // Browser fetch works only when the feed allows CORS. If it does not, wire a safe
  // allowlisted /api/calendar?county=slug proxy as documented in README.md.
  const response = await fetch(normalizeCalendarFeedUrl(icsUrl), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Calendar feed failed with ${response.status}`);
  }

  const icsText = await response.text();
  if (!/BEGIN:VCALENDAR/i.test(icsText)) {
    throw new Error("Calendar feed response was not ICS text.");
  }

  return icsText;
}

export function normalizeCalendarFeedUrl(icsUrl: string) {
  const stableUrl = icsUrl.replace(/&(?:nocache|utm_source)=[^&]*/g, "");
  return stableUrl.startsWith("webcal://") ? `https://${stableUrl.slice("webcal://".length)}` : stableUrl;
}

export function combineIcsFeeds(icsTexts: string[]) {
  const combinedEvents = icsTexts
    .map((icsText) => icsText.replace(/BEGIN:VCALENDAR|END:VCALENDAR/gi, "").trim())
    .filter(Boolean)
    .join("\n");

  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MyTexasGOP//CountyCalendar//EN\n${combinedEvents}\nEND:VCALENDAR`;
}

export async function fetchCombinedCalendarFeeds(icsUrls: string[]) {
  const results = await Promise.allSettled(icsUrls.map((icsUrl) => fetchCalendarFeed(icsUrl)));
  const feedTexts = results
    .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
    .map((result) => result.value);

  if (!feedTexts.length) {
    throw new Error("No calendar feeds could be loaded.");
  }

  return combineIcsFeeds(feedTexts);
}

export function extractCommunityEventLink(description = "") {
  return description.match(/https:\/\/community\.patriotsinaction\.com\/[^\s<)"]+/i)?.[0];
}

function toEvent(component: ICAL.Component, occurrence?: { startDate: ICAL.Time; endDate?: ICAL.Time }): CalendarEvent {
  const event = new ICAL.Event(component);
  const startTime = occurrence?.startDate || event.startDate;
  const endTime = occurrence?.endDate || event.endDate;
  const start = startTime.toJSDate();
  const end = endTime?.toJSDate();
  const description = event.description || "";

  return {
    id: `${event.uid || event.summary}-${start.toISOString()}`,
    title: event.summary || "Untitled event",
    start,
    end,
    eventLink: extractCommunityEventLink(description),
    location: event.location || undefined,
    description,
    isAllDay: Boolean(startTime.isDate),
  };
}

export function expandRecurringEvents(component: ICAL.Component, futureLimit = twoYearsFromNow()): CalendarEvent[] {
  const event = new ICAL.Event(component);

  if (!event.isRecurring()) {
    return [toEvent(component)];
  }

  const results: CalendarEvent[] = [];
  const iterator = event.iterator();
  const seen = new Set<string>();
  let next = iterator.next();

  while (next) {
    const start = next.toJSDate();
    if (start > futureLimit) {
      break;
    }

    const key = start.toISOString();
    if (!seen.has(key)) {
      seen.add(key);
      const duration = event.endDate?.subtractDate(event.startDate);
      const endDate = duration ? next.clone() : undefined;
      if (endDate && duration) {
        endDate.addDuration(duration);
      }
      results.push(toEvent(component, { startDate: next, endDate }));
    }
    next = iterator.next();
  }

  return results;
}

export function dedupeEvents(events: CalendarEvent[]) {
  const seen = new Set<string>();

  return events.filter((event) => {
    const key = `${event.title.toLowerCase()}-${event.start.toISOString()}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function sortEvents(events: CalendarEvent[]) {
  return [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function parseIcsEvents(icsText: string): CalendarEvent[] {
  const jcal = ICAL.parse(icsText);
  const calendar = new ICAL.Component(jcal);
  const now = new Date();
  const futureLimit = twoYearsFromNow();
  const events = calendar
    .getAllSubcomponents("vevent")
    .flatMap((component) => expandRecurringEvents(component, futureLimit))
    .filter((event) => (event.end || event.start) >= now);

  return sortEvents(dedupeEvents(events));
}
