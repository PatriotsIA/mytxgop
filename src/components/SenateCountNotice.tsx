import { Link } from "react-router-dom";
import { chairNotes, chairNotesHeading, senateCountPath, senateCountPdf, senateCountDocx } from "../data/senate-count";
import "./SenateCountNotice.css";

export function ChairNotes() {
  return <div className="chair-notes">
    <p className="chair-notes-heading">{chairNotesHeading}</p>
    <ol>{chairNotes.map(note => <li key={note}>{note}</li>)}</ol>
  </div>;
}

export function SenateCountNotice() {
  return <section className="senate-count-notice" aria-labelledby="senate-count-notice-heading">
    <div className="senate-count-notice-main">
      <div>
        <p className="senate-count-kicker">Texas · County chair resources</p>
        <h2 id="senate-count-notice-heading">Request a hand count of the U.S. Senate race</h2>
        <p>A letter template for county Republican Party chairs to send to their election officials.</p>
      </div>
      <div className="senate-count-actions">
        <Link className="senate-count-learn" to={senateCountPath}>Learn more</Link>
        <a className="senate-count-download" href={senateCountPdf} download>Download template <span>PDF letter</span></a>
        <a className="senate-count-download senate-count-word" href={senateCountDocx} download>Download Word template <span>Editable .docx</span></a>
      </div>
    </div>
    <details className="senate-count-notes-dropdown"
      onPointerEnter={event => { if (event.pointerType === "mouse") event.currentTarget.open = true; }}
      onPointerLeave={event => {
        if (event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) event.currentTarget.open = false;
      }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}>
      <summary>Notes for the chair <span>Hover or tap to read</span></summary>
      <ChairNotes />
    </details>
  </section>;
}
