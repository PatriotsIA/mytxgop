import { Navigate, useParams } from "react-router-dom";
import { getCountyBySlug } from "../data/counties";
import { countyPagePath, countyPath } from "../lib/paths";

export default function LegacyCountyRedirect({ pageSlug }: { pageSlug?: string }) {
  const { countySlug } = useParams();
  const county = getCountyBySlug(countySlug);

  if (!county) return <Navigate to="/not-found" replace />;

  return <Navigate to={pageSlug ? countyPagePath(county, pageSlug) : countyPath(county)} replace />;
}
