import { useEffect, useMemo, useState } from "react";
import { getCountyCalendarUrls } from "../data/calendarFeeds";
import type { CountySite } from "../data/countyTypes";
import { fetchCalendarFeed, fetchCombinedCalendarFeeds, parseIcsEvents, type CalendarEvent } from "../lib/calendar";
import { Button } from "./Button";

const pageSize = 3;

function formatDate(event: CalendarEvent) {
  return event.start.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(event: CalendarEvent) {
  if (event.isAllDay) {
    return "All day";
  }

  const start = event.start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const end = event.end ? event.end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : undefined;
  return end ? `${start} - ${end}` : start;
}

export function EventCalendar({ county, mockIcsText }: { county: CountySite; mockIcsText?: string }) {
  const feedUrls = useMemo(() => getCountyCalendarUrls(county), [county]);
  const hasCalendarFeed = Boolean(county.calendar.proxyUrl || feedUrls.length || mockIcsText);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(hasCalendarFeed);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      if (!hasCalendarFeed) {
        setLoading(false);
        setEvents([]);
        return;
      }

      setLoading(true);
      setError("");
      try {
        let icsText = mockIcsText;

        if (!icsText && county.calendar.proxyUrl) {
          try {
            icsText = await fetchCalendarFeed(county.calendar.proxyUrl);
          } catch {
            // Local development may not have the serverless proxy running. Fall back to
            // direct configured feeds when CORS allows it.
          }
        }

        if (!icsText && !county.calendar.proxyUrl && feedUrls.length) {
          icsText = await fetchCombinedCalendarFeeds(feedUrls);
        }

        if (!icsText) {
          throw new Error("No calendar feed configured.");
        }

        const parsed = parseIcsEvents(icsText);
        if (active) {
          setEvents(parsed);
          setPage(0);
        }
      } catch {
        if (active) setError("We could not load this calendar feed right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadEvents();
    return () => {
      active = false;
    };
  }, [county.calendar.proxyUrl, feedUrls, hasCalendarFeed, mockIcsText]);

  const visibleEvents = useMemo(() => events.slice(page * pageSize, page * pageSize + pageSize), [events, page]);
  const hasPrevious = page > 0;
  const hasNext = (page + 1) * pageSize < events.length;

  if (!hasCalendarFeed) {
    return <div className="calendar-empty">No calendar feed has been added for this county yet.</div>;
  }

  if (loading) {
    return <div className="calendar-empty">Loading community events...</div>;
  }

  if (error) {
    return <div className="calendar-error">{error}</div>;
  }

  if (!events.length) {
    return <div className="calendar-empty">No upcoming events are listed yet.</div>;
  }

  return (
    <div className="calendar">
      {visibleEvents.map((event, index) => {
        const month = event.start.toLocaleDateString(undefined, { month: "long", year: "numeric" });
        const previousEvent = visibleEvents[index - 1];
        const previousMonth = previousEvent?.start.toLocaleDateString(undefined, { month: "long", year: "numeric" });
        const showMonth = month !== previousMonth;

        return (
          <div key={event.id}>
            {showMonth ? <h3 className="month-divider">{month}</h3> : null}
            <article className="event-card">
              <h4>{event.title}</h4>
              <p>{formatDate(event)} · {formatTime(event)}</p>
              {event.location ? <p>{event.location}</p> : null}
              {event.eventLink ? <Button href={event.eventLink}>View Event →</Button> : null}
            </article>
          </div>
        );
      })}
      <div className="calendar-pagination">
        <Button variant="secondary" disabled={!hasPrevious} onClick={() => setPage((current) => Math.max(0, current - 1))}>Previous</Button>
        <Button variant="secondary" disabled={!hasNext} onClick={() => setPage((current) => current + 1)}>Next</Button>
      </div>
    </div>
  );
}
