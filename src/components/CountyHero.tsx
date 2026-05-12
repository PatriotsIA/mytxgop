import type { CountySite } from "../data/countyTypes";
import { getElectedOfficialsUrl } from "../lib/links";
import { Button } from "./Button";

export function CountyHero({ county }: { county: CountySite }) {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          {county.hero.eyebrow ? <p className="eyebrow">{county.hero.eyebrow}</p> : null}
          <h1>{county.hero.title}</h1>
          <p>{county.hero.subtitle}</p>
          <div className="button-row">
            <Button href={getElectedOfficialsUrl(county)}>Elected Officials</Button>
            <Button to={`/${county.slug}/about`} variant="secondary">GOP Leadership</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
