import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="container narrow">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>That state or county route does not exist yet. Start from the finder and choose a state or county.</p>
        <Link className="button button-primary" to="/">Back to Finder</Link>
      </div>
    </main>
  );
}
