# NYS Universe Planner - Data Report

**Groups completed:** Sue Merrell  
**Generated:** 2026-11-12  
**Output route:** `NYS_Universe_Planner_FILLED.xlsx` was written directly. An automated check confirmed that every formula, dropdown, conditional format, named range and every other tab is unchanged. Backup CSVs (`ZIP_Crosswalk.csv`, `Venues.csv`) in exact workbook column order are included too.

**Totals so far:** 218 ZIP rows, 204 venue rows (Library 107, College Campus 10, Senior Center 61, Veterans Hall 26).

## ZIP Crosswalk method

- **County (B):** from the HUD USPS ZIP-County Crosswalk (2026Q2, via the HUD User API). Each ZIP gets the county with the largest share of *all USPS delivery addresses* (TOT_RATIO), with ties broken by residential share.
- **Municipality (C):** the USPS preferred city name for the ZIP (HUD `city` field), in Title Case. This is the post-office name, which can differ from the town or village (e.g., 12901 = Plattsburgh covers both the City and Town of Plattsburgh).
- **Notes (G):** multi-county ZIPs list the other counties and their approximate share of addresses. **PO Box-only / unique ZIPs are inferred**, because no free official source flags them directly. A ZIP that is in HUD but has no Census 2020 ZCTA (ZCTAs cover only ZIPs with street delivery areas) is marked "likely PO Box-only", or "likely unique" if HUD shows only business addresses. Three ZIPs that appear in GeoNames but not in HUD (no active delivery addresses) were added with county and city from GeoNames and are flagged.
- ZIPs whose largest-share county is an NYC borough were excluded even if a sliver touches an in-scope county: 10466 (Bronx; Westchester 0.1%), 10470 (Bronx; Westchester 0.6%), 10475 (Bronx; Westchester 0.0%), 11005 (Queens; Nassau 1.0%), 11363 (Queens; Nassau 0.5%), 11422 (Queens; Nassau 0.0%), 11691 (Queens; Nassau 0.1%).

## 1. Venue counts by county and type

| County | Director | Library | College Campus | Senior Center | Veterans Hall | Total |
|---|---|---:|---:|---:|---:|---:|
| Clinton | Sue Merrell | 9 | 2 | 8 | 4 | 23 |
| Essex | Sue Merrell | 16 | 1 | 10 | 1 | 28 |
| Franklin | Sue Merrell | 5 | 1 | 11 | 3 | 20 |
| Fulton | Sue Merrell | 3 | 0 | 13 | 1 | 17 |
| Hamilton | Sue Merrell | 5 | 0 | 3 | 0 | 8 |
| Herkimer | Sue Merrell | 13 | 1 | 1 | 2 | 17 |
| Jefferson | Sue Merrell | 25 | 1 | 2 | 6 | 34 |
| Lewis | Sue Merrell | 10 | 0 | 6 | 2 | 18 |
| St. Lawrence | Sue Merrell | 21 | 4 | 7 | 7 | 39 |
| **Total** | | **107** | **10** | **61** | **26** | **204** |

**In-scope counties with zero venues of any type:** none (in the completed groups)

**County/type gaps (zero of that type):** Fulton - College Campus; Hamilton - College Campus; Hamilton - Veterans Hall; Lewis - College Campus

## 2. Dropped records (135)

| Reason | Count |
|---|---:|
| PO Box-only address | 60 |
| Auxiliary / district / affiliated group - not a post with its own hall | 43 |
| Looks residential: IRS address is in care of an individual and no other veterans org shares it | 26 |
| Not degree-granting | 4 |
| Duplicate of 'American Legion Post 162 - Lowville Memorial' | 1 |
| Duplicate of 'AMVETS Post 4' | 1 |

Full list:

