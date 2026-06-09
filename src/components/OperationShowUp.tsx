import americanFlag from "../../assets/americanflag.jpg";
import type { CountySite } from "../data/countyTypes";

export function OperationShowUp({ county }: { county: CountySite }) {
  return (
    <article className="operation-card">
      <img src={americanFlag} alt="American flag" loading="lazy" />
      <div className="operation-copy">
        <h2>{county.intro.heading}</h2>
        <p>{county.intro.body}</p>
      </div>
    </article>
  );
}
