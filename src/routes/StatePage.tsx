import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getCountiesForState, getCountyBySlug, getStateBySlug } from "../data/counties";
import { countyPath, statePath } from "../lib/paths";
import { setPageSeo } from "../lib/seo";

export default function StatePage() {
  const { stateSlug } = useParams();
  const state = getStateBySlug(stateSlug);
  const legacyCounty = state ? undefined : getCountyBySlug(stateSlug);
  const [query, setQuery] = useState("");

  const counties = useMemo(() => getCountiesForState(state?.slug), [state?.slug]);
  const filteredCounties = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return counties;

    return counties.filter((county) =>
      [
        county.displayName,
        county.name,
        county.slug,
        county.primaryCity,
        county.fips,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery)),
    );
  }, [counties, query]);

  useEffect(() => {
    if (state) {
      setPageSeo(`${state.name} County GOP Directory | My Local GOP`, `Find county Republican Party pages across ${state.name}.`, statePath(state));
    }
  }, [state]);

  if (legacyCounty) return <Navigate to={countyPath(legacyCounty)} replace />;
  if (!state) return <Navigate to="/not-found" replace />;
  if (stateSlug?.toLowerCase() !== state.abbr.toLowerCase()) return <Navigate to={statePath(state)} replace />;

  return (
    <main>
      <section className="finder-hero">
        <div className="container finder-grid">
          <div className="hero-panel">
            <p className="eyebrow">My Local GOP</p>
            <h1>{state.name} county directory</h1>
            <p>Find the county-specific GOP page for every county in {state.name}.</p>
            <label className="search-label" htmlFor="state-county-search">Search {state.name} counties</label>
            <input
              id="state-county-search"
              className="county-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by county, city, slug, or FIPS..."
            />
          </div>
          <div className="finder-stat-card">
            <strong>{counties.length}</strong>
            <span>county pages</span>
            <Link to="/">Search all states</Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container result-summary" aria-live="polite">
          Showing {filteredCounties.length} of {counties.length} counties
        </div>
        <div className="container county-grid" aria-live="polite">
          {filteredCounties.map((county) => (
            <Link key={`${county.state.slug}-${county.slug}`} className="county-link-card" to={countyPath(county)}>
              <strong>{county.displayName}</strong>
              <span>{county.fips ? `FIPS ${county.fips}` : `${state.name} county page`}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
