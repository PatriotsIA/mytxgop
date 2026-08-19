import { useEffect, useState } from "react";
import type { CountySite } from "../data/countyTypes";
import { fetchCountyWeather, type CountyWeather } from "./weather";

type WeatherState = {
  loadedKey: string | null;
  data?: CountyWeather;
  failed: boolean;
};

export function useCountyWeather(county: CountySite) {
  const requestKey = county.fips.padStart(5, "0");
  const [state, setState] = useState<WeatherState>({
    loadedKey: null,
    failed: false,
  });

  useEffect(() => {
    let active = true;

    fetchCountyWeather(county)
      .then((data) => {
        if (active) setState({ loadedKey: requestKey, data, failed: false });
      })
      .catch(() => {
        if (active) setState({ loadedKey: requestKey, failed: true });
      });

    return () => {
      active = false;
    };
  }, [county, requestKey]);

  return {
    data: state.loadedKey === requestKey ? state.data : undefined,
    loading: state.loadedKey !== requestKey,
    failed: state.loadedKey === requestKey && state.failed,
  };
}
