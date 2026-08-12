import { useMemo, useState } from "react";
import type { CountySite } from "../data/countyTypes";
import { countyPath } from "../lib/paths";
import { Button } from "./Button";

function isDismissed(storageKey: string) {
  if (typeof window === "undefined") return true;

  try {
    return window.sessionStorage.getItem(storageKey) === "true";
  } catch {
    return false;
  }
}

export function CountyBookmarkToast({ county }: { county: CountySite }) {
  const storageKey = `mytxgop-bookmark-toast-dismissed:${county.state.slug}/${county.slug}`;
  const [visible, setVisible] = useState(() => !isDismissed(storageKey));
  const [status, setStatus] = useState("");
  const countyUrl = useMemo(() => {
    if (typeof window === "undefined") return countyPath(county);
    return new URL(countyPath(county), window.location.origin).toString();
  }, [county]);
  const bookmarkTitle = `${county.displayName}, ${county.state.name} | My Local GOP`;

  if (!visible) return null;

  function dismiss() {
    try {
      window.sessionStorage.setItem(storageKey, "true");
    } catch {
      // Ignore storage failures; the toast can still close for this render.
    }
    setVisible(false);
  }

  async function handleBookmark() {
    const legacyWindow = window as Window & {
      external?: { AddFavorite?: (url: string, title: string) => void };
      sidebar?: { addPanel?: (title: string, url: string, content?: string) => void };
    };

    try {
      if (legacyWindow.external?.AddFavorite) {
        legacyWindow.external.AddFavorite(countyUrl, bookmarkTitle);
        setStatus("Bookmark prompt opened.");
        return;
      }

      if (legacyWindow.sidebar?.addPanel) {
        legacyWindow.sidebar.addPanel(bookmarkTitle, countyUrl, "");
        setStatus("Bookmark prompt opened.");
        return;
      }
    } catch {
      // Modern browsers may expose but block legacy bookmark APIs.
    }

    try {
      await navigator.clipboard.writeText(countyUrl);
      setStatus("Link copied.");
    } catch {
      setStatus("Use the instructions below to save this county.");
    }
  }

  return (
    <aside className="bookmark-toast" role="status" aria-live="polite">
      <button className="bookmark-toast-close" type="button" onClick={dismiss} aria-label="Dismiss bookmark reminder">
        x
      </button>
      <p className="eyebrow">Save Your County</p>
      <h2>Bookmark {county.displayName}</h2>
      <p>Keep your county page handy so you can quickly return to local updates, weather, events, and resources.</p>
      <div className="bookmark-toast-actions">
        <Button type="button" onClick={handleBookmark}>Bookmark this county</Button>
        <Button type="button" variant="secondary" onClick={dismiss}>Not now</Button>
      </div>
      {status ? (
        <div className="bookmark-toast-instructions">
          <p className="bookmark-toast-status">{status}</p>
          <p><strong>Desktop:</strong> Press Ctrl+D on Windows/Linux or Cmd+D on Mac.</p>
          <p><strong>Mobile:</strong> iPhone/iPad: tap Share, then Add Bookmark or Add to Home Screen. Android: tap the browser menu, then Star or Add to Home screen.</p>
        </div>
      ) : null}
    </aside>
  );
}
