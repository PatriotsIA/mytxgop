import { useEffect } from "react";
import { Link } from "react-router-dom";
import { legalLinks } from "../lib/links";
import { setPageSeo } from "../lib/seo";
import "../styles/legal.css";

export function LegalPageLayout({
  title,
  description,
  canonicalPath,
  children,
}: {
  title: string;
  description: string;
  canonicalPath: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    setPageSeo(title, description, canonicalPath);
  }, [title, description, canonicalPath]);

  return (
    <main className="legal-page">
      <div className="container narrow legal-content">
        <Link className="legal-back-link" to="/">
          Back to directory
        </Link>
        {children}
      </div>
      <div className="legal-site-footer">
        <div className="container copyright">
          © {new Date().getFullYear()} • Powered by My Local GOP • All Rights Reserved •{" "}
          <Link to={legalLinks.privacyPolicyPath}>Privacy Policy</Link>
          {" "}&{" "}
          <Link to={legalLinks.termsOfServicePath}>Terms of Service</Link>
        </div>
      </div>
    </main>
  );
}
