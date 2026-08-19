import type { CountySite } from "../data/countyTypes";
import { useCountyWeather } from "../lib/useCountyWeather";

export function WeatherChip({ county }: { county: CountySite }) {
  const place = county.primaryCity || county.displayName;
  const { data } = useCountyWeather(county);
  const temperature = data?.current?.temperature;
  const alerts = data?.alerts.length || 0;

  return (
    <span className="weather-chip" aria-label={`Weather for ${place}`}>
      {place}: {temperature === undefined ? "--°F" : `${temperature}°F`}
      {alerts ? ` · ${alerts} alert${alerts === 1 ? "" : "s"}` : ""}
    </span>
  );
}
