import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { LeadershipGrid } from "../components/LeadershipGrid";
import { setPageSeo } from "../lib/seo";
import { useCounty } from "./useCounty";

export default function CountyAbout() {
  const county = useCounty();

  useEffect(() => {
    if (county) {
      setPageSeo(`Leadership | ${county.partyName}`, `Meet the leadership team for ${county.partyName}.`, `/${county.slug}/about`);
    }
  }, [county]);

  if (!county) return <Navigate to="/not-found" replace />;

  return (
    <Layout county={county}>
      <section className="about-leadership-section">
        <div className="container">
          <LeadershipGrid county={county} />
        </div>
      </section>
    </Layout>
  );
}
