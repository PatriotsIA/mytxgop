import { useParams } from "react-router-dom";
import { getCountyBySlug } from "../data/counties";

export function useCounty() {
  const { countySlug } = useParams();
  return getCountyBySlug(countySlug);
}
