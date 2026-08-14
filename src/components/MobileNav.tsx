import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { CountySite } from "../data/countyTypes";
import { countyPagePath, statePath } from "../lib/paths";

export function MobileNav({ county, showStateCountiesLink = true }: { county: CountySite; showStateCountiesLink?: boolean }) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="mobile-nav" ref={navRef}>
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
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="mobile-menu"
          onClick={(event) => {
            if ((event.target as Element).closest("a")) setOpen(false);
          }}
        >
          <Link to="/">Find Another County</Link>
          {showStateCountiesLink ? <Link to={statePath(county.state)}>{county.state.name} Counties</Link> : null}
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
          {county.links.donateUrl ? (
            <a href={county.links.donateUrl} target="_blank" rel="noreferrer">Donate</a>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
