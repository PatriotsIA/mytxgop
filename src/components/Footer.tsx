import { Link } from "react-router-dom";
import logo from "../../assets/MyGOPMasterLOGOColor.png";
import piaLogo from "../../assets/PIAlogo2.png";
import piaTextLogo from "../../assets/PIAFooterLogo.png";
import type { CountySite } from "../data/countyTypes";

export function Footer({ county }: { county: CountySite }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <section className="footer-county">
          <img className="footer-logo" src={logo} alt={`${county.partyName} logo`} />
          <a href={county.links.communityUrl} target="_blank" rel="noreferrer">Join Our Community</a>
          <a href={county.links.registerToVote}>Register To Vote</a>
          <a href={county.links.partnerWithUs}>Partner With Us</a>
          <a href={county.links.patriotRewards}>Join Patriot Rewards</a>
          <h2>Connect With Us</h2>
          <p>{county.phone ? <a href={`tel:${county.phone}`}>{county.phone}</a> : null}</p>
          <p><a href={`mailto:${county.email || "info@mytexasgop.com"}`}>{county.email || "info@mytexasgop.com"}</a></p>
        </section>
        <section>
          <h2>Stay Informed.</h2>
          <a href={county.links.precinctMap}>Precinct Map</a>
          <a href={county.links.votingLocations}>Voting Locations</a>
          <a href={county.links.registerToVote}>Register to Vote</a>
          <a href={county.links.electedOfficialsLocal || county.links.electedOfficialsState}>Elected Officials</a>
        </section>
        <section>
          <h2>More About Us</h2>
          <Link to={`/${county.slug}/about`}>Leadership</Link>
          <a href={county.links.merch} target="_blank" rel="noreferrer">Merch Store</a>
          <a href={county.links.communityUrl} target="_blank" rel="noreferrer">Join Our Interactive Community</a>
          <Link to={`/${county.slug}/contact-us`}>Contact Us</Link>
        </section>
        <section className="footer-cta">
          <img className="pia-patriot" src={piaLogo} alt="" loading="lazy" />
          <img className="pia-text-logo" src={piaTextLogo} alt="Patriots in Action" loading="lazy" />
          <h2>Join Patriots in Action</h2>
          <p>Answer the call to serve, lead, and stand strong for God, family, and country.</p>
          <a className="button button-primary" href={county.links.communityUrl} target="_blank" rel="noreferrer">
            Join The Movement Now
          </a>
        </section>
      </div>
      <div className="container copyright">© {new Date().getFullYear()} • Powered by GOP Connect • All Rights Reserved • Privacy Policy & Terms</div>
    </footer>
  );
}
