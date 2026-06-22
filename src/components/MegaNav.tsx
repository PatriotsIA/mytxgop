import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { CountySite } from "../data/countyTypes";
import { countyPagePath, countyPath, statePath } from "../lib/paths";

type OpenMenu = "elections" | "news" | null;

export function MegaNav({ county }: { county: CountySite }) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function toggleMenu(menu: Exclude<OpenMenu, null>) {
    setOpenMenu((current) => (current === menu ? null : menu));
  }

  return (
    <nav ref={navRef} className="desktop-nav" aria-label="Primary navigation">
      <Link to="/">Find Another County</Link>
      <Link to={statePath(county.state)}>{county.state.abbr} Counties</Link>
      <Link to={countyPagePath(county, "about")}>About / Leadership</Link>
      <Link to={countyPagePath(county, "support-report")}>Support Report</Link>
      <div className={`nav-group${openMenu === "elections" ? " is-open" : ""}`}>
        <button
          type="button"
          aria-expanded={openMenu === "elections"}
          aria-haspopup="true"
          onClick={() => toggleMenu("elections")}
        >
          Elections & More
        </button>
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
      <div className={`nav-group${openMenu === "news" ? " is-open" : ""}`}>
        <button
          type="button"
          aria-expanded={openMenu === "news"}
          aria-haspopup="true"
          onClick={() => toggleMenu("news")}
        >
          News & Events
        </button>
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
      {county.links.donateUrl ? (
        <a href={county.links.donateUrl} target="_blank" rel="noreferrer">Donate</a>
      ) : null}
    </nav>
  );
}
