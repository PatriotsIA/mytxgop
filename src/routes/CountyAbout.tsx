import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { LeadershipGrid } from "../components/LeadershipGrid";
import { countyPagePath } from "../lib/paths";
import { setPageSeo } from "../lib/seo";
import { useCanonicalCountyPath, useCounty } from "./useCounty";

export default function CountyAbout() {
  const county = useCounty();
  const redirectTo = useCanonicalCountyPath("about");

  useEffect(() => {
    if (county) {
      setPageSeo(`Leadership | ${county.partyName}`, `Meet the leadership team for ${county.partyName}.`, countyPagePath(county, "about"));
    }
  }, [county]);

  if (!county) return <Navigate to="/not-found" replace />;
  if (redirectTo) return <Navigate to={redirectTo} replace />;

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
