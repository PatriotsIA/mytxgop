import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Layout } from "../components/Layout";
import type { SupportReportOfficial } from "../data/countyTypes";
import { countyPagePath } from "../lib/paths";
import { setPageSeo } from "../lib/seo";
import { useCanonicalCountyPath, useCounty } from "./useCounty";

function OfficialContact({ official }: { official: SupportReportOfficial }) {
  const contact = official.contact;

  if (!contact) {
    return <span>Contact information pending.</span>;
  }

  return (
    <div className="official-contact">
      {contact.phone ? <a href={`tel:${contact.phone}`}>{contact.phone}</a> : null}
      {contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : null}
      {contact.website ? (
        <a href={contact.website} target="_blank" rel="noreferrer">
          Office website
        </a>
      ) : null}
      {contact.address ? <span>{contact.address}</span> : null}
    </div>
  );
}

export default function CountySupportReport() {
  const county = useCounty();
  const redirectTo = useCanonicalCountyPath("support-report");

  useEffect(() => {
    if (county) {
      setPageSeo(
        `Support Report | ${county.partyName}`,
        `Review ${county.displayName} elected officials, contact information, and local GOP contributions.`,
        countyPagePath(county, "support-report"),
      );
    }
  }, [county]);

  if (!county) return <Navigate to="/not-found" replace />;
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  const report = county.supportReport;
  const officials = report?.officials ?? [];

  return (
    <Layout county={county}>
      <section className="page-hero">
        <div className="container">
          <div className="hero-panel">
            <p className="eyebrow">{county.displayName}</p>
            <h1>Support Report</h1>
            <p>County and local elected officials, public contact information, and reported local GOP contributions.</p>
            <div className="button-row">
              {report?.sourceUrl ? (
                <Button href={report.sourceUrl} variant="secondary">
                  Official County Source
                </Button>
              ) : null}
              <Button to={countyPagePath(county, "contact-us")}>Report A Contribution</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section support-report-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Local Accountability</p>
              <h2>{county.displayName} elected officials</h2>
              <p>
                Local GOP contribution totals are shown below. Use the contact form to report a contribution we should
                add or correct.
              </p>
            </div>
            {report?.lastReviewed ? <p className="report-updated">{report.lastReviewed}</p> : null}
          </div>

          {officials.length > 0 ? (
            <>
            <div className="report-table-wrap">
              <table className="support-report-table">
                <thead>
                  <tr>
                    <th scope="col">Office</th>
                    <th scope="col">Official</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Local GOP Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {officials.map((official) => (
                    <tr key={`${official.office}-${official.name}`}>
                      <td>
                        <strong>{official.office}</strong>
                        {official.jurisdiction ? <span>{official.jurisdiction}</span> : null}
                        {official.termEnds ? (
                          <span>
                            {official.termEnds.includes("-") ? "Term " : "Term ends "}
                            {official.termEnds}
                          </span>
                        ) : null}
                      </td>
                      <td>
                        <strong>{official.name}</strong>
                        {official.party ? <span>{official.party}</span> : null}
                      </td>
                      <td>
                        <OfficialContact official={official} />
                      </td>
                      <td>
                        <strong>{official.localGopContribution ?? "$0"}</strong>
                        {official.contributionNote ? <span>{official.contributionNote}</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="submit-row">
              <Button to={countyPagePath(county, "contact-us")}>Report A Contribution</Button>
            </div>
            </>
          ) : (
            <div className="card">
              <h2>Report data coming soon</h2>
              <p>
                This county does not have a local Support Report dataset yet. Use the official elected officials link
                while contribution details are being prepared.
              </p>
              <Button href={county.links.electedOfficialsLocal || county.links.electedOfficialsState}>
                Elected Officials
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
