const configuredMightyBase = import.meta.env.VITE_MIGHTY_API_BASE?.replace(/\/+$/, "");
const mightyBase = import.meta.env.DEV && configuredMightyBase ? "/api/mighty" : configuredMightyBase;

type MightyListResponse<T> = {
  items?: T[];
};

export type MightyPost = {
  id: number | string;
  title?: string | null;
  summary?: string | null;
  description?: string | null;
  permalink?: string;
  images?: (string | null)[];
  published_at?: string | null;
  updated_at?: string;
  created_at?: string;
};

export type MightyEvent = {
  id: number | string;
  title?: string | null;
  summary?: string | null;
  description?: string | null;
  permalink?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  location?: string | null;
  link?: string | null;
  published_at?: string | null;
  created_at?: string;
};

async function fetchJson<T>(path: string) {
  if (!mightyBase) {
    throw new Error("Mighty API base URL is not configured.");
  }

  const response = await fetch(`${mightyBase}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Mighty API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function mightyIsConfigured() {
  return Boolean(mightyBase);
}

export async function fetchSpaceFeed(spaceId: string, perPage = 25): Promise<MightyPost[]> {
  const data = await fetchJson<MightyListResponse<MightyPost>>(`/spaces/${spaceId}/feed?per_page=${perPage}`);
  return data.items || [];
}

export async function fetchSpaceEvents(spaceId: string, perPage = 50): Promise<MightyEvent[]> {
  const data = await fetchJson<MightyListResponse<MightyEvent>>(`/spaces/${spaceId}/events?per_page=${perPage}`);
  return data.items || [];
}
