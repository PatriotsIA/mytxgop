import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { counties, states } from "../data/counties";
import { countyPath, statePath } from "../lib/paths";
import texasFlag from "../assets/placeholders/texas-flag-placeholder.svg";

export default function CountyFinder() {
  const [stateQuery, setStateQuery] = useState("");
  const [countyQuery, setCountyQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const countyResultsRef = useRef<HTMLDivElement>(null);

  const filteredStates = useMemo(() => {
    const normalizedQuery = stateQuery.toLowerCase().trim();
    if (!normalizedQuery) return states;

    return states.filter((state) =>
      [state.name, state.abbr, state.slug].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [stateQuery]);

  const filteredCounties = useMemo(() => {
    const normalizedQuery = countyQuery.toLowerCase().trim();

    return counties.filter((county) => {
      const matchesState = stateFilter === "all" || county.state.slug === stateFilter;
      const matchesQuery =
        !normalizedQuery ||
        [
          county.displayName,
          county.name,
          county.slug,
          county.state.name,
          county.state.abbr,
          county.primaryCity,
          county.fips,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery));

      return matchesState && matchesQuery;
    });
  }, [countyQuery, stateFilter]);

  const selectedState = states.find((state) => state.slug === stateFilter);
  const hasCountyCriteria = stateFilter !== "all" || countyQuery.trim().length > 0;
  const countyResultLabel = selectedState
    ? `${selectedState.name} county pages`
    : countyQuery.trim()
      ? "Matching county pages"
      : "County pages";

  function handleStateFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setStateFilter(event.target.value);
    window.requestAnimationFrame(() => {
      countyResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function clearCountyFilters() {
    setCountyQuery("");
    setStateFilter("all");
  }

  return (
    <main>
      <section className="finder-hero">
        <div className="container finder-grid">
          <div>
            <p className="eyebrow">My Texas GOP</p>
            <h1>Find your state or county Republican Party</h1>
            <p>Start with a state, or search directly for a county when you already know the name.</p>
            <label className="search-label" htmlFor="state-search">Find a state</label>
            <input
              id="state-search"
              className="county-search"
              value={stateQuery}
              onChange={(event) => setStateQuery(event.target.value)}
              placeholder="Search Texas, Florida, California..."
            />
            <label className="search-label" htmlFor="county-search">Find a county</label>
            <input
              id="county-search"
              className="county-search"
              value={countyQuery}
              onChange={(event) => setCountyQuery(event.target.value)}
              placeholder="Search Potter, El Paso, Red River..."
            />
            <label className="search-label" htmlFor="state-filter">Limit county results to a state</label>
            <select
              id="state-filter"
              className="county-search state-filter"
              value={stateFilter}
              onChange={handleStateFilterChange}
            >
              <option value="all">All states</option>
              {states.map((state) => (
                <option key={state.slug} value={state.slug}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <img src={texasFlag} alt="Texas flag placeholder" />
        </div>
      </section>
      <section className="section">
        <div className="container directory-section">
          <div className="section-heading">
            <p className="eyebrow">States</p>
            <h2>Browse by state</h2>
            <p>Open a state page to see all counties, or choose a state above to filter the county results on this page.</p>
          </div>
          <div className="state-grid" aria-live="polite">
            {filteredStates.map((state) => (
              <Link key={state.slug} className="county-link-card" to={statePath(state)}>
                <strong>{state.name}</strong>
                <span>{state.abbr}</span>
              </Link>
            ))}
          </div>
        </div>
        <div ref={countyResultsRef} className="container result-summary" aria-live="polite">
          <div>
            <strong>{countyResultLabel}</strong>
            <span>
              {hasCountyCriteria
                ? `Showing ${filteredCounties.length} ${filteredCounties.length === 1 ? "result" : "results"}`
                : "Choose a state or enter a county name to narrow the list."}
            </span>
          </div>
          {hasCountyCriteria ? (
            <button type="button" className="text-button" onClick={clearCountyFilters}>
              Clear county filters
            </button>
          ) : null}
        </div>
        {hasCountyCriteria ? (
          <div className="container county-grid" aria-live="polite">
            {filteredCounties.map((county) => (
              <Link key={`${county.state.slug}-${county.slug}`} className="county-link-card" to={countyPath(county)}>
                <strong>{county.displayName}</strong>
                <span>{county.state.name}{county.isCustom ? " · Custom demo" : ""}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
