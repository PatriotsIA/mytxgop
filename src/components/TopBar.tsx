import type { CountySite } from "../data/countyTypes";
import { organizationContact, organizationPhone, phoneHref } from "../lib/contact";
import { WeatherChip } from "./WeatherChip";

export function TopBar({ county }: { county: CountySite }) {
  const phone = organizationPhone(county.phone);

  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <strong>Meet Your Neighbors!</strong>
        <a href={county.links.communityUrl} target="_blank" rel="noreferrer">
          CHAT HERE
        </a>
        <a href={phoneHref(phone)}>{phone}</a>
        <a href={`mailto:${county.email || organizationContact.email}`}>{county.email || organizationContact.email}</a>
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
