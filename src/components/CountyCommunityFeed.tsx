import { useEffect, useState } from "react";
import type { CountySite } from "../data/countyTypes";
import { getCountyMightySpaceId } from "../data/calendarFeeds";
import { fetchSpaceFeed, mightyIsConfigured, type MightyPost } from "../lib/mighty";
import { countyPagePath } from "../lib/paths";
import { Button } from "./Button";

const missingCommunityMessage =
  "Live in This County and Want to get Involved & Informed? Contact us to Get Your County’s Community Calendar & Community Feed set up.";

function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatPostDate(post: MightyPost) {
  const value = post.published_at || post.updated_at || post.created_at;
  if (!value) return "Recent post";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent post";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function CountyCommunityFeed({ county }: { county: CountySite }) {
  const spaceId = getCountyMightySpaceId(county);
  const canFetch = Boolean(spaceId && mightyIsConfigured());
  const requestKey = canFetch && spaceId ? spaceId : "missing-space";
  const [state, setState] = useState<{ loadedKey: string | null; posts: MightyPost[]; fetchFailed: boolean }>({
    loadedKey: null,
    posts: [],
    fetchFailed: false,
  });

  useEffect(() => {
    let active = true;

    async function loadFeed() {
      if (!canFetch || !spaceId) {
        if (active) {
          setState({ loadedKey: requestKey, posts: [], fetchFailed: false });
        }
        return;
      }

      try {
        const results = await fetchSpaceFeed(spaceId, 20);
        if (!active) return;
        setState({
          loadedKey: requestKey,
          posts: results.filter((post) => stripHtml(post.title || post.summary || post.description).length > 0).slice(0, 8),
          fetchFailed: false,
        });
      } catch {
        if (!active) return;
        setState({ loadedKey: requestKey, posts: [], fetchFailed: true });
      }
    }

    loadFeed();
    return () => {
      active = false;
    };
  }, [canFetch, requestKey, spaceId]);

  const loading = state.loadedKey !== requestKey;
  const posts = state.posts;
  const fetchFailed = state.fetchFailed;

  if (loading) {
    return <div className="calendar-empty">Loading county community feed...</div>;
  }

  if (fetchFailed || !posts.length) {
    return (
      <div className="calendar-empty community-fallback">
        <p>{missingCommunityMessage}</p>
        <Button to={countyPagePath(county, "contact-us")}>Contact {county.displayName}</Button>
      </div>
    );
  }

  return (
    <div className="community-feed-grid">
      {posts.map((post) => {
        const title = stripHtml(post.title || post.summary || post.description || "County community update");
        const preview = stripHtml(post.summary || post.description || "");

        return (
          <article key={String(post.id)} className="community-post-card">
            <h3>{title}</h3>
            <p className="community-post-date">{formatPostDate(post)}</p>
            {preview ? <p>{preview}</p> : null}
            {post.permalink ? <Button href={post.permalink} variant="secondary">View Post</Button> : null}
          </article>
        );
      })}
    </div>
  );
}
