import type { CountySite } from "../data/countyTypes";

const configuredApiBase = import.meta.env.VITE_MIGHTY_API_BASE?.replace(/\/+$/, "");
const apiBase = import.meta.env.DEV && configuredApiBase ? "/api/mighty" : configuredApiBase;
const WEATHER_CACHE_MS = 5 * 60 * 1000;

type CountyCentroids = {
  counties: Record<string, { latitude: number; longitude: number }>;
};

export type CountyWeather = {
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
    timeZone?: string;
  };
  current?: {
    observedAt?: string;
    temperature?: number;
    temperatureUnit: "F";
    description?: string;
    icon?: string;
    humidity?: number;
    windSpeed?: number;
    windDirection?: number;
  };
  forecast: Array<{
    number: number;
    name: string;
    startTime?: string;
    endTime?: string;
    isDaytime?: boolean;
    temperature?: number;
    temperatureUnit?: string;
    precipitationChance?: number;
    windSpeed?: string;
    windDirection?: string;
    icon?: string;
    shortForecast?: string;
    detailedForecast?: string;
  }>;
  alerts: Array<{
    id: string;
    event: string;
    headline?: string;
    description?: string;
    instruction?: string;
    severity?: string;
    urgency?: string;
    certainty?: string;
    area?: string;
    onset?: string;
    effective?: string;
    expires?: string;
    ends?: string;
    sender?: string;
  }>;
  updatedAt?: string;
};

let centroidRequest: Promise<CountyCentroids> | undefined;
const weatherCache = new Map<string, { expiresAt: number; data: CountyWeather }>();
const pendingRequests = new Map<string, Promise<CountyWeather>>();

async function loadCentroids() {
  centroidRequest ??= fetch("/data/county-centroids.json", { cache: "force-cache" }).then(async (response) => {
    if (!response.ok) throw new Error("County coordinates could not be loaded.");
    return (await response.json()) as CountyCentroids;
  });
  return centroidRequest;
}

async function requestCountyWeather(county: CountySite) {
  if (!apiBase) {
    throw new Error("Weather service is not configured.");
  }

  const centroids = await loadCentroids();
  const coordinates = centroids.counties[county.fips.padStart(5, "0")];
  if (!coordinates) {
    throw new Error("Weather coordinates are unavailable for this county.");
  }

  const search = new URLSearchParams({
    lat: String(coordinates.latitude),
    lon: String(coordinates.longitude),
  });
  const response = await fetch(`${apiBase}/weather?${search}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Weather service request failed: ${response.status}`);
  }
  return (await response.json()) as CountyWeather;
}

export async function fetchCountyWeather(county: CountySite) {
  const cacheKey = county.fips.padStart(5, "0");
  const cached = weatherCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  let pending = pendingRequests.get(cacheKey);
  if (!pending) {
    pending = requestCountyWeather(county)
      .then((data) => {
        weatherCache.set(cacheKey, { expiresAt: Date.now() + WEATHER_CACHE_MS, data });
        return data;
      })
      .finally(() => pendingRequests.delete(cacheKey));
    pendingRequests.set(cacheKey, pending);
  }
  return pending;
}
