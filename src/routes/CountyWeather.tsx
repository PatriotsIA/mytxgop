import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { CountyWeatherPanel } from "../components/CountyWeatherPanel";
import { Layout } from "../components/Layout";
import { countyPagePath } from "../lib/paths";
import { setPageSeo } from "../lib/seo";
import { useCanonicalCountyPath, useCounty } from "./useCounty";

export default function CountyWeather() {
  const county = useCounty();
  const redirectTo = useCanonicalCountyPath("weather");

  useEffect(() => {
    if (county) {
      setPageSeo(`Weather | ${county.displayName}`, `Current weather, alerts, and forecast for ${county.displayName}.`, countyPagePath(county, "weather"));
    }
  }, [county]);

  if (!county) return <Navigate to="/not-found" replace />;
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <Layout county={county}>
      <section className="page-hero">
        <div className="container">
          <div className="hero-panel">
            <h1>{county.displayName} Weather</h1>
            <p>Current conditions, active alerts, and the local forecast from the National Weather Service.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <CountyWeatherPanel county={county} />
        </div>
      </section>
    </Layout>
  );
}
