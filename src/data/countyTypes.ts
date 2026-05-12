export type LeadershipMember = {
  name: string;
  role: string;
  precinct?: string;
  imageUrl?: string;
  bio?: string;
};

export type CountySite = {
  name: string;
  slug: string;
  displayName: string;
  partyName: string;
  primaryCity?: string;
  phone?: string;
  email?: string;
  isCustom?: boolean;
  emailSettings?: {
    contactToEmail?: string;
    eventSubmissionToEmail?: string;
    ccEmail?: string;
  };
  hero: {
    eyebrow?: string;
    title: string;
    subtitle: string;
    imageAlt?: string;
  };
  intro: {
    heading: string;
    body: string;
  };
  calendar: {
    icsUrl?: string;
    icsUrls?: string[];
    proxyUrl?: string;
    submitEventUrl?: string;
    useInternalSubmitEventForm?: boolean;
  };
  links: {
    donateUrl?: string;
    communityUrl?: string;
    submitEventUrl?: string;
    electedOfficialsLocal?: string;
    electedOfficialsState?: string;
    electedOfficialsFederal?: string;
    precinctMap?: string;
    stateHouseDistricts?: string;
    stateSenateDistricts?: string;
    congressionalDistricts?: string;
    votingLocations?: string;
    earlyVotingLocations?: string;
    electionDayVotingLocations?: string;
    sampleBallot?: string;
    registerToVote?: string;
    countyGop?: string;
    merch?: string;
    partnerWithUs?: string;
    patriotRewards?: string;
    weather?: string;
    localNews?: string;
    nationalNews?: string;
    obituaries?: string;
  };
  leadership?: LeadershipMember[];
};
