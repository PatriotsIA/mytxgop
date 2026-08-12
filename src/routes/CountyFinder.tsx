import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { counties, getCounty, states } from "../data/counties";
import { legalLinks } from "../lib/links";
import { countyPath, statePath } from "../lib/paths";
import { Header } from "../components/Header";
import { TopBar } from "../components/TopBar";
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = normalizeSearch(searchQuery);
  const homeNavCounty = useMemo(() => getCounty("texas", "potter") || counties[0], []);

  const filteredStates = states;

  const filteredCounties = useMemo(() => {
    return counties.filter((county) => matchesCounty(county, normalizedQuery));
  }, [normalizedQuery]);

  const countyCountsByState = useMemo(() => {
    return counties.reduce<Record<string, number>>((counts, county) => {
      counts[county.state.slug] = (counts[county.state.slug] || 0) + 1;
      return counts;
    }, {});
  }, []);
  const hasCountyCriteria = normalizedQuery.length > 0;
  const shouldShowCounties = hasCountyCriteria;
  const countyResultLabel = normalizedQuery ? "Matching county pages" : "County pages";
  const liveStateMatches = useMemo(() => (normalizedQuery ? states.filter((state) => matchesState(state, normalizedQuery)).slice(0, 6) : []), [normalizedQuery]);
  const liveCountyMatches = useMemo(() => {
    if (!normalizedQuery) return [];
    return counties.filter((county) => matchesCounty(county, normalizedQuery)).slice(0, 10);
  }, [normalizedQuery]);

  function handleDirectorySearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!normalizedQuery) return;

    const firstCounty = counties.find((county) => matchesCounty(county, normalizedQuery));
    if (firstCounty) {
      navigate(countyPath(firstCounty));
      return;
    }

    const firstState = states.find((state) => matchesState(state, normalizedQuery));
    if (firstState) {
      navigate(statePath(firstState));
    }
  }

  function clearCountyFilters() {
    setSearchQuery("");
  }

  return (
    <>
      <TopBar county={homeNavCounty} showWeather={false} />
      <Header county={homeNavCounty} brandTitle="My Local GOP" brandEyebrow="" showStateCountiesLink={false} />
      <main>
      <section className="finder-hero">
        <div className="container finder-grid">
          <div className="hero-panel">
            <p className="eyebrow">My Local GOP</p>
            <h1>Find your state or county Republican Party</h1>
            <p>Search by state, abbreviation, county, or city.</p>
          </div>
          <div className="finder-stat-card">
            <strong>{STATE_DIRECTORY_COUNT}</strong>
            <span>state directories</span>
            <strong>{counties.length}</strong>
            <span>county pages</span>
          </div>
        </div>
        <div className="container">
          <div className="finder-county-search-shell">
            <p className="finder-county-search-title">Find a County</p>
            <form onSubmit={handleDirectorySearchSubmit} className="finder-county-search-form">
              <div className="finder-county-search-row">
                <input
                  id="directory-search"
                  className="finder-county-search-input"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by county or state (e.g., Orange, TX)"
                  type="search"
                />
                <button type="submit" className="finder-county-search-button">Search</button>
              </div>
              {normalizedQuery ? (
                <div className="finder-county-search-results" aria-live="polite">
                  {liveStateMatches.map((state) => (
                    <Link key={`live-state-${state.slug}`} className="finder-county-search-result" to={statePath(state)}>
                      <div className="finder-county-search-result-main">
                        <img src={stateFlagUrl(state.abbr)} alt={`${state.name} flag`} loading="lazy" />
                        <strong>{state.name}</strong>
                      </div>
                      <span>State - {state.abbr}</span>
                    </Link>
                  ))}
                  {liveCountyMatches.map((county) => (
                    <Link
                      key={`live-county-${county.state.slug}-${county.slug}`}
                      className="finder-county-search-result"
                      to={countyPath(county)}
                    >
                      <div className="finder-county-search-result-main">
                        <img src={stateFlagUrl(county.state.abbr)} alt={`${county.state.name} flag`} loading="lazy" />
                        <strong>{county.displayName}</strong>
                      </div>
                      <span>County - {county.state.name}</span>
                    </Link>
                  ))}
                  {liveStateMatches.length === 0 && liveCountyMatches.length === 0 ? (
                    <p className="empty-results">No places match the current search.</p>
                  ) : null}
                </div>
              ) : null}
            </form>
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
        </div>
        <div className="container result-summary" aria-live="polite">
          <div>
            <strong>{countyResultLabel}</strong>
            <span>
              {hasCountyCriteria
                ? `Showing ${filteredCounties.length} ${filteredCounties.length === 1 ? "result" : "results"}`
                : "Search for a county or choose a state to show county pages."}
            </span>
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
                <span>{county.state.name}{county.primaryCity ? ` · ${county.primaryCity}` : ""}{county.isCustom ? " · Custom demo" : ""}</span>
              </Link>
            ))}
            {filteredCounties.length === 0 ? <p className="empty-results">No counties match the current search.</p> : null}
          </div>
        ) : null}
        <div className="container directory-legal-links">
          <Link to={legalLinks.privacyPolicyPath}>Privacy Policy</Link>
          <span aria-hidden="true">•</span>
          <Link to={legalLinks.termsOfServicePath}>Terms of Service</Link>
        </div>
      </section>
      </main>
    </>
  );
}
