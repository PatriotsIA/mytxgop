import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="container narrow">
        <p className="eyebrow">404</p>
        <h1>County page not found</h1>
        <p>That county route does not exist yet. Start from the county finder and choose a Texas county.</p>
        <Link className="button button-primary" to="/">Back to County Finder</Link>
      </div>
    </main>
  );
}
