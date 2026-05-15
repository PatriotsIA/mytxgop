import { Link } from "react-router-dom";
import type { CountySite } from "../data/countyTypes";
import { countyPagePath, countyPath } from "../lib/paths";

export function MegaNav({ county }: { county: CountySite }) {
  return (
    <nav className="desktop-nav" aria-label="Primary navigation">
      <Link to={countyPagePath(county, "about")}>About / Leadership</Link>
      <div className="nav-group">
        <button type="button">Elections & More</button>
        <div className="mega-panel">
          <a href={county.links.precinctMap}>Precinct Map</a>
          <a href={county.links.votingLocations}>Voting Locations</a>
          <a href={county.links.sampleBallot}>Sample Ballot</a>
          <a href={county.links.registerToVote}>How Do I Register to Vote</a>
          <a href={county.links.electedOfficialsLocal}>Elected Officials: Local</a>
          <a href={county.links.electedOfficialsState}>Elected Officials: State</a>
          <a href={county.links.electedOfficialsFederal}>Elected Officials: Federal</a>
          <a href="https://texasgop.org/platform/" target="_blank" rel="noreferrer">Texas Republican Platform</a>
          <a href="https://www.gop.com/platform/" target="_blank" rel="noreferrer">National Republican Platform</a>
        </div>
      </div>
      <div className="nav-group">
        <button type="button">News & Events</button>
        <div className="mega-panel">
          <Link to={countyPagePath(county, "weather")}>Weather</Link>
          <Link to={countyPagePath(county, "local-news")}>Local News</Link>
          <Link to={countyPagePath(county, "national-news")}>National News</Link>
          <Link to={countyPath(county)}>Events</Link>
          <a href={county.links.communityUrl} target="_blank" rel="noreferrer">Community</a>
          <a href={county.links.obituaries}>Local Obituaries</a>
        </div>
      </div>
      <a href={county.links.merch} target="_blank" rel="noreferrer">Merch</a>
      <a href={county.links.donateUrl} target="_blank" rel="noreferrer">Donate</a>
    </nav>
  );
}