| Type | Name | Address (as in source) | County | Reason |
|---|---|---|---|---|
| College Campus | CVPH Medical Center School of Radiologic Technology | 75 Beekman St | Clinton | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Clinton Essex Warren Washington BOCES | 1585 Military Turnpike | Clinton | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Herkimer County BOCES-Practical Nursing Program | 420 East German Street | Herkimer | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Jefferson Lewis BOCES-Practical Nursing Program | 20104 State Route 3 | Jefferson | Not degree-granting (IPEDS DEGGRANT=2) |
| Senior Center | Ausable Forks Nutrition Site | PO Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Elizabethtown Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Essex/Willsboro Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Keeseville Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Knapp Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Lake Placid Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Minerva Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Newcomb Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Port Henry Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Schroon Lake Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | St. Armand Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Ticonderoga Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Wilmington Senior Center | P.O. Box 848, Elizabethtown | Essex | PO Box-only address (NYSOFA directory) |
| Senior Center | Indian Lake Senior Center | PO Box 635, Indian Lake | Hamilton | PO Box-only address (NYSOFA directory) |
| Veterans Hall | AMVETS Post 8793 | PO BOX 147 | Clinton | PO Box-only address (IRS EIN 320267351) |
| Veterans Hall | American Legion Auxiliary / 0912 Montgomery | PO BOX 63 | Clinton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 204484696) |
| Veterans Hall | American Legion Post 1618 - Saranac | 275 WILSON RD | Clinton | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046324) |
| Veterans Hall | American Legion Post 20 | 162 QUARRY RD | Clinton | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 141514851) |
| Veterans Hall | American Legion Post 504 - Medos a Nelson | 11 MCCREA STREET | Clinton | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046443) |
| Veterans Hall | American Legion Post 769 - Russell B Childs | PO BOX 226 | Clinton | PO Box-only address (IRS EIN 146046403) |
| Veterans Hall | American Legion Post 912 - Montgomery | PO BOX 63 | Clinton | PO Box-only address (IRS EIN 141287665) |
| Veterans Hall | DAV Chapter 179 - Pfc R Lafountain | PO BOX 744 | Clinton | PO Box-only address (IRS EIN 141671314) |
| Veterans Hall | Department of New Yor VFW Auxiliary / District 9 | 316 PELLERIN RD | Clinton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 371931835) |
| Veterans Hall | Department of New York VFW Auxiliary / Edward & Moses Wells Post 125 | 116 BOYNTON AVE | Clinton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510658992) |
| Veterans Hall | Department of New York VFW Auxiliary / Peru Memorial Post 309 | 710 PLEASANT STREET | Clinton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 134367932) |
| Veterans Hall | VFW Post 8793 | PO BOX 147 | Clinton | PO Box-only address (IRS EIN 510208590) |
| Veterans Hall | American Legion Post 326 - Lake Placid | PO BOX 968 | Essex | PO Box-only address (IRS EIN 141276482) |
| Veterans Hall | American Legion Post 982 - Number | 20 HEMLOCK DR | Essex | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 200390239) |
| Veterans Hall | Marine Corps League Detachment 791 - Essex County Leatherneck Mc | 1145 WHITE CHURCH RD | Essex | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 141744883) |
| Veterans Hall | VFW Post 1505 | PO BOX 308 | Essex | PO Box-only address (IRS EIN 141545731) |
| Veterans Hall | AMVETS Post 710 | PO BOX 1194 | Franklin | PO Box-only address (IRS EIN 821114890) |
| Veterans Hall | AMVETS Post 8 | PO BOX 281 | Franklin | PO Box-only address (IRS EIN 146036394) |
| Veterans Hall | AMVETS Post 8 | PO BOX 281 | Franklin | PO Box-only address (IRS EIN 383783433) |
| Veterans Hall | AMVETS Post 8 | PO BOX 281 | Franklin | PO Box-only address (IRS EIN 412209865) |
| Veterans Hall | American Legion Auxiliary / 0219 Malone Unit | 53 MORTON ST | Franklin | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 141791417) |
| Veterans Hall | American Legion Auxiliary / 0322 St Regis Unit | PO BOX 22 | Franklin | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 262940764) |
| Veterans Hall | American Legion Auxiliary / 0447 Saranac Lake Unit | PO BOX 323 | Franklin | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 263578051) |
| Veterans Hall | American Legion Auxiliary / 0875 John E Harrica | PO BOX 563 | Franklin | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222516546) |
| Veterans Hall | American Legion Post 1418 - Salmon River | PO BOX 298 | Franklin | PO Box-only address (IRS EIN 141592475) |
| Veterans Hall | American Legion Post 220 - Benjamin Churco | PO BOX 803 | Franklin | PO Box-only address (IRS EIN 146046426) |
| Veterans Hall | American Legion Post 322 - St Regis | 19 MAIN ST | Franklin | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093872) |
| Veterans Hall | American Legion Post 875 - John E Harrica | PO BOX 79 | Franklin | PO Box-only address (IRS EIN 166093954) |
| Veterans Hall | American Legion Post 939 - Brushton Moira | PO BOX 52 | Franklin | PO Box-only address (IRS EIN 166094084) |
| Veterans Hall | Brushton-Moira American Legion Auxiliary / 939 Brushton | PO BOX 72 | Franklin | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800312141) |
| Veterans Hall | DAV Chapter 182 - Ssgt Earl a Robinson Chapter | PO BOX 11 | Franklin | PO Box-only address (IRS EIN 310898167) |
| Veterans Hall | Department of New York VFW Auxiliary / Albert a Gonyea Memorial Post 3357 | 202 BROADWAY | Franklin | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510675597) |
| Veterans Hall | VFW Post 3120 | 196 PARK ST | Franklin | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237332260) |
| Veterans Hall | American Legion Auxiliary Unit 137 /  | 200 N MAIN ST | Fulton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 862815166) |
| Veterans Hall | American Legion Post 1076 | PO BOX 973 | Fulton | PO Box-only address (IRS EIN 311620412) |
| Veterans Hall | American Legion Post 337 - Robert Lee Walsh | PO BOX 305 | Fulton | PO Box-only address (IRS EIN 141551083) |
| Veterans Hall | Department of New York VFW Auxiliary / John Baird Post 8690 | 19 PINE ST | Fulton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 364679524) |
| Veterans Hall | VFW Post 8690 | PO BOX 692 | Fulton | PO Box-only address (IRS EIN 237334558) |
| Veterans Hall | American Legion Post 1392 - Parker Benton | PO BOX 699 | Hamilton | PO Box-only address (IRS EIN 141784337) |
| Veterans Hall | American Legion Post 1402 | PO BOX 116 | Hamilton | PO Box-only address (IRS EIN 146046377) |
| Veterans Hall | American Legion Post 650 - Hamilton | PO BOX 384 | Hamilton | PO Box-only address (IRS EIN 146046460) |
| Veterans Hall | American Legion Auxiliary / 1118 Adirondack Unit | PO BOX 24 | Herkimer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 371572864) |
| Veterans Hall | American Legion Auxiliary / 893 Covey-Pashley | PO BOX 893 | Herkimer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161218691) |
| Veterans Hall | American Legion Auxiliary-25 Crowly Barnum Unit /  | 43 W MAIN ST | Herkimer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900458281) |
| Veterans Hall | American Legion Post 1058 - Lt Walter J Will C M H | 419 CHURCH ST | Herkimer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093701) |
| Veterans Hall | American Legion Post 1524 - West Canada Valley | 138 WHITE CRK RD | Herkimer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150516932) |
| Veterans Hall | American Legion Post 845 - Baldwin Branck | 128 S LITCHFIELD ST | Herkimer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093960) |
| Veterans Hall | American Legion Post 893 - Covey Pashley | PO BOX 893 | Herkimer | PO Box-only address (IRS EIN 166093734) |
| Veterans Hall | Department of New York VFW Auxiliary / Llion Frankfort Memorial Post 502 | 4274 ACME RD | Herkimer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 262416379) |
| Veterans Hall | Department of New York VFW Auxiliary / Michael S Pliseck Post 4915 | 131 MOHAWK ST | Herkimer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161557683) |
| Veterans Hall | Marine Corps League / 368 NY Pack Pound | 178 2ND ST | Herkimer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 475038272) |
| Veterans Hall | Marine Corps League Detachment - Herkimer County Unit | 178 2ND ST | Herkimer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161584683) |
| Veterans Hall | Marine Corps League Detachment 227 - Herkimer County | 2103 ALBANY RD | Herkimer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161257017) |
| Veterans Hall | VFW Post 2338 | 752 US HIGHWAY 20 | Herkimer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 223147319) |
| Veterans Hall | VFW Post 4612 | PO BOX 145 | Herkimer | PO Box-only address (IRS EIN 150516870) |
| Veterans Hall | VFW Post 4915 - Michael S Pliseck | PO BOX 26 | Herkimer | PO Box-only address (IRS EIN 150525601) |
| Veterans Hall | VFW Post 7220 - Middleville | PO BOX 5 | Herkimer | PO Box-only address (IRS EIN 900521730) |
| Veterans Hall | Vietnam Veterans of America Chapter 827 - Herkimer Chapter | PO BOX 412 | Herkimer | PO Box-only address (IRS EIN 161570317) |
| Veterans Hall | American Legion Auxiliary / 0798 Robert Markwick Unit | 58 MAIN ST | Jefferson | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800287843) |
| Veterans Hall | American Legion Auxiliary / 0832 John C Londraville | PO BOX 97 | Jefferson | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510675070) |
| Veterans Hall | American Legion Auxiliary / 1757 Harold W Townsend | PO BOX 475 | Jefferson | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 237093050) |
| Veterans Hall | American Legion Auxiliary / 586 Don Rounds | 10 S MAIN ST | Jefferson | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161406867) |
| Veterans Hall | American Legion Auxiliary / 588 Allen-Giles | PO BOX 15 | Jefferson | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161464103) |
| Veterans Hall | American Legion Auxiliary / 821 Colon-Couch | 518 RIVERSIDE DR | Jefferson | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222511446) |
| Veterans Hall | American Legion Post 1757 - Harold W Townsend | 209 AMBROSE ST | Jefferson | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160873609) |
| Veterans Hall | American Legion Post 583 - Smith Savage | PO BOX 237 | Jefferson | PO Box-only address (IRS EIN 150517092) |
| Veterans Hall | American Legion Post 588 - Allen Giles | PO BOX 15 | Jefferson | PO Box-only address (IRS EIN 150514899) |
| Veterans Hall | American Legion Post 789 - Bassett Baxter | 415 WEST ST | Jefferson | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150509944) |
| Veterans Hall | American Legion Post 798 - Robert Markwick | PO BOX 326 | Jefferson | PO Box-only address (IRS EIN 150616048) |
| Veterans Hall | American Legion Post 832 - Cape Vincent | PO BOX 401 | Jefferson | PO Box-only address (IRS EIN 150513565) |
| Veterans Hall | American Legion Post 904 - John B Lyman | 9 ROCK ST | Jefferson | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094048) |
| Veterans Hall | American Legion Post 916 | 40 MAIN ST | Jefferson | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094056) |
| Veterans Hall | American Legion Post 916 | PO BOX 581 | Jefferson | PO Box-only address (IRS EIN 222557422) |
| Veterans Hall | Department of New York VFW Auxiliary / Barben-Jones Post 1400 | 231 BELLEW AVE N | Jefferson | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113826246) |
| Veterans Hall | Department of New York VFW Auxiliary / Dionne Rumble Post 7277 | PO BOX 2 | Jefferson | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113825785) |
| Veterans Hall | Department of New York VFW Auxiliary / District 4 | 43 HIGH ST | Jefferson | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 010795589) |
| Veterans Hall | Department of New York VFW Auxiliary / South Jefferson County Memorial5344 | 3 VFW DR | Jefferson | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 814787081) |
| Veterans Hall | AMVETS Post 99 | 5383 Dayan St | Lewis | Duplicate of 'American Legion Post 162 - Lowville Memorial' (same address and type) |
| Veterans Hall | American Legion Auxiliary / 0162 Lowville Memorial | 5383 DAYAN ST | Lewis | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 562380305) |
| Veterans Hall | American Legion Auxiliary / 1663 Beaver River Memorial | PO BOX 217 | Lewis | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161322054) |
| Veterans Hall | American Legion Post 1663 - Beaver River Memorial | PO BOX 217 | Lewis | PO Box-only address (IRS EIN 166093941) |
| Veterans Hall | American Legion Post 723 - Floyd Lyng | 6703 OLD STATE RD | Lewis | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094032) |
| Veterans Hall | Department of New York VFW Auxiliary / Lewis County Memorial Post 6912 | 7150 STATE ROUTE 26 | Lewis | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 611509921) |
| Veterans Hall | Marine Corps League Detachment 754 - Lewis County | PO BOX 164 | Lewis | PO Box-only address (IRS EIN 161575298) |
| Veterans Hall | AMVETS / 265 Ladies Auxilliary | 5 CATHERINE STREET | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 100000719) |
| Veterans Hall | AMVETS Post 1997 | PO BOX 580 | St. Lawrence | PO Box-only address (IRS EIN 161529284) |
| Veterans Hall | AMVETS Post 1997 | PO BOX 580 | St. Lawrence | PO Box-only address (IRS EIN 161543507) |
| Veterans Hall | AMVETS Post 1997 - Heuvelton | PO BOX 221 | St. Lawrence | PO Box-only address (IRS EIN 161545587) |
| Veterans Hall | AMVETS Post 262 | PO BOX 272 | St. Lawrence | PO Box-only address (IRS EIN 141909226) |
| Veterans Hall | AMVETS Post 262 | PO BOX 272 | St. Lawrence | PO Box-only address (IRS EIN 300162487) |
| Veterans Hall | AMVETS Post 262 | 5082 STATE HIGHWAY 56 | St. Lawrence | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 300266393) |
| Veterans Hall | AMVETS Post 265 | PO BOX 803 | St. Lawrence | PO Box-only address (IRS EIN 161605165) |
| Veterans Hall | AMVETS Post 282 | 943 JUDSON STREET RD | St. Lawrence | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 471066365) |
| Veterans Hall | AMVETS Post 282 | PO BOX 282 | St. Lawrence | PO Box-only address (IRS EIN 473676263) |
| Veterans Hall | AMVETS Post 4 | 12 Andrews St | St. Lawrence | Duplicate of 'AMVETS Post 4' (same address and type) |
| Veterans Hall | American Legion Auxiliary / 0079 Massena | 40 E ORVIS ST | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 611546856) |
| Veterans Hall | American Legion Auxiliary / 4 New York District | 30 HALL RD | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222512307) |
| Veterans Hall | American Legion Auxiliary / 65 James Maloy | 30 HALL ST | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161259650) |
| Veterans Hall | American Legion Auxiliary / 925 John Adams Jr Unit | PO BOX 396 | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800208133) |
| Veterans Hall | American Legion Auxiliary / St Lawrence County | 30 HALL RD | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900994676) |
| Veterans Hall | American Legion Auxiliary Unit of Waddington Post No 420 /  | PO BOX 321 | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222485975) |
| Veterans Hall | American Legion Post 1342 - Lisbon | PO BOX 202 | St. Lawrence | PO Box-only address (IRS EIN 166094252) |
| Veterans Hall | American Legion Post 1513 - Madrid | PO BOX 186 | St. Lawrence | PO Box-only address (IRS EIN 320227263) |
| Veterans Hall | American Legion Post 1539 - Mervin Eno | PO BOX 82 | St. Lawrence | PO Box-only address (IRS EIN 166093839) |
| Veterans Hall | American Legion Post 68 - Clark Robinson | PO BOX 221 | St. Lawrence | PO Box-only address (IRS EIN 166094260) |
| Veterans Hall | American Legion Post 925 - John Adams Jr | PO BOX 99 | St. Lawrence | PO Box-only address (IRS EIN 166094044) |
| Veterans Hall | DAV Chapter 171 - Thomas Bushnell | 30 WELLS RD | St. Lawrence | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237429524) |
| Veterans Hall | Department of New York VFW Auxiliary / Earl J Santimaw Post 1143 | 101 W HATFIELD ST | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320220750) |
| Veterans Hall | Department of New York VFW Auxiliary / Edward C Seymour Post 1231 | 34 GOUVERNEUR ST | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510642736) |
| Veterans Hall | Department of New York VFW Auxiliary / Silas Wainwright Post 6338 | 223 ROWLEY ST | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 364655678) |
| Veterans Hall | Dist 9 Veterans of Foreign Wars of the US Dept of NY Inc /  | 3 MORTON ST | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 862677962) |
| Veterans Hall | Marine Corps League Detachment - Massena Unit | 145 MAPLE STREET | St. Lawrence | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 270062649) |
| Veterans Hall | Marine Corps League Detachment 408 - St Lawrence County | POIBOX 401 | St. Lawrence | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 800218889) |
| Veterans Hall | Marine Corps League Detachment 685 - Massena | 166 MAPLE ST | St. Lawrence | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161416085) |
| Veterans Hall | Sons of AMVETS Squadron 265 / NY 265 | PO BOX 212 | St. Lawrence | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 010563346) |
| Veterans Hall | VFW Post | 1112 CHAMPLAIN ST | St. Lawrence | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150507630) |
| Veterans Hall | VFW Post 6338 | 100 W MAIN ST | St. Lawrence | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150527116) |

