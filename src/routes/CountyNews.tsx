import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";
import { setPageSeo } from "../lib/seo";
import { useCanonicalCountyPath, useCounty } from "./useCounty";

export default function CountyNews() {
  const county = useCounty();
  const location = useLocation();
  const isLocal = location.pathname.endsWith("/local-news");
  const redirectTo = useCanonicalCountyPath(isLocal ? "local-news" : "national-news");

  useEffect(() => {
    if (county) {
      const label = isLocal ? "Local News" : "National News";
      setPageSeo(`${label} | ${county.displayName}`, `${label} placeholder for ${county.displayName}.`, location.pathname);
    }
  }, [county, isLocal, location.pathname]);

  if (!county) return <Navigate to="/not-found" replace />;
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <Layout county={county}>
      <section className="page-hero">
        <div className="container">
          <div className="hero-panel">
            <h1>{isLocal ? "Local News" : "National News"}</h1>
            <p>Curated news for {county.displayName} will appear here when configured.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <Card><p>No news feed has been added yet.</p></Card>
        </div>
      </section>
    </Layout>
  );
}
