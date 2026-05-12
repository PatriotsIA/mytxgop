import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { SubmitEventForm } from "../components/SubmitEventForm";
import { setPageSeo } from "../lib/seo";
import { useCounty } from "./useCounty";

export default function CountySubmitEvent() {
  const county = useCounty();

  useEffect(() => {
    if (county) {
      setPageSeo(`Submit an Event | ${county.partyName}`, `Submit a local event for ${county.displayName}.`, `/${county.slug}/submit-event`);
    }
  }, [county]);

  if (!county) return <Navigate to="/not-found" replace />;

  return (
    <Layout county={county}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{county.displayName}</p>
          <h1>submit an event</h1>
          <p>Submit your local event for review. Approved events may be added to the {county.displayName} community calendar.</p>
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
