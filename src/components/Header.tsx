import { Link } from "react-router-dom";
import logo from "../../assets/MyGOPMasterLOGOColor.png";
import type { CountySite } from "../data/countyTypes";
import { MegaNav } from "./MegaNav";
import { MobileNav } from "./MobileNav";

export function Header({ county }: { county: CountySite }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to={`/${county.slug}`} aria-label={`${county.partyName} home`}>
          <img src={logo} alt={`${county.partyName} logo`} />
        </Link>
        <MegaNav county={county} />
        <MobileNav county={county} />
      </div>
    </header>
  );
}
