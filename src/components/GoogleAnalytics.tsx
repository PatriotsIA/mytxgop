import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

export function GoogleAnalytics() {
  const location = useLocation();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const path = location.pathname + location.search;

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    trackPageView(path);
  }, [location]);

  return null;
}
