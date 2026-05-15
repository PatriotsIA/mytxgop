import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { countyCalendarFeedsBySlug, type CountyCalendarSlug } from "./src/data/calendarFeeds";

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

function calendarApiDevMiddleware(): Plugin {
  return {
    name: "mytxgop-calendar-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/calendar", async (request, response) => {
        const requestUrl = new URL(request.url || "", "http://localhost");
        const state = requestUrl.searchParams.get("state")?.toLowerCase() || "texas";
        const county = requestUrl.searchParams.get("county")?.toLowerCase();
        const feedUrl =
          county && (state === "texas" || state === "tx")
            ? countyCalendarFeedsBySlug[county as CountyCalendarSlug]
            : undefined;

        if (!feedUrl) {
          response.statusCode = 404;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify({ error: "Calendar feed is not configured for this county." }));
          return;
        }

        try {
          const feedResponse = await fetch(normalizeCalendarFeedUrl(feedUrl));
          if (!feedResponse.ok) {
            response.statusCode = feedResponse.status === 429 ? 429 : 502;
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.end(JSON.stringify({ error: `Calendar feed could not be loaded. Upstream status: ${feedResponse.status}.` }));
            return;
          }

          const feedText = await feedResponse.text();
          response.statusCode = 200;
          response.setHeader("Access-Control-Allow-Origin", "*");
          response.setHeader("Cache-Control", "no-store");
          response.setHeader("Content-Type", "text/calendar; charset=utf-8");
          response.end(combineIcsFeeds([feedText]));
        } catch {
          response.statusCode = 502;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify({ error: "Calendar feed could not be loaded." }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [calendarApiDevMiddleware(), react()],
});
