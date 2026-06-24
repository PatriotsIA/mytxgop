import { useEffect } from "react";
import { Link } from "react-router-dom";
import { organizationContact, phoneHref } from "../lib/contact";
import { legalLinks } from "../lib/links";
import { setPageSeo } from "../lib/seo";
import "../styles/legal.css";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  canonicalPath: string;
  heroTitle: string;
  heroIntro: string;
  metaLabel?: string;
  children: React.ReactNode;
};

export function LegalPageLayout({
  title,
  description,
  canonicalPath,
  heroTitle,
  heroIntro,
  metaLabel,
  children,
}: LegalPageLayoutProps) {
  useEffect(() => {
    setPageSeo(title, description, canonicalPath);
  }, [title, description, canonicalPath]);

  const otherLegalPath =
    canonicalPath === legalLinks.privacyPolicyPath
      ? legalLinks.termsOfServicePath
      : legalLinks.privacyPolicyPath;
  const otherLegalLabel =
    canonicalPath === legalLinks.privacyPolicyPath ? "Terms of Service" : "Privacy Policy";

  return (
    <>
      <header className="site-header legal-site-header">
        <div className="container header-inner">
          <Link className="brand brand-text" to="/" aria-label="My Local GOP home">
            <span className="brand-eyebrow">My Local GOP</span>
            <span className="brand-title">Legal Center</span>
          </Link>
          <nav className="legal-nav" aria-label="Legal pages">
            <Link to={legalLinks.privacyPolicyPath} aria-current={canonicalPath === legalLinks.privacyPolicyPath ? "page" : undefined}>
              Privacy Policy
            </Link>
            <Link to={legalLinks.termsOfServicePath} aria-current={canonicalPath === legalLinks.termsOfServicePath ? "page" : undefined}>
              Terms of Service
            </Link>
          </nav>
        </div>
      </header>

      <main className="legal-page">
        <section className="page-hero legal-hero">
          <div className="container">
            <div className="hero-panel legal-hero-panel">
              <p className="eyebrow">Legal</p>
              <h1>{heroTitle}</h1>
              <p>{heroIntro}</p>
              {metaLabel ? <p className="legal-meta">{metaLabel}</p> : null}
              <div className="button-row">
                <Link className="button button-primary" to="/">
                  Back to directory
                </Link>
                <Link className="button button-secondary" to={otherLegalPath}>
                  {otherLegalLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section legal-section">
          <div className="container narrow">
            <article className="legal-document card">{children}</article>
          </div>
        </section>
      </main>

      <footer className="footer legal-footer">
        <div className="container legal-footer-inner">
          <div>
            <p className="eyebrow">My Local GOP</p>
            <h2>Questions about these policies?</h2>
            <p>
              Contact us at{" "}
              <a href={`mailto:${organizationContact.email}`}>{organizationContact.email}</a> or{" "}
              <a href={phoneHref()}>{organizationContact.phone}</a>.
            </p>
          </div>
        </div>
        <div className="container copyright">
          © {new Date().getFullYear()} • Powered by My Local GOP • All Rights Reserved •{" "}
          <Link to={legalLinks.privacyPolicyPath}>Privacy Policy</Link>
          {" "}&{" "}
          <Link to={legalLinks.termsOfServicePath}>Terms of Service</Link>
        </div>
      </footer>
    </>
  );
}