## 3. Records with missing ZIP, county or street address

| ID | Type | Name | Street | City | ZIP | County |
|---|---|---|---|---|---|---|
| V-0044 | Senior Center | Minerva Senior Center (Minerva Town Hall) | 5 A P Morse Hwy | Minerva | **(none)** | Essex |
| V-0076 | Senior Center | Broadalbin Senior Citizens (St Joseph's Church Hall) | Main St | Broadalbin | **(none)** | Fulton |
| V-0084 | Senior Center | Mayfield Town Hall Congregate Dining Site | **(none)** | Mayfield | 12117 | Fulton |
| V-0094 | Senior Center | Indian Lake/Blue Mountain Senior Citizens | **(none)** | Indian Lake | **(none)** | Hamilton |
| V-0158 | Senior Center | Copenhagen Dining Site (Copenhagen United Church) | **(none)** | Copenhagen | 13626 | Lewis |

**Venue ZIPs not yet in the crosswalk** (their ZIP mainly lies in a county of a group not yet processed; this resolves when that group is added): V-0075 Perth Senior Citizen Club (Perth Town Hall) (12010); V-0086 Leona B Trumbull Senior Citizen Club and Center (13452); V-0149 Osceola Public Library (13316)

**County conflicts** (source county kept, conflict noted in Notes): V-0024 Ausable Forks Free Library - County conflict: source says Essex, ZIP 12912 is mainly Clinton; V-0040 North Country Community College - County conflict: source says Essex, ZIP 12983 is mainly Franklin; V-0041 AuSable Forks Senior Center (Community Center Building) - County conflict: source says Essex, ZIP 12912 is mainly Clinton; V-0075 Perth Senior Citizen Club (Perth Town Hall) - County conflict: source says Fulton, ZIP 12010 is mainly Montgomery; V-0078 Oppenheim Senior Citizens Center - County conflict: source says Fulton, ZIP 13329 is mainly Herkimer; V-0086 Leona B Trumbull Senior Citizen Club and Center - County conflict: source says Fulton, ZIP 13452 is mainly Montgomery; V-0149 Osceola Public Library - County conflict: source says Lewis, ZIP 13316 is mainly Oneida

## 4. Sources

| Source | URL | Accessed | License / terms |
|---|---|---|---|
| HUD USPS ZIP Code Crosswalk (ZIP-County), 2026Q2 | https://www.huduser.gov/hudapi/public/usps?type=2&query=NY | 2026-11-12 | Free HUD User API token (registered by user). U.S. government data; HUD asks users to cite HUD/USPS as source. |
| Census 2020 ZCTA-to-County relationship file | https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt | 2026-11-12 | U.S. Census Bureau - public domain |
| GeoNames US postal codes | https://download.geonames.org/export/zip/US.zip | 2026-11-12 | CC BY 4.0 (attribution: GeoNames.org) - used only for 3 ZIPs absent from HUD |
| IMLS Public Libraries Survey FY2024, outlet file | https://www.imls.gov/sites/default/files/2026-06/pls_fy2024_csv.zip | 2026-11-12 | Federal data - public domain |
| NCES IPEDS Institutional Characteristics HD2024 | https://nces.ed.gov/ipeds/datacenter/data/HD2024.zip | 2026-11-12 | Federal data - public domain |
| NYSOFA Directory of Multi-Purpose Senior Centers (data.ny.gov t4ba-giyx; last updated 2021-10-27) | https://data.ny.gov/api/views/t4ba-giyx/rows.csv?accessType=DOWNLOAD | 2026-11-12 | Open NY Terms of Use (free reuse) |
| NYSOFA Directory of Area Agency on Aging Service Providers (data.ny.gov t8nk-j66w) | https://data.ny.gov/api/views/t8nk-j66w/rows.csv?accessType=DOWNLOAD | 2026-11-12 | Open NY Terms of Use (free reuse) |
| Essex County / ACAP Senior Centers and Nutrition Sites 2026 (PDF) | https://essexcountyny.gov/wp-content/uploads/Senior-Centers-and-Nutrition-Sites-2026.pdf | 2026-11-12 | Public government page; robots.txt allows |
| Clinton County OFA - Nutrition Sites | https://www.clintoncountyny.gov/aging/snapshots/nutrition-sites | 2026-11-12 | Public government page; robots.txt allows |
| St. Lawrence County OFA page (+ July 2025 menu PDF for cross-check) | https://stlawco.gov/node/285 | 2026-11-12 | Public government page; robots.txt allows |
| Lewis County OFA - Food and Meals | https://lewiscountyny.gov/departments/office-for-the-aging/food-and-meals/ | 2026-11-12 | Public government page; robots.txt allows |
| Fulton County Office for Aging - Services | https://www.fcofa.org/services.html | 2026-11-12 | Public county agency page; no robots restrictions found |
| Warren/Hamilton Counties OFA Summer 2026 newsletter (PDF) | https://www.warrencountyny.gov/sites/default/files/ofa/docs/news/2026/summer.pdf | 2026-11-12 | Public government page; robots.txt allows |
| Herkimer County OFA documents (checked; no site addresses published) | https://herkimercountyny.gov/download/document.php?docid=4501 | 2026-11-12 | Public government page |
| Jefferson County OFA nutrition page (checked; site list empty on page) | https://www.jeffersoncountyny.gov/nutrition-program | 2026-11-12 | Public government page |
| IRS Exempt Organizations Business Master File Extract - NY | https://www.irs.gov/pub/irs-soi/eo_ny.csv | 2026-11-12 | IRS public data - public domain |
| U.S. Census Geocoder (ZIP fill for county-list addresses; spot-check) | https://geocoding.geo.census.gov/geocoder/ | 2026-11-12 | U.S. Census Bureau - public; rate-limited to ~1 request/sec |

**Sources checked and NOT used:**
- **American Legion post locator (legion.org):** Terms of Use prohibit "any robot, spider, scraper or other automated means to access the Services for any purpose without our express written permission". Not used.
- **VFW Find-a-Post (vfw.org):** Terms of Use allow only personal, non-commercial use and prohibit copying or reproducing site content. Not used.
- **OpenStreetMap (Overpass API):** approved by you, but every Overpass server tried (overpass-api.de and two mirrors) reset or timed out from this cloud machine. Not used this round.
- **NYS Library public library directory (nysl.nysed.gov):** the site serves an incomplete TLS certificate chain, so secure connections fail. I did not bypass certificate checking. It appeared in web search results during the spot-check only.
- **NYS Division of Veterans' Services:** publishes no post or hall directory, only benefits-advisor offices, so it was not useful for halls.

## 5. Spot-check

Random sample of 25 of 204 venue records (about 12%, minimum 25), stratified by type (seed 20261112): 11 libraries, 7 senior centers, 5 veterans halls, 2 colleges. Each was checked with the Census Geocoder (address exists, ZIP, county) and a second source: the venue's own or official website where one was found, otherwise public directories.

| ID | Type | Name | Address in workbook | Second source | Result |
|---|---|---|---|---|---|
| V-0053 | Library | Chateaugay Memorial Library | 4 John St, Chateaugay 12920 | Census Geocoder; nyslittree.org directory | Match (address, phone) |
| V-0181 | Library | Ogdensburg Public Library | 312 Washington St, Ogdensburg 13669 | Census Geocoder; library website ogdensburgpubliclibrary.org | Match (address, phone) |
| V-0127 | Library | Ellisburg Free Library | 12117 NYS Route 193, Ellisburg 13636 | Census Geocoder; Town of Ellisburg site | Match (12117 NY-193 = NYS Route 193; phone) |
| V-0107 | Library | Poland District Public Library | 8849 Main St, Poland 13431 | Census Geocoder; directory | MISMATCH (minor): geocoder has 8849 N Main St; source says Main St |
| V-0184 | Library | Richville Free Library | 41 School St, Richville 13681 | Census Geocoder; directories (librarytechnology.org, AARP) | MISMATCH: several directories list 87 Main St; possible move |
| V-0173 | Library | Hepburn Library of Hermon | 105 Main St, Hermon 13652 | Census Geocoder; 211CNY directory | MISMATCH (minor): geocoder has 105 E Main St |
| V-0073 | Library | Johnstown Public Library | 38 S Market St, Johnstown 12095 | Census Geocoder; OSC audit + directories | Match (address, phone) |
| V-0149 | Library | Osceola Public Library | 2117 N Osceola Rd, Camden 13316 | Census Geocoder; 211CNY directory | Match (address, phone) |
| V-0029 | Library | Keene Valley Library Association | 1796 Main St, Keene Valley 12943 | Directories; Wikipedia/NRHP | Match with alternate street name (1796 NYS Route 73); geocoder no match |
| V-0177 | Library | Massena Public Library | 41 Glenn St, Massena 13662 | Census Geocoder; 211CNY; news | Match (address, phone) |
| V-0118 | Library | Belleville Philomathean Free Library | 8086 County Route 75, Belleville 13611 | Census Geocoder; NYS Library directory listing (via search) | Match (address, phone) |
| V-0062 | Senior Center | Constable Adult Center | 238 Poplar St, Constable 12926 | Census Geocoder only | UNCONFIRMED: address exists, but no second source confirms an adult center there |
| V-0044 | Senior Center | Minerva Senior Center (Minerva Town Hall) | 5 A P Morse Hwy, Minerva  | Town of Minerva website | MISMATCH: town says meals at Town of Minerva Community Center (county list says Town Hall); phone matches |
| V-0160 | Senior Center | Harrisville Dining Site (Harris Courts Community Room) | 14168 Church St, Harrisville 13648 | Census Geocoder; directory | MISMATCH (minor): directory lists Harris Courts at 14172 Church St; geocoder matches 14168 |
| V-0076 | Senior Center | Broadalbin Senior Citizens (St Joseph's Church Hall) | Main St, Broadalbin  | Church directories | MISMATCH: St. Joseph's Church is at 7 North St, not Main St |
| V-0080 | Senior Center | Gloversville Senior Center | 53 Church St, Gloversville 12078 | Census Geocoder; directories | Match (address). Third-party phone (518) 725-0923 not added |
| V-0046 | Senior Center | Moriah Senior Center (Port Henry Train Station) | 14 Park Pl, Port Henry 12974 | Census Geocoder; Amtrak/NRHP | MISMATCH: depot listed at 20 Park Pl elsewhere; county list says 14 Park Pl |
| V-0047 | Senior Center | Schroon Lake Senior Center | 1108 US Route 9, Schroon Lake 12870 | Town of Schroon website | Match (address). MISMATCH phone: town lists (518) 532-7755 vs county 518-532-0179. ZIP 12870 added from town site |
| V-0146 | Veterans Hall | American Legion Post 61 - Watertown Army & Navy | 138 Sterling St, Watertown 13601 | Census Geocoder; event listings; IRS-based directories | Match (address). One map directory says closed; recent events suggest open |
| V-0144 | Veterans Hall | VFW Post 7227 - Dionne Rumble | 668 W End Ave, Carthage 13619 | Census Geocoder; directories | Match (address) |
| V-0020 | Veterans Hall | VFW Post 1418 - Great Chazy River Memorial | 600 St John Rd, Champlain 12919 | Census Geocoder; directories | Match (spelling St Johns Rd vs St John Rd) |
| V-0147 | Veterans Hall | VFW Post 1400 - Barben Jones | 231 Bellew Ave N, Watertown 13601 | Census Geocoder; historical marker database | Match (geocoder drops 'N'). One map directory says closed |
| V-0112 | Veterans Hall | American Legion Post 31 - Little Falls | 100 W Main St, Little Falls 13365 | Census Geocoder; IRS 990 summaries | Match (address) |
| V-0011 | College Campus | State University of New York at Plattsburgh | 101 Broad St, Plattsburgh 12901 | Official plattsburgh.edu contact page | Match (address, phone); geocoder no match (campus address) |
| V-0189 | College Campus | Clarkson University | 8 Clarkson Ave, Potsdam 13699 | Official clarkson.edu | Match (address, phone); geocoder no match (campus address) |

**9 of 25 sampled records had a mismatch or could not be confirmed** (6 substantive, the rest minor street-name differences). Every mismatch was added to that record's Notes. In short: OFA and IRS-sourced records need more staff verification than the library and college records do.

## 6. Incomplete or uncertain

- **Hours (J)** are filled only where a county OFA source published them (30 senior-center rows). IMLS and IPEDS publish no weekly schedules (IMLS has annual hours only, which were not used).
- **Library websites** are blank: IMLS outlet data has no web address, and the NYS Library directory could not be reached (TLS error).
- **Veterans halls:** IRS addresses are the address of record, not a confirmed hall. 26 records that looked residential were dropped as you instructed: care of a named individual with no other veterans group at the same address, or an apartment/unit/lot address. 60 PO Box records were dropped too. As a result, many posts are missing (e.g., several Legion posts in Hamilton, Essex and Franklin use PO Boxes). Phone numbers are blank because the IRS file has none.
- **Senior centers:** Franklin and Jefferson rely on the NYSOFA 2021 directory (Jefferson County's web page lists no sites). Herkimer County says it runs 5 congregate sites at senior housing (Dolgeville, Little Falls, Herkimer, Ilion, West Winfield) but publishes no addresses, so only the Herkimer OFA office is listed. Essex sites in the NYSOFA 2021 directory all used the OFA PO Box and were dropped; the 2026 county list replaced them.
- **Office for the Aging offices** are included as Type 'Senior Center' (the closest allowed type), with a note that they are administrative offices. Warren/Hamilton's joint OFA office is in Lake George (Warren County), so it will appear with Buck Bobbin's group.
- **College branch campuses** not separately reported to IPEDS are missing, e.g., North Country Community College's Malone and Ticonderoga campuses and Jefferson CC's Fort Drum site. IPEDS also shows North Country CC's main campus in Essex County although its Saranac Lake ZIP (12983) is mainly Franklin; the source county was kept and the conflict noted.
- **Name cleaning:** veterans post names were built from IRS name fields (e.g., 'American Legion Post 61 - Watertown Army & Navy'). IRS truncates long names, so a few post names may be cut short.
- **Date Verified (N)** is the date the data was pulled, 2026-11-12. No staff verification yet; every row has 'Verified by Staff?' = No.
- %
- TODAY
