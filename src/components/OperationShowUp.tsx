import showUpImage from "../../assets/BlueBonnets2.jpg";
import type { CountySite } from "../data/countyTypes";

export function OperationShowUp({ county }: { county: CountySite }) {
  return (
    <article className="operation-card">
      <img src={showUpImage} alt="Texas flag wood art with bluebonnets" loading="lazy" />
      <div className="operation-copy">
        <h2>{county.intro.heading}</h2>
        <p>{county.intro.body}</p>
      </div>
    </article>
  );
}
