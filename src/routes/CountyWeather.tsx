import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";
import { WeatherChip } from "../components/WeatherChip";
import { countyPagePath } from "../lib/paths";
import { setPageSeo } from "../lib/seo";
import { useCanonicalCountyPath, useCounty } from "./useCounty";

export default function CountyWeather() {
  const county = useCounty();
  const redirectTo = useCanonicalCountyPath("weather");

  useEffect(() => {
    if (county) {
      setPageSeo(`Weather | ${county.displayName}`, `Weather placeholder for ${county.displayName}.`, countyPagePath(county, "weather"));
    }
  }, [county]);

  if (!county) return <Navigate to="/not-found" replace />;
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <Layout county={county}>
      <section className="page-hero">
        <div className="container">
          <h1>{county.displayName} Weather</h1>
          <p>Weather integrations can be added when county city or coordinates are configured.</p>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <Card><WeatherChip county={county} /><p>Live weather data has not been configured yet.</p></Card>
        </div>
      </section>
    </Layout>
  );
}
