import type { CountySite } from "../data/countyTypes";
import { Card } from "./Card";

export function LeadershipGrid({ county }: { county: CountySite }) {
  if (!county.leadership?.length) {
    return <Card><p>Leadership information for {county.displayName} has not been added yet.</p></Card>;
  }

  const [chairman, ...committee] = county.leadership;

  return (
    <div className="leadership-page">
      <section className="chairman-feature" aria-labelledby="chairman-heading">
        <h1 id="chairman-heading">Meet Our Chairman</h1>
        <div className="chairman-grid">
          {chairman.imageUrl ? <img src={chairman.imageUrl} alt={chairman.name} loading="lazy" /> : null}
          <div className="chairman-copy">
            <h2>{chairman.name}</h2>
            <p className="role">{chairman.role}</p>
            {chairman.bio ? <p>{chairman.bio}</p> : null}
            <div className="leader-socials" aria-label={`${chairman.name} social links`}>
              <a href={`mailto:${county.email || "info@mytexasgop.com"}`} aria-label="Email">E</a>
              <a href={county.links.communityUrl} target="_blank" rel="noreferrer" aria-label="Community">C</a>
              <a href={`/${county.slug}/contact-us`} aria-label="Contact">T</a>
            </div>
          </div>
        </div>
      </section>

      <section className="executive-committee" aria-labelledby="committee-heading">
        <h2 id="committee-heading">Executive Committee</h2>
        <div className="committee-list">
          {committee.map((member) => (
            <details key={`${member.name}-${member.role}`} className="committee-item">
              <summary>
                <span>{member.name}, {member.role}{member.precinct ? ` ${member.precinct}` : ""}</span>
              </summary>
              {member.bio ? <p>{member.bio}</p> : <p>Biography coming soon.</p>}
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
