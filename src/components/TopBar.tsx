import type { CountySite } from "../data/countyTypes";
import { organizationContact, organizationPhone, phoneHref } from "../lib/contact";
import { WeatherChip } from "./WeatherChip";

type TopBarProps = {
  county: CountySite;
  showWeather?: boolean;
};

export function TopBar({ county, showWeather = true }: TopBarProps) {
  const phone = organizationPhone(county.phone);

  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <a href={phoneHref(phone)}>{phone}</a>
        <a href={`mailto:${county.email || organizationContact.email}`}>{county.email || organizationContact.email}</a>
        {county.links.donateUrl ? (
          <a className="topbar-donate" href={county.links.donateUrl} target="_blank" rel="noreferrer">
            Donate Now
          </a>
        ) : null}
        <a className="topbar-community-button" href={county.links.communityUrl} target="_blank" rel="noreferrer">
          Join Our Interactive Community!
        </a>
        {showWeather ? <WeatherChip county={county} /> : null}
      </div>
    </div>
  );
}
