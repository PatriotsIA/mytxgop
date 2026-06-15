/// <reference types="vite/client" />

interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
}

declare module "@nickgraffis/us-counties" {
  export type UsCountyRecord = {
    FIPS: string;
    name: string;
    state: string;
  };

  export function getCountyByState(state: string): UsCountyRecord[];
}
