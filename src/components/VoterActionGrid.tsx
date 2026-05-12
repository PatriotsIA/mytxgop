import type { CountySite } from "../data/countyTypes";

const actions = [
  ["Precinct Map", "precinctMap", "map"],
  ["Early Voting Locations", "earlyVotingLocations", "check"],
  ["Election Day Voting Locations", "electionDayVotingLocations", "vote"],
  ["Register To Vote", "registerToVote", "flag"],
  ["Find My Elected Officials", "electedOfficialsLocal", "capitol"],
] as const;

export function VoterActionGrid({ county }: { county: CountySite }) {
  return (
    <section className="voter-section">
      <div className="container voter-grid">
        <div className="section-heading">
          <p className="eyebrow">Don't sit it out. Show up and vote.</p>
          <h2>You Make The Difference</h2>
          <strong>Your Vote. Your Voice. Your Power.</strong>
          <p>
            Every election matters--from your local school board to the White House. Voting is how we protect our
            freedoms, shape our future, and ensure that our values are represented at every level of government.
          </p>
        </div>
        <div className="voter-actions">
          {actions.map(([label, key, icon]) => (
            <a key={label} href={county.links[key] || county.links.votingLocations || county.links.registerToVote}>
              <span className={`voter-icon ${icon}`} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
