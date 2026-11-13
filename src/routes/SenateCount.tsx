import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { TopBar } from "../components/TopBar";
import { Footer } from "../components/Footer";
import { ChairNotes } from "../components/SenateCountNotice";
import { getCounty } from "../data/counties";
import { senateCountLetter, senateCountPath, senateCountPdf, senateCountText } from "../data/senate-count";
import { setPageSeo } from "../lib/seo";
import "../styles/senate-count.css";

export default function SenateCount() {
  const county = getCounty("tx", "potter")!;
  const [copyStatus, setCopyStatus] = useState("");
  useEffect(() => {
    setPageSeo("U.S. Senate Manual Count Request | My Local GOP", "Download the letter template and read Dan Rogers’s instructions for Texas county Republican Party chairs requesting a manual count of the U.S. Senate race.", senateCountPath);
  }, []);

  async function copyLetter() {
    try {
      await navigator.clipboard.writeText(senateCountLetter);
      setCopyStatus("Letter copied. Replace the bracketed fields with your county’s information.");
    } catch {
      setCopyStatus("Copy is unavailable in this browser. Download the editable text or select the letter below to copy it.");
    }
  }

  return <>
    <TopBar county={county} showWeather={false} />
    <Header county={county} brandTitle="My Local GOP" brandEyebrow="" showStateCountiesLink={false} inFlow />
    <main className="senate-count-page">
      <section className="page-hero">
        <div className="container">
          <Link className="senate-count-back" to="/">← My Local GOP home</Link>
          <div className="hero-panel">
            <p className="eyebrow">Texas · County chair resources</p>
            <h1>U.S. Senate manual count request</h1>
            <p>A letter template and instructions from Dan Rogers, Potter County Chairman, for Texas county Republican Party chairs.</p>
            <div className="button-row">
              <a className="button button-primary" href={senateCountPdf} download>Download template (PDF)</a>
              <a className="button button-secondary" href={senateCountText} download>Download editable text</a>
              <a className="button button-secondary" href="#chair-instructions">Read the instructions</a>
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="chair-instructions" aria-labelledby="chair-instructions-heading">
        <div className="container narrow">
          <h2 id="chair-instructions-heading">Instructions for county chairs</h2>
          <ChairNotes />
        </div>
      </section>
      <section className="section senate-count-letter-section" aria-labelledby="senate-count-letter-heading">
        <div className="container narrow">
          <div className="senate-count-letter-heading">
            <h2 id="senate-count-letter-heading">Letter template</h2>
            <button className="button button-secondary" type="button" onClick={copyLetter}>Copy letter</button>
          </div>
          <p>Replace the bracketed fields with your county’s information before sending.</p>
          <p className="senate-count-copy-status" role="status">{copyStatus}</p>
          <article className="senate-count-letter" aria-label="Dan Rogers’s letter template">
            {senateCountLetter.split("\n\n").map((paragraph, index) => <p key={index}>{index === 0 || paragraph.startsWith("Re:") ? <strong>{paragraph}</strong> : paragraph}</p>)}
          </article>
        </div>
      </section>
    </main>
    <Footer county={county} />
  </>;
}
