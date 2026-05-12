import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { counties } from "../data/counties";
import texasFlag from "../assets/placeholders/texas-flag-placeholder.svg";

export default function CountyFinder() {
  const [query, setQuery] = useState("");
  const filteredCounties = useMemo(
    () => counties.filter((county) => county.displayName.toLowerCase().includes(query.toLowerCase().trim())),
    [query],
  );

  return (
    <main>
      <section className="finder-hero">
        <div className="container finder-grid">
          <div>
            <p className="eyebrow">My Texas GOP</p>
            <h1>Find your county Republican Party</h1>
            <p>One data-driven county site system for every Texas county.</p>
            <label className="search-label" htmlFor="county-search">Search counties</label>
            <input
              id="county-search"
              className="county-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Potter, El Paso, Red River..."
            />
          </div>
          <img src={texasFlag} alt="Texas flag placeholder" />
        </div>
      </section>
      <section className="section">
        <div className="container county-grid" aria-live="polite">
          {filteredCounties.map((county) => (
            <Link key={county.slug} className="county-link-card" to={`/${county.slug}`}>
              <strong>{county.displayName}</strong>
              {county.isCustom ? <span>Custom demo</span> : <span>Default site</span>}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
