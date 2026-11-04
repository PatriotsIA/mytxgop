import { useEffect } from "react";
import { Layout } from "../components/Layout";
import { MidtermsPressRelease } from "../components/MidtermsPressRelease";
import { getCounty } from "../data/counties";
import { midtermsPressRelease } from "../data/midterms-press-release";
import { setPageSeo } from "../lib/seo";

export default function MidtermsRelease() {
  const county = getCounty("tx", "potter")!;

  useEffect(() => {
    setPageSeo(`${midtermsPressRelease.title} | ${county.partyName}`, midtermsPressRelease.description, "/tx/potter/2026-midterms");
  }, [county.partyName]);

  return <Layout county={county}><div className="container"><MidtermsPressRelease /></div></Layout>;
}
