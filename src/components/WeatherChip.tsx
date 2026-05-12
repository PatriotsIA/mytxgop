import type { CountySite } from "../data/countyTypes";

export function WeatherChip({ county }: { county: CountySite }) {
  const place = county.primaryCity || county.displayName;
  return (
    <span className="weather-chip" aria-label={`Weather for ${place}`}>
      {place}: --°F
    </span>
  );
}
