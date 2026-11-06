import { beforeEach, expect, it, vi } from "vitest";
import { loadCountyCalendar } from "../../src/lib/county-calendar";
import { fetchSpaceEvents, normalizeMightyEvents } from "../../src/lib/mighty";
import { fetchCalendarFeed, fetchCombinedCalendarFeeds, parseIcsEvents } from "../../src/lib/calendar";

vi.mock("../../src/lib/mighty", () => ({
  mightyIsConfigured: () => true,
  fetchSpaceEvents: vi.fn(),
  normalizeMightyEvents: vi.fn(),
}));
vi.mock("../../src/lib/calendar", () => ({
  fetchCalendarFeed: vi.fn(), fetchCombinedCalendarFeeds: vi.fn(), parseIcsEvents: vi.fn(),
}));

beforeEach(() => { vi.resetAllMocks(); vi.stubEnv("DEV", false); });
const options = { spaceId: "123", proxyUrl: "/api/calendar?county=example", feedUrls: ["https://calendar.example/events.ics"] };

it("keeps a successfully loaded empty Mighty calendar without a failing ICS request", async () => {
  vi.mocked(fetchSpaceEvents).mockResolvedValue([]);
  vi.mocked(normalizeMightyEvents).mockReturnValue([]);
  expect(await loadCountyCalendar(options)).toEqual([]);
  expect(fetchCalendarFeed).not.toHaveBeenCalled();
  expect(fetchCombinedCalendarFeeds).not.toHaveBeenCalled();
});

it("tries the direct feed after a failed Mighty request and failed development proxy", async () => {
  vi.stubEnv("DEV", true);
  vi.mocked(fetchSpaceEvents).mockRejectedValue(new Error("Unavailable"));
  vi.mocked(fetchCalendarFeed).mockRejectedValue(new Error("Proxy unavailable"));
  vi.mocked(fetchCombinedCalendarFeeds).mockResolvedValue("calendar fixture");
  vi.mocked(parseIcsEvents).mockReturnValue([]);
  expect(await loadCountyCalendar(options)).toEqual([]);
  expect(fetchCalendarFeed).toHaveBeenCalledWith(options.proxyUrl);
  expect(fetchCombinedCalendarFeeds).toHaveBeenCalledWith(options.feedUrls);
});

it("never requests a nonexistent relative calendar API on static hosting", async () => {
  vi.mocked(fetchSpaceEvents).mockRejectedValue(new Error("Unavailable"));
  vi.mocked(fetchCombinedCalendarFeeds).mockRejectedValue(new Error("Feed unavailable"));
  await expect(loadCountyCalendar(options)).rejects.toThrow("Feed unavailable");
  expect(fetchCalendarFeed).not.toHaveBeenCalled();
});
