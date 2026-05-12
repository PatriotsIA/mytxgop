import { useState } from "react";
import { Link } from "react-router-dom";
import type { CountySite } from "../data/countyTypes";

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
          <Link to={`/${county.slug}/about`}>About / Leadership</Link>
          <Link to={`/${county.slug}/contact-us`}>Contact Us</Link>
          <Link to={`/${county.slug}/submit-event`}>Submit Event</Link>
          <Link to={`/${county.slug}/weather`}>Weather</Link>
          <Link to={`/${county.slug}/local-news`}>Local News</Link>
          <Link to={`/${county.slug}/national-news`}>National News</Link>
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
