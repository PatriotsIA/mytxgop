import { Link } from "react-router-dom";
import type { CountySite } from "../data/countyTypes";
import { countyPath } from "../lib/paths";
import { MegaNav } from "./MegaNav";
import { MobileNav } from "./MobileNav";

type HeaderProps = {
  county: CountySite;
  brandTitle?: string;
  brandEyebrow?: string;
  showStateCountiesLink?: boolean;
};

export function Header({ county, brandTitle, brandEyebrow = "My Local GOP", showStateCountiesLink = true }: HeaderProps) {
  const resolvedBrandTitle = brandTitle || county.partyName;

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand brand-text" to={countyPath(county)} aria-label={`${county.partyName} home`}>
          {brandEyebrow ? <span className="brand-eyebrow">{brandEyebrow}</span> : null}
          <span className="brand-title">{resolvedBrandTitle}</span>
        </Link>
        <MegaNav county={county} showStateCountiesLink={showStateCountiesLink} />
        <MobileNav county={county} showStateCountiesLink={showStateCountiesLink} />
      </div>
    </header>
  );
}
