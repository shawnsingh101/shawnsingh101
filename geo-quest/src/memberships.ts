// Who belongs to which international organization or group, by ISO 3166 alpha-3 code, for the membership map cards
// ("[members: NATO] Picture NATO's members" and "[whose: NATO] Whose members are these?" in a deck). Membership
// changes, so each group carries the month it was checked (`asOf`) and the deck that teaches it follows the Wikipedia
// member list (the weekly briefing flags changes). Sources: each organization's own member list and its Wikipedia
// article ("Member states of NATO", "Member state of the European Union", …), checked November 2026.
export interface Membership {
  code: string;          // the id used in decks: [members: NATO]
  name: string;          // the card's answer: "NATO (North Atlantic Treaty Organization)"
  color: string;
  asOf: string;
  note?: string;         // shown on the back: the newest member, who's suspended, who's invited
  iso3: string[];
}

const L = (s: string) => s.split(' ');

export const MEMBERSHIPS: Membership[] = [
  { code: 'NATO', name: 'NATO (North Atlantic Treaty Organization)', color: '#3d6fd6', asOf: 'November 2026',
    note: '32 members. Founded 1949 with 12; the newest are Finland (2023) and Sweden (2024).',
    iso3: L('ALB BEL BGR CAN HRV CZE DNK EST FIN FRA DEU GRC HUN ISL ITA LVA LTU LUX MNE NLD MKD NOR POL PRT ROU SVK SVN ESP SWE TUR GBR USA') },
  { code: 'EU', name: 'the European Union', color: '#2a5bb8', asOf: 'November 2026',
    note: '27 members since the United Kingdom left in 2020; the newest is Croatia (2013).',
    iso3: L('AUT BEL BGR HRV CYP CZE DNK EST FIN FRA DEU GRC HUN IRL ITA LVA LTU LUX MLT NLD POL PRT ROU SVK SVN ESP SWE') },
  { code: 'EURO', name: 'the eurozone', color: '#1f6fae', asOf: 'November 2026',
    note: '21 EU countries use the euro; Bulgaria joined on January 1, 2026. Denmark has an opt-out; the others have promised to join one day.',
    iso3: L('AUT BEL BGR HRV CYP EST FIN FRA DEU GRC IRL ITA LVA LTU LUX MLT NLD PRT SVK SVN ESP') },
  { code: 'SCHENGEN', name: 'the Schengen Area', color: '#2a8fb8', asOf: 'November 2026',
    note: '29 countries with no passport checks between them: the EU minus Ireland and Cyprus, plus Iceland, Norway, Switzerland and Liechtenstein. Bulgaria and Romania became full members in 2025.',
    iso3: L('AUT BEL BGR HRV CZE DNK EST FIN FRA DEU GRC HUN ITA LVA LTU LUX MLT NLD POL PRT ROU SVK SVN ESP SWE ISL NOR CHE LIE') },
  { code: 'G7', name: 'the G7 (Group of Seven)', color: '#c2443c', asOf: 'November 2026',
    note: 'Seven large rich democracies; the EU also takes part. Russia was in it (the G8) until it was suspended in 2014 over Crimea.',
    iso3: L('CAN FRA DEU ITA JPN GBR USA') },
  { code: 'G20', name: 'the G20 (Group of Twenty)', color: '#c46f1d', asOf: 'November 2026',
    note: '19 countries plus the European Union and the African Union (a member since 2023): about 85% of the world economy.',
    iso3: L('ARG AUS BRA CAN CHN FRA DEU IND IDN ITA JPN KOR MEX RUS SAU ZAF TUR GBR USA') },
  { code: 'BRICS', name: 'BRICS', color: '#c49a1d', asOf: 'November 2026',
    note: 'Brazil, Russia, India, China and South Africa (2010), then Egypt, Ethiopia, Iran and the UAE (2024) and Indonesia (2025). Saudi Arabia was invited but has not confirmed.',
    iso3: L('BRA RUS IND CHN ZAF EGY ETH IRN ARE IDN') },
  { code: 'OPEC', name: 'OPEC (Organization of the Petroleum Exporting Countries)', color: '#7a5230', asOf: 'November 2026',
    note: '11 members. Founded in Baghdad in 1960; Qatar (2019), Ecuador (2020), Angola (2024) and the United Arab Emirates (May 2026) left. Russia works with it in "OPEC+" but is not a member.',
    iso3: L('DZA COG GNQ GAB IRN IRQ KWT LBY NGA SAU VEN') },
  { code: 'ASEAN', name: 'ASEAN (Association of Southeast Asian Nations)', color: '#2f8f83', asOf: 'November 2026',
    note: '11 members; Timor-Leste became the newest in October 2025.',
    iso3: L('BRN KHM IDN LAO MYS MMR PHL SGP THA VNM TLS') },
  { code: 'AU', name: 'the African Union', color: '#5a9a3c', asOf: 'November 2026',
    note: '55 members: every African country, and the Sahrawi Republic (Western Sahara). Countries run by coups are suspended for a time.',
    iso3: L('DZA AGO BEN BWA BFA BDI CPV CMR CAF TCD COM COD COG CIV DJI EGY GNQ ERI SWZ ETH GAB GMB GHA GIN GNB KEN LSO LBR LBY MDG MWI MLI MRT MUS MAR MOZ NAM NER NGA RWA STP SEN SYC SLE SOM ZAF SSD SDN TZA TGO TUN UGA ZMB ZWE ESH') },
  { code: 'ARAB', name: 'the Arab League', color: '#8a6d1d', asOf: 'November 2026',
    note: '22 members, from Mauritania to Oman, Comoros included; Syria was suspended from 2011 to 2023.',
    iso3: L('DZA BHR COM DJI EGY IRQ JOR KWT LBN LBY MRT MAR OMN PSE QAT SAU SOM SDN SYR TUN ARE YEM') },
  { code: 'GCC', name: 'the Gulf Cooperation Council', color: '#b5523b', asOf: 'November 2026',
    note: 'Six Gulf monarchies, founded 1981.',
    iso3: L('BHR KWT OMN QAT SAU ARE') },
  { code: 'SCO', name: 'the Shanghai Cooperation Organisation', color: '#a33a3a', asOf: 'November 2026',
    note: 'Ten members led by China and Russia; India and Pakistan joined in 2017, Iran in 2023, Belarus in 2024.',
    iso3: L('CHN RUS IND PAK KAZ KGZ TJK UZB IRN BLR') },
  { code: 'CSTO', name: 'the CSTO (Collective Security Treaty Organization)', color: '#7a2e2e', asOf: 'November 2026',
    note: 'Russia\'s military alliance of former Soviet states. Armenia froze its participation in 2024.',
    iso3: L('RUS BLR ARM KAZ KGZ TJK') },
  { code: 'MERCOSUR', name: 'Mercosur (the Southern Common Market)', color: '#3c8a5a', asOf: 'November 2026',
    note: 'Founded 1991 by Argentina, Brazil, Paraguay and Uruguay; Bolivia became a full member in 2024. Venezuela has been suspended since 2016.',
    iso3: L('ARG BRA PRY URY BOL') },
  { code: 'USMCA', name: 'the USMCA (United States–Mexico–Canada Agreement)', color: '#4a6fa5', asOf: 'November 2026',
    note: 'Replaced NAFTA in 2020; its first joint review is due in 2026.',
    iso3: L('USA MEX CAN') },
  { code: 'FIVEEYES', name: 'the Five Eyes', color: '#5b4a9a', asOf: 'November 2026',
    note: 'An intelligence-sharing alliance growing out of the 1946 UKUSA Agreement.',
    iso3: L('AUS CAN NZL GBR USA') },
  { code: 'QUAD', name: 'the Quad (Quadrilateral Security Dialogue)', color: '#7a5bb5', asOf: 'November 2026',
    note: 'Four Indo-Pacific democracies, revived in 2017.',
    iso3: L('USA JPN IND AUS') },
  { code: 'AUKUS', name: 'AUKUS', color: '#3a7ab5', asOf: 'November 2026',
    note: 'A 2021 security pact: the US and UK help Australia build nuclear-powered (not nuclear-armed) submarines.',
    iso3: L('AUS GBR USA') },
  { code: 'P5', name: 'the permanent members of the UN Security Council (P5)', color: '#2d5f9a', asOf: 'November 2026',
    note: 'The five with a veto, the victors of World War II, and the five nuclear-weapon states the NPT recognizes.',
    iso3: L('CHN FRA RUS GBR USA') },
  { code: 'NUCLEAR', name: 'the nine countries with nuclear weapons', color: '#b03a2e', asOf: 'November 2026',
    note: 'The P5, plus India, Pakistan and North Korea (never in the NPT, or left it) and Israel (never confirms it).',
    iso3: L('USA RUS GBR FRA CHN IND PAK PRK ISR') },
];

const BY_CODE = new Map(MEMBERSHIPS.map(m => [m.code, m]));
export const membership = (code: string) => BY_CODE.get(code.toUpperCase()) ?? null;
