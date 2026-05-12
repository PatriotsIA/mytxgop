import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";
import { WeatherChip } from "../components/WeatherChip";
import { setPageSeo } from "../lib/seo";
import { useCounty } from "./useCounty";

export default function CountyWeather() {
  const county = useCounty();

  useEffect(() => {
    if (county) {
      setPageSeo(`Weather | ${county.displayName}`, `Weather placeholder for ${county.displayName}.`, `/${county.slug}/weather`);
    }
  }, [county]);

  if (!county) return <Navigate to="/not-found" replace />;

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
