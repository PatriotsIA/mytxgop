import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ContactForm } from "../components/ContactForm";
import { Layout } from "../components/Layout";
import { setPageSeo } from "../lib/seo";
import { useCounty } from "./useCounty";

export default function CountyContact() {
  const county = useCounty();

  useEffect(() => {
    if (county) {
      setPageSeo(`Contact ${county.partyName}`, `Contact ${county.partyName} by phone, email, or secure web form.`, `/${county.slug}/contact-us`);
    }
  }, [county]);

  if (!county) return <Navigate to="/not-found" replace />;

  const email = county.email || county.emailSettings?.contactToEmail || "info@mytexasgop.com";

  return (
    <Layout county={county}>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">{county.displayName}</p>
          <h1>let's talk</h1>
          <p>Reach out to your local county GOP team.</p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-layout">
          <div className="contact-cards">
            <Card><h2>Phone</h2><p>{county.phone || "Phone number coming soon."}</p></Card>
            <Card><h2>Email</h2><p><a href={`mailto:${email}`}>{email}</a></p></Card>
            <div className="button-row">
              <Button href={county.links.communityUrl}>Join Community</Button>
              <Button href={county.links.donateUrl} variant="secondary">Donate</Button>
            </div>
          </div>
          <ContactForm county={county} />
        </div>
      </section>
    </Layout>
  );
}
