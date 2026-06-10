import { useState } from "react";
import { Link } from "react-router-dom";
import type { CountySite } from "../data/countyTypes";
import { countyPagePath, statePath } from "../lib/paths";

export function MobileNav({ county }: { county: CountySite }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="hamburger"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((current) => !current)}
      >
        Menu
      </button>
      {open ? (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="mobile-menu">
          <Link to="/">Find Another County</Link>
          <Link to={statePath(county.state)}>{county.state.name} Counties</Link>
          <Link to={countyPagePath(county, "about")}>About / Leadership</Link>
          <Link to={countyPagePath(county, "support-report")}>Support Report</Link>
          <Link to={countyPagePath(county, "contact-us")}>Contact Us</Link>
          <Link to={countyPagePath(county, "submit-event")}>Submit Event</Link>
          <Link to={countyPagePath(county, "weather")}>Weather</Link>
          <Link to={countyPagePath(county, "local-news")}>Local News</Link>
          <Link to={countyPagePath(county, "national-news")}>National News</Link>
          <a href={county.links.precinctMap}>Precinct Map</a>
          <a href={county.links.votingLocations}>Voting Locations</a>
          <a href={county.links.registerToVote}>Register to Vote</a>
          <a href={county.links.communityUrl} target="_blank" rel="noreferrer">Community</a>
          <a href={county.links.merch} target="_blank" rel="noreferrer">Merch</a>
          <a href={county.links.donateUrl} target="_blank" rel="noreferrer">Donate</a>
        </nav>
      ) : null}
    </div>
  );
}
