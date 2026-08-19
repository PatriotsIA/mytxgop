import type { CountySite } from "../data/countyTypes";
import { countyPagePath } from "../lib/paths";
import { useCountyWeather } from "../lib/useCountyWeather";
import { Button } from "./Button";

function formatWeatherTime(value?: string, timeZone?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
}

export function CountyWeatherPanel({ county, compact = false }: { county: CountySite; compact?: boolean }) {
  const { data, loading, failed } = useCountyWeather(county);

  if (loading) {
    return <div className="weather-status">Loading National Weather Service data...</div>;
  }

  if (failed || !data) {
    return (
      <div className="weather-status weather-status-error">
        <p>Weather data is temporarily unavailable.</p>
        <a href="https://www.weather.gov/" target="_blank" rel="noreferrer">Check Weather.gov</a>
      </div>
    );
  }

  const periods = data.forecast.slice(0, compact ? 4 : 8);
  const observedAt = formatWeatherTime(data.current?.observedAt, data.location.timeZone);

  return (
    <div className={`county-weather${compact ? " county-weather-compact" : ""}`}>
      {data.alerts.length ? (
        <div className="weather-alerts" aria-live="polite">
          <div className="weather-alerts-heading">
            <span aria-hidden="true">!</span>
            <div>
              <p className="eyebrow">Active Weather Alerts</p>
              <h2>{data.alerts.length} alert{data.alerts.length === 1 ? "" : "s"} for {county.displayName}</h2>
            </div>
          </div>
          {data.alerts.map((alert) => (
            <article className={`weather-alert weather-alert-${(alert.severity || "unknown").toLowerCase()}`} key={alert.id}>
              <h3>{alert.headline || alert.event}</h3>
              <p className="weather-alert-meta">
                {[alert.severity, alert.urgency, alert.area].filter(Boolean).join(" · ")}
              </p>
              {!compact && alert.description ? <p>{alert.description}</p> : null}
              {!compact && alert.instruction ? <p><strong>What to do:</strong> {alert.instruction}</p> : null}
              {alert.expires ? <p className="weather-alert-expires">Expires {formatWeatherTime(alert.expires, data.location.timeZone)}</p> : null}
            </article>
          ))}
        </div>
      ) : null}

      <div className="weather-overview">
        <article className="weather-current">
          <div>
            <p className="eyebrow">Current Conditions</p>
            <h2>{county.displayName}</h2>
            <p>{data.current?.description || "Current conditions"}</p>
          </div>
          <div className="weather-current-reading">
            {data.current?.icon ? <img src={data.current.icon} alt="" /> : null}
            {data.current?.temperature !== undefined ? (
              <strong>{data.current.temperature}°{data.current.temperatureUnit}</strong>
            ) : null}
          </div>
          <dl className="weather-details">
            {data.current?.humidity !== undefined ? <><dt>Humidity</dt><dd>{data.current.humidity}%</dd></> : null}
            {data.current?.windSpeed !== undefined ? <><dt>Wind</dt><dd>{data.current.windSpeed} mph</dd></> : null}
            {observedAt ? <><dt>Observed</dt><dd>{observedAt}</dd></> : null}
          </dl>
        </article>

        <div className="weather-forecast">
          {periods.map((period) => (
            <article className="weather-period" key={period.number}>
              <h3>{period.name}</h3>
              {period.icon ? <img src={period.icon} alt="" loading="lazy" /> : null}
              {period.temperature !== undefined ? <strong>{period.temperature}°{period.temperatureUnit || "F"}</strong> : null}
              <p>{period.shortForecast}</p>
              {period.precipitationChance !== undefined ? <span>Rain: {period.precipitationChance}%</span> : null}
            </article>
          ))}
        </div>
      </div>

      <div className="weather-source">
        <span>Official data from the National Weather Service</span>
        {compact ? <Button to={countyPagePath(county, "weather")} variant="secondary">Full Forecast</Button> : null}
        <a href="https://www.weather.gov/documentation/services-web-api" target="_blank" rel="noreferrer">About NWS data</a>
      </div>
    </div>
  );
}
