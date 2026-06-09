import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { SubmitEventForm } from "../components/SubmitEventForm";
import { countyPagePath } from "../lib/paths";
import { setPageSeo } from "../lib/seo";
import { useCanonicalCountyPath, useCounty } from "./useCounty";

export default function CountySubmitEvent() {
  const county = useCounty();
  const redirectTo = useCanonicalCountyPath("submit-event");

  useEffect(() => {
    if (county) {
      setPageSeo(`Submit an Event | ${county.partyName}`, `Submit a local event for ${county.displayName}.`, countyPagePath(county, "submit-event"));
    }
  }, [county]);

  if (!county) return <Navigate to="/not-found" replace />;
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <Layout county={county}>
      <section className="page-hero">
        <div className="container">
          <div className="hero-panel">
            <p className="eyebrow">{county.displayName}</p>
            <h1>submit an event</h1>
            <p>Submit your local event for review. Approved events may be added to the {county.displayName} community calendar.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <SubmitEventForm county={county} />
        </div>
      </section>
    </Layout>
  );
}
