import { useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Layout } from "../components/Layout";
import { countyPagePath } from "../lib/paths";
import { setPageSeo } from "../lib/seo";
import { useCanonicalCountyPath, useCounty } from "./useCounty";
import "../styles/statement.css";

// Render the statement's **bold**, _italic_ and [link](url) marks without accepting HTML.
function inline(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\((?:https:\/\/|mailto:|\/)[^)\s]+\)|\*\*.+?\*\*|_.+?_)/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={index} href={link[2]}>{inline(link[1])}</a>;
    if (/^\*\*.+\*\*$/.test(part)) return <strong key={index}>{inline(part.slice(2, -2))}</strong>;
    if (/^_.+_$/.test(part)) return <em key={index}>{inline(part.slice(1, -1))}</em>;
    return part;
  });
}

export default function CountyStatement() {
  const county = useCounty();
  const redirectTo = useCanonicalCountyPath("statement");
  const statement = county?.statement;

  useEffect(() => {
    if (county && statement) {
      setPageSeo(`${statement.title} | ${county.partyName}`, statement.deck, countyPagePath(county, "statement"));
    }
  }, [county, statement]);

  if (!county || !statement) return <Navigate to="/not-found" replace />;
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  const { document } = statement;
  // Android browsers have no inline PDF viewer; they get the buttons without an empty frame.
  const embedPdf = navigator.pdfViewerEnabled !== false;

  return (
    <Layout county={county}>
      <section className="page-hero">
        <div className="container">
          <div className="hero-panel">
            <p className="eyebrow">{county.partyName} · {statement.eyebrow}</p>
            <h1>{statement.title}</h1>
            <p>{statement.deck}</p>
            <div className="button-row">
              <Button href="#complaint">Read the complaint</Button>
              <Button href={document.href} variant="secondary">Open the PDF</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section statement-section">
        <div className="container narrow">
          <article className="card statement-body">
            {statement.paragraphs.map((paragraph) => <p key={paragraph}>{inline(paragraph)}</p>)}
            <p className="statement-contact">{inline(statement.contact)}</p>
            <p className="statement-signature">
              {statement.signature.map((line, index) => <span key={line}>{index === 0 ? <strong>{line}</strong> : line}</span>)}
            </p>
          </article>
        </div>
      </section>

      <section className="section statement-document-section" id="complaint" aria-labelledby="statement-document-heading">
        <div className="container">
          <p className="eyebrow">The filing</p>
          <h2 id="statement-document-heading">{document.title}</h2>
          <p className="statement-citation">{inline(document.citation)} · {document.pages} pages</p>
          {embedPdf ? (
            <object className="statement-document" data={document.href} type="application/pdf" aria-label={`${document.title} (PDF)`}>
              <p>
                This browser cannot show the PDF here. <a href={document.href}>Open the complaint ({document.pages}-page PDF)</a>.
              </p>
            </object>
          ) : (
            <p className="statement-document-note">This browser opens PDFs outside the page. Use the buttons below to read the complaint.</p>
          )}
          <div className="button-row">
            <Button href={document.href}>Open the complaint</Button>
            <a className="button button-secondary" href={document.href} download>Download the PDF</a>
          </div>

          <h3>Source documents cited in the complaint</h3>
          <ul className="statement-sources">
            {statement.sources.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
}
