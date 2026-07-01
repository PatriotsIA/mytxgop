import americanFlag from "../../assets/americanflag.jpg";
import type { CountySite } from "../data/countyTypes";
import { useCountyTurnout } from "../lib/useCountyTurnout";

const numberFormatter = new Intl.NumberFormat("en-US");

export function OperationShowUp({ county }: { county: CountySite }) {
  const turnout = useCountyTurnout(county.fips);
  const latest = turnout.data[0];
  const priorElections = turnout.data.slice(1, 4);

  return (
    <article className="operation-card">
      <img src={americanFlag} alt="American flag" loading="lazy" />
      <div className="operation-copy">
        <h2>{county.intro.heading}</h2>
        <p>{county.intro.body}</p>
        <section className="show-up-meter" aria-live="polite">
          <h3>Show Up Meter</h3>
          {turnout.loading ? (
            <p>Loading latest turnout data...</p>
          ) : latest ? (
            <>
              <p>
                <strong>{numberFormatter.format(latest.ballotsCast)}</strong> out of{" "}
                <strong>{numberFormatter.format(latest.registeredVoters)}</strong> registered voters cast a ballot.
              </p>
              <div className="show-up-meter-track" role="img" aria-label={`${latest.turnoutPct.toFixed(1)}% turnout`}>
                <div className="show-up-meter-fill" style={{ width: `${latest.turnoutPct.toFixed(2)}%` }} />
              </div>
              <p className="show-up-meter-meta">
                {latest.turnoutPct.toFixed(1)}% turnout · {latest.electionLabel}
              </p>
              {priorElections.length > 0 ? (
                <ul className="show-up-meter-history">
                  {priorElections.map((entry) => (
                    <li key={entry.electionId}>
                      <strong>{entry.electionLabel}:</strong> {entry.turnoutPct.toFixed(1)}%
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="show-up-meter-note">
                2025-2026 county turnout is published state-by-state, so coverage will expand as those official files are added.
              </p>
            </>
          ) : (
            <p>Turnout data is not available for this county yet.</p>
          )}
        </section>
      </div>
    </article>
  );
}
