// The State Department's six regional bureaus and the countries each covers (by ISO 3166 alpha-3 code), for the
// "which bureau covers this country?" map cards ([bureau: EGY] in a deck). Sources: the bureaus' pages on state.gov and
// the Foreign Affairs Manual (1 FAM 110–170). The usual surprises: North Africa (Egypt to Morocco) is Near Eastern
// Affairs, not African Affairs; Turkey and the Caucasus are European; Central Asia is with South Asia; Canada is in
// the Western Hemisphere bureau.
export interface Bureau { code: string; name: string; color: string; iso3: string[] }

export const REGIONAL_BUREAUS: Bureau[] = [
  { code: 'AF', name: 'African Affairs', color: '#c58b2a', iso3: 'AGO BEN BWA BFA BDI CPV CMR CAF TCD COM COD COG CIV DJI GNQ ERI SWZ ETH GAB GMB GHA GIN GNB KEN LSO LBR MDG MWI MLI MRT MUS MOZ NAM NER NGA RWA STP SEN SYC SLE SOM ZAF SSD SDN TZA TGO UGA ZMB ZWE'.split(' ') },
  { code: 'NEA', name: 'Near Eastern Affairs', color: '#b5523b', iso3: 'DZA BHR EGY IRN IRQ ISR JOR KWT LBN LBY MAR OMN PSE QAT SAU SYR TUN ARE YEM'.split(' ') },
  { code: 'SCA', name: 'South and Central Asian Affairs', color: '#7a5bb5', iso3: 'AFG BGD BTN IND KAZ KGZ MDV NPL PAK LKA TJK TKM UZB'.split(' ') },
  { code: 'EAP', name: 'East Asian and Pacific Affairs', color: '#2f8f83', iso3: 'AUS BRN MMR KHM CHN FJI IDN JPN KIR LAO MYS MHL FSM MNG NRU NZL PRK PLW PNG PHL WSM SGP SLB KOR TWN THA TLS TON TUV VUT VNM'.split(' ') },
  { code: 'EUR', name: 'European and Eurasian Affairs', color: '#3d7fc4', iso3: 'ALB AND ARM AUT AZE BLR BEL BIH BGR HRV CYP CZE DNK EST FIN FRA GEO DEU GRC HUN ISL IRL ITA XKS LVA LIE LTU LUX MLT MDA MCO MNE NLD MKD NOR POL PRT ROU RUS SMR SRB SVK SVN ESP SWE CHE TUR UKR GBR VAT'.split(' ') },
  { code: 'WHA', name: 'Western Hemisphere Affairs', color: '#5a9a3c', iso3: 'ATG ARG BHS BRB BLZ BOL BRA CAN CHL COL CRI CUB DMA DOM ECU SLV GRD GTM GUY HTI HND JAM MEX NIC PAN PRY PER KNA LCA VCT SUR TTO URY VEN'.split(' ') },
];

const BY_ISO = new Map(REGIONAL_BUREAUS.flatMap(b => b.iso3.map(i => [i, b] as const)));
export const bureauOf = (iso3: string) => BY_ISO.get(iso3.toUpperCase()) ?? null;
/** A card's answer: "Near Eastern Affairs (NEA)". */
export const bureauAnswer = (b: Bureau) => `${b.name} (${b.code})`;
