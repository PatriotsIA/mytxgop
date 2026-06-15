export const GA_MEASUREMENT_ID = "G-6EB1L635QW";

export function trackPageView(path: string) {
  if (typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: path });
}
