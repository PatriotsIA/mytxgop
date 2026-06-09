import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { counties, states } from "../data/counties";
import { countyPath, statePath } from "../lib/paths";
import districtOfColumbiaFlag from "../assets/flags/district-of-columbia.svg";

function normalizeSearch(value: string) {
  return value.toLowerCase().trim();
}

function matchesState(state: (typeof states)[number], query: string) {
  if (!query) return true;
  return [state.name, state.abbr, state.slug].some((value) => value.toLowerCase().includes(query));
}

function matchesCounty(county: (typeof counties)[number], query: string) {
  if (!query) return true;
  return [
    county.displayName,
    county.name,
    county.slug,
    county.state.name,
    county.state.abbr,
    county.primaryCity,
    county.fips,
  ]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(query));
}

function stateFlagUrl(abbr: string) {
  if (abbr.toLowerCase() === "dc") {
    return districtOfColumbiaFlag;
  }

  return `https://flagcdn.com/h80/us-${abbr.toLowerCase()}.png`;
}

function countyCountLabel(count: number) {
  return `${count} ${count === 1 ? "county" : "counties"}`;
}

const STATE_DIRECTORY_COUNT = 50;

export default function CountyFinder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const countyResultsRef = useRef<HTMLDivElement>(null);
  const normalizedQuery = normalizeSearch(searchQuery);

  const filteredStates = useMemo(() => {
    return states.filter((state) => matchesState(state, normalizedQuery));
  }, [normalizedQuery]);

  const filteredCounties = useMemo(() => {
    return counties.filter((county) => {
      const matchesState = stateFilter === "all" || county.state.slug === stateFilter;
      return matchesState && matchesCounty(county, normalizedQuery);
    });
  }, [normalizedQuery, stateFilter]);

  const selectedState = states.find((state) => state.slug === stateFilter);
  const countyCountsByState = useMemo(() => {
    return counties.reduce<Record<string, number>>((counts, county) => {
      counts[county.state.slug] = (counts[county.state.slug] || 0) + 1;
      return counts;
    }, {});
  }, []);
  const hasCountyCriteria = stateFilter !== "all" || normalizedQuery.length > 0;
  const shouldShowCounties = hasCountyCriteria;
  const countyResultLabel = selectedState
    ? `${selectedState.name} county pages`
    : normalizedQuery
      ? "Matching county pages"
      : "County pages";

  function handleStateFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setStateFilter(event.target.value);
    window.requestAnimationFrame(() => {
      countyResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function clearCountyFilters() {
    setSearchQuery("");
    setStateFilter("all");
  }

  return (
    <main>
      <section className="finder-hero">
        <div className="container finder-grid">
          <div className="hero-panel">
            <p className="eyebrow">My Texas GOP</p>
            <h1>Find your state or county Republican Party</h1>
            <p>Search by state, abbreviation, county, city, or FIPS. Narrow results to one state using the menu in the search bar.</p>
            <label className="search-label" htmlFor="directory-search">Search states and counties</label>
            <div className="finder-search-combo">
              <select
                id="state-filter"
                className="finder-search-state"
                value={stateFilter}
                onChange={handleStateFilterChange}
                aria-label="Filter by state"
              >
                <option value="all">All states</option>
                {states.map((state) => (
                  <option key={state.slug} value={state.slug}>
                    {state.name}
                  </option>
                ))}
              </select>
              <input
                id="directory-search"
                className="finder-search-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search Texas, TX, Potter, El Paso..."
                type="search"
              />
            </div>
            {selectedState ? (
              <p className="filter-note">
                Filtering counties in <strong>{selectedState.name}</strong>.
              </p>
            ) : null}
          </div>
          <div className="finder-stat-card">
            <strong>{STATE_DIRECTORY_COUNT}</strong>
            <span>state directories</span>
            <strong>{counties.length}</strong>
            <span>county pages</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container directory-section">
          <div className="section-heading">
            <p className="eyebrow">States</p>
            <h2>Browse by state</h2>
            <p>Open a state page to see every county there, or narrow by state in the search bar above.</p>
          </div>
          <div className="state-grid" aria-live="polite">
            {filteredStates.map((state) => (
              <Link key={state.slug} className="county-link-card state-link-card" to={statePath(state)}>
                <img src={stateFlagUrl(state.abbr)} alt={`${state.name} flag`} loading="lazy" />
                <strong>{state.name}</strong>
                <span>{state.abbr} · {countyCountLabel(countyCountsByState[state.slug] || 0)}</span>
              </Link>
            ))}
          </div>
          {filteredStates.length === 0 ? <p className="empty-results">No states match “{searchQuery}”.</p> : null}
        </div>
        <div ref={countyResultsRef} className="container result-summary" aria-live="polite">
          <div>
            <strong>{countyResultLabel}</strong>
            <span>
              {hasCountyCriteria
                ? `Showing ${filteredCounties.length} ${filteredCounties.length === 1 ? "result" : "results"}`
                : "Search for a county or choose a state to show county pages."}
            </span>
            {selectedState ? (
              <Link className="inline-directory-link" to={statePath(selectedState)}>
                View {selectedState.name} page
              </Link>
            ) : null}
          </div>
          {hasCountyCriteria ? (
            <button type="button" className="text-button" onClick={clearCountyFilters}>
              Clear county filters
            </button>
          ) : null}
        </div>
        {shouldShowCounties ? (
          <div className="container county-grid" aria-live="polite">
            {filteredCounties.map((county) => (
              <Link key={`${county.state.slug}-${county.slug}`} className="county-link-card" to={countyPath(county)}>
                <strong>{county.displayName}</strong>
                <span>{county.state.name} {county.fips ? `· FIPS ${county.fips}` : ""}{county.isCustom ? " · Custom demo" : ""}</span>
              </Link>
            ))}
            {filteredCounties.length === 0 ? <p className="empty-results">No counties match the current search.</p> : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
