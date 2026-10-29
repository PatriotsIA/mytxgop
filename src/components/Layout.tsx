import { VoterIncidentNotice } from "./VoterIncidentNotice";
import type { CountySite } from "../data/countyTypes";
import { CountyBookmarkToast } from "./CountyBookmarkToast";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { TopBar } from "./TopBar";

export function Layout({ county, children }: { county: CountySite; children: React.ReactNode }) {
  return (
    <>
      <TopBar county={county} />
      <Header county={county} inFlow={county.state.abbr === "TX"} />
      <main>{county.state.abbr === "TX" && <div className="container"><VoterIncidentNotice /></div>}{children}</main>
      <Footer county={county} />
      <CountyBookmarkToast county={county} />
    </>
  );
}
