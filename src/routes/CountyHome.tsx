import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { CTAButtons } from "../components/CTAButtons";
import { CountyHero } from "../components/CountyHero";
import { EventCalendar } from "../components/EventCalendar";
import { Layout } from "../components/Layout";
import { OperationShowUp } from "../components/OperationShowUp";
import { VoterActionGrid } from "../components/VoterActionGrid";
import { Button } from "../components/Button";
import { getSubmitEventUrl } from "../lib/links";
import { setPageSeo } from "../lib/seo";
import { useCounty } from "./useCounty";

export default function CountyHome() {
  const county = useCounty();

  useEffect(() => {
    if (county) {
      setPageSeo(`${county.partyName} | My Texas GOP`, county.hero.subtitle, `/${county.slug}`);
    }
  }, [county]);

  if (!county) return <Navigate to="/not-found" replace />;

  return (
    <Layout county={county}>
      <CountyHero county={county} />
      <section className="home-overview">
        <div className="container home-overview-grid">
          <OperationShowUp county={county} />
          <div className="calendar-panel">
            <div className="section-heading">
              <h2>Community Calendar</h2>
            </div>
            <EventCalendar county={county} />
          </div>
        </div>
        <div className="container submit-row">
          <Button to={getSubmitEventUrl(county)}>Submit an Event</Button>
        </div>
      </section>
      <section className="vote-callout">
        <div className="container">
          <p>Don't sit it out. Show up and VOTE.</p>
        </div>
      </section>
      <VoterActionGrid county={county} />
      <CTAButtons county={county} />
    </Layout>
  );
}
