import { useParams } from "react-router-dom";
import { getCounty } from "../data/counties";
import { countyPagePath, countyPath } from "../lib/paths";

export function useCounty() {
  const { stateSlug, countySlug } = useParams();
  return getCounty(stateSlug, countySlug);
}

export function useCanonicalCountyPath(pageSlug?: string) {
  const { stateSlug } = useParams();
  const county = useCounty();
  if (!county) return undefined;

  const path = pageSlug ? countyPagePath(county, pageSlug) : countyPath(county);
  return stateSlug?.toLowerCase() === county.state.abbr.toLowerCase() ? undefined : path;
}
