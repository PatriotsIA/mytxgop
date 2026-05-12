import type { CountySite } from "../data/countyTypes";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { TopBar } from "./TopBar";

export function Layout({ county, children }: { county: CountySite; children: React.ReactNode }) {
  return (
    <>
      <TopBar county={county} />
      <Header county={county} />
      <main>{children}</main>
      <Footer county={county} />
    </>
  );
}
