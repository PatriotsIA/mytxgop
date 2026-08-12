const mightyBase = import.meta.env.VITE_MIGHTY_API_BASE?.replace(/\/$/, "");

type MightyListResponse<T> = {
  items?: T[];
};

export type MightyPost = {
  id: number | string;
  title?: string;
  summary?: string;
  description?: string;
  permalink?: string;
  images?: string[];
  published_at?: string;
  updated_at?: string;
  created_at?: string;
};

export type MightyEvent = {
  id: number | string;
  title?: string;
  summary?: string;
  description?: string;
  permalink?: string;
  starts_at?: string;
  ends_at?: string;
  location?: string;
  link?: string;
  published_at?: string;
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
