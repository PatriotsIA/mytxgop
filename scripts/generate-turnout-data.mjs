import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import xlsx from "xlsx";
import { countiesdata } from "@nickgraffis/us-counties";

const ELECTION_SOURCES = [
  {
    id: "eavs-2024-v2",
    year: 2024,
    electionLabel: "2024 General Election",
    electionType: "federal-general",
    sourceName: "U.S. Election Assistance Commission - EAVS 2024 V2",
    sourceUrl: "https://www.eac.gov/sites/default/files/2026-02/2024_EAVS_for_Public_Release_V2.xlsx",
  },
  {
    id: "eavs-2022-v1.1",
    year: 2022,
    electionLabel: "2022 General Election",
    electionType: "federal-general",
    sourceName: "U.S. Election Assistance Commission - EAVS 2022 V1.1",
    sourceUrl: "https://www.eac.gov/sites/default/files/2023-12/2022_EAVS_for_Public_Release_V1.1.xlsx",
  },
  {
    id: "eavs-2020-v1.2",
    year: 2020,
    electionLabel: "2020 General Election",
    electionType: "federal-general",
    sourceName: "U.S. Election Assistance Commission - EAVS 2020 V1.2",
    sourceUrl: "https://www.eac.gov/sites/default/files/2023-12/2020_EAVS_for_Public_Release_V1.2.xlsx",
  },
  {
    id: "eavs-2018-v1.3",
    year: 2018,
    electionLabel: "2018 General Election",
    electionType: "federal-general",
    sourceName: "U.S. Election Assistance Commission - EAVS 2018 V1.3",
    sourceUrl: "https://www.eac.gov/sites/default/files/Research/EAVS_2018_for_Public_Release_Updates3.xlsx",
  },
];

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function isCountySummaryFips(fips10) {
  return /^[0-9]{10}$/.test(fips10) && fips10.slice(5) === "00000";
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.join(projectRoot, "public", "data", "turnout", "latest.json");

const allKnownCountyFips = new Set(
  countiesdata.map(([fips]) => String(fips)).filter((fips) => /^[0-9]{5}$/.test(fips)),
);

/** @type {Array<{
 * id: string;
 * year: number;
 * electionLabel: string;
 * electionType: string;
 * updatedAt: string;
 * source: { name: string; url: string; registeredVotersField: string; ballotsCastField: string };
 * coverage: { countiesInSource: number; matchedKnownCountyFips: number; totalKnownCountyFips: number };
 * byFips: Record<string, { registeredVoters: number; ballotsCast: number; jurisdictionName: string; stateAbbr: string }>;
 * }>}
 */
const elections = [];

for (const source of ELECTION_SOURCES) {
  const response = await fetch(source.sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${source.id}: ${response.status} ${response.statusText}`);
  }

  const workbook = xlsx.read(Buffer.from(await response.arrayBuffer()), { type: "buffer" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

  /** @type {Record<string, { registeredVoters: number; ballotsCast: number; jurisdictionName: string; stateAbbr: string }>} */
  const byFips = {};

  for (const row of rows) {
    const rawFips = String(row.FIPSCode || "").trim();
    const fips10 = rawFips.padStart(10, "0");
    if (!isCountySummaryFips(fips10)) continue;

    const fips5 = fips10.slice(0, 5);
    const registeredVoters = toNumber(row.A1a);
    const ballotsCast = toNumber(row.F1a);

    if (registeredVoters === null || ballotsCast === null) continue;
    if (registeredVoters <= 0 || ballotsCast < 0) continue;

    byFips[fips5] = {
      registeredVoters,
      ballotsCast,
      jurisdictionName: String(row.Jurisdiction_Name || "").trim(),
      stateAbbr: String(row.State_Abbr || "").trim(),
    };
  }

  let coverageCount = 0;
  for (const fips of Object.keys(byFips)) {
    if (allKnownCountyFips.has(fips)) coverageCount += 1;
  }

  elections.push({
    id: source.id,
    year: source.year,
    electionLabel: source.electionLabel,
    electionType: source.electionType,
    updatedAt: new Date().toISOString(),
    source: {
      name: source.sourceName,
      url: source.sourceUrl,
      registeredVotersField: "A1a",
      ballotsCastField: "F1a",
    },
    coverage: {
      countiesInSource: Object.keys(byFips).length,
      matchedKnownCountyFips: coverageCount,
      totalKnownCountyFips: allKnownCountyFips.size,
    },
    byFips,
  });
}

const output = {
  schemaVersion: 2,
  generatedAt: new Date().toISOString(),
  notes: {
    currentLimitations:
      "Nationwide county-level registered-voter turnout with consistent schema is currently available through EAVS federal cycles. 2025/2026 local and special election turnout is decentralized across state systems.",
    nextTargets: ["2025 state/local turnout feeds", "2026 primary/general state feeds"],
  },
  elections: elections.sort((a, b) => b.year - a.year),
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(output, null, 2) + "\n", "utf8");

console.log(`Saved turnout data to ${outputPath}`);
for (const election of output.elections) {
  console.log(
    `${election.electionLabel}: ${election.coverage.matchedKnownCountyFips}/${election.coverage.totalKnownCountyFips} known county FIPS`,
  );
}
