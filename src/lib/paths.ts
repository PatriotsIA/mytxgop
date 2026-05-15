import type { CountySite, StateSite } from "../data/countyTypes";

export function statePath(state: StateSite) {
  return `/${state.abbr.toLowerCase()}`;
}

export function countyPath(county: CountySite) {
  return `${statePath(county.state)}/${county.slug}`;
}

export function countyPagePath(county: CountySite, pageSlug: string) {
  return `${countyPath(county)}/${pageSlug}`;
}
