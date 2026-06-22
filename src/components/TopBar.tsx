import type { CountySite } from "../data/countyTypes";
import { WeatherChip } from "./WeatherChip";

export function TopBar({ county }: { county: CountySite }) {
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <strong>Meet Your Neighbors!</strong>
        <a href={county.links.communityUrl} target="_blank" rel="noreferrer">
          CHAT HERE
        </a>
        {county.phone ? <a href={`tel:${county.phone}`}>{county.phone}</a> : null}
        <a href={`mailto:${county.email || "info@mytexasgop.com"}`}>{county.email || "info@mytexasgop.com"}</a>
        {county.links.donateUrl ? (
          <a className="topbar-donate" href={county.links.donateUrl} target="_blank" rel="noreferrer">
            Donate Now
          </a>
        ) : null}
        <a className="community-link" href={county.links.communityUrl} target="_blank" rel="noreferrer">
          Join Our Interactive Community!
        </a>
        <WeatherChip county={county} />
      </div>
    </div>
  );
}
