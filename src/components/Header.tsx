import { Link } from "react-router-dom";
import type { CountySite } from "../data/countyTypes";
import { countyPath } from "../lib/paths";
import { MegaNav } from "./MegaNav";
import { MobileNav } from "./MobileNav";

export function Header({ county }: { county: CountySite }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand brand-text" to={countyPath(county)} aria-label={`${county.partyName} home`}>
          <span className="brand-eyebrow">GOP Connect</span>
          <span className="brand-title">{county.partyName}</span>
        </Link>
        <MegaNav county={county} />
        <MobileNav county={county} />
      </div>
    </header>
  );
}
