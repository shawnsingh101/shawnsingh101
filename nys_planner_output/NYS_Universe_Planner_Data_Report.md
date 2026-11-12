# NYS Universe Planner - Data Report

**Groups completed:** Sue Merrell, Austin Ponce, Courtney Ball, Jamie Fuess, Michael Scheid, Damian Garcia, Buck Bobbin  
**Generated:** 2026-11-12  
**Output route:** `NYS_Universe_Planner_FILLED.xlsx` was written directly. An automated check confirmed that every formula, dropdown, conditional format, named range and every other tab is unchanged. Backup CSVs (`ZIP_Crosswalk.csv`, `Venues.csv`) in exact workbook column order are included too.

**Totals so far:** 1843 ZIP rows, 1897 venue rows (Library 855, College Campus 170, Senior Center 558, Veterans Hall 314).

## ZIP Crosswalk method

- **County (B):** from the HUD USPS ZIP-County Crosswalk (2026Q2, via the HUD User API). Each ZIP gets the county with the largest share of *all USPS delivery addresses* (TOT_RATIO), with ties broken by residential share.
- **Municipality (C):** the USPS preferred city name for the ZIP (HUD `city` field), in Title Case. This is the post-office name, which can differ from the town or village (e.g., 12901 = Plattsburgh covers both the City and Town of Plattsburgh).
- **Notes (G):** multi-county ZIPs list the other counties and their approximate share of addresses. **PO Box-only / unique ZIPs are inferred**, because no free official source flags them directly. A ZIP that is in HUD but has no Census 2020 ZCTA (ZCTAs cover only ZIPs with street delivery areas) is marked "likely PO Box-only", or "likely unique" if HUD shows only business addresses. Three ZIPs that appear in GeoNames but not in HUD (no active delivery addresses) were added with county and city from GeoNames and are flagged.
- ZIPs whose largest-share county is an NYC borough were excluded even if a sliver touches an in-scope county: 10466 (Bronx; Westchester 0.1%), 10470 (Bronx; Westchester 0.6%), 10475 (Bronx; Westchester 0.0%), 11005 (Queens; Nassau 1.0%), 11363 (Queens; Nassau 0.5%), 11422 (Queens; Nassau 0.0%), 11691 (Queens; Nassau 0.1%).

## 1. Venue counts by county and type

| County | Director | Library | College Campus | Senior Center | Veterans Hall | Total |
|---|---|---:|---:|---:|---:|---:|
| Albany | Buck Bobbin | 19 | 12 | 9 | 7 | 47 |
| Allegany | Courtney Ball | 17 | 3 | 1 | 3 | 24 |
| Broome | Jamie Fuess | 9 | 2 | 10 | 6 | 27 |
| Cattaraugus | Courtney Ball | 13 | 1 | 6 | 6 | 26 |
| Cayuga | Jamie Fuess | 9 | 1 | 6 | 2 | 18 |
| Chautauqua | Courtney Ball | 24 | 3 | 5 | 12 | 44 |
| Chemung | Austin Ponce | 5 | 2 | 10 | 1 | 18 |
| Chenango | Jamie Fuess | 9 | 0 | 8 | 3 | 20 |
| Clinton | Sue Merrell | 9 | 2 | 8 | 4 | 23 |
| Columbia | Buck Bobbin | 12 | 1 | 8 | 0 | 21 |
| Cortland | Jamie Fuess | 5 | 1 | 8 | 1 | 15 |
| Delaware | Damian Garcia | 12 | 1 | 1 | 2 | 16 |
| Dutchess | Damian Garcia | 24 | 5 | 8 | 7 | 44 |
| Erie | Courtney Ball | 38 | 11 | 76 | 26 | 151 |
| Essex | Sue Merrell | 16 | 1 | 10 | 1 | 28 |
| Franklin | Sue Merrell | 5 | 1 | 11 | 3 | 20 |
| Fulton | Sue Merrell | 3 | 0 | 13 | 1 | 17 |
| Genesee | Courtney Ball | 6 | 1 | 1 | 3 | 11 |
| Greene | Buck Bobbin | 9 | 0 | 6 | 2 | 17 |
| Hamilton | Sue Merrell | 5 | 0 | 3 | 0 | 8 |
| Herkimer | Sue Merrell | 13 | 1 | 1 | 2 | 17 |
| Jefferson | Sue Merrell | 25 | 1 | 2 | 6 | 34 |
| Lewis | Sue Merrell | 10 | 0 | 6 | 2 | 18 |
| Livingston | Austin Ponce | 8 | 2 | 5 | 3 | 18 |
| Madison | Jamie Fuess | 10 | 2 | 1 | 2 | 15 |
| Monroe | Austin Ponce | 31 | 12 | 22 | 5 | 70 |
| Montgomery | Buck Bobbin | 6 | 1 | 3 | 1 | 11 |
| Nassau | Michael Scheid | 62 | 14 | 31 | 36 | 143 |
| Niagara | Courtney Ball | 12 | 2 | 8 | 9 | 31 |
| Oneida | Jamie Fuess | 21 | 5 | 9 | 12 | 47 |
| Onondaga | Jamie Fuess | 32 | 8 | 41 | 13 | 94 |
| Ontario | Austin Ponce | 12 | 3 | 3 | 3 | 21 |
| Orange | Damian Garcia | 19 | 6 | 13 | 11 | 49 |
| Orleans | Courtney Ball | 4 | 0 | 1 | 4 | 9 |
| Oswego | Jamie Fuess | 11 | 1 | 7 | 6 | 25 |
| Otsego | Jamie Fuess | 14 | 2 | 1 | 2 | 19 |
| Putnam | Damian Garcia | 8 | 0 | 5 | 4 | 17 |
| Rensselaer | Buck Bobbin | 17 | 4 | 6 | 3 | 30 |
| Rockland | Damian Garcia | 18 | 16 | 6 | 5 | 45 |
| Saratoga | Buck Bobbin | 11 | 2 | 9 | 3 | 25 |
| Schenectady | Buck Bobbin | 9 | 3 | 5 | 3 | 20 |
| Schoharie | Buck Bobbin | 4 | 1 | 5 | 1 | 11 |
| Schuyler | Austin Ponce | 3 | 0 | 2 | 0 | 5 |
| Seneca | Austin Ponce | 5 | 1 | 2 | 2 | 10 |
| St. Lawrence | Sue Merrell | 21 | 4 | 7 | 7 | 39 |
| Steuben | Austin Ponce | 16 | 1 | 3 | 8 | 28 |
| Suffolk | Michael Scheid | 67 | 5 | 24 | 23 | 119 |
| Sullivan | Damian Garcia | 11 | 2 | 13 | 3 | 29 |
| Tioga | Jamie Fuess | 8 | 0 | 2 | 2 | 12 |
| Tompkins | Austin Ponce | 6 | 3 | 5 | 3 | 17 |
| Ulster | Damian Garcia | 21 | 3 | 3 | 6 | 33 |
| Warren | Buck Bobbin | 10 | 2 | 4 | 4 | 20 |
| Washington | Buck Bobbin | 9 | 0 | 3 | 5 | 17 |
| Wayne | Austin Ponce | 13 | 0 | 5 | 6 | 24 |
| Westchester | Damian Garcia | 45 | 14 | 80 | 13 | 152 |
| Wyoming | Courtney Ball | 9 | 0 | 6 | 4 | 19 |
| Yates | Austin Ponce | 5 | 1 | 1 | 2 | 9 |
| **Total** | | **855** | **170** | **558** | **314** | **1897** |

**In-scope counties with zero venues of any type:** none (in the completed groups)

**County/type gaps (zero of that type):** Chenango - College Campus; Columbia - Veterans Hall; Fulton - College Campus; Greene - College Campus; Hamilton - College Campus; Hamilton - Veterans Hall; Lewis - College Campus; Orleans - College Campus; Putnam - College Campus; Schuyler - College Campus; Schuyler - Veterans Hall; Tioga - College Campus; Washington - College Campus; Wayne - College Campus; Wyoming - College Campus

## 2. Dropped records (1147)

| Reason | Count |
|---|---:|
| Auxiliary / district / affiliated group - not a post with its own hall | 403 |
| PO Box-only address | 369 |
| Looks residential: IRS address is in care of an individual and no other veterans org shares it | 218 |
| Not degree-granting | 64 |
| State/county-level organization record, not an individual post | 20 |
| Bookmobile / books-by-mail outlet | 8 |
| Duplicate of 'AMVETS Post 245' | 3 |
| No street address | 3 |
| Looks residential: apartment/unit/lot in address | 3 |
| Duplicate of 'AMVETS Post 48' | 2 |
| Duplicate of 'AMVETS Post 88 - Amvet Memorial' | 2 |
| Duplicate of 'AMVETS Post 76' | 2 |
| Duplicate of 'Marine Corps League Detachment 861 - Carmen Ramputi' | 2 |
| Duplicate of 'American Legion Post 162 - Lowville Memorial' | 1 |
| Duplicate of 'AMVETS Post 4' | 1 |
| Superseded: Monroe County's current list has Sweden Senior Center at 4927 Lake Rd S, Brockport | 1 |
| Superseded: Monroe County's current list has Chili Senior Center at 3237 Chili Ave | 1 |
| Catering kitchen address | 1 |
| Superseded: Monroe County's current list has Irondequoit Senior Center at 450 Skyview Centre Pkwy | 1 |
| Superseded: Monroe County's current list has Gates Senior Center at 1605 Buffalo Rd | 1 |
| Superseded: Monroe County's current list has Pittsford Senior Center at 35 Lincoln Ave | 1 |
| Duplicate of 'Vietnam Veterans of America Chapter 377 - Finger Lakes Chapter' | 1 |
| Duplicate of 'VFW Post 16' | 1 |
| Duplicate of 'VFW Post 2250' | 1 |
| Duplicate of 'American Legion Post 468 - Greece' | 1 |
| Duplicate of 'American Legion Post 1041 - Niagara Frontier' | 1 |
| Duplicate of 'AMVETS Post 897' | 1 |
| Duplicate of 'AMVETS Post 637' | 1 |
| Duplicate of 'American Legion Post 63 - Lackawanna' | 1 |
| Duplicate of 'American Legion Post 410 - B Leo Dolan' | 1 |
| Duplicate of 'VFW Post 53 - John W Tiffany' | 1 |
| Duplicate of 'AMVETS Post 1' | 1 |
| Duplicate of 'VFW Post 8265 - Eden Memorial' | 1 |
| Duplicate of 'AMVETS Post 6472' | 1 |
| Duplicate of 'VFW Post 7275' | 1 |
| Duplicate of 'American Legion Post 1320 - Frank L Gierlach' | 1 |
| Duplicate of 'American Legion Post 204 - Butts Clark' | 1 |
| Closed / not active | 1 |
| Listed as Closed on Onondaga County senior dining list | 1 |
| Placeholder record - location to be determined, no address | 1 |
| Duplicate of 'Marine Corps League Detachment 250 - John W Thurston' | 1 |
| Duplicate of 'DAV Chapter 82 - Wheeler Stars Stripes' | 1 |
| Duplicate of 'VFW Post 5885 - Quattrini Dehm' | 1 |
| Duplicate of 'VFW Post 1371' | 1 |
| Outlet temporarily closed in FY2024 | 1 |
| Duplicate of 'VFW Post 10870' | 1 |
| Duplicate of 'American Legion Post 1006 - Joseph Loeffler' | 1 |
| Duplicate of 'American Legion Post 94 - Babylon' | 1 |
| Duplicate of 'American Legion Post 421 - Charles Wagner' | 1 |
| Duplicate of 'AMVETS Post 18' | 1 |
| Duplicate of 'Yorktown Senior Nutrition Program' | 1 |
| Duplicate of 'Jewish War Veterans Post 731 - Pfc Andrew Goldstein' | 1 |
| Duplicate of 'Marine Corps League Detachment 243 - Rockland County' | 1 |
| Duplicate of 'American Legion Post 1298 - Town of Esopus' | 1 |
| Duplicate of 'American Legion Post 32 - Truman C Tobey' | 1 |
| Duplicate of 'American Legion Post 8 - New Rochelle' | 1 |
| Duplicate of 'American Legion Post 275 - George A Casey' | 1 |
| Duplicate of 'VFW Post 2475 - Adirondack' | 1 |
| Duplicate of 'American Legion Post 701 - John Wyszomirski' | 1 |
| Duplicate of 'VFW Post 9594' | 1 |
| Duplicate of 'American Legion Post 35 - Dept of New York' | 1 |

Full list:

| Type | Name | Address (as in source) | County | Reason |
|---|---|---|---|---|
| College Campus | Aesthetic Science Institute | 922 Troy-Schenectady Road | Albany | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Albany BOCES-Adult Practical Nursing Program | 900  Watervliet Shaker Rd | Albany | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Orlo School of Hair Design and Cosmetology | 232 North Allen St | Albany | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Broome Delaware Tioga BOCES-Practical Nursing Program | 1100 East Main Street | Broome | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Cattaraugus Allegany BOCES-Practical Nursing Program | 1825 Windfall Rd | Cattaraugus | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Cayuga Onondaga BOCES-Practical Nursing Program | Center for Learning 12 Allen Street | Cayuga | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Wells College | 170 Main Street | Cayuga | Closed / not active (CYACTIVE=3, CLOSEDAT=05/10/2024) |
| College Campus | Erie 2 Chautauqua Cattaraugus BOCES-Practical Nursing Program | 8685 Erie Rd | Chautauqua | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Schuyler Steuben Chemung Tioga Allegany BOCES | 459 Philo Road | Chemung | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Delaware Chenango Madison Otsego BOCES-Practical Nursing Program | 6678 County Rd 32 | Chenango | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | CVPH Medical Center School of Radiologic Technology | 75 Beekman St | Clinton | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Clinton Essex Warren Washington BOCES | 1585 Military Turnpike | Clinton | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Dutchess BOCES-Practical Nursing Program | 5 BOCES Road | Dutchess | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Continental School of Beauty Culture-West Seneca | 1050 Union Rd | Erie | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Empire Beauty School-Buffalo | 2190 Walden Avenue | Erie | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Erie 1 BOCES | 355 Harlem Rd | Erie | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Leon Studio One School of Beauty Knowledge | 5385 Main St | Erie | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | New York Institute of Massage Inc | 4701 Transit Rd | Erie | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Professional Culinary Academy | 875 Elmwood Avenue | Erie | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | The Salon Professional Academy-Tonawanda | 2309 Eggert Rd | Erie | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Genesee Valley BOCES-Practical Nursing Program | Adult Education Office  8250 State St Rd | Genesee | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Herkimer County BOCES-Practical Nursing Program | 420 East German Street | Herkimer | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Jefferson Lewis BOCES-Practical Nursing Program | 20104 State Route 3 | Jefferson | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Continental School of Beauty Culture-Rochester | 633 Jefferson Rd | Monroe | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Empire Beauty School-Rochester | 340 Elmridge Center Drive | Monroe | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Isabella Graham Hart School of Practical Nursing | 470 Skyview Centre Pkwy | Monroe | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Sharp Edgez Barber Institute | 398 West Ridge Road | Monroe | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Shear Ego International School of Hair Design | 525 Titus Avenue | Monroe | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Access Careers | 474 Fulton Avenue, Suite 201 | Nassau | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Barber & Beauty Institute of New York | 266 Greenwich Street | Nassau | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Brittany Beauty Academy | 3274 Hempstead Turnpike | Nassau | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Hunter Business School | 3601 Hempstead Tpk Unit19 | Nassau | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Long Island Beauty School-Hempstead | 173-A  Fulton Ave | Nassau | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Long Island Nail Skin & Hair Institute | 1055 Stewart Avenue | Nassau | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Veeb Nassau County School of Practical Nursing | 30 East Cherry Street | Nassau | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Orleans Niagara BOCES-Practical Nursing Program | 50 Main Street | Niagara | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Madison Oneida BOCES-Practical Nursing Program | 4937 Spring Rd | Oneida | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Continental School of Beauty Culture-Mattydale | 2803 Brewerton Road | Onondaga | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Onondaga Cortland Madison BOCES | Main Campus | Onondaga | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Marion S Whelan School of Nursing of Geneva General Hospital | 196 North St | Ontario | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Derech Hachaim Seminary | 5 Israel Zupnik Drive | Orange | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Orange Ulster BOCES | 3 Washington Center | Orange | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Center for Instruction, Technology & Innovation | 179 County  Route 64 | Oswego | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Otsego Area BOCES-Practical Nursing Program | 31 Center Street 3rd floor | Otsego | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Capri Cosmetology Learning Centers | 251 West Route 59 | Rockland | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Rockland County BOCES-Practical Nursing Program | 65 Parrott Rd, Bldg 3 | Rockland | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Modern Welding School | 1842 State St | Schenectady | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Paul Mitchell the School-Schenectady | 411 State Street | Schenectady | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Access Careers-Islandia | 1930 Veterans Highway, Suite 10 | Suffolk | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Eastern Suffolk BOCES | 30 Greene Avenue | Suffolk | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Eastern Suffolk BOCES | 970 North Griffing Avenue | Suffolk | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Eastern Suffolk BOCES | 375 Locust Avenue | Suffolk | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Electrical and HVAC/R Training Center | 65 Elm St. | Suffolk | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Long Island Beauty School-Hauppauge | 544 Rte 111 | Suffolk | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | New York Institute of Beauty | 11 Oval Drive Suite 180 | Suffolk | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Western Suffolk BOCES | 152 Laurel Hill Rd | Suffolk | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Word of Life Bible Institute | 4230 Glendale Road | Warren | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Washington Saratoga Warren Hamilton Essex BOCES-Practical Nursing Program | 1051 Dix Ave | Washington | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Wayne Finger Lakes BOCES-Practical Nursing Program | 131 Drumlin Ct | Wayne | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Center for Ultrasound Research & Education | 333 Westchester Avenue Suite 101 West | Westchester | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Culinary Tech Center | 303 Quarropas Street | Westchester | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Empire Beauty School-Peekskill | 19 Bank St | Westchester | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | New York School of Esthetics & Day Spa | 239 central ave 3rd Floor | Westchester | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Westchester School for Medical & Dental Assistants | 1053 Saw Mill River Road | Westchester | Not degree-granting (IPEDS DEGGRANT=2) |
| College Campus | Westchester School of Beauty Culture | Six Gramatan Avenue    Suite 200 | Westchester | Not degree-granting (IPEDS DEGGRANT=2) |
| Library | Bookmobile Service | 101 EAST CHURCH STREET | Chemung | Bookmobile / books-by-mail outlet (C_OUT_TY=BS) |
| Library | Rover | 93 MARKET STREET | Dutchess | Bookmobile / books-by-mail outlet (C_OUT_TY=BS) |
| Library | Bookmobile | 1 LAFAYETTE SQUARE | Erie | Bookmobile / books-by-mail outlet (C_OUT_TY=BS) |
| Library | Bookmobile | 1 LAFAYETTE SQUARE | Erie | Bookmobile / books-by-mail outlet (C_OUT_TY=BS) |
| Library | Bookmobile | 1 LAFAYETTE SQUARE | Erie | Bookmobile / books-by-mail outlet (C_OUT_TY=BS) |
| Library | Bookmobile | 30 DAVISON AVENUE | Nassau | Bookmobile / books-by-mail outlet (C_OUT_TY=BS) |
| Library | Nopl Pop-Up Library (Bookmobile) | 8686 KNOWLEDGE LANE | Onondaga | Bookmobile / books-by-mail outlet (C_OUT_TY=BS) |
| Library | Woman's Round Lake Improvement Society | 31 WESLEY AVENUE, PO BOX 665 | Saratoga | PO Box-only address |
| Library | Bookmobile | 47 CAYUGA STREET | Seneca | Bookmobile / books-by-mail outlet (C_OUT_TY=BS) |
| Library | Mastics-Moriches-Shirley Community Library | 407 WILLIAM FLOYD PARKWAY | Suffolk | Outlet temporarily closed in FY2024 (STATSTRU=23) |
| Senior Center | Guilderland Senior Services Town of | P.O. Box 339, Guilderland | Albany | PO Box-only address (NYSOFA directory) |
| Senior Center | Village of Altamont | 115 Main St. PO Box 643, Altamont | Albany | PO Box-only address (NYSOFA directory) |
| Senior Center | Cattaraugus County Department of Aging | One Leo Moss Drive Suite 7610 | Cattaraugus | No street address (NYSOFA AAA directory) |
| Senior Center | Colden Senior Center/Colden Town Hall | 8812 Rte. 240/P.O. Box 335, Colden | Erie | PO Box-only address (NYSOFA directory) |
| Senior Center | Collins Senior Center/LK Painter Community Cntr. | 2355 Main St./P.O. Box 420, Collins | Erie | PO Box-only address (NYSOFA directory) |
| Senior Center | Concord Senior Citizens/Concord Town Hall | 86 Franklin St/ P.O. Box 368, Springville | Erie | PO Box-only address (NYSOFA directory) |
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
| Senior Center | Association for the Blind/Goodwill Industries | 422 South Clinton Avenue - Catering, Rochester | Monroe | Catering kitchen address ('422 South Clinton Avenue - Catering'), not a senior center venue (NYSOFA 2021 directory) |
| Senior Center | Lifetime Assistance - Sweden Senior Center | 133 State Street, Brockport | Monroe | Superseded: Monroe County's current list has Sweden Senior Center at 4927 Lake Rd S, Brockport (NYSOFA 2021 directory) |
| Senior Center | Town of Chili Senior Center | 3235 Chili Avenue, Rochester | Monroe | Superseded: Monroe County's current list has Chili Senior Center at 3237 Chili Ave (NYSOFA 2021 directory) |
| Senior Center | Town of Gates Senior Center | 160 Buffalo Road, Gates | Monroe | Superseded: Monroe County's current list has Gates Senior Center at 1605 Buffalo Rd (NYSOFA 2021 directory) |
| Senior Center | Town of Irondequoit Senior Center | 154 Pinegrove Avenue, Rochester | Monroe | Superseded: Monroe County's current list has Irondequoit Senior Center at 450 Skyview Centre Pkwy (NYSOFA 2021 directory) |
| Senior Center | Town of Pittsford Senior Center | 3750 Monroe Avenue, Pittsford | Monroe | Superseded: Monroe County's current list has Pittsford Senior Center at 35 Lincoln Ave (NYSOFA 2021 directory) |
| Senior Center | North Syracuse Community Center | 700 S. Bay Rd, North Syracuse | Onondaga | Listed as Closed on Onondaga County senior dining list (rev. 10/2025) |
| Senior Center | Blooming Grove Senior Center | 6 Horton Road  PO Box 358, Blooming Grove | Orange | PO Box-only address (NYSOFA directory) |
| Senior Center | Blooming Grove Senior Dining Site | 6 Horton Road  PO Box 358, Blooming Grove | Orange | PO Box-only address (NYSOFA directory) |
| Senior Center | Farnum House | Ulster Place  PO Box 90, Port Jervis | Orange | PO Box-only address (NYSOFA directory) |
| Senior Center | Goshen Senior Center | 110 Trotter Circle PO Box 217, Goshen | Orange | PO Box-only address (NYSOFA directory) |
| Senior Center | Greenwood Lake Senior Center | Windemere Avenue  PO Box 7, Greenwood Lake | Orange | PO Box-only address (NYSOFA directory) |
| Senior Center | Orleans County Office for the Aging | County Administration Building 14016 Route 31West | Orleans | No street address (NYSOFA AAA directory) |
| Senior Center | Sandy Creek/Pulaski - To Be Determined | , Sandy Creek/Pulaski Area | Oswego | Placeholder record - location to be determined, no address |
| Senior Center | Sullivan County Office for the Aging | 100 North Street, P.O. Box 5012 | Sullivan | No street address (NYSOFA AAA directory) |
| Senior Center | Somers Senior Citizens | PO Box 46, Somers | Westchester | PO Box-only address (NYSOFA directory) |
| Senior Center | Yorktown Seniors New Horizon | 1974 Commerce St | Westchester | Duplicate of 'Yorktown Senior Nutrition Program' (same address and type) |
| Veterans Hall | AMVETS Post 9594 - AMVETS | 13 Whitbeck St | Albany | Duplicate of 'VFW Post 9594' (same address and type) |
| Veterans Hall | American Legion Auxiliary / 0589 Clark White Unit | PO BOX 114 | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800494290) |
| Veterans Hall | American Legion Auxiliary / 0927 Legnard-Curtin Unit | 168 DUNSBACH FERRY RD | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 141767560) |
| Veterans Hall | American Legion Auxiliary / 1040 Nathaniel Adams Blanchard | 16 W POPLAR DR | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800654025) |
| Veterans Hall | American Legion Auxiliary / 1493 Voorheesville | 18 SCHOOL RD | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222483939) |
| Veterans Hall | American Legion Auxiliary / 1520 Joseph E Zaloga | 4 EVERETT RD EXT | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 146030020) |
| Veterans Hall | American Legion Auxiliary / 977 Helderberg | 105 GI RD | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222505603) |
| Veterans Hall | American Legion Auxiliary / New York Albany County | 105 GI RD | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 270047222) |
| Veterans Hall | American Legion Post | 100 MARQUIS AVENUE | Albany | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 141762092) |
| Veterans Hall | American Legion Post - Department of New York | 112 STATE ST RM 1310 | Albany | State/county-level organization record, not an individual post (IRS EIN 135653638) |
| Veterans Hall | American Legion Post 1256 - Colonie | PO BOX 12083 | Albany | PO Box-only address (IRS EIN 146046433) |
| Veterans Hall | American Legion Post 1493 | PO BOX 72 | Albany | PO Box-only address (IRS EIN 141514543) |
| Veterans Hall | American Legion Post 1530 - Bucci Mctague | PO BOX 655 | Albany | PO Box-only address (IRS EIN 141461866) |
| Veterans Hall | American Legion Post 589 - Clarke White | PO BOX 114 | Albany | PO Box-only address (IRS EIN 146046369) |
| Veterans Hall | American Legion Post 977 | 988 ALTAMONT BLVD | Albany | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 810959505) |
| Veterans Hall | American Legion Post 977 - Helderberg | PO BOX 461 | Albany | PO Box-only address (IRS EIN 146046422) |
| Veterans Hall | Department of New Tork VFW Auxiliary / Unitas Memorial Post 9594 | 12 WHITBECK ST | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 651319097) |
| Veterans Hall | Department of New York VFW Auxiliary / Bethlehem Memorial Post 3185 | 404 DELAWARE AVE | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 943460020) |
| Veterans Hall | Department of New York VFW Auxiliary / Robert L Weininger Memorial PO 8692 | 140 VFW DR | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261664948) |
| Veterans Hall | Department of New York VFW Auxiliary / Sheehy-Palmer Post 6776 | 525 DELAWARE AVE | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510650669) |
| Veterans Hall | Marine Corps League / 134 NY Pack Pound Modd | 81 MELVILLE AVE | Albany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 010723024) |
| Veterans Hall | Marine Corps League Detachment 241 - Capt Wm Dale Obrien | PO BOX 5084 | Albany | PO Box-only address (IRS EIN 141764942) |
| Veterans Hall | VFW Post - Headquarters | 69 SAND CREEK RD | Albany | State/county-level organization record, not an individual post (IRS EIN 131436995) |
| Veterans Hall | VFW Post 7062 - Boyd Hilton | PO BOX 505 | Albany | PO Box-only address (IRS EIN 510243923) |
| Veterans Hall | Vietnam Veterans of America Chapter 8 - Chapter | 1231 NEW LOUDON RD | Albany | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 223111802) |
| Veterans Hall | AMVETS Post 1 | 5276 Maple Ln | Allegany | Duplicate of 'AMVETS Post 1' (same address and type) |
| Veterans Hall | American Legion Post 1155 - Dee Victor Thomas | PO BOX 258 | Allegany | PO Box-only address (IRS EIN 166093926) |
| Veterans Hall | American Legion Post 1504 - Robert W Howden | PO BOX 25 | Allegany | PO Box-only address (IRS EIN 160764877) |
| Veterans Hall | American Legion Post 1582 - The Fawcett | 83 MAIN ST | Allegany | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094021) |
| Veterans Hall | Department of New York VFW Auxiliary / Frank B Church Post 2530 | 250 MAPLE AVE | Allegany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 611590998) |
| Veterans Hall | Department of New York VFW Auxiliary / Town of Cuba Memorial Post 2721 | 9316 HORNER RD | Allegany | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 680659272) |
| Veterans Hall | AMVETS Post 722 | 9 WATSON AVE | Broome | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 510501881) |
| Veterans Hall | American Legion Auxiliary / 1645 North-East | 177 ROBINSON ST | Broome | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222485298) |
| Veterans Hall | American Legion Auxiliary / 1700 George F Johnson Unit | 305 MAPLE ST | Broome | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900417656) |
| Veterans Hall | American Legion Auxiliary / 82 Unit | 1305 RIVERVIEW DR | Broome | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800270185) |
| Veterans Hall | American Legion Auxiliary / George F Riordan Post 974 | PO BOX 189 | Broome | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161546687) |
| Veterans Hall | American Legion Post 1194 - Joseph P Mangan | 363 W Service Hwy | Broome | Duplicate of 'Marine Corps League Detachment 250 - John W Thurston' (same address and type) |
| Veterans Hall | American Legion Post 757 - Wallace | 44 4TH ST | Broome | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093939) |
| Veterans Hall | DAV Chapter 60 - Bill Gasper Mem | 611 VENTURA BLVD | Broome | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237014440) |
| Veterans Hall | Department of New York VFW Auxiliary / District 5 | 221 FENNER HILL RD | Broome | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 943450102) |
| Veterans Hall | Department of New York VFW Auxiliary / Major Ray H Humphrey Dsc Post 1449 | 103 NANTICOKE AVE | Broome | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800407178) |
| Veterans Hall | Department of New York VFW Auxiliary Post 478 / Kathy Barnett Treasurer | 238 ROBINSON ST | Broome | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 421739859) |
| Veterans Hall | VFW Post 2332 | 824 TYLER ST | Broome | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237336877) |
| Veterans Hall | American Legion Auxiliary / 0814 Portville Memorial Unit | PO BOX 733 | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 943440347) |
| Veterans Hall | American Legion Auxiliary / 1434 Norton-Chambers | 3727 ROUTE 16 | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 611561182) |
| Veterans Hall | American Legion Auxiliary / 409 Gowanda | 100 LEGION DR | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 166032522) |
| Veterans Hall | American Legion Auxiliary / 530 Unit Olean | 307 E STATE ST | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 270219484) |
| Veterans Hall | American Legion Auxiliary / Post 1434 Norton Chambers | PO BOX 193 | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 263501047) |
| Veterans Hall | American Legion Post 1434 - Norton Chambers | PO BOX 121 | Cattaraugus | PO Box-only address (IRS EIN 161137227) |
| Veterans Hall | American Legion Post 1593 | PO BOX 41 | Cattaraugus | PO Box-only address (IRS EIN 166093846) |
| Veterans Hall | American Legion Post 181 - Randolph | 62 JAMESTOWN ST | Cattaraugus | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160778687) |
| Veterans Hall | American Legion Post 526 - Franklinville Memorial | PO BOX 73 | Cattaraugus | PO Box-only address (IRS EIN 260263878) |
| Veterans Hall | American Legion Post 531 - Little Valley | PO BOX 29 | Cattaraugus | PO Box-only address (IRS EIN 160720712) |
| Veterans Hall | American Legion Post 659 - Ellicottville Memorial | 6500 MAPLES ROAD BOX 277 | Cattaraugus | PO Box-only address (IRS EIN 160719329) |
| Veterans Hall | American Legion Post 814 - Portville Memorial | 24 S MAIN STREET | Cattaraugus | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160718464) |
| Veterans Hall | Department of New York VFW Auxiliary / District 6 | 2027 CEMETERY HILL RD | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 262996423) |
| Veterans Hall | Department of New York VFW Auxiliary / Franklin Post 9487 | 8012 ROGERS RD | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 651319213) |
| Veterans Hall | Department of New York VFW Auxiliary / James J Cruden Post 5007 | 20 SANDHILL RD | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800440158) |
| Veterans Hall | Department of New York VFW Auxiliary / John F Ahrens Post 5296 | 61 WILDWOOD AVE | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113827795) |
| Veterans Hall | Department of New York VFW Auxiliary / Little Valley Post 8734 | 2027 CEMETERY HILL RD | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 421711292) |
| Veterans Hall | Department of New York VFW Auxiliary / Olean Post 1619 | 1238 ROUTE 16 S | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113827618) |
| Veterans Hall | Department of New York VFW Auxiliary / Pine Valley Memorial Post 2522 | 5934 ROUTE 83 | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261519078) |
| Veterans Hall | Department of New York VFW Auxiliary / Randolph Memorial Post 6533 | 19 CARTER ST | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 134368163) |
| Veterans Hall | Sons of American Legion 535 /  | 67 WILDWOOD AVE | Cattaraugus | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 262708173) |
| Veterans Hall | VFW Post 6533 | PO BOX 123 | Cattaraugus | PO Box-only address (IRS EIN 237336666) |
| Veterans Hall | VFW Post 8734 - Little Valley | PO BOX 91 | Cattaraugus | PO Box-only address (IRS EIN 510208594) |
| Veterans Hall | VFW Post 9487 | PO BOX 262 | Cattaraugus | PO Box-only address (IRS EIN 900421834) |
| Veterans Hall | American Legion Auxiliary / 1107 Walton T Conley | 8 SCHOBEY ST | Cayuga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 364644107) |
| Veterans Hall | American Legion Post 1259 - Donald R Ward | PO BOX 143 | Cayuga | PO Box-only address (IRS EIN 161502761) |
| Veterans Hall | American Legion Post 1776 - Carnicelli Indelicate | 1 EAST GENESEE ST | Cayuga | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094053) |
| Veterans Hall | American Legion Post 257 - John Cool | PO BOX 61 | Cayuga | PO Box-only address (IRS EIN 150552059) |
| Veterans Hall | American Legion Post 568 - Clark Heck | PO BOX 767 | Cayuga | PO Box-only address (IRS EIN 166093705) |
| Veterans Hall | American Legion Post 658 - George E Ingersoll | PO BOX 243 | Cayuga | PO Box-only address (IRS EIN 166093838) |
| Veterans Hall | American Legion Post 911 - La Buff Cole | 2558 LEGION ST | Cayuga | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094029) |
| Veterans Hall | Department of New York VFW Auxiliary / Auburn Post 1975 | A1 SOUTHFIELD APT | Cayuga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510657171) |
| Veterans Hall | Department of New York VFW Auxiliary / Clifford E Gfalbraith Memorial 7127 | PO BOX 547 | Cayuga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 352389852) |
| Veterans Hall | Department of New York VFW Auxiliary / Thurston-Schramm-Reynolds Post 8137 | 513 ERIE ST | Cayuga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800504165) |
| Veterans Hall | Korean War Veterans Association Chapter 296 | 5173 PLASTER PT | Cayuga | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 562463862) |
| Veterans Hall | VFW Post 1975 - Auburn | 44 E GENESEE ST | Cayuga | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150513575) |
| Veterans Hall | VFW Post 7127 - Clifford E Galbraith Mmrl | PO BOX 547 | Cayuga | PO Box-only address (IRS EIN 150611843) |
| Veterans Hall | VFW Post 8137 - Thurston Schramm Reynolds | PO BOX 430 | Cayuga | PO Box-only address (IRS EIN 237334578) |
| Veterans Hall | Veterans of Foreign Wars of the United States Dept of New York / 5th District | 2408 FLEMING SCIPIO TOWNLINE RD | Cayuga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 223134500) |
| Veterans Hall | Vietnam Veterans of America Chapter 704 - Chapter | PO BOX 1484 | Cayuga | PO Box-only address (IRS EIN 161532011) |
| Veterans Hall | AMVETS Post 6472 | 234 Central Ave | Chautauqua | Duplicate of 'AMVETS Post 6472' (same address and type) |
| Veterans Hall | AMVETS Post 726 | 6310 E MAIN RD | Chautauqua | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 510575230) |
| Veterans Hall | AMVETS Post 726 | 364 Fluvanna Ave | Chautauqua | Duplicate of 'VFW Post 53 - John W Tiffany' (same address and type) |
| Veterans Hall | American Legion / American Legion Dist 0008 | 8 W SUMMIT ST | Chautauqua | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 464599905) |
| Veterans Hall | American Legion Auxiliary / 434 Post | 110 E MAIN ST | Chautauqua | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 811304686) |
| Veterans Hall | American Legion Auxiliary / 556 Samuel Derby | 9 MEADOW LN | Chautauqua | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320262411) |
| Veterans Hall | American Legion Auxiliary / 59 Fredonia Memorial | 156 E MAIN ST | Chautauqua | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222481213) |
| Veterans Hall | American Legion Auxiliary / 777 Herman Kent | 26 JACKSON AVE | Chautauqua | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222511336) |
| Veterans Hall | American Legion Post | PO BOX 586 | Chautauqua | PO Box-only address (IRS EIN 166032121) |
| Veterans Hall | American Legion Post - New York Chautuaqua County | 188 E PINE ST | Chautauqua | State/county-level organization record, not an individual post (IRS EIN 471049471) |
| Veterans Hall | American Legion Post 327 | 7579 E MAIN RD | Chautauqua | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 510244100) |
| Veterans Hall | American Legion Post 493 - Wm L Travis | 3 E MARVIN ST | Chautauqua | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160723246) |
| Veterans Hall | American Legion Post 566 - Lester White | PO BOX 928 | Chautauqua | PO Box-only address (IRS EIN 160743551) |
| Veterans Hall | American Legion Post 638 - Henry Mosher | PO BOX 474 | Chautauqua | PO Box-only address (IRS EIN 160834368) |
| Veterans Hall | American Legion Post 953 - J Carter Knapp | 6 CEDAR ST | Chautauqua | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093922) |
| Veterans Hall | DAV Chapter 142 - Charles Tinley Memorial | 61 E TALCOTT ST | Chautauqua | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116101266) |
| Veterans Hall | Department of New York VFW Auxiliary / Bemus Point Post 557 | PO BOX 358 | Chautauqua | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510669193) |
| Veterans Hall | Department of New York VFW Auxiliary / John T Murray Post 1017 | 111-113DEER STREET | Chautauqua | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 743243227) |
| Veterans Hall | Department of New York VFW Auxiliary / Lake Chautuaqua Memorial Post 8647 | 10 MEMORIAL DR | Chautauqua | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800473634) |
| Veterans Hall | Department of New York VFW Auxiliary / Samuel Cimino Post 6472 | 13 N MAIN ST | Chautauqua | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 651318996) |
| Veterans Hall | Department of New York VFW Auxiliary / William P Jackway Post 6764 | 34 PEARL ST | Chautauqua | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510658174) |
| Veterans Hall | Disabled American Veterans Auxiliary Inc / 47 Robert P Illig | PO BOX 181 | Chautauqua | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 237337548) |
| Veterans Hall | Marine Corps League Detachment - Dep of New York | 57 BUFFALO ST | Chautauqua | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 300513089) |
| Veterans Hall | VFW Post 8647 | PO BOX 72 | Chautauqua | PO Box-only address (IRS EIN 166069164) |
| Veterans Hall | Vietnam Veterans of America Chapter 459 - Chautauqua County Chapter | 111 SISSON ST | Chautauqua | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 521850922) |
| Veterans Hall | Vietnam Veterans of America Chapter 865 - Vva Chapter | 41 BIGELOW AVE | Chautauqua | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161585783) |
| Veterans Hall | Vietnam Veterans of America Chapter 978 - Vva Chapter | PO BOX 401 | Chautauqua | PO Box-only address (IRS EIN 432105895) |
| Veterans Hall | American Legion Auxiliary / 1612 Skinner-Ernest | 45 OLCOTT RD S | Chemung | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 166018485) |
| Veterans Hall | American Legion Post 154 - Captain Clarence R Oliver | 236 SCOTTWOOD AVE | Chemung | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160712197) |
| Veterans Hall | American Legion Post 1612 - Skinner Ernest | PO BOX 166 | Chemung | PO Box-only address (IRS EIN 166093987) |
| Veterans Hall | American Legion Post 1627 - Olive Memorial | PO BOX 1522 | Chemung | PO Box-only address (IRS EIN 146046297) |
| Veterans Hall | American Legion Post 442 - Bentley Trumble | PO BOX 420 | Chemung | PO Box-only address (IRS EIN 160720963) |
| Veterans Hall | Department of New York VFW Auxiliary / Rex Field Post 901 | 113 KEEFE ST # 115 | Chemung | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 743241723) |
| Veterans Hall | Department of New York VFW Auxiliary / Van Etten-Spencer Post 8139 | 3936 WYNCOOP CREEK RD | Chemung | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 611556089) |
| Veterans Hall | Marine Corps League Detachment - Dept of New York | PO BOX 444 | Chemung | State/county-level organization record, not an individual post (IRS EIN 133660427) |
| Veterans Hall | Marine Corps League Detachment 1493 - Empire State Leathernecks | PO BOX 444 | Chemung | PO Box-only address (IRS EIN 931837620) |
| Veterans Hall | Marine Corps League Detachment 458 - Edward J Brewer | PO BOX 236 | Chemung | PO Box-only address (IRS EIN 510252058) |
| Veterans Hall | Vietnam Veterans of America Chapter 803 - Chapter | 1200 DAVIS ST | Chemung | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161553640) |
| Veterans Hall | American Legion Auxiliary / 0376 Fort Hill Unit | PO BOX 832 | Chenango | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800230705) |
| Veterans Hall | American Legion Auxiliary / 876 Sherburne | 15 S MAIN ST | Chenango | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 160953097) |
| Veterans Hall | American Legion Post 1478 - Edwin Wilbur Jr | PO BOX 30 | Chenango | PO Box-only address (IRS EIN 166094255) |
| Veterans Hall | American Legion Post 189 - Lieutenant Warren E Eaton Dsc | 29 SHELDON ST | Chenango | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094043) |
| Veterans Hall | American Legion Post 348 - Frank H Arnold | PO BOX 488 | Chenango | PO Box-only address (IRS EIN 161339909) |
| Veterans Hall | American Legion Post 692 - Lloyd O Jackson | PO BOX 149 | Chenango | PO Box-only address (IRS EIN 166093991) |
| Veterans Hall | American Legion Post 806 - Slater Silvernail | PO BOX 4 | Chenango | PO Box-only address (IRS EIN 166093946) |
| Veterans Hall | American Legion Post 876 - Sherburne | PO BOX 286 | Chenango | PO Box-only address (IRS EIN 166093860) |
| Veterans Hall | American Legion Post 973 - Perry Cook | PO BOX 53 | Chenango | PO Box-only address (IRS EIN 166094096) |
| Veterans Hall | Department of New York VFW Auxiliary / Afton Memorial Post 3529 | 187 MAIN STREET | Chenango | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800673152) |
| Veterans Hall | Department of New York VFW Auxiliary / Christy Rock Post 2782 | 61 E MAIN ST | Chenango | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320252519) |
| Veterans Hall | VFW Post 3529 | PO BOX 238 | Chenango | PO Box-only address (IRS EIN 222877224) |
| Veterans Hall | AMVETS Post 8793 | PO BOX 147 | Clinton | PO Box-only address (IRS EIN 320267351) |
| Veterans Hall | American Legion Auxiliary / 0912 Montgomery | PO BOX 63 | Clinton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 204484696) |
| Veterans Hall | American Legion Post 1618 - Saranac | 275 WILSON RD | Clinton | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046324) |
| Veterans Hall | American Legion Post 20 | 162 QUARRY RD | Clinton | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 141514851) |
| Veterans Hall | American Legion Post 504 - Medos A Nelson | 11 MCCREA STREET | Clinton | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046443) |
| Veterans Hall | American Legion Post 769 - Russell B Childs | PO BOX 226 | Clinton | PO Box-only address (IRS EIN 146046403) |
| Veterans Hall | American Legion Post 912 - Montgomery | PO BOX 63 | Clinton | PO Box-only address (IRS EIN 141287665) |
| Veterans Hall | DAV Chapter 179 - Pfc R Lafountain | PO BOX 744 | Clinton | PO Box-only address (IRS EIN 141671314) |
| Veterans Hall | Department of New Yor VFW Auxiliary / District 9 | 316 PELLERIN RD | Clinton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 371931835) |
| Veterans Hall | Department of New York VFW Auxiliary / Edward & Moses Wells Post 125 | 116 BOYNTON AVE | Clinton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510658992) |
| Veterans Hall | Department of New York VFW Auxiliary / Peru Memorial Post 309 | 710 PLEASANT STREET | Clinton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 134367932) |
| Veterans Hall | VFW Post 8793 | PO BOX 147 | Clinton | PO Box-only address (IRS EIN 510208590) |
| Veterans Hall | American Legion Auxiliary / 346 Jennings-Willets | 10 OSTOYICH RD | Columbia | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222487263) |
| Veterans Hall | American Legion Post 1160 - Closson Raught | PO BOX 97 | Columbia | PO Box-only address (IRS EIN 146030323) |
| Veterans Hall | American Legion Post 184 - Hudson | PO BOX 715 | Columbia | PO Box-only address (IRS EIN 146035043) |
| Veterans Hall | American Legion Post 252 - Minkler Seery | PO BOX 1 | Columbia | PO Box-only address (IRS EIN 146046343) |
| Veterans Hall | American Legion Post 42 - Chatham | 34 WOODBRIDGE AVE | Columbia | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046404) |
| Veterans Hall | Department of New York VFW Auxiliary / Columbia County Post 1314 | 544 UNION ST | Columbia | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 383772872) |
| Veterans Hall | Department of New York VFW Auxiliary / Ghent Post 5933 | PO BOX 227 | Columbia | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800144297) |
| Veterans Hall | VFW Post 1314 | PO BOX 395 | Columbia | PO Box-only address (IRS EIN 146074751) |
| Veterans Hall | VFW Post 5933 | PO BOX 181 | Columbia | PO Box-only address (IRS EIN 237303207) |
| Veterans Hall | VFW Post 7552 | PO BOX 10 | Columbia | PO Box-only address (IRS EIN 237242176) |
| Veterans Hall | VFW Post 9593 | PO BOX 73 | Columbia | PO Box-only address (IRS EIN 237304255) |
| Veterans Hall | American Legion Auxiliary / 0465 Burns-Mccauliffe | PO BOX 361 | Cortland | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 364636601) |
| Veterans Hall | American Legion Auxiliary / 0489 Cortland City Unit | 212 TOMPKINS ST | Cortland | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 263340217) |
| Veterans Hall | American Legion Auxiliary / 0617 Osco Robinson Unit | 1034 US 11 | Cortland | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 352337187) |
| Veterans Hall | American Legion Post 465 - Burns Mccauliffe | PO BOX 141 | Cortland | PO Box-only address (IRS EIN 166093930) |
| Veterans Hall | American Legion Post 596 - Knickerbocker | 2757 NYS RT 26 | Cortland | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094003) |
| Veterans Hall | Department of New York VFW Auxiliary / Tioughioga Post 2354 | 19 PARKER AVE | Cortland | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800405233) |
| Veterans Hall | Disabled American Veterans Auxiliary Inc / 153 Cortland Memorial | 14813 STATE ROUTE 90 | Cortland | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 030469943) |
| Veterans Hall | Marine Corps League Detachment 221 - Cortland County of | 76 MAIN ST | Cortland | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166075471) |
| Veterans Hall | VFW Post 2354 | PO BOX 704 | Cortland | PO Box-only address (IRS EIN 237171118) |
| Veterans Hall | American Legion Auxiliary / 190 Donald W Gleason | 488 W TERRY CLOVE RD | Delaware | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161242432) |
| Veterans Hall | American Legion Auxiliary / 32 Truman C Tobey | 10 PARK ST | Delaware | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800404731) |
| Veterans Hall | American Legion Post 1554 - Guntown | 8460 COUNTY ROUTE 27 | Delaware | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161451034) |
| Veterans Hall | American Legion Post 183 - Charles L Jacobi | 22 UNION ST | Delaware | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 222424071) |
| Veterans Hall | American Legion Post 190 - Donald W Gleason | 41 PAGE AVE | Delaware | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093985) |
| Veterans Hall | American Legion Post 216 - Middletown Township | PO BOX 41 | Delaware | PO Box-only address (IRS EIN 166094077) |
| Veterans Hall | Department of New York VFW Auxiliary / Allan Milk Memorial Post 7276 | PO BOX 72 | Delaware | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 300522924) |
| Veterans Hall | VFW Post 270 - Frank Mead Eells | 10 Park St | Delaware | Duplicate of 'American Legion Post 32 - Truman C Tobey' (same address and type) |
| Veterans Hall | Vietnam Veterans of America Chapter 85 - Chapter | 76 WOOD RD | Delaware | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161343155) |
| Veterans Hall | American Legion Auxiliary / 0178 Millerton Unit | 26 MAY LN | Dutchess | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800255859) |
| Veterans Hall | American Legion Auxiliary / 1302 Arlington Town of Poughkeepsie | 10 FAIRMONT AVE | Dutchess | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800272410) |
| Veterans Hall | American Legion Auxiliary / 1466 John Livingstone Post Ladies | 50 LEGION RD | Dutchess | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320673279) |
| Veterans Hall | American Legion Auxiliary / 429 Montgomery | PO BOX 429 | Dutchess | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 371574026) |
| Veterans Hall | American Legion Auxiliary / New York Dutchess County | 10 FAIRMONT AVE | Dutchess | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 141682720) |
| Veterans Hall | American Legion Post - Dutchess Co American Legi | PO BOX 654 | Dutchess | PO Box-only address (IRS EIN 146021229) |
| Veterans Hall | American Legion Post 1302 - Arlington Town of Poughkeepsie | 55 OVERLOOK RD | Dutchess | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 141406980) |
| Veterans Hall | American Legion Post 1303 - Hyde Park | 1487 RT 9 G APT 1 | Dutchess | Looks residential: apartment/unit/lot in address (IRS EIN 146046455) |
| Veterans Hall | American Legion Post 1758 - Manny Bacon | PO BOX 92 | Dutchess | PO Box-only address (IRS EIN 146046290) |
| Veterans Hall | American Legion Post 178 - Millerton | PO BOX 22 | Dutchess | PO Box-only address (IRS EIN 146046451) |
| Veterans Hall | American Legion Post 203 - Beacon | 413 Main St | Dutchess | Duplicate of 'Marine Corps League Detachment 861 - Carmen Ramputi' (same address and type) |
| Veterans Hall | American Legion Post 215 - Hasler Kamp | PO BOX 515 | Dutchess | PO Box-only address (IRS EIN 146046351) |
| Veterans Hall | American Legion Post 426 - Shacameco | PO BOX 125 | Dutchess | PO Box-only address (IRS EIN 146046345) |
| Veterans Hall | American Legion Post 429 - Montgomery | PO BOX 429 | Dutchess | PO Box-only address (IRS EIN 146046350) |
| Veterans Hall | American Legion Post 524 - Harris Smith | PO BOX 59 | Dutchess | PO Box-only address (IRS EIN 146046279) |
| Veterans Hall | American Legion Post 71 - Argonne | 7 LILAC DR | Dutchess | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146032447) |
| Veterans Hall | American Legion Post 739 - Pleasant | PO BOX 284 | Dutchess | PO Box-only address (IRS EIN 146046325) |
| Veterans Hall | DAV Chapter 144 - Castle Point | 11 HIGH ACRES DR | Dutchess | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146036396) |
| Veterans Hall | Department of New York VFW Auxiliary / Harlem Valley Post 5444 | PO BOX 363 | Dutchess | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 770708900) |
| Veterans Hall | Department of New York VFW Auxiliary / Red Hook Post 7765 | 155 METZGER RD LOT 19 | Dutchess | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 651318410) |
| Veterans Hall | Department of New York VFW Auxiliary / Vail Wolff Mckenna Frye Post 170 | 1 VIOLET AVE | Dutchess | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 141581117) |
| Veterans Hall | Department of New York VFW Auxiliary / Victor L Bracone Post 5913 | 8 SCHOOL ST | Dutchess | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 813153767) |
| Veterans Hall | Disabled American Veterans Auxiliary Inc / 144 Castle Point | 332 ALL ANGELS HILL RD | Dutchess | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 364672321) |
| Veterans Hall | VFW Post 666 | 413 Main St | Dutchess | Duplicate of 'Marine Corps League Detachment 861 - Carmen Ramputi' (same address and type) |
| Veterans Hall | Vietnam Veterans of America Chapter 869 - Vv Chapter | 28 RIDGEVIEW RD | Dutchess | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 263648770) |
| Veterans Hall | AMVETS / NY State Service Foundation Inc | 42 CAMPBELL AVE | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 111961055) |
| Veterans Hall | AMVETS Post - Dept | 42 CAMPBELL AVE | Erie | State/county-level organization record, not an individual post (IRS EIN 113117721) |
| Veterans Hall | AMVETS Post - Dept | 5828 BROADWAY ST APT 711 | Erie | State/county-level organization record, not an individual post (IRS EIN 237204645) |
| Veterans Hall | AMVETS Post 14 | PO BOX 505 | Erie | PO Box-only address (IRS EIN 133348380) |
| Veterans Hall | AMVETS Post 14 | 4721 BROADWAY | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237171276) |
| Veterans Hall | AMVETS Post 219 | PO BOX 271 | Erie | PO Box-only address (IRS EIN 237079781) |
| Veterans Hall | AMVETS Post 219 | PO BOX 271 | Erie | PO Box-only address (IRS EIN 510502831) |
| Veterans Hall | AMVETS Post 219 | PO BOX 341 | Erie | PO Box-only address (IRS EIN 562388720) |
| Veterans Hall | AMVETS Post 24 | 1440 JEFFERSON AVE | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 364725222) |
| Veterans Hall | AMVETS Post 45 | 38 COLONIAL MANOR CT | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166050853) |
| Veterans Hall | AMVETS Post 4572 | 50 Gates St | Erie | Duplicate of 'American Legion Post 1320 - Frank L Gierlach' (same address and type) |
| Veterans Hall | AMVETS Post 61 | 65 CHURCH ST | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 813841891) |
| Veterans Hall | AMVETS Post 72 | 2683 CLINTON ST | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237303590) |
| Veterans Hall | AMVETS Post 72 | 305 BARNSDALE AVE | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 753064493) |
| Veterans Hall | AMVETS Post 7275 | 3741 Walden Ave | Erie | Duplicate of 'VFW Post 7275' (same address and type) |
| Veterans Hall | AMVETS Post 8113 | PO BOX 433 | Erie | PO Box-only address (IRS EIN 237316004) |
| Veterans Hall | AMVETS Post 8113 | PO BOX 433 | Erie | PO Box-only address (IRS EIN 260085006) |
| Veterans Hall | AMVETS Post 897 | 263 LABELLE AVE | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161560125) |
| Veterans Hall | AMVETS Post 897 | 149 Lake Ave | Erie | Duplicate of 'AMVETS Post 897' (same address and type) |
| Veterans Hall | American Legion Auxiliary / 0567 Orchard Park | 5784 ELLIS ROAD | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800182725) |
| Veterans Hall | American Legion Auxiliary / 0880 Newell-Faulkner Unit | 2912 LEGION DR | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 300466505) |
| Veterans Hall | American Legion Auxiliary / 1041 Niagara Frontier Unit | 533 AMHERST ST | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900422394) |
| Veterans Hall | American Legion Auxiliary / 1477 Matthew Glab Unit | 1965 ABBOTT RD | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900423603) |
| Veterans Hall | American Legion Auxiliary / 1626 Francis J Donovan | 3210 GENESEE ST | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222489625) |
| Veterans Hall | American Legion Auxiliary / 1780 Bennett Wells | 1356 E DELAVAN AVE | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 611556300) |
| Veterans Hall | American Legion Auxiliary / 1928 Gabriel A Rodriguez Unit | 397 PARKDALE AVE | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 934188781) |
| Veterans Hall | American Legion Auxiliary / 205 Milton J Brounshidle | 3354 DELAWARE AVE | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 166029504) |
| Veterans Hall | American Legion Auxiliary / 264 Tonawanda Unit | 139 SETON RD | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 166047738) |
| Veterans Hall | American Legion Auxiliary / 362 East Aurora | 7040 LEWIS RD | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 943441007) |
| Veterans Hall | American Legion Auxiliary / 721 South Buffalo | 136 CAZENOVIA ST | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161363487) |
| Veterans Hall | American Legion Auxiliary / 735 West Seneca | 35 LEGION PKWY | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161594592) |
| Veterans Hall | American Legion Auxiliary / 900 L L Tillman | 9 ECKERSON AVE | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 166054274) |
| Veterans Hall | American Legion Band of the Tonawandas Inc /  | PO BOX 122 | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 223067668) |
| Veterans Hall | American Legion Post - Erie County Committee | 65 NIAGARA ST | Erie | State/county-level organization record, not an individual post (IRS EIN 160331270) |
| Veterans Hall | American Legion Post 1346 - Grand Island | PO BOX 1346 | Erie | PO Box-only address (IRS EIN 166093731) |
| Veterans Hall | American Legion Post 1449 - Thomas E Tehan | 2075 ELECTRIC AVE | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160849819) |
| Veterans Hall | American Legion Post 1477 - Matthew Glab | 1965 Abbott Rd | Erie | Duplicate of 'American Legion Post 63 - Lackawanna' (same address and type) |
| Veterans Hall | American Legion Post 1529 - Coast Guard | PO BOX 301 | Erie | PO Box-only address (IRS EIN 166094248) |
| Veterans Hall | American Legion Post 1586 - Erieco Womens | PO BOX 759 | Erie | PO Box-only address (IRS EIN 166094064) |
| Veterans Hall | American Legion Post 1640 | PO BOX 520 | Erie | PO Box-only address (IRS EIN 222509378) |
| Veterans Hall | American Legion Post 1672 - Alfred J Jurek | PO BOX 759 | Erie | PO Box-only address (IRS EIN 166094018) |
| Veterans Hall | American Legion Post 1928 | 45 LORNA LN | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 852014390) |
| Veterans Hall | American Legion Post 362 - East Aurora | PO BOX 122 | Erie | PO Box-only address (IRS EIN 160957714) |
| Veterans Hall | American Legion Post 430 - Jesse Clipper | PO BOX 2836 | Erie | PO Box-only address (IRS EIN 161375208) |
| Veterans Hall | American Legion Post 431 - Concord | 109 ZOAR VALLEY RD | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093842) |
| Veterans Hall | American Legion Post 527 - Hamburg | PO BOX 178 | Erie | PO Box-only address (IRS EIN 160717454) |
| Veterans Hall | American Legion Post 622 - George F Lamm | 962 WEHRLE DR | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161432285) |
| Veterans Hall | American Legion Post 665 - Troop I | 234 SUMNER PL | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160637649) |
| Veterans Hall | American Legion Post 78 - Lorenzo Burrows Jr | PO BOX 248 | Erie | PO Box-only address (IRS EIN 166094015) |
| Veterans Hall | American Legion Post 928 - Newcomb Long | 7353 ERIE RD | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160730756) |
| Veterans Hall | DAV Chapter 1 - Greater Buffalo | 533 Amherst St | Erie | Duplicate of 'American Legion Post 1041 - Niagara Frontier' (same address and type) |
| Veterans Hall | DAV Chapter 120 - Roll of Honor | 281 CRABAPPLE LN | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116101238) |
| Veterans Hall | DAV Chapter 177 - Southtowns | 2551 March Rd | Erie | Duplicate of 'VFW Post 8265 - Eden Memorial' (same address and type) |
| Veterans Hall | DAV Chapter 203 - Korean Era Mem | 30 PRINCESS DR | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 222567252) |
| Veterans Hall | Department of New York VFW Auxiliary / Amherst Township Post 416 | 3758 SHERIDAN DR | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 421747094) |
| Veterans Hall | Department of New York VFW Auxiliary / Charles N Deglopper Memorial Po9249 | 1361 E PARK RD | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320270673) |
| Veterans Hall | Department of New York VFW Auxiliary / Colonel J B Weber Post 898 | 2909 S PARK AVE | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800319837) |
| Veterans Hall | Department of New York VFW Auxiliary / Elma Marille Wales Rademacher P5861 | 3007 BOWEN RD | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 142011559) |
| Veterans Hall | Department of New York VFW Auxiliary / Evans Township Post 5798 | 6632 HAMILTON DR | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510658112) |
| Veterans Hall | Department of New York VFW Auxiliary / Felton Burns Post 5260 | 650 E MAIN ST | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261672855) |
| Veterans Hall | Department of New York VFW Auxiliary / Frontiersman Post 7545 | 110 ELGIN ST | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 550874366) |
| Veterans Hall | Department of New York VFW Auxiliary / Hamburg Township Post 1419 | 2985 LAKEVIEW RD | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510649180) |
| Veterans Hall | Department of New York VFW Auxiliary / Pvt Leonard Post Jr Post 6251 | 67 FEDERAL AVE | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 562677608) |
| Veterans Hall | Disabled American Veterans Auxiliary Inc / 1 Greater Buffalo | 11672 BONCLIFF DR | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222513882) |
| Veterans Hall | Disabled American Veterans Auxiliary Inc / 120 Roll of Honor | 59 SAGAMORE TER | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900419347) |
| Veterans Hall | Disabled American Veterans Auxiliary Inc / State Department of New York | 11672 BONCLIFF DR | Erie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 273561519) |
| Veterans Hall | Marine Corps League Detachment 1136 - Southtowns Del | 11042 BIG TREE RD | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 320203359) |
| Veterans Hall | Marine Corps League Detachment 216 - Bett Toomey | PO BOX 311 | Erie | PO Box-only address (IRS EIN 161263197) |
| Veterans Hall | Marine Corps League Detachment 239 - Niagara Frontier | PO BOX 106 | Erie | PO Box-only address (IRS EIN 223614558) |
| Veterans Hall | VFW Post 416 - Amherst Township | PO BOX 182 | Erie | PO Box-only address (IRS EIN 160705085) |
| Veterans Hall | VFW Post 7545 - Frontiersman | PO BOX 263 | Erie | PO Box-only address (IRS EIN 237333455) |
| Veterans Hall | VFW Post 8113 - West Seneca | PO BOX 119 | Erie | PO Box-only address (IRS EIN 237303198) |
| Veterans Hall | VFW Post 9249 | 2121 GRAND ISLAND BLVD | Erie | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237332984) |
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
| Veterans Hall | DAV Chapter 182 - Ssgt Earl A Robinson Chapter | PO BOX 11 | Franklin | PO Box-only address (IRS EIN 310898167) |
| Veterans Hall | Department of New York VFW Auxiliary / Albert A Gonyea Memorial Post 3357 | 202 BROADWAY | Franklin | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510675597) |
| Veterans Hall | VFW Post 3120 | 196 PARK ST | Franklin | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237332260) |
| Veterans Hall | American Legion Auxiliary Unit 137 /  | 200 N MAIN ST | Fulton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 862815166) |
| Veterans Hall | American Legion Post 1076 | PO BOX 973 | Fulton | PO Box-only address (IRS EIN 311620412) |
| Veterans Hall | American Legion Post 337 - Robert Lee Walsh | PO BOX 305 | Fulton | PO Box-only address (IRS EIN 141551083) |
| Veterans Hall | Department of New York VFW Auxiliary / John Baird Post 8690 | 19 PINE ST | Fulton | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 364679524) |
| Veterans Hall | VFW Post 8690 | PO BOX 692 | Fulton | PO Box-only address (IRS EIN 237334558) |
| Veterans Hall | American Legion Auxiliary / 0332 Glenn S Loomis Unit | 8960 ALEXANDER RD | Genesee | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 166093795) |
| Veterans Hall | American Legion Auxiliary / 576 Botts-Florito | 53 WEST MAIN ST | Genesee | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222512354) |
| Veterans Hall | American Legion Post 576 - Botts Fiorito | 53 WEST MAIN STREET | Genesee | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093937) |
| Veterans Hall | American Legion Post 626 - Hiram G Luhman | 6554 ALLEGHANY RD | Genesee | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094039) |
| Veterans Hall | Department of New York VFW Auxiliary / District 7 | 114 GRANDVIEW TER | Genesee | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 743107108) |
| Veterans Hall | Department of New York VFW Auxiliary / Vaness-Strollo Post 1602 | 25 EDWARDS ST | Genesee | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320265507) |
| Veterans Hall | American Legion Auxiliary / 0291 Greenville Unit | PO BOX 132 | Greene | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800242600) |
| Veterans Hall | American Legion Auxiliary / 1327 Virgil E Deyo Unit | 13497 STATE ROUTE 23A | Greene | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900398013) |
| Veterans Hall | American Legion Post 110 | 4492 ROUTE 32 | Greene | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 222459591) |
| Veterans Hall | American Legion Post 1327 - Virgil E Deyo | PO BOX 272 | Greene | PO Box-only address (IRS EIN 146046347) |
| Veterans Hall | American Legion Post 165 - Bunt Brewer | PO BOX 1065 | Greene | PO Box-only address (IRS EIN 146046277) |
| Veterans Hall | American Legion Post 166 - Coxsackie | PO BOX 101 | Greene | PO Box-only address (IRS EIN 146046415) |
| Veterans Hall | American Legion Post 187 - T G M | PO BOX 21 | Greene | PO Box-only address (IRS EIN 146046439) |
| Veterans Hall | American Legion Post 291 - Greenville | PO BOX 132 | Greene | PO Box-only address (IRS EIN 146046341) |
| Veterans Hall | American Legion Post 983 - Mohican | PO BOX 329 | Greene | PO Box-only address (IRS EIN 146046446) |
| Veterans Hall | Department of New York VFW Auxiliary / Sullivan Teator Post 770 | 539 MAIN ST | Greene | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510659369) |
| Veterans Hall | Marine Corps League Detachment 1274 - Mountain Top | PO BOX 1257 | Greene | PO Box-only address (IRS EIN 770674018) |
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
| Veterans Hall | Marine Corps League Detachment 227 - Herkimer County | 2103 ALBANY RD | Herkimer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161257017) |
| Veterans Hall | Marine Corps League Detachment 368 - NY Pack Pound | 178 2ND ST | Herkimer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161584683) |
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
| Veterans Hall | VFW Post - South Jefferson County Memorial | 3 VFW DR | Jefferson | State/county-level organization record, not an individual post (IRS EIN 814787081) |
| Veterans Hall | AMVETS Post 99 | 5383 Dayan St | Lewis | Duplicate of 'American Legion Post 162 - Lowville Memorial' (same address and type) |
| Veterans Hall | American Legion Auxiliary / 0162 Lowville Memorial | 5383 DAYAN ST | Lewis | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 562380305) |
| Veterans Hall | American Legion Auxiliary / 1663 Beaver River Memorial | PO BOX 217 | Lewis | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161322054) |
| Veterans Hall | American Legion Post 1663 - Beaver River Memorial | PO BOX 217 | Lewis | PO Box-only address (IRS EIN 166093941) |
| Veterans Hall | American Legion Post 723 - Floyd Lyng | 6703 OLD STATE RD | Lewis | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094032) |
| Veterans Hall | Department of New York VFW Auxiliary / Lewis County Memorial Post 6912 | 7150 STATE ROUTE 26 | Lewis | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 611509921) |
| Veterans Hall | Marine Corps League Detachment 754 - Lewis County | PO BOX 164 | Lewis | PO Box-only address (IRS EIN 161575298) |
| Veterans Hall | American Legion Auxiliary / 0255 Mathew Cleary Unit | CHURCH STREET | Livingston | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 300517136) |
| Veterans Hall | American Legion Auxiliary / 87 Daniel Goho | 16 LEONARD ST | Livingston | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161306038) |
| Veterans Hall | American Legion Auxiliary / Unit of Seager Werner American Legi | PO BOX 55 | Livingston | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 393942627) |
| Veterans Hall | American Legion Post 1341 - Hally Allen | PO BOX 135 | Livingston | PO Box-only address (IRS EIN 166094230) |
| Veterans Hall | American Legion Post 1569 - Arland Kelley | PO BOX 95 | Livingston | PO Box-only address (IRS EIN 900628878) |
| Veterans Hall | American Legion Post 271 - J Livingston Wadsworth | PO BOX 388 | Livingston | PO Box-only address (IRS EIN 166094220) |
| Veterans Hall | American Legion Post 282 - Francis M Dalton | PO BOX 311 | Livingston | PO Box-only address (IRS EIN 166094253) |
| Veterans Hall | American Legion Post 283 - Harrison Lee | PO BOX 214 | Livingston | PO Box-only address (IRS EIN 166094254) |
| Veterans Hall | American Legion Post 294 - Joseph Gallipeau | PO BOX 132 | Livingston | PO Box-only address (IRS EIN 166094051) |
| Veterans Hall | American Legion Post 333 - Seager Werner | PO BOX 55 | Livingston | PO Box-only address (IRS EIN 166094038) |
| Veterans Hall | American Legion Post 87 - Daniel Goho | 34 ELIZABETH ST | Livingston | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160809313) |
| Veterans Hall | American Legion Post 905 - Kern Robinson | PO BOX 100 | Livingston | PO Box-only address (IRS EIN 166093841) |
| Veterans Hall | Department of New York VFW Auxiliary / Duryea-Kleinhenz-Lathrop Post 8961 | 32 N STATE ST | Livingston | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 010918487) |
| Veterans Hall | Department of New York VFW Auxiliary / Frank J Casbolt Memorial Post 6780 | 145 MAIN ST | Livingston | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161360206) |
| Veterans Hall | Department of New York VFW Auxiliary / Lt Boyd and Sgt Parker Post 547 | 3 ELM ST | Livingston | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 262278643) |
| Veterans Hall | VFW Post 547 | PO BOX 414 | Livingston | PO Box-only address (IRS EIN 237335018) |
| Veterans Hall | American Legion Auxiliary / 1287 William H Cain Unit | LEGION DRIVE | Madison | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800199052) |
| Veterans Hall | American Legion Auxiliary / 140 Charles Miller | 3312 PINE RIDGE RD | Madison | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 263397373) |
| Veterans Hall | American Legion Auxiliary Oneida 169 /  | PO BOX 73 | Madison | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 166043024) |
| Veterans Hall | American Legion Post 1287 - William H Cain | PO BOX 11 | Madison | PO Box-only address (IRS EIN 166093953) |
| Veterans Hall | American Legion Post 1492 - Johnson Rogers | PO BOX 245 | Madison | PO Box-only address (IRS EIN 166093978) |
| Veterans Hall | American Legion Post 1572 - Malcom Taylor | PO BOX 2W48 | Madison | PO Box-only address (IRS EIN 166094237) |
| Veterans Hall | American Legion Post 236 - Earlville | PO BOX 741 | Madison | PO Box-only address (IRS EIN 166093992) |
| Veterans Hall | American Legion Post 375 - Lloyd V Evans | PO BOX 181 | Madison | PO Box-only address (IRS EIN 571210775) |
| Veterans Hall | American Legion Post 54 - Munnsville | PO BOX 187 | Madison | PO Box-only address (IRS EIN 150511190) |
| Veterans Hall | American Legion Post 88 - Cazenovia | PO BOX 263 | Madison | PO Box-only address (IRS EIN 166093956) |
| Veterans Hall | American Legion Post 894 - Woodford Burdick | PO BOX 407 | Madison | PO Box-only address (IRS EIN 166093940) |
| Veterans Hall | Department of New York VFW Auxiliary / Bridgeport Memorial Post 8440 | 516 STATE ROUTE 31 | Madison | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 134367895) |
| Veterans Hall | Department of New York VFW Auxiliary / Canastota Memorial Post 600 | PO BOX 104 | Madison | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 202365917) |
| Veterans Hall | Marine Corps League Detachment 639 - Leatherstocking | 311 WASHINGTON AVE | Madison | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161564121) |
| Veterans Hall | Marine Corps League Detachment 877 - Emerald City | 612 LAKE ST | Madison | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 223641965) |
| Veterans Hall | VFW Post 600 | PO BOX 104 | Madison | PO Box-only address (IRS EIN 161137464) |
| Veterans Hall | American Legion Auxiliary / 0468 Greece | 344 DORSEY RD | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 611569788) |
| Veterans Hall | American Legion Auxiliary / 1830 Chili | 450 CHILI-SCOTTSVILLE ROAD | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222506384) |
| Veterans Hall | American Legion Auxiliary / 330 Unit | FERRIS GOODRIDGE AUXILIARY UNIT 330 | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 364848693) |
| Veterans Hall | American Legion Auxiliary / 367 Smith-Warren | 61 MAIN ST | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 166052028) |
| Veterans Hall | American Legion Auxiliary / 942 Cottreall Warner | 818 RIDGE RD | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 263461791) |
| Veterans Hall | American Legion Auxiliary / 954 Harvey C Noone | PO BOX 3 | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 166053362) |
| Veterans Hall | American Legion Post | 933 UNIVERSITY AVE STE A | Monroe | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 200302749) |
| Veterans Hall | American Legion Post - New York Monroe County Committee | 93 FREEDOM POND LN | Monroe | State/county-level organization record, not an individual post (IRS EIN 161214899) |
| Veterans Hall | American Legion Post 1151 - Ely Fagan | PO BOX 72 | Monroe | PO Box-only address (IRS EIN 166093875) |
| Veterans Hall | American Legion Post 1229 - Braman | PO BOX 4 | Monroe | PO Box-only address (IRS EIN 166094092) |
| Veterans Hall | American Legion Post 1229 - Braman | PO BOX 4 | Monroe | PO Box-only address (IRS EIN 932605013) |
| Veterans Hall | American Legion Post 134 - Irondequoit | 222 OAKLAWN DR | Monroe | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093829) |
| Veterans Hall | American Legion Post 1830 - Chili | 450 CHILI SCOTTSVILLE ROAD | Monroe | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161074268) |
| Veterans Hall | American Legion Post 330 - Ferris Goodridge | PO BOX 113 | Monroe | PO Box-only address (IRS EIN 166093844) |
| Veterans Hall | American Legion Post 468 - Greece | 344 Dorsey Rd | Monroe | Duplicate of 'American Legion Post 468 - Greece' (same address and type) |
| Veterans Hall | American Legion Post 474 - Ira J Jacobson | 90 SAINT JOHNS PARK | Monroe | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160871272) |
| Veterans Hall | American Legion Post 899 - Rayson Miller | 21 N MAIN ST | Monroe | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094290) |
| Veterans Hall | American Legion Post 954 - Harvey C Noone | PO BOX 3 | Monroe | PO Box-only address (IRS EIN 166094207) |
| Veterans Hall | American Legion Post 98 - William W Doud | PO BOX 24679 | Monroe | PO Box-only address (IRS EIN 510243700) |
| Veterans Hall | DAV Chapter 15 - Monroe Powers | 2125 PINNACLE RD | Monroe | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116101243) |
| Veterans Hall | Department of New York VFW Auxiliary / Chili Memorial Post 412 | 32 ALFRED AVE | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800321242) |
| Veterans Hall | Department of New York VFW Auxiliary / Frances E Hibbard Post 4658 | 344 DORSEY RD | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510659557) |
| Veterans Hall | Department of New York VFW Auxiliary / Hamlin Post 6703 | 1739 LAKE RD | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510648192) |
| Veterans Hall | Department of New York VFW Auxiliary / Pennington-Moye Post 9251 | 74 MULCAHY BLVD | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 743245639) |
| Veterans Hall | Department of New York VFW Auxiliary / Perinton Memorial Post 8495 | 300 MACEDON CENTER RD | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 134366587) |
| Veterans Hall | Department of New York VFW Auxiliary to District 8 /  | 40 GROTON PKWY | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 753259925) |
| Veterans Hall | Disabled American Veterans Auxiliary Inc / 15 Monroe Powers Unit | 1239 UNIVERSITY AVE SUITE 4 | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 882807225) |
| Veterans Hall | Jewish War Veterans Post 41 - David J Kaufman | PO BOX 18184 | Monroe | PO Box-only address (IRS EIN 166054125) |
| Veterans Hall | Jewish War Veterans of USA Memorial Foundation Inc / David J Kauffman Post 41 Jwv | 255 EAST AVE STE 201 | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161363822) |
| Veterans Hall | Marine Corps League Detachment 223 - Genesee Valley | 1805 BLOSSOM RD | Monroe | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166089744) |
| Veterans Hall | Monroe County American Legion Honor Guard Inc /  | PO BOX 15493 | Monroe | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 822441116) |
| Veterans Hall | VFW Post 8495 | PO BOX 92 | Monroe | PO Box-only address (IRS EIN 237334568) |
| Veterans Hall | VFW Post 9251 | 200 West Ave | Monroe | Duplicate of 'VFW Post 16' (same address and type) |
| Veterans Hall | VFW Post 9483 - Sean P Miller Adm | PO BOX 1140 | Monroe | PO Box-only address (IRS EIN 237303600) |
| Veterans Hall | Vietnam Veterans of America Chapter 20 - Chapter | PO BOX 12580 | Monroe | PO Box-only address (IRS EIN 161185365) |
| Veterans Hall | American Legion Auxiliary / 0554 Fort Plain | WEBSTER STREET | Montgomery | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 611610307) |
| Veterans Hall | Department of New York VFW Auxiliary / Glen Mohawk Post 942 | PO BOX 116 | Montgomery | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 300649029) |
| Veterans Hall | Marine Corps League Detachment 392 - Amsterdam | 123 W Main St | Montgomery | Duplicate of 'American Legion Post 701 - John Wyszomirski' (same address and type) |
| Veterans Hall | Marine Corps League Detachment 787 - Adirondack | 170 NEW TURNPIKE RD | Montgomery | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 141817523) |
| Veterans Hall | VFW Post 3275 | 30 RIVER ST | Montgomery | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160996195) |
| Veterans Hall | VFW Post 942 | PO BOX 116 | Montgomery | PO Box-only address (IRS EIN 237262351) |
| Veterans Hall | AMVETS Post 88 | 692 Broadway | Nassau | Duplicate of 'AMVETS Post 88 - Amvet Memorial' (same address and type) |
| Veterans Hall | AMVETS Post 88 | 692 Broadway | Nassau | Duplicate of 'AMVETS Post 88 - Amvet Memorial' (same address and type) |
| Veterans Hall | American Legion Auxiliary /  | 27 BAYVIEW AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510177455) |
| Veterans Hall | American Legion Auxiliary / 0144 Williston Unit | 730 WILLIS AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320259281) |
| Veterans Hall | American Legion Auxiliary / 0265 William Bradford Turner | 98 MEADOW ST | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800283579) |
| Veterans Hall | American Legion Auxiliary / 0854 Andrew Fatscher Unit | 51 ROOSEVELT AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 112483628) |
| Veterans Hall | American Legion Auxiliary / 1029 Island Park | 3925 NEVADA AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 112662360) |
| Veterans Hall | American Legion Auxiliary / 1066 Massapequa | 66 VETERANS BLVD | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113462571) |
| Veterans Hall | American Legion Auxiliary / 1282 Merrick Unit | 160 MERRICK RD | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 010909114) |
| Veterans Hall | American Legion Auxiliary / 1285 Robert H Spittle Unit | 20 JULY AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800281792) |
| Veterans Hall | American Legion Auxiliary / 1718 Carle Place American Legion | PO BOX 127 | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 611779833) |
| Veterans Hall | American Legion Auxiliary / 336 Auxiliary Unit | 190 GLEN HEAD RD | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 472339133) |
| Veterans Hall | American Legion Auxiliary / 44 Malverne | PO BOX 44 | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 116105060) |
| Veterans Hall | American Legion Auxiliary / 958 East Rockaway | 71 MAIN ST | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113109294) |
| Veterans Hall | American Legion Auxiliary / Unit 335 Lynbrook American Legion A | 70 HARDING AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 932618660) |
| Veterans Hall | American Legion Auxiliary National 1082 Post East Meadow Memorial /  | 294 BELLMORE RD | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113108527) |
| Veterans Hall | American Legion Auxiliary Unit 1711 Levittown /  | 3123 N JERUSALEM RD | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 364641128) |
| Veterans Hall | American Legion Post 1029 | PO BOX 308 | Nassau | PO Box-only address (IRS EIN 116104960) |
| Veterans Hall | American Legion Post 1087 - Cathedral | 233 WOODLAWN RD | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237402917) |
| Veterans Hall | American Legion Post 1089 - New Hyde Park Ernie Pyle | PO BOX 1174 | Nassau | PO Box-only address (IRS EIN 116104971) |
| Veterans Hall | American Legion Post 1132 - Edwin Welch Jr Ubc | 2301 PENATIQUIT AVE | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116105107) |
| Veterans Hall | American Legion Post 1285 - Robert M Spittel | PO BOX 137 | Nassau | PO Box-only address (IRS EIN 116105017) |
| Veterans Hall | American Legion Post 144 - Williston | PO BOX 1 | Nassau | PO Box-only address (IRS EIN 116104946) |
| Veterans Hall | American Legion Post 160 - Charles A Fowler Jr | PO BOX 231248 | Nassau | PO Box-only address (IRS EIN 116105080) |
| Veterans Hall | American Legion Post 1634 - Sergeant John Sardielloinc | 2730 ROYLE ST | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116105105) |
| Veterans Hall | American Legion Post 1718 - Carle Place | PO BOX 127 | Nassau | PO Box-only address (IRS EIN 116104975) |
| Veterans Hall | American Legion Post 1749 - North Bellmore | PO BOX 559 | Nassau | PO Box-only address (IRS EIN 116105008) |
| Veterans Hall | American Legion Post 1812 - Plainview | PO BOX 62 | Nassau | PO Box-only address (IRS EIN 116104957) |
| Veterans Hall | American Legion Post 303 | 197 MAPLE AVE | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 112499000) |
| Veterans Hall | American Legion Post 304 - Manhasset | PO BOX 304 | Nassau | PO Box-only address (IRS EIN 112902662) |
| Veterans Hall | American Legion Post 334 - Floral Park | PO BOX11002 | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116105053) |
| Veterans Hall | American Legion Post 335 - Lynbrook | PO BOX 62 | Nassau | PO Box-only address (IRS EIN 383799830) |
| Veterans Hall | American Legion Post 342 - William Clinton Story | 925 S OCEAN AVE | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 111620630) |
| Veterans Hall | American Legion Post 349 - Mineola Memorial | 349 MINEOLA MEMORIAL | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116105042) |
| Veterans Hall | American Legion Post 390 - Hempstead | 160 MARVIN AVE | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 111590355) |
| Veterans Hall | American Legion Post 421 - Charles Wagner | 4011 Bernice Rd | Nassau | Duplicate of 'American Legion Post 421 - Charles Wagner' (same address and type) |
| Veterans Hall | American Legion Post 44 - Malverne | PO BOX 44 | Nassau | PO Box-only address (IRS EIN 112543248) |
| Veterans Hall | American Legion Post 449 - Hugh C Newman III Memorial | PO BOX 4000 | Nassau | PO Box-only address (IRS EIN 371433938) |
| Veterans Hall | American Legion Post 456 - James F Brengel | 289 8TH AVE | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116105077) |
| Veterans Hall | American Legion Post 948 - Bellmore | PO BOX 394 | Nassau | PO Box-only address (IRS EIN 116105103) |
| Veterans Hall | American Legion Post 962 - Howard A Van Wagner | 280 FOREST AVENUE | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 113129312) |
| Veterans Hall | American Legion Post 972 - Victor Murtha | PO BOX 97 | Nassau | PO Box-only address (IRS EIN 116105035) |
| Veterans Hall | DAV Chapter - Dept of New York | 162 ATLANTIC AVE | Nassau | State/county-level organization record, not an individual post (IRS EIN 112248726) |
| Veterans Hall | DAV Chapter 145 - Chateau Thierry Cpl Wainz | PO BOX 1626 | Nassau | PO Box-only address (IRS EIN 116101194) |
| Veterans Hall | Department of New York VFW Auxiliary / 2770 Vigilant Post | 2400 BEDFORD AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113825927) |
| Veterans Hall | Department of New York VFW Auxiliary / Corporal George Benkert Jr Post 516 | 112 LAMBERT AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113017041) |
| Veterans Hall | Department of New York VFW Auxiliary / Frank P Curry Jr Post 2718 | 68 LINCOLN RD | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 383850417) |
| Veterans Hall | Department of New York VFW Auxiliary / Lieutenant John F Ogrady Post 1384 | 675 W PARK AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 271723413) |
| Veterans Hall | Department of New York VFW Auxiliary / Robert F Garrison Post 3350 | 164 MAIN ST | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 824619052) |
| Veterans Hall | Department of New York VFW Auxiliary / Sgt John Kissell Post 5199 | 397 WEIDNER AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510660638) |
| Veterans Hall | Department of New York VFW Auxiliary / Wade Burns Post 7279 | 31 ADAM RD W | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 870813331) |
| Veterans Hall | Jewish War Veterans Post 488 - Major Joseph Lief | 100 LANDING RD APT 110 | Nassau | Looks residential: apartment/unit/lot in address (IRS EIN 116083901) |
| Veterans Hall | Jewish War Veterans Post 652 - Ens Lawrence Solowey | 2554 LEFFERTS PL | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237049336) |
| Veterans Hall | Jewish War Veterans Post 717 - Chwatsky Faber | 596 OAKTREE CT | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116083847) |
| Veterans Hall | Marine Corps League Detachment - North Shore Queens Unit | 2090 SPRUCE ST | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 112315982) |
| Veterans Hall | Marine Corps League Detachment 225 - Dan Daly Globe & Anchor | 46 HITCHING POST LN | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 113455232) |
| Veterans Hall | Marine Corps League Detachment 248 - Sunrise | 99 NEW YORK AVE | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116101167) |
| Veterans Hall | Marine Corps League Detachment 561 - Western Long Island | PO BOX 7 | Nassau | PO Box-only address (IRS EIN 113339557) |
| Veterans Hall | Marine Corps League Detachment 614 - Port Washington | 649 FOCH BLVD | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 474625585) |
| Veterans Hall | Nassua County Committee American Legion Auxiliary /  | 158 WEBSTER AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 116030578) |
| Veterans Hall | Polish Legion of American Veterans Post 24 - General Casimir Pulaski | 3812 FRANKLIN AVE | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237035175) |
| Veterans Hall | VFW Auxiliary to Levittown-Island Trees Post 9592 /  | 5 WELCOME LN | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 300483802) |
| Veterans Hall | VFW Post 516 | PO BOX 155 | Nassau | PO Box-only address (IRS EIN 112489633) |
| Veterans Hall | VFW Post 7277 | 191 VETERANS BLVD | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237304248) |
| Veterans Hall | Veterans of Foreign Wars of the US Dept of NY / 1 District | 674 MARTHA ST | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510617677) |
| Veterans Hall | Veterans of Foreign Wars of the United States Dept of New York / District 10-New York | 282 LINCOLN AVE | Nassau | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 112774017) |
| Veterans Hall | Vietnam Veterans of America Chapter - New York Association | 124 HARDING AVE | Nassau | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 204489582) |
| Veterans Hall | Vietnam Veterans of America Chapter 82 - Nassau County Vva Chapter | PO BOX 412 | Nassau | PO Box-only address (IRS EIN 521389512) |
| Veterans Hall | AMVETS Post 26 | 115 14TH AVE | Niagara | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 831221322) |
| Veterans Hall | American Legion Auxiliary / 0830 O Leo Curtiss Unit | 2120 LANGDON RD | Niagara | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900414121) |
| Veterans Hall | American Legion Auxiliary / 0873 Newfane Unit | 6076 WALLACE AVE | Niagara | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800237282) |
| Veterans Hall | American Legion Auxiliary / 1142 Lasalle | 8643 BUFFALO AVE | Niagara | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222485285) |
| Veterans Hall | American Legion Auxiliary / 1465 the Portage Unit | 3230 NIAGARA AVE | Niagara | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900414650) |
| Veterans Hall | American Legion Auxiliary / 410 B Leo Dolan | 99 LINDHURST DR | Niagara | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 383784434) |
| Veterans Hall | American Legion Auxiliary Wheatfield Post 1451 /  | 6525 WARD RD | Niagara | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 237169522) |
| Veterans Hall | American Legion Post - Convention of New York | 318 WHEATFIELD ST | Niagara | State/county-level organization record, not an individual post (IRS EIN 161314111) |
| Veterans Hall | American Legion Post - Niagara County Committee | 138 GRANT ST | Niagara | State/county-level organization record, not an individual post (IRS EIN 371625959) |
| Veterans Hall | American Legion Post 1083 - C C Kinney | PO BOX 48 | Niagara | PO Box-only address (IRS EIN 166093938) |
| Veterans Hall | American Legion Post 1253 | 3251 HOSMER RD | Niagara | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093915) |
| Veterans Hall | American Legion Post 1664 - Cadille | 752 E MARKET ST | Niagara | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166075404) |
| Veterans Hall | American Legion Post 425 - Herbert Carr | 8650 HUNTINGTON BEACH RD | Niagara | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161471615) |
| Veterans Hall | American Legion Post 830 - Leo Curtis | PO BOX 98 | Niagara | PO Box-only address (IRS EIN 166093910) |
| Veterans Hall | American Legion Post 836 - Martin F Jennings | 102 CASEWOOD DR | Niagara | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093695) |
| Veterans Hall | American Legion Post 873 - Nefane | PO BOX 72 | Niagara | PO Box-only address (IRS EIN 166093911) |
| Veterans Hall | American Legion Post 969 - Sanborn | 82 STEELE CIR | Niagara | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093870) |
| Veterans Hall | Department of New York VFW Auxiliary / Lake Ontario Post 313 | 434 3RD ST | Niagara | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900490051) |
| Veterans Hall | Department of New York VFW Auxiliary / Lockport Post 2535 | 112 CALEDONIA ST | Niagara | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510651483) |
| Veterans Hall | Marine Corps League / 232 Lockport Devil Dog Detachment | 37 PARK AVE | Niagara | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161566797) |
| Veterans Hall | Marine Corps League Detachment 230 - Conrad Kania | PO BOX 405 | Niagara | PO Box-only address (IRS EIN 166089743) |
| Veterans Hall | VFW Post 2535 | 112 Caledonia St | Niagara | Duplicate of 'American Legion Post 410 - B Leo Dolan' (same address and type) |
| Veterans Hall | VFW Post 7487 | PO BOX 1164 | Niagara | PO Box-only address (IRS EIN 166092800) |
| Veterans Hall | Vietnam Veterans of America Chapter 268 - Vva Chapter | PO BOX 585 | Niagara | PO Box-only address (IRS EIN 161283151) |
| Veterans Hall | Vietnam Veterans of America Chapter 77 - Chapter | 260 OLIVER ST | Niagara | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 880545795) |
| Veterans Hall | AMVETS Post 384 | 2145 WHITESBORO ST | Oneida | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161508996) |
| Veterans Hall | American Legion Auxiliary / 0024 Henry P Smith | 325 ERIE BLVD W | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800642111) |
| Veterans Hall | American Legion Auxiliary / 1000 Edward L Clonan | PO BOX 257 | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 274090229) |
| Veterans Hall | American Legion Auxiliary / 1153 Sylvan Beach | PO BOX 619 | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222979561) |
| Veterans Hall | American Legion Auxiliary / 1309 Meeker-Orourke | PO BOX 107 | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222486368) |
| Veterans Hall | American Legion Auxiliary / 1376 New Hartford | 8616 CLINTON ST | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222484367) |
| Veterans Hall | American Legion Auxiliary / 1448 R Kirk Parkhurst | 7908 STATE ROUTE 69 | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 237093048) |
| Veterans Hall | American Legion Auxiliary / 161 Leon R Roberts | PO BOX 161 | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222509845) |
| Veterans Hall | American Legion Auxiliary / 569 Kelley-Phillios | 115 MADISON ST | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161266240) |
| Veterans Hall | American Legion Auxiliary / 66 Arthur S Moran | PO BOX 72 | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222485521) |
| Veterans Hall | American Legion Auxiliary / Helmuth-Ingalls Ladies Aux | PO BOX 224 | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800884337) |
| Veterans Hall | American Legion Auxiliary 26 Clark Mills / 26 Clark Mills | 7661 SOUTH ST | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161108222) |
| Veterans Hall | American Legion Auxiliary Western Memorial Unit 1846 Department /  | PO BOX 194 | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800649268) |
| Veterans Hall | American Legion Post 1000 - Edward L Clonan | PO BOX 257 | Oneida | PO Box-only address (IRS EIN 166094235) |
| Veterans Hall | American Legion Post 1153 - Sylvan Beach | PO BOX 412 | Oneida | PO Box-only address (IRS EIN 166093837) |
| Veterans Hall | American Legion Post 1290 - Fort Schyler | 404 KOSSUTH AVE | Oneida | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093723) |
| Veterans Hall | American Legion Post 1309 | PO BOX 225 | Oneida | PO Box-only address (IRS EIN 166093747) |
| Veterans Hall | American Legion Post 161 - Leon R Roberts | PO BOX 161 | Oneida | PO Box-only address (IRS EIN 166093929) |
| Veterans Hall | American Legion Post 1846 - Western Memorial | PO BOX 162 | Oneida | PO Box-only address (IRS EIN 161243901) |
| Veterans Hall | American Legion Post 229 - Utica | 409 Herkimer Rd | Oneida | Duplicate of 'DAV Chapter 82 - Wheeler Stars Stripes' (same address and type) |
| Veterans Hall | American Legion Post 232 - Helmuth Ingalls of the | PO BOX 224 | Oneida | PO Box-only address (IRS EIN 150522103) |
| Veterans Hall | American Legion Post 26 - Clark Mills | PO BOX 244 | Oneida | PO Box-only address (IRS EIN 166093951) |
| Veterans Hall | American Legion Post 404 - William Russell | RR 5 BOX 98 | Oneida | PO Box-only address (IRS EIN 150513541) |
| Veterans Hall | American Legion Post 569 - Kelley Phillips | PO BOX 453 | Oneida | PO Box-only address (IRS EIN 166094262) |
| Veterans Hall | American Legion Post 625 - Charles H Adrean D S C | 726 WASHINGTON ST | Oneida | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150501057) |
| Veterans Hall | American Legion Post 66 - Arthur S Moran | PO BOX 81 | Oneida | PO Box-only address (IRS EIN 150524837) |
| Veterans Hall | American Legion Post 890 - George Glenn Hughes | PO BOX 11 | Oneida | PO Box-only address (IRS EIN 166093899) |
| Veterans Hall | American Legion Post 92 - Clifford J Fulmer | PO BOX 12 | Oneida | PO Box-only address (IRS EIN 156021814) |
| Veterans Hall | Department of New York VFW Auxiliary /  | 7507 ALVORD RD | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 141682753) |
| Veterans Hall | Department of New York VFW Auxiliary / Douglas E Voss Memorial Post 6001 | 45 CALDER AVE | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 861128494) |
| Veterans Hall | Department of New York VFW Auxiliary / Harland J Hennessey Post 5538 | PO BOX 87 | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 010908731) |
| Veterans Hall | Department of New York VFW Auxiliary / Rome Post 2246 | 124 DWIGHT DR | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 450577197) |
| Veterans Hall | Department of New York VFW Auxiliary / Schilling Burns Young Post 9591 | PO BOX 362 | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 582680966) |
| Veterans Hall | Department of New York VFW Auxiliary / Verona Post 6811 | 4928 SPRING RD | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900621791) |
| Veterans Hall | Marine Corps League / 283 Kasky-Hayes Pound Modd | 7830 HALLENBECK RD | Oneida | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261265287) |
| Veterans Hall | Marine Corps League Detachment 245 - Edward L Smith | 1247 ERIE BLVD W | Oneida | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166075473) |
| Veterans Hall | Marine Corps League Detachment 961 - Tun Tavern Leathernecks | 8170 STATE ROUTE 294 | Oneida | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 651226707) |
| Veterans Hall | Marine Corps League Detachment 999 - Lz Old Corps | PO BOX 296 | Oneida | PO Box-only address (IRS EIN 223636271) |
| Veterans Hall | VFW Post - Nelson T Dodge | PO BOX 282 | Oneida | PO Box-only address (IRS EIN 237304491) |
| Veterans Hall | VFW Post 5538 - Harland J Hennessey Memorial C | 108 PARK AVE | Oneida | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161042042) |
| Veterans Hall | VFW Post 8259 - Upton Memorial | 8999 OLIN RD | Oneida | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161277225) |
| Veterans Hall | VFW Post 982 | PO BOX 52 | Oneida | PO Box-only address (IRS EIN 161359779) |
| Veterans Hall | Vietnam Veterans of America Chapter 944 - Vva Chapter | PO BOX 4444 | Oneida | PO Box-only address (IRS EIN 800123012) |
| Veterans Hall | American Legion Auxiliary /  | 2718 LEMOYNE AVE | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222500932) |
| Veterans Hall | American Legion Auxiliary / 0188 Liverpool Unit | 205 CYPRESS ST | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161080126) |
| Veterans Hall | American Legion Auxiliary / 113 Vernice Suttle | 8529 SMOKEY HOLLOW RD | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161216046) |
| Veterans Hall | American Legion Auxiliary / 1276 Unit | 3701 JAMES ST | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161530604) |
| Veterans Hall | American Legion Auxiliary / 1524 West Canada Valley | 104 DOLORES TER N | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 271393114) |
| Veterans Hall | American Legion Auxiliary / 239 Robert J Hydon | PO BOX 304 | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161097933) |
| Veterans Hall | American Legion Auxiliary / 317 Valentine Meyer | 4572 JORDAN RD | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510244101) |
| Veterans Hall | American Legion Auxiliary / 787 James Harvey Spire | 5575 LEGIONNAIRE DR | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 814080536) |
| Veterans Hall | American Legion Post - Onondaga County | 6609 CANTON ST | Onondaga | State/county-level organization record, not an individual post (IRS EIN 900429438) |
| Veterans Hall | American Legion Post 1102 - Hackett Moore Scheuerman | 4748 STONEDALE DR | Onondaga | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094199) |
| Veterans Hall | American Legion Post 141 | 109 FAYETTE ST | Onondaga | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160975386) |
| Veterans Hall | American Legion Post 1642 - Dunbar | 119 DELL ST | Onondaga | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093745) |
| Veterans Hall | American Legion Post 1650 - General Pulaski | POST 1650 1604 BURNET AVE | Onondaga | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150620639) |
| Veterans Hall | American Legion Post 297 - Ralph Share | PO BOX 3 | Onondaga | PO Box-only address (IRS EIN 166094076) |
| Veterans Hall | DAV Chapter 30 - Coonley Nojaim Mem | PO BOX 661 | Onondaga | PO Box-only address (IRS EIN 116101091) |
| Veterans Hall | Department of New York VFW Auxiliary / Lafayette Memorial Post 1955 | 2456 ROUTE 11 | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 352344911) |
| Veterans Hall | Department of New York VFW Auxiliary / Mattydale Post 3146 | 2000 LEMOYNE AVE | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161525857) |
| Veterans Hall | Department of New York VFW Auxiliary / Simon-Parise Post 9596 | 6996 E TAFT RD | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161481003) |
| Veterans Hall | Disabled American Veterans Auxiliary Inc / 30 Coonley Nojaim | 26 PHILLIPS ST | Onondaga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161529211) |
| Veterans Hall | Marine Corps League Detachment 224 - Greater Syracuse | PO BOX 104 | Onondaga | PO Box-only address (IRS EIN 116101168) |
| Veterans Hall | VFW Post 1955 | PO BOX 51 | Onondaga | PO Box-only address (IRS EIN 161099050) |
| Veterans Hall | VFW Post 3146 - Mattydale | PO BOX 62 | Onondaga | PO Box-only address (IRS EIN 150521485) |
| Veterans Hall | VFW Post 7290 | 105 MAXWELL AVE | Onondaga | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160982971) |
| Veterans Hall | VFW Post 7872 | PO BOX 15547 | Onondaga | PO Box-only address (IRS EIN 237296330) |
| Veterans Hall | AMVETS Post 332 | PO BOX 25291 | Ontario | PO Box-only address (IRS EIN 473592467) |
| Veterans Hall | American Legion Auxiliary / 0396 Winnek Unit | 1011 ROUTES 5 AND 20 | Ontario | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 450594837) |
| Veterans Hall | American Legion Auxiliary / 457 Seeley B Parish | 1345 STATE ROUTE 96 | Ontario | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222485315) |
| Veterans Hall | American Legion Post 1278 - Honedye Hemlock | 4931 COUNTY ROAD 36 | Ontario | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094241) |
| Veterans Hall | American Legion Post 34 - Turner Schrader | PO BOX 234 | Ontario | PO Box-only address (IRS EIN 160782304) |
| Veterans Hall | American Legion Post 396 - Winnek | 1101 ROUTES 5 20 | Ontario | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094221) |
| Veterans Hall | American Legion Post 457 - Seeley B Parish | 1346 ROUTE 96 | Ontario | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094093) |
| Veterans Hall | American Legion Post 931 - James Cooke | PO BOX 131 | Ontario | PO Box-only address (IRS EIN 166093718) |
| Veterans Hall | Department of New York VFW Auxiliary / Canandaigua Memorial Post 7414 | 93 S MAIN ST | Ontario | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510657849) |
| Veterans Hall | VFW Post 44 | PO BOX 149 | Ontario | PO Box-only address (IRS EIN 237333008) |
| Veterans Hall | VFW Post 8726 | PO BOX 146 | Ontario | PO Box-only address (IRS EIN 510208593) |
| Veterans Hall | AMVETS Post 1213 | PO BOX 223 | Orange | PO Box-only address (IRS EIN 472583084) |
| Veterans Hall | American Legion Auxiliary / 1079 Floyd Carter | 20 AMSTER RD | Orange | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 237260127) |
| Veterans Hall | American Legion Auxiliary / 1250 Florida | PO BOX 644 | Orange | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 061164385) |
| Veterans Hall | American Legion Auxiliary / 1796 New Windsor | 29 WALNUT ST | Orange | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800172045) |
| Veterans Hall | American Legion Auxiliary Unit 151 /  | 61 BRICK POND RD | Orange | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 061291863) |
| Veterans Hall | American Legion Post 1420 - Newburgh Township | PO BOX 2742 | Orange | PO Box-only address (IRS EIN 146046353) |
| Veterans Hall | American Legion Post 1443 - Arthur Finnegan | PO BOX 332 | Orange | PO Box-only address (IRS EIN 146046395) |
| Veterans Hall | American Legion Post 151 - Middletown | PO BOX 2209 | Orange | PO Box-only address (IRS EIN 141282779) |
| Veterans Hall | American Legion Post 158 - William Deakin Joel H Cook | PO BOX 12 | Orange | PO Box-only address (IRS EIN 146046287) |
| Veterans Hall | American Legion Post 214 - N P Lesando Jr Warwick Twp | PO BOX 491 | Orange | PO Box-only address (IRS EIN 146046292) |
| Veterans Hall | American Legion Post 293 - Tuxedo | PO BOX 12 | Orange | PO Box-only address (IRS EIN 146046310) |
| Veterans Hall | American Legion Post 353 - Cornwall | PO BOX 353 | Orange | PO Box-only address (IRS EIN 146046414) |
| Veterans Hall | American Legion Post 377 - Goshen | PO BOX 625 | Orange | PO Box-only address (IRS EIN 146046389) |
| Veterans Hall | American Legion Post 460 - New York City Police | PO BOX 147 | Orange | PO Box-only address (IRS EIN 116104933) |
| Veterans Hall | American Legion Post 521 - Osborn Fitzsimmons | PO BOX 131 | Orange | PO Box-only address (IRS EIN 146046452) |
| Veterans Hall | American Legion Post 633 - O Connor Doyle | PO BOX 15 | Orange | PO Box-only address (IRS EIN 146046376) |
| Veterans Hall | American Legion Post 779 - Woodbury | PO BOX 252 | Orange | PO Box-only address (IRS EIN 262096289) |
| Veterans Hall | Catholic War Veterans Post 386 - Catholic War Veterans | PO BOX 4602 | Orange | PO Box-only address (IRS EIN 141705471) |
| Veterans Hall | DAV Chapter 212 - Edward G Galian Mem | PO BOX 201 | Orange | PO Box-only address (IRS EIN 900289732) |
| Veterans Hall | Department of New York VFW Auxiliary / Dusenberry-Flannery Post 2064 | 209 MAIN ST | Orange | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 352307609) |
| Veterans Hall | Department of New York VFW Auxiliary / Roosa Fleming Post 161 | 47 OWEN ST # 51 | Orange | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113826189) |
| Veterans Hall | Disabled American Veterans Auxiliary Inc / 212 Edward G Dalian Memorial | 17 AMCHIR AVE | Orange | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510605342) |
| Veterans Hall | Marine Corps League Detachment 236 - Middletown of Marine | 185 WAWAYANDA AVE | Orange | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 061302178) |
| Veterans Hall | Marine Corps League Detachment 249 - Greater Newburgh | 30 LAWRENCE AVE | Orange | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 141785441) |
| Veterans Hall | Polish Legion of American Veterans Post 16 - Pine Island Memorial | PO BOX 16 | Orange | PO Box-only address (IRS EIN 146048688) |
| Veterans Hall | VFW Post 1161 | PO BOX 4204 | Orange | PO Box-only address (IRS EIN 237335643) |
| Veterans Hall | VFW Post 1708 | PO BOX 625 | Orange | PO Box-only address (IRS EIN 237304414) |
| Veterans Hall | VFW Post 2064 - Dusenberry Flannery | PO BOX 518 | Orange | PO Box-only address (IRS EIN 146029683) |
| Veterans Hall | VFW Post 2946 - Memorial Society of Walden | 4-8 OAK STREET | Orange | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237334249) |
| Veterans Hall | VFW Post 4662 - Warwick Valley | PO BOX 261 | Orange | PO Box-only address (IRS EIN 237331887) |
| Veterans Hall | Vietnam Veterans of America Chapter 140 - Orange County Chapter | PO BOX 171 | Orange | PO Box-only address (IRS EIN 133410045) |
| Veterans Hall | Vietnam Veterans of America Chapter 537 - Hudson Highland Chapter | 370 N MONTGOMERY ST | Orange | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 223071751) |
| Veterans Hall | Vietnam Veterans of America Chapter 541 - Martha Ray Chapter | 11 MARK ST | Orange | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 352257730) |
| Veterans Hall | American Legion Post 1603 - Houseman Tanner | PO BOX 402 | Orleans | PO Box-only address (IRS EIN 166093919) |
| Veterans Hall | American Legion Post 204 - Butts-Clark | 305 N Main St | Orleans | Duplicate of 'American Legion Post 204 - Butts Clark' (same address and type) |
| Veterans Hall | American Legion Post 35 - Sheret | PO BOX 302 | Orleans | PO Box-only address (IRS EIN 166093805) |
| Veterans Hall | American Legion Post 529 - Jewell Buckman | PO BOX 254 | Orleans | PO Box-only address (IRS EIN 160741030) |
| Veterans Hall | Department of New York VFW Auxiliary / Eastern Oleans Memorial Post 202 | 8 VETERANS DR | Orleans | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 371556147) |
| Veterans Hall | Department of New York VFW Auxiliary / Lincoln Post 1483 | 216 E CENTER ST | Orleans | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 412253887) |
| Veterans Hall | AMVETS Post 370 | 5931 SCENIC AVE | Oswego | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 800607506) |
| Veterans Hall | American Legion Auxiliary / 1128 Hastings-Gorski | 8 VIDA DRIVE | Oswego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 300513876) |
| Veterans Hall | American Legion Auxiliary / 268 William S Monaghan | 69 WEST FIRST STREET | Oswego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161146955) |
| Veterans Hall | American Legion Auxiliary / 418 Phoenix | 9 OSWEGO RIVER RD | Oswego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 273636072) |
| Veterans Hall | American Legion Auxiliary / 915 Unit Fuller-Taylor | PO BOX 85 | Oswego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 331212588) |
| Veterans Hall | American Legion Post 1128 - Hastings Gorski | PO BOX 214 | Oswego | PO Box-only address (IRS EIN 166093696) |
| Veterans Hall | American Legion Post 1435 - Russell Tryon | PO BOX 412 | Oswego | PO Box-only address (IRS EIN 166094046) |
| Veterans Hall | American Legion Post 1532 - Hamlin Welden | PO BOX 41 | Oswego | PO Box-only address (IRS EIN 166094234) |
| Veterans Hall | American Legion Post 268 - William S Monoghan | 69 W BRIDGE ST | Oswego | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094100) |
| Veterans Hall | American Legion Post 358 | PO BOX 127 | Oswego | PO Box-only address (IRS EIN 166146630) |
| Veterans Hall | American Legion Post 587 - Homer Russell Smith | 2949 COUNTY ROUTE 45 | Oswego | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094218) |
| Veterans Hall | American Legion Post 915 | PO BOX 85 | Oswego | PO Box-only address (IRS EIN 150568878) |
| Veterans Hall | Department of New York VFW Auxiliary / Cable Trail Post 8534 | 10 CABLE TRL | Oswego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222923151) |
| Veterans Hall | Department of New York VFW Auxiliary / Fulton Post 569 | 216 CAYUGA ST # 218 | Oswego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261960435) |
| Veterans Hall | Department of New York VFW Auxiliary / Hastings Parish Memorial Post 8823 | PO BOX 226 | Oswego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261430819) |
| Veterans Hall | Department of New York VFW Auxiliary / Phoenix Memorial Post 5540 | 70 CULVERT ST | Oswego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161464003) |
| Veterans Hall | Department of New York VFW Auxiliary / Pulaski Memorial Post 7289 | PO BOX 387 | Oswego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113833633) |
| Veterans Hall | Department of New York VFW Auxiliary / Trach Auringer Post 7325 | PO BOX 91 | Oswego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261380798) |
| Veterans Hall | Department on New York VFW Auxiliary / Edick-Hamlink Post 369 | 261 POTTER RD | Oswego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800328956) |
| Veterans Hall | VFW Post 369 - Edick Hamlink | PO BOX 1001 | Oswego | PO Box-only address (IRS EIN 237286012) |
| Veterans Hall | VFW Post 5885 | 14 Bronson St | Oswego | Duplicate of 'VFW Post 5885 - Quattrini Dehm' (same address and type) |
| Veterans Hall | VFW Post 7289 - Pulaski Memorial | PO BOX 151 | Oswego | PO Box-only address (IRS EIN 237171326) |
| Veterans Hall | VFW Post 8823 - Aric C Nellis | PO BOX 226 | Oswego | PO Box-only address (IRS EIN 161095443) |
| Veterans Hall | AMVETS Post 669 | PO BOX 928 | Otsego | PO Box-only address (IRS EIN 352390159) |
| Veterans Hall | American Legion Auxiliary / 1311 Wharton Valley | 920 COUNTY HIGHWAY 20 | Otsego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222505535) |
| Veterans Hall | American Legion Auxiliary / 1566 Milford Unit | PO BOX 83 | Otsego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 743262299) |
| Veterans Hall | American Legion Auxiliary / 1584 Worcester | PO BOX 273 | Otsego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222485335) |
| Veterans Hall | American Legion Auxiliary / 1688 Laurens | 11 MAIN ST | Otsego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800557476) |
| Veterans Hall | American Legion Auxiliary / 259 Oneonta | 279 CHESTNUT ST | Otsego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 166052072) |
| Veterans Hall | American Legion Auxiliary / 579 Clark F Simmons Post | 60 MAIN ST | Otsego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222511662) |
| Veterans Hall | American Legion Auxiliary / 616 Hugick-Purcell-Shepard | PO BOX 1425 | Otsego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161270712) |
| Veterans Hall | American Legion Post 1555 - Otego | PO BOX 256 | Otsego | PO Box-only address (IRS EIN 166094095) |
| Veterans Hall | American Legion Post 1584 - Worcester | PO BOX 363 | Otsego | PO Box-only address (IRS EIN 166093691) |
| Veterans Hall | American Legion Post 616 - Hugick Purcell Shepard | PO BOX 686 | Otsego | PO Box-only address (IRS EIN 166093900) |
| Veterans Hall | DAV Chapter 200 - Oneonta | PO BOX 596 | Otsego | PO Box-only address (IRS EIN 311099940) |
| Veterans Hall | Department of New York VFW Auxiliary / Sgt Walter P Eggleston Post 7128 | PO BOX 1272 | Otsego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261500844) |
| Veterans Hall | Hartwick Sons of the American Legion Post 1567 /  | PO BOX 53 | Otsego | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 332013771) |
| Veterans Hall | VFW Post 1206 | PO BOX 6 | Otsego | PO Box-only address (IRS EIN 160874510) |
| Veterans Hall | VFW Post 7128 | PO BOX 823 | Otsego | PO Box-only address (IRS EIN 237304490) |
| Veterans Hall | American Legion Auxiliary / 1080 Mahopac | 59 BROOKSIDE RD | Putnam | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 133238662) |
| Veterans Hall | American Legion Auxiliary / Putnam County | 59 BROOKSIDE RD | Putnam | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 133188750) |
| Veterans Hall | Department of New York VFW Auxiliary / Daniel J Obrien Post 1374 | 40 SCHUYLKILL CT | Putnam | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800242180) |
| Veterans Hall | Department of New York VFW Auxiliary / Greater Mahopac Post 5491 | PO BOX 132 | Putnam | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261357556) |
| Veterans Hall | Department of New York VFW Auxiliary / Putnam County Council | 40 SCHUYLKILL CT | Putnam | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320260440) |
| Veterans Hall | Marine Corps League Detachment 242 - Putnam County | 32 GLENEIDA AVE | Putnam | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 061353562) |
| Veterans Hall | VFW Post 2362 - James Harvey Hustis | 10 Cedar St | Putnam | Duplicate of 'American Legion Post 275 - George A Casey' (same address and type) |
| Veterans Hall | VFW Post 391 - Putnam Valley | PO BOX 623 | Putnam | PO Box-only address (IRS EIN 237335013) |
| Veterans Hall | VFW Post 5491 | PO BOX 132 | Putnam | PO Box-only address (IRS EIN 237303209) |
| Veterans Hall | AMVETS Post - Michael Lever Mbr | PO BOX 797 | Rensselaer | PO Box-only address (IRS EIN 460916317) |
| Veterans Hall | American Legion Auxiliary / 1231 Melvin Roads | 200 COLUMBIA ST | Rensselaer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 263451082) |
| Veterans Hall | American Legion Auxiliary / 1268 Nassau Unit | 62 OLD FORGE RD | Rensselaer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 943435067) |
| Veterans Hall | American Legion Auxiliary / 1683 Gerald O Neil Unit | 137 3RD AVE | Rensselaer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 331215149) |
| Veterans Hall | American Legion Auxiliary / 731 Charles Waldron Unit | 181 MAIN STREET | Rensselaer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800305481) |
| Veterans Hall | American Legion Post 1021 - Sgt Walter A Adams | PO BOX 412 | Rensselaer | PO Box-only address (IRS EIN 146046442) |
| Veterans Hall | American Legion Post 1489 - North Greenbush Memorial | 111 MAIN AVE | Rensselaer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046282) |
| Veterans Hall | American Legion Post 1683 - Gerald O Neil | 836 BROADWAY | Rensselaer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046308) |
| Veterans Hall | American Legion Post 35 - Dept of New York | 1304 Park Blvd | Rensselaer | Duplicate of 'American Legion Post 35 - Dept of New York' (same address and type) |
| Veterans Hall | American Legion Post 471 | 20 PARTITION ST | Rensselaer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 452753431) |
| Veterans Hall | American Legion Post 937 - Taconic Valley | PO BOX 173 | Rensselaer | PO Box-only address (IRS EIN 146031130) |
| Veterans Hall | DAV Chapter 38 - Rev F A Kelley | 777 1ST AVE | Rensselaer | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146032735) |
| Veterans Hall | Department of New York VFW Auxiliary / East Greenbush Post 7338 | 100 HAYS RD | Rensselaer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 134368307) |
| Veterans Hall | Department of New York VFW Auxiliary / Justin Welch Mbr | 242 POPLAR AVE | Rensselaer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510650249) |
| Veterans Hall | Department of New York VFW Auxiliary / Sullivan Jones Post 7466 | PO BOX 3 | Rensselaer | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 611645975) |
| Veterans Hall | Marine Corps League Detachment 252 - Troy | PO BOX 116 | Rensselaer | PO Box-only address (IRS EIN 146039109) |
| Veterans Hall | VFW Post 3025 - Lt Perry Williams | PO BOX 412 | Rensselaer | PO Box-only address (IRS EIN 146050412) |
| Veterans Hall | VFW Post 6340 | PO BOX 361 | Rensselaer | PO Box-only address (IRS EIN 800818318) |
| Veterans Hall | VFW Post 7338 - Conrad J Jones Ex | PO BOX 352 | Rensselaer | PO Box-only address (IRS EIN 237304493) |
| Veterans Hall | VFW Post 8162 | PO BOX 701 | Rensselaer | PO Box-only address (IRS EIN 237334577) |
| Veterans Hall | American Legion Post - Chas R Raymond O Blauvelt | PO BOX 302 | Rockland | PO Box-only address (IRS EIN 136272128) |
| Veterans Hall | American Legion Post 1044 | PO BOX 311 | Rockland | PO Box-only address (IRS EIN 136119001) |
| Veterans Hall | American Legion Post 1199 - James H Anderson | 61 HUNT RD | Rockland | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136271855) |
| Veterans Hall | American Legion Post 130 - Leo Laders | 130 AMERICAN LEGION WAY | Rockland | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 274397456) |
| Veterans Hall | American Legion Post 1447 - Fred Eller | PO BOX 127 | Rockland | PO Box-only address (IRS EIN 136377666) |
| Veterans Hall | American Legion Post 1600 - Kearsing and Edwards | 20 Station Rd | Rockland | Duplicate of 'Marine Corps League Detachment 243 - Rockland County' (same address and type) |
| Veterans Hall | American Legion Post 329 - John H Secor | 30 RAILROAD AVE | Rockland | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136271809) |
| Veterans Hall | American Legion Post 46 - Harold B Holt | 7-9 MCKENZIE DR | Rockland | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 873256555) |
| Veterans Hall | American Legion Post 794 | PO BOX 898 | Rockland | PO Box-only address (IRS EIN 204832704) |
| Veterans Hall | American Legion Post 859 - Fromm Maxwell Debaun | 17 PAVILION RD | Rockland | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 226098827) |
| Veterans Hall | Jewish War Veterans Post 425 - Pfc Frederick Hecht | 4 TRAPPERS WAY | Rockland | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136221874) |
| Veterans Hall | Jewish War Veterans Post 720 - Lts Schwartz Kerchman | 17 Donna St | Rockland | Duplicate of 'Jewish War Veterans Post 731 - Pfc Andrew Goldstein' (same address and type) |
| Veterans Hall | Jewish War Veterans of the United States of America Inc / Rockland Orange Dist Council | 17 DONNA ST | Rockland | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 133565360) |
| Veterans Hall | Marine Corps League / 149 Rockland Devil Dogs Pound Modd | 8 BALDWIN CT | Rockland | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261121744) |
| Veterans Hall | Vietnam Veterans of America Chapter 333 - Vva Chapter | PO BOX 243 | Rockland | PO Box-only address (IRS EIN 222916635) |
| Veterans Hall | American Legion Auxiliary / 1450 Mohawk Unit | 1450 MOHAWK UNIT 13 DAVIS DRIVE | Saratoga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 412275981) |
| Veterans Hall | American Legion Auxiliary / 1644 Henry F Lefko | PO BOX 389 | Saratoga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 237176636) |
| Veterans Hall | American Legion Auxiliary / 490 Earl J Manning | 1 AMERICAN LEGION RD | Saratoga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 141676779) |
| Veterans Hall | American Legion Auxiliary / 862 William J Varney | 41 2ND AVE | Saratoga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222485388) |
| Veterans Hall | American Legion Auxiliary / New York Saratoga Co | 13 DAVIS DRIVE | Saratoga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 412275980) |
| Veterans Hall | American Legion Post 1450 - Mohawk | PO BOX 4149 | Saratoga | PO Box-only address (IRS EIN 146046294) |
| Veterans Hall | American Legion Post 533 - Horace D Washburn | 531 MAIN ST | Saratoga | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046413) |
| Veterans Hall | American Legion Post 91 Auxiliary /  | 427 S MAIN ST | Saratoga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222485357) |
| Veterans Hall | Department of New York VFW Auxiliary / Ballston Spa Post 358 | 68 E NORTH ST | Saratoga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 263913367) |
| Veterans Hall | Gurtler Brothers VFW Aux 420 / Gurtler Brothers Post 420 | 190 EXCELSIOR AVE | Saratoga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510648125) |
| Veterans Hall | Gurtler Brothers VFW Post 420 Mens Auxilary /  | 190 EXCELSIOR AVE | Saratoga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320273792) |
| Veterans Hall | Marine Corps League Detachment 641 - New York Marine Corps League Sp | PO BOX 2302 | Saratoga | PO Box-only address (IRS EIN 550794831) |
| Veterans Hall | VFW Post 1498 | PO BOX 4480 | Saratoga | PO Box-only address (IRS EIN 116039084) |
| Veterans Hall | VFW Post 420 | PO BOX 209 | Saratoga | PO Box-only address (IRS EIN 237109121) |
| Veterans Hall | VFW Post 4660 | PO BOX 3 | Saratoga | PO Box-only address (IRS EIN 237067968) |
| Veterans Hall | VFW Post 5800 | PO BOX 161 | Saratoga | PO Box-only address (IRS EIN 237303206) |
| Veterans Hall | VFW Post 5836 | PO BOX 210 | Saratoga | PO Box-only address (IRS EIN 237336114) |
| Veterans Hall | AMVETS Post 35 | 1048 INNER DR | Schenectady | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 455048367) |
| Veterans Hall | American Legion Auxiliary / 21 Schenectady | 20 SOUTH CHURCH ST | Schenectady | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222501841) |
| Veterans Hall | American Legion Auxiliary Unit 1092 /  | 1809 UNION ST | Schenectady | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 141732184) |
| Veterans Hall | American Legion Post 1002 - Twenty Seventh Division | 1053 PARKWOOD BLVD | Schenectady | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046319) |
| Veterans Hall | DAV Chapter 88 - Lt V O Fryer | PO BOX 3528 | Schenectady | PO Box-only address (IRS EIN 146026733) |
| Veterans Hall | Department of New York VFW Auxiliary / Hildebrand Davis Post 1895 | 609 DRAPER AVE | Schenectady | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 651318418) |
| Veterans Hall | Department of New York VFW Auxiliary / Schenectady Post 357 | 1799 FRED RD | Schenectady | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 870864708) |
| Veterans Hall | Disabled American Veterans Auxiliary Inc / 88 Lt Vo Fryer | ARGO BLVD | Schenectady | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 273560664) |
| Veterans Hall | Jewish War Veterans Post 106 - Sam Luria | 903 NORTHUMBERLAND DR | Schenectady | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146034355) |
| Veterans Hall | Marine Corps League Detachment 222 - Electric City | PO BOX 3456 | Schenectady | PO Box-only address (IRS EIN 141796272) |
| Veterans Hall | AMVETS Post 175 | PO BOX 264 | Schoharie | PO Box-only address (IRS EIN 141833382) |
| Veterans Hall | American Legion Post 248 - Timothy Murphy | PO BOX 1069 | Schoharie | PO Box-only address (IRS EIN 146089309) |
| Veterans Hall | American Legion Post 57 - Fred L Stilson | PO BOX 252 | Schoharie | PO Box-only address (IRS EIN 146046409) |
| Veterans Hall | Department of New York VFW Auxiliary / Middleburgh Memorial Post 2161 | 143 VFW LANE | Schoharie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261918138) |
| Veterans Hall | The American Legion Auxiliary Unit of Sharon Springs Post No 1269 /  | PO BOX 45 | Schoharie | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222488651) |
| Veterans Hall | American Legion Post 1208 - Meade Price | PO BOX 101 | Schuyler | PO Box-only address (IRS EIN 166094224) |
| Veterans Hall | American Legion Post 555 - Seneca | 3404 WEDGEWOOD RD | Schuyler | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093709) |
| Veterans Hall | American Legion Post 676 - Cole Hansenberger Deland | 2532 STEAM MILL ROAD | Schuyler | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093811) |
| Veterans Hall | DAV Chapter 7 - Kimble Kowalski | 3221 STATE ROUTE 414 | Schuyler | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116101242) |
| Veterans Hall | American Legion Auxiliary / 0435 Warner-Van Riper Unit | 585 W RIVER RD | Seneca | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800248271) |
| Veterans Hall | American Legion Post 366 | 48 STATE ST | Seneca | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150521606) |
| Veterans Hall | American Legion Post 435 | 7 E WILLIAMS ST | Seneca | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150509709) |
| Veterans Hall | American Legion Post 463 - Manning Lilla | PO BOX 401 | Seneca | PO Box-only address (IRS EIN 166093698) |
| Veterans Hall | Department of New York VFW Auxiliary / Arthur G Depew Post 2600 | PO BOX 1 | Seneca | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 450582120) |
| Veterans Hall | Department of New York VFW Auxiliary / Jeannette Lichter | PO BOX 181 | Seneca | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 263414128) |
| Veterans Hall | Department of New York VFW Auxiliiary / Waterloo Memorial Post 6433 | 29 W ELISHA ST | Seneca | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 260803337) |
| Veterans Hall | VFW Post 1323 | PO BOX 181 | Seneca | PO Box-only address (IRS EIN 150519261) |
| Veterans Hall | Veterans of Foreign Wars of the US Dept of NY- District 8 / Wl Campbell | 36 INSLEE ST | Seneca | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161430861) |
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
| Veterans Hall | AMVETS Post 245 | 28 Broadway Mall | Steuben | Duplicate of 'AMVETS Post 245' (same address and type) |
| Veterans Hall | AMVETS Post 245 | 28 Broadway Mall | Steuben | Duplicate of 'AMVETS Post 245' (same address and type) |
| Veterans Hall | AMVETS Post 245 | 28 Broadway Mall | Steuben | Duplicate of 'AMVETS Post 245' (same address and type) |
| Veterans Hall | American Legion Auxiliary / 1248 Arkport Memorial | PO BOX 292 | Steuben | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222488608) |
| Veterans Hall | American Legion Auxiliary / 1279 Robert N Austin | 8458 COUNTY ROUTE 333 | Steuben | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 133336969) |
| Veterans Hall | American Legion Auxiliary / 1425 Birmingham-Burd | PO BOX 741 | Steuben | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 300620845) |
| Veterans Hall | American Legion Auxiliary / 173 Charles E Wescott | 14 W WILLIAM ST | Steuben | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222488830) |
| Veterans Hall | American Legion Auxiliary / 440 Arthur J Cunningham Unit | 72 SENECA ST | Steuben | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 262920484) |
| Veterans Hall | American Legion Auxiliary / 746 John P Eaton | 60 BISSELL AVE | Steuben | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222486826) |
| Veterans Hall | American Legion Auxiliary / Canisteo Legion Auxiliary | 61 W MAIN ST | Steuben | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 264013674) |
| Veterans Hall | American Legion Auxiliary Unit of Theo R Vantassel Post No 402 /  | 102 N MAIN ST | Steuben | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800567618) |
| Veterans Hall | American Legion Post - New York Steuben County | 110 CROSBY ST | Steuben | State/county-level organization record, not an individual post (IRS EIN 222505248) |
| Veterans Hall | American Legion Post 1248 - Arkport Memorial | PO BOX 475 | Steuben | PO Box-only address (IRS EIN 166093797) |
| Veterans Hall | American Legion Post 1428 - Birmingham Burd | PO BOX 734 | Steuben | PO Box-only address (IRS EIN 166093963) |
| Veterans Hall | American Legion Post 1740 - Woodhull Memorial | PO BOX 140 | Steuben | PO Box-only address (IRS EIN 166093692) |
| Veterans Hall | American Legion Post 407 - Roswell Mcdaniels | PO BOX 544 | Steuben | PO Box-only address (IRS EIN 161074620) |
| Veterans Hall | American Legion Post 730 - Williams Greengrass | 85 MAPLE STREET 85 MAPLE STREET | Steuben | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 160864999) |
| Veterans Hall | American Legion Post 805 - Ouderkirk Cragg | 6 WILCOX ST | Steuben | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 161216874) |
| Veterans Hall | Department of New York VFW Auxiliary / Corporal Jj Mooney Post 2250 | 245 CANISTEO ST | Steuben | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 412249698) |
| Veterans Hall | Department of New York VFW Auxiliary / Crystal City Post 524 | 281 BAKER ST | Steuben | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 364691976) |
| Veterans Hall | Department of New York VFW Auxiliary / Webster-Hill-Conklin Post 1470 | PO BOX 527 | Steuben | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800334373) |
| Veterans Hall | Marine Corps League Detachment 461 - Raider | 245 Canisteo St | Steuben | Duplicate of 'VFW Post 2250' (same address and type) |
| Veterans Hall | VFW Post 1470 - Webster Hill Conklim | PO BOX 527 | Steuben | PO Box-only address (IRS EIN 262039269) |
| Veterans Hall | AMVETS Post | 141 Carleton Ave | Suffolk | Duplicate of 'AMVETS Post 18' (same address and type) |
| Veterans Hall | AMVETS Post - Dept | 7 HOLLY RD | Suffolk | State/county-level organization record, not an individual post (IRS EIN 161476558) |
| Veterans Hall | AMVETS Post - Dept | HAWKINS AVENUE | Suffolk | State/county-level organization record, not an individual post (IRS EIN 462956496) |
| Veterans Hall | AMVETS Post 111 | 66 STEPNEY LN | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 113149230) |
| Veterans Hall | AMVETS Post 111 | 15 CEDAR AVE | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 462157638) |
| Veterans Hall | AMVETS Post 1174 | 6 STORM DR | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 811436619) |
| Veterans Hall | AMVETS Post 48 | 660 Hawkins Ave | Suffolk | Duplicate of 'AMVETS Post 48' (same address and type) |
| Veterans Hall | AMVETS Post 76 | 44 W Main St | Suffolk | Duplicate of 'AMVETS Post 76' (same address and type) |
| Veterans Hall | AMVETS Post 76 | 44 W Main St | Suffolk | Duplicate of 'AMVETS Post 76' (same address and type) |
| Veterans Hall | American Legion Auxiliary / 0269 Patchogue | PO BOX 457 | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800354967) |
| Veterans Hall | American Legion Auxiliary / 0411 Rusy-Bohm | 39 NASSAU AVE | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 273768835) |
| Veterans Hall | American Legion Auxiliary / 0924 Hand-Aldrich Unit | 55 PONQUOGUE AVE | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113271410) |
| Veterans Hall | American Legion Auxiliary / 1218 Hunter-Squires-Jackson | PO BOX 352 | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113145679) |
| Veterans Hall | American Legion Auxiliary / 1533 Arthur H Clune | PO BOX 47 | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510177457) |
| Veterans Hall | American Legion Auxiliary / 1738 West Islip Unit | 340 UNION BLVD | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 364820261) |
| Veterans Hall | American Legion Auxiliary / 1887 Leisure Knoll | 106 SHEFFIELD DR | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 310939203) |
| Veterans Hall | American Legion Auxiliary / 432 Wilson Ritch | 1450 HALLOCK AVE | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 112777943) |
| Veterans Hall | American Legion Auxiliary / 803 Post Griswold Terry-Glover | 51655 MAIN RD | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 237309582) |
| Veterans Hall | American Legion Auxiliary / Carmela Lucas | 11 BRUCE STREET | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113319308) |
| Veterans Hall | American Legion Auxiliary Harbor Unit 417 /  | PO BOX 160 | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 301445166) |
| Veterans Hall | American Legion Auxiliary Post 1146 /  | 826 HUBAL ST | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 465186770) |
| Veterans Hall | American Legion Auxiliary Unit 352 /  | 573 LEISURE DR | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320279172) |
| Veterans Hall | American Legion Auxiliary Unit of East Hampton Post No 419 /  | PO BOX 1343 | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 112666553) |
| Veterans Hall | American Legion Auxiliary Unit of Suffolk Post No 1880 /  | 106 EXMORE CT UNIT A | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 640957351) |
| Veterans Hall | American Legion Post 1015 - Amityville | PO BOX 248 | Suffolk | PO Box-only address (IRS EIN 111748252) |
| Veterans Hall | American Legion Post 1120 - Feustel Kurdt | 80 HERBERT AVE | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 112001022) |
| Veterans Hall | American Legion Post 1152 - Sherwood Brothers | 198 1st St | Suffolk | Duplicate of 'American Legion Post 1006 - Joseph Loeffler' (same address and type) |
| Veterans Hall | American Legion Post 1244 - Greenlawn | PO BOX 238 | Suffolk | PO Box-only address (IRS EIN 116105023) |
| Veterans Hall | American Legion Post 1533 - Arthur Clune | PO BOX 72 | Suffolk | PO Box-only address (IRS EIN 116104909) |
| Veterans Hall | American Legion Post 1545 - Eastport | 478 MONTAUK HWY | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116104977) |
| Veterans Hall | American Legion Post 155 - William M Hallock | 115 CHURCH ST | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116167134) |
| Veterans Hall | American Legion Post 185 - Burton Potter | 121 3RD ST | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116036914) |
| Veterans Hall | American Legion Post 269 - Patchogue | PO BOX 457 | Suffolk | PO Box-only address (IRS EIN 116105027) |
| Veterans Hall | American Legion Post 281 | PO BOX 2021 | Suffolk | PO Box-only address (IRS EIN 116074588) |
| Veterans Hall | American Legion Post 360 - Huntington | 1 MILL DAM RD | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116104908) |
| Veterans Hall | American Legion Post 365 - Bay Shore | PO BOX 365 | Suffolk | PO Box-only address (IRS EIN 116105016) |
| Veterans Hall | American Legion Post 388 - Chelberg & Battle | PO BOX 541 | Suffolk | PO Box-only address (IRS EIN 111736534) |
| Veterans Hall | American Legion Post 417 - Harbor | PO BOX 160 | Suffolk | PO Box-only address (IRS EIN 116105094) |
| Veterans Hall | American Legion Post 419 - East Hamptontown | PO BOX 1343 | Suffolk | PO Box-only address (IRS EIN 116104892) |
| Veterans Hall | American Legion Post 45 - Treasury | PO BOX 1005 | Suffolk | PO Box-only address (IRS EIN 136272112) |
| Veterans Hall | American Legion Post 743 - Aviators | PO BOX 1533 | Suffolk | PO Box-only address (IRS EIN 136271821) |
| Veterans Hall | American Legion Post 803 - Griswold Terry Glover | PO BOX 591 | Suffolk | PO Box-only address (IRS EIN 116104931) |
| Veterans Hall | American Legion Post 833 - James Ely Miller | 51 Juniper Ave | Suffolk | Duplicate of 'VFW Post 10870' (same address and type) |
| Veterans Hall | American Legion Post 834 - Arthur Ellis Hamm | PO BOX 53 | Suffolk | PO Box-only address (IRS EIN 116104941) |
| Veterans Hall | American Legion Post 861 | PO BOX 725 | Suffolk | PO Box-only address (IRS EIN 301011158) |
| Veterans Hall | American Legion Post 924 - Hand Aldrich | PO BOX 1004 | Suffolk | PO Box-only address (IRS EIN 111793413) |
| Veterans Hall | American Legion Post 944 - Donald C Munro | 20 THOMPSON ST | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116104867) |
| Veterans Hall | Catholic War Veterans Post 1897 - Assumption of the Blessed | 36 PICKET LN | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 300714748) |
| Veterans Hall | DAV Chapter 190 - W F Hailend Jr | 705 GREENBELT PKWY W | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 112518629) |
| Veterans Hall | Department of New York VFW Auxiliary / 4927 Tordik Diedrich Duffield Post | 34 LAMPORT AVWNUE | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113825024) |
| Veterans Hall | Department of New York VFW Auxiliary / Jayne Lattin Post 2913 | 32 EDWARDS ST | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 113828773) |
| Veterans Hall | Department of New York VFW Auxiliary / Nissequogue Post 5796 | 18 PEARY LN | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 223975553) |
| Veterans Hall | Department of New York VFW Auxiliary / Wyandanch Memorial Post 361 | 30 WILLIAM ST | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 205718498) |
| Veterans Hall | Jewish War Veterans Post 336 - Col David Mickey Marcus | 1 DAVIDS WAY | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 510177560) |
| Veterans Hall | Jewish War Veterans of the United States of America Inc / Nassau-Suffolk District Council | 8 DUSK DR | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 112743558) |
| Veterans Hall | Korean War Veterans Association Chapter | 19 TORLEN CT | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 113054977) |
| Veterans Hall | Marine Corps League / That Pound Modd | PO BOX 363 | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 262068517) |
| Veterans Hall | Marine Corps League Detachment 244 - South Shore | 22 Grove Pl | Suffolk | Duplicate of 'American Legion Post 94 - Babylon' (same address and type) |
| Veterans Hall | Marine Corps League Detachment 247 - Suffolk County | 2055 SUNRISE HWY | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 900238849) |
| Veterans Hall | Marine Corps League Detachment 642 - East End | 25 BLUE POINT RD | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 113135442) |
| Veterans Hall | Marine Corps League Detachment 792 - Huntington Long Island | PO BOX 448 | Suffolk | PO Box-only address (IRS EIN 113380386) |
| Veterans Hall | Sons of AMVETS Squadron 1174 /  | 7 HOLLY RD | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 853344902) |
| Veterans Hall | Squadron 48 / Sons of AMVETS | 660 HAWKINS AVE | Suffolk | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 332572147) |
| Veterans Hall | VFW Post 3054 | 8 JONES ST | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 811339719) |
| Veterans Hall | VFW Post 361 - Wyandanch Memorial | PO BOX 1296 | Suffolk | PO Box-only address (IRS EIN 237332883) |
| Veterans Hall | VFW Post 395 - Sgt John W Cooke | PO BOX 126 | Suffolk | PO Box-only address (IRS EIN 237335014) |
| Veterans Hall | VFW Post 414 | 437 MAIN ST | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237332884) |
| Veterans Hall | VFW Post 550 | PO BOX 5033 | Suffolk | PO Box-only address (IRS EIN 111532247) |
| Veterans Hall | VFW Post 6249 - Fischer Hewins | PO BOX 1106 | Suffolk | PO Box-only address (IRS EIN 237304494) |
| Veterans Hall | VFW Post 7009 - Dunes | PO BOX 1314 | Suffolk | PO Box-only address (IRS EIN 111574012) |
| Veterans Hall | VFW Post 7223 - Sgt John J Kreyer | 300 BROADWAY | Suffolk | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237336644) |
| Veterans Hall | VFW Post 9082 - Sag Harbor | PO BOX 748 | Suffolk | PO Box-only address (IRS EIN 237332973) |
| Veterans Hall | VFW Post 9486 - Wm Francis Taylor | 660 Hawkins Ave | Suffolk | Duplicate of 'AMVETS Post 48' (same address and type) |
| Veterans Hall | Vietnam Veterans of America Chapter 11 - Chapter | PO BOX 518 | Suffolk | PO Box-only address (IRS EIN 521389550) |
| Veterans Hall | AMVETS Post 50 | PO BOX 307 | Sullivan | PO Box-only address (IRS EIN 813761331) |
| Veterans Hall | American Legion Auxiliary / 1266 Mamakting Unit | PO BOX 1125 | Sullivan | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900508708) |
| Veterans Hall | American Legion Post 109 - Russell D Sprague | PO BOX 743 | Sullivan | PO Box-only address (IRS EIN 146046464) |
| Veterans Hall | American Legion Post 1363 - Sylvan Liebla | PO BOX 63 | Sullivan | PO Box-only address (IRS EIN 146046428) |
| Veterans Hall | American Legion Post 73 - Ruddick Trowbridge | 9 HANOVER DR | Sullivan | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146030123) |
| Veterans Hall | Department of New York VFW Auxiliary / District 2 | PO BOX 418 | Sullivan | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 133303749) |
| Veterans Hall | Department of New York VFW Auxiliary / H Russell Kenyon Post 5808 | PO BOX 418 | Sullivan | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 141576928) |
| Veterans Hall | VFW Post 5499 | PO BOX 401 | Sullivan | PO Box-only address (IRS EIN 237303178) |
| Veterans Hall | VFW Post 5808 | 3091 ROUTE 17B | Sullivan | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237336116) |
| Veterans Hall | American Legion / 907 Post Sons of Legion | PO BOX 46 | Tioga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 261109153) |
| Veterans Hall | American Legion Auxiliary / 0907 Arden Kelsey Unit | PO BOX 112 | Tioga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800288442) |
| Veterans Hall | American Legion Post - Tioga County Committee | 22 HOWARD HILL RD | Tioga | State/county-level organization record, not an individual post (IRS EIN 471463048) |
| Veterans Hall | Department of New York VFW Auxiliary / Glenn A Warner Post 1371 | 207 MAIN ST | Tioga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320283531) |
| Veterans Hall | Department of New York VFW Auxiliary / Waverly Memorial Post 8104 | PO BOX 142 | Tioga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510673285) |
| Veterans Hall | Marine Corps League / 382 NY Pack Pound | PO BOX 455 | Tioga | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 320603414) |
| Veterans Hall | Marine Corps League Detachment 1201 - Jim Hatch | 207 Main St | Tioga | Duplicate of 'VFW Post 1371' (same address and type) |
| Veterans Hall | Vietnam Veterans of America Chapter 480 - Southern Tier Vva Chapter | PO BOX 491 | Tioga | PO Box-only address (IRS EIN 222998286) |
| Veterans Hall | American Legion Auxiliary / 0221 Ithaca Unit | 119 COMPTON RD | Tompkins | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161399055) |
| Veterans Hall | American Legion Auxiliary / 1134 Leonard T Spaulding | 2272 DRYDEN RD | Tompkins | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161264386) |
| Veterans Hall | American Legion Auxiliary / 800 Carrington Fuller Post | 307 MAIN ST | Tompkins | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 237008634) |
| Veterans Hall | American Legion Auxiliary / Tompkins County | 119 COMPTON RD | Tompkins | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 166179230) |
| Veterans Hall | American Legion Post 1134 - Leonard T Spaulding | 2272 Dryden Rd | Tompkins | Duplicate of 'Vietnam Veterans of America Chapter 377 - Finger Lakes Chapter' (same address and type) |
| Veterans Hall | American Legion Post 221 - Ithaca | 1231 DANBY RD | Tompkins | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150504561) |
| Veterans Hall | VFW Post 961 | 423 W STATE ST | Tompkins | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150479696) |
| Veterans Hall | American Legion Auxiliary / 124 Vibey Sutton | 50 WESTERN AVE | Ulster | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 141853514) |
| Veterans Hall | American Legion Auxiliary / 1308 Aux G Paul Bettinger American | PO BOX 651 | Ulster | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 392286062) |
| Veterans Hall | American Legion Auxiliary / 72 Lamoree-Hackett | 30 JOHN ST | Ulster | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 237212541) |
| Veterans Hall | American Legion Auxiliary / Woodstock Unit 1026 | 10 RICHARD QUINN DRIVE | Ulster | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 141754323) |
| Veterans Hall | American Legion Post 1026 - Woodstock | 10 SERGEANT RICHARD QUINN DR | Ulster | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 141430665) |
| Veterans Hall | American Legion Post 1219 - Rosendale Tillson | PO BOX 103 | Ulster | PO Box-only address (IRS EIN 146046278) |
| Veterans Hall | American Legion Post 1308 - G Paul Bettinger | PO BOX 651 | Ulster | PO Box-only address (IRS EIN 262571592) |
| Veterans Hall | American Legion Post 1627 - Binghamton Savings Bank Ttee | PO BOX 286 | Ulster | PO Box-only address (IRS EIN 166373738) |
| Veterans Hall | American Legion Post 1748 | PO BOX 163 | Ulster | PO Box-only address (IRS EIN 146029692) |
| Veterans Hall | American Legion Post 554 - Fort Plain | 205 Lindorf St | Ulster | Duplicate of 'American Legion Post 1298 - Town of Esopus' (same address and type) |
| Veterans Hall | Catholic War Veterans Post 1937 - Cmr Cwv | PO BOX 1599 | Ulster | PO Box-only address (IRS EIN 141834522) |
| Veterans Hall | DAV Chapter 156 - Ulster County Mem | 206 DOWNS ST | Ulster | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237057723) |
| Veterans Hall | Department of New York VFW Auxiliary / Brannen Van Den Berg Post 8645 | 101 STATE ROUTE 208 | Ulster | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 260470328) |
| Veterans Hall | Department of New York VFW Auxiliary / Joyce Schirick Post 1386 | 786 EAST CHESTER ST | Ulster | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 141774118) |
| Veterans Hall | Marine Corps League Detachment 253 - Ulster County | PO BOX 1584 | Ulster | PO Box-only address (IRS EIN 146039108) |
| Veterans Hall | VFW Post 1386 | PO BOX 1711 | Ulster | PO Box-only address (IRS EIN 141332324) |
| Veterans Hall | VFW Post 5034 | PO BOX 152 | Ulster | PO Box-only address (IRS EIN 237304422) |
| Veterans Hall | VFW Post 5492 | 4 MARTIN ST | Ulster | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 141647251) |
| Veterans Hall | VFW Post 686 | 41 COLONIAL DR | Ulster | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 237335027) |
| Veterans Hall | American Legion Auxiliary / 374 Lake George | PO BOX 267 | Warren | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 237234902) |
| Veterans Hall | American Legion Post - Warren County Organization | 440 RIDGE RD | Warren | State/county-level organization record, not an individual post (IRS EIN 010876529) |
| Veterans Hall | American Legion Post 233 - Glen Falls | 30 Cooper St | Warren | Duplicate of 'VFW Post 2475 - Adirondack' (same address and type) |
| Veterans Hall | American Legion Post 374 - Lake George | PO BOX 267 | Warren | PO Box-only address (IRS EIN 146046365) |
| Veterans Hall | American Legion Post 862 - William J Varney | PO BOX 208 | Warren | PO Box-only address (IRS EIN 146046385) |
| Veterans Hall | American Legion Post 961 - Bolton | 30 BROOK ST | Warren | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046444) |
| Veterans Hall | American Legion Post 964 - Chestertown | 6311 MAIN STREET | Warren | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046407) |
| Veterans Hall | DAV Chapter 158 - Marcelle Nolan | PO BOX 163 | Warren | PO Box-only address (IRS EIN 237093840) |
| Veterans Hall | Department of New York VFW Auxiliary / Queensbury Post 6196 | 32 LUZERNE RD | Warren | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 300530797) |
| Veterans Hall | Marine Corps League Detachment 233 - Memorial 2 | 322 | Warren | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146030068) |
| Veterans Hall | VFW Post 5513 | PO BOX 63 | Warren | PO Box-only address (IRS EIN 237334220) |
| Veterans Hall | American Legion Auxiliary / 0515 Liberty | 19 ABEEL AVE | Washington | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 943446733) |
| Veterans Hall | American Legion Auxiliary / 634 Captain Maxson Unit | 782 CTY ROUTE 61 | Washington | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800204495) |
| Veterans Hall | American Legion Auxiliary Washington County /  | 118 JEROME DR | Washington | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 462477504) |
| Veterans Hall | American Legion Post 1518 - Argyle | 7 COUNTY ROUTE 47 | Washington | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 222964963) |
| Veterans Hall | American Legion Post 1713 - Rollandbraley | 94 ABAIR RD | Washington | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046355) |
| Veterans Hall | American Legion Post 634 - Captain Maxson | 2106 STATE ROUTE 22 | Washington | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146046447) |
| Veterans Hall | American Legion Post 812 - Francis J Clark Cmh | PO BOX 265 | Washington | PO Box-only address (IRS EIN 146030599) |
| Veterans Hall | Department of New York VFW Auxiliary / Adirondack Post 2475 | 495 GANSEVOORT RD | Washington | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 260409206) |
| Veterans Hall | Department of New York VFW Auxiliary / District 3 | 495 GANSEVOORT RD | Washington | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800409171) |
| Veterans Hall | Department of New York VFW Auxiliary / Falvey-Fringi Post 1653 | 9J METTOWEE ST | Washington | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510675232) |
| Veterans Hall | Jewish War Veterans Post 105 - Albany | 28 HARMONY WAY | Washington | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 146034335) |
| Veterans Hall | Vietnam Veterans of America Chapter 79 - Adirondack Vva Chapter | 1368 PATTENS MILLS RD | Washington | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 521389514) |
| Veterans Hall | American Legion Auxiliary / 120 James R Hickey | 132 CUYLER ST | Wayne | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222484780) |
| Veterans Hall | American Legion Auxiliary / 1430 Marion Memorial | 4141 WITHERDEN RD | Wayne | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222547393) |
| Veterans Hall | American Legion Auxiliary / 286 August Mauer | 200 E UNION ST | Wayne | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 943451015) |
| Veterans Hall | American Legion Auxiliary / 394 Williamson | PO BIX 196 | Wayne | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 237197058) |
| Veterans Hall | American Legion Auxiliary / 428 Meyers-Ingraham | 6959 MUD LN | Wayne | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 222485158) |
| Veterans Hall | American Legion Auxiliary / 494 Philip Steiger | 521 WILKINSON RD | Wayne | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 800296898) |
| Veterans Hall | American Legion Post 1343 - Arthur T Meehan | 544 WILEY RD | Wayne | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093864) |
| Veterans Hall | American Legion Post 394 | PO BOX 158 | Wayne | PO Box-only address (IRS EIN 166093697) |
| Veterans Hall | American Legion Post 428 - Meyers Ingraham | PO BOX 428 | Wayne | PO Box-only address (IRS EIN 166094037) |
| Veterans Hall | American Legion Post 436 - Peterson Hall | PO BOX 19 | Wayne | PO Box-only address (IRS EIN 364620077) |
| Veterans Hall | American Legion Post 494 - Phillip Steiger | 76 W MAIN ST | Wayne | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094070) |
| Veterans Hall | Department of New York VFW Auxiliary / Charles W Hall Post 7147 | 10675 RIDGE RD | Wayne | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 300475842) |
| Veterans Hall | Department of New York VFW Auxiliary / Lyons Memorial Post 5092 | PO BOX 286 | Wayne | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 300508545) |
| Veterans Hall | Department of New York VFW Auxiliary / Palmyra Memorial Post 6778 | 4306 ROUTE 31 | Wayne | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 510677020) |
| Veterans Hall | Marine Corps League / 37 Weny Pound Modd | 2921 PILGRINPORT RD | Wayne | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 421758542) |
| Veterans Hall | Marine Corps League Detachment 468 - Memorial Day | 245 W GENESEE ST | Wayne | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 431978009) |
| Veterans Hall | VFW Post 5092 | 202 GENEVA ST | Wayne | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 150560790) |
| Veterans Hall | AMVETS Post 40 | 72 CYPRESS ST | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136188549) |
| Veterans Hall | American Legion Auxiliary / 1038 Adolph Pfister | 27 LEGION DR | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 136374415) |
| Veterans Hall | American Legion Auxiliary / 1048 Dobbs Ferry | 46 DEVOE STREET | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 200091810) |
| Veterans Hall | American Legion Auxiliary / 1097 North Castle | 35 BEDFORD RD | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 133159251) |
| Veterans Hall | American Legion Auxiliary / 1195 American Legion Auxiliary Unit | 126 HIGH ST | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 463711947) |
| Veterans Hall | American Legion Auxiliary / 128 Rye | 47 WAINWRIGHT ST | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 133562897) |
| Veterans Hall | American Legion Auxiliary / 136 Moses Taylor Jr | 1 LEGION WAY | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 136220291) |
| Veterans Hall | American Legion Auxiliary / 274 Post | 17 CRESCENT CT | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 462769791) |
| Veterans Hall | American Legion Auxiliary / Westchester County Committee of Ala | 17 CRESCENT CT | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 994765322) |
| Veterans Hall | American Legion Post - Of Westchester Co | 58 S HIGHLAND AVE | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136141389) |
| Veterans Hall | American Legion Post 1009 Auxiliary /  | 235 VETERANS RD | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 331470444) |
| Veterans Hall | American Legion Post 1048 - Dobbs Ferry | PO BOX 76 | Westchester | PO Box-only address (IRS EIN 132710742) |
| Veterans Hall | American Legion Post 1054 - Briarcliff Manor | 1111 PLEASANTVILLE RD | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136272148) |
| Veterans Hall | American Legion Post 112 - Hawthorne | 1 CLINTON ST APT 210 | Westchester | Looks residential: apartment/unit/lot in address (IRS EIN 136271798) |
| Veterans Hall | American Legion Post 128 | PO BOX 128 | Westchester | PO Box-only address (IRS EIN 332962880) |
| Veterans Hall | American Legion Post 1506 - Ernest Pasqua | 25 CRICKLEWOOD S | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136272185) |
| Veterans Hall | American Legion Post 1508 - Dunwoodie | 174 HOMEWOOD AVE | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136272186) |
| Veterans Hall | American Legion Post 1574 - Gilbert Rauh | PO BOX 92 | Westchester | PO Box-only address (IRS EIN 136272189) |
| Veterans Hall | American Legion Post 1575 - Katonah | 136 JAY ST | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136271875) |
| Veterans Hall | American Legion Post 2023 | 10 COUNTY CENTER ROAD | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 880926249) |
| Veterans Hall | American Legion Post 274 - Captain Oliver C Chase Jr | PO BOX 21 | Westchester | PO Box-only address (IRS EIN 273558027) |
| Veterans Hall | American Legion Post 347 - Larchmont | PO BOX 347 | Westchester | PO Box-only address (IRS EIN 131739790) |
| Veterans Hall | American Legion Post 50 - Pelham | PO BOX 8293 | Westchester | PO Box-only address (IRS EIN 136272114) |
| Veterans Hall | American Legion Post 505 - Fox Eklof | 63 MAPLE ST | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136223134) |
| Veterans Hall | American Legion Post 52 - Scarsdale | PO BOX 246 | Westchester | PO Box-only address (IRS EIN 134104270) |
| Veterans Hall | American Legion Post 979 - Leroy Gregory | 40 BELL RD | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136272144) |
| Veterans Hall | DAV Chapter 16 - Greenburgh | 19 BARRETT LN | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116101259) |
| Veterans Hall | DAV Chapter 23 - Abe Wolkolsky Bronx | 1988 BALDWIN RD | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 116101218) |
| Veterans Hall | Department of New York VFW Auxiliary / Aaron A Lewis Post 6396 | 170 S 14TH AVE | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 352312656) |
| Veterans Hall | Department of New York VFW Auxiliary / Brewster Post 672 | 273 HERITAGE HLS UNIT B | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 820678553) |
| Veterans Hall | Department of New York VFW Auxiliary / Yonkers City Post 1666 | 574 YONKERS AVE | Westchester | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 331193422) |
| Veterans Hall | Jewish War Veterans Post - Bronx County Council | 235 GARTH RD APT C4E | Westchester | State/county-level organization record, not an individual post (IRS EIN 911918043) |
| Veterans Hall | Jewish War Veterans Post - Westchester County Council | 30 CLAUDET WAY | Westchester | State/county-level organization record, not an individual post (IRS EIN 237147060) |
| Veterans Hall | Jewish War Veterans Post 69 - Neumann Goldman | 235 GARTH ROAD | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 136162703) |
| Veterans Hall | Marine Corps League Detachment 254 - Westchester County | PO BOX 505 | Westchester | PO Box-only address (IRS EIN 136227877) |
| Veterans Hall | VFW Post 439 - New Rochelle | 112 North Ave | Westchester | Duplicate of 'American Legion Post 8 - New Rochelle' (same address and type) |
| Veterans Hall | VFW Post 596 | 11 13 SOUTH THIRD AVE | Westchester | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 131739792) |
| Veterans Hall | Vietnam Veterans of America Chapter 49 - Westchester Country Chapter | PO BOX 224 | Westchester | PO Box-only address (IRS EIN 133158702) |
| Veterans Hall | American Legion Auxiliary / 1720 Eagle Memorial | 3377 MAIN ST | Wyoming | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161271517) |
| Veterans Hall | American Legion Auxiliary / 637 Six Star | PO BOX 84 | Wyoming | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 161265431) |
| Veterans Hall | American Legion Post 1670 - Hunt Stout | PO BOX 144 | Wyoming | PO Box-only address (IRS EIN 166093904) |
| Veterans Hall | American Legion Post 350 - Mckelton | PO BOX 183 | Wyoming | PO Box-only address (IRS EIN 166093893) |
| Veterans Hall | American Legion Post 637 - Six Star | 3960 Main St | Wyoming | Duplicate of 'AMVETS Post 637' (same address and type) |
| Veterans Hall | American Legion Post 734 - Harder Odonnell | 83 MARKET ST | Wyoming | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166093800) |
| Veterans Hall | American Legion Post 737 - Hugh Lynch | 49 HASKELL AVE | Wyoming | Looks residential: IRS address is in care of an individual and no other veterans org shares it (IRS EIN 166094057) |
| Veterans Hall | Department of New York VFW Auxiliary / Hendershott Manness Post 374 | 20 MADISON AVE | Wyoming | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 331182630) |
| Veterans Hall | Department of New York VFW Auxiliary / Warsaw Memorial Post 4823 | 4294 BUG RD | Wyoming | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 371563389) |
| Veterans Hall | American Legion Auxiliary / 355 Johnson-Costello | 2001 HIMROD RD | Yates | Auxiliary / district / affiliated group - not a post with its own hall (IRS EIN 900388108) |
| Veterans Hall | VFW Post 745 - Yates County | PO BOX 652 | Yates | PO Box-only address (IRS EIN 160723908) |
| Veterans Hall | VFW Post 8649 - Goodrich Smith | PO BOX 206 | Yates | PO Box-only address (IRS EIN 237334560) |

## 3. Records with missing ZIP, county or street address

| ID | Type | Name | Street | City | ZIP | County |
|---|---|---|---|---|---|---|
| V-0044 | Senior Center | Minerva Senior Center (Minerva Town Hall) | 5 A P Morse Hwy | Minerva | **(none)** | Essex |
| V-0076 | Senior Center | Broadalbin Senior Citizens (St Joseph's Church Hall) | Main St | Broadalbin | **(none)** | Fulton |
| V-0084 | Senior Center | Mayfield Town Hall Congregate Dining Site | **(none)** | Mayfield | 12117 | Fulton |
| V-0094 | Senior Center | Indian Lake/Blue Mountain Senior Citizens | **(none)** | Indian Lake | **(none)** | Hamilton |
| V-0158 | Senior Center | Copenhagen Dining Site (Copenhagen United Church) | **(none)** | Copenhagen | 13626 | Lewis |
| V-0618 | Senior Center | Hamburg Senior Center | **(none)** | Hamburg | **(none)** | Erie |
| V-0632 | Senior Center | Sardinia Senior Center | **(none)** | Sardinia | **(none)** | Erie |
| V-0922 | Senior Center | Brighton Towers Apartments | 821 Brighton Ave |  | **(none)** | Onondaga |
| V-0923 | Senior Center | Toomey Abbott Towers | 1207 Almond St |  | **(none)** | Onondaga |
| V-0935 | Senior Center | Jordan Elbridge Comm. Ctr. | 1 NY 31 | Jordan | **(none)** | Onondaga |
| V-0937 | Senior Center | Senior Adult Ministry | 7815 Adams Rd | Kirkville | **(none)** | Onondaga |

**Venue ZIPs not yet in the crosswalk** (their ZIP mainly lies in a county of a group not yet processed; this resolves when that group is added): none

**County conflicts** (source county kept, conflict noted in Notes): V-0024 Ausable Forks Free Library - County conflict: source says Essex, ZIP 12912 is mainly Clinton; V-0040 North Country Community College - County conflict: source says Essex, ZIP 12983 is mainly Franklin; V-0041 AuSable Forks Senior Center (Community Center Building) - County conflict: source says Essex, ZIP 12912 is mainly Clinton; V-0075 Perth Senior Citizen Club (Perth Town Hall) - County conflict: source says Fulton, ZIP 12010 is mainly Montgomery; V-0078 Oppenheim Senior Citizens Center - County conflict: source says Fulton, ZIP 13329 is mainly Herkimer; V-0086 Leona B Trumbull Senior Citizen Club and Center - County conflict: source says Fulton, ZIP 13452 is mainly Montgomery; V-0149 Osceola Public Library - County conflict: source says Lewis, ZIP 13316 is mainly Oneida; V-1244 Farmingdale State College - County conflict: source says Suffolk, ZIP 11735 is mainly Nassau; V-1367 Pine Bush Area Public Library District - County conflict: source says Orange, ZIP 12566 is mainly Ulster; V-1770 Fulton-Montgomery Community College - County conflict: source says Montgomery, ZIP 12095 is mainly Fulton; V-1795 Samaritan Hospital School of Nursing - County conflict: source says Rensselaer, ZIP 12065 is mainly Saratoga

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
| IRS Exempt Organizations Business Master File Extract - NY | https://www.irs.gov/pub/irs-soi/eo_ny.csv | 2026-11-12 | IRS public data - public domain |
| U.S. Census Geocoder (ZIP fill for county-list addresses; spot-check) | https://geocoding.geo.census.gov/geocoder/ | 2026-11-12 | U.S. Census Bureau - public; rate-limited to ~1 request/sec |
| Essex County / ACAP Senior Centers and Nutrition Sites 2026 (PDF) [Sue Merrell] | https://essexcountyny.gov/wp-content/uploads/Senior-Centers-and-Nutrition-Sites-2026.pdf | 2026-11-12 | Public government page; robots.txt allows |
| Clinton County OFA - Nutrition Sites [Sue Merrell] | https://www.clintoncountyny.gov/aging/snapshots/nutrition-sites | 2026-11-12 | Public government page; robots.txt allows |
| St. Lawrence County OFA page (+ July 2025 menu PDF for cross-check) [Sue Merrell] | https://stlawco.gov/node/285 | 2026-11-12 | Public government page; robots.txt allows |
| Lewis County OFA - Food and Meals [Sue Merrell] | https://lewiscountyny.gov/departments/office-for-the-aging/food-and-meals/ | 2026-11-12 | Public government page; robots.txt allows |
| Fulton County Office for Aging - Services [Sue Merrell] | https://www.fcofa.org/services.html | 2026-11-12 | Public county agency page; no robots restrictions found |
| Warren/Hamilton Counties OFA Summer 2026 newsletter (PDF) [Sue Merrell] | https://www.warrencountyny.gov/sites/default/files/ofa/docs/news/2026/summer.pdf | 2026-11-12 | Public government page; robots.txt allows |
| Herkimer County OFA documents (checked; no site addresses published) [Sue Merrell] | https://herkimercountyny.gov/download/document.php?docid=4501 | 2026-11-12 | Public government page |
| Jefferson County OFA nutrition page (checked; site list empty on page) [Sue Merrell] | https://www.jeffersoncountyny.gov/nutrition-program | 2026-11-12 | Public government page |
| Monroe County OFA - Lunch Club / Senior Center Meal Sites [Austin Ponce] | https://www.monroecounty.gov/aging-centers | 2026-11-12 | Public government page; robots.txt has no restrictions |
| Livingston County OFA - Senior Sites [Austin Ponce] | https://www.livingstoncountyny.gov/590/Senior-Sites | 2026-11-12 | Public government page; robots.txt blocks only Baidu/Yandex crawlers |
| Chemung County Eat Well Live Well flyer (PDF, modified 2025-10-20) [Austin Ponce] | https://www.chemungcountyny.gov/DocumentCenter/View/18866 | 2026-11-12 | Public government document; robots.txt blocks only Baidu/Yandex |
| Foodnet Meals on Wheels community dining (Tompkins County OFA contractor) [Austin Ponce] | https://www.foodnet.org/senior-community-dining | 2026-11-12 | Public nonprofit page; robots.txt allows; Tompkins County's own page returned 403 to automated access, so not used |
| Steuben County OFA directory page [Austin Ponce] | https://www.steubencountyny.gov/Directory.aspx?DID=36 | 2026-11-12 | Public government page; robots.txt blocks only Baidu/Yandex |
| 211 Lifeline directory - Wayne County Dept of Aging & Youth senior centers (LOW CONFIDENCE, third-party; read via web search only, not crawled; staff names not copied) [Austin Ponce] | https://211lifeline.org/detail.php?id=7334183 | 2026-11-12 | Public nonprofit 211 directory; used only because Wayne County publishes no site list found |
| Erie County Dept for the Aging - Senior Centers in Buffalo and Erie County (PDF, Aug 2025) [Courtney Ball] | https://www3.erie.gov/aging/sites/www3.erie.gov.aging/files/2025-08/senior-center-locations.pdf | 2026-11-12 | Public government document; robots.txt blocks only specific crawlers (Bytespider, Amazonbot, Baidu) |
| Genesee, Orleans, Allegany, Chautauqua county OFA pages (checked; not used) [Courtney Ball] | https://www.geneseeny.gov/Department-Content/Office-For-The-Aging/Nutrition-Programs | 2026-11-12 | Genesee returned HTTP 403 to automated access; Orleans site unreachable; Allegany/Chautauqua publish no addressed site list |
| Onondaga County Senior Dining Sites (PDF, rev. 10/2025) [Jamie Fuess] | https://onondaga.gov/adult/wp-content/uploads/sites/243/2025/11/Senior-Dining-Sites-November-2025.pdf | 2026-11-12 | Public government document; robots.txt has no restrictions |
| Otsego County NY Connects directory (checked; NOT used) [Jamie Fuess] | https://cms2.revize.com/revize/otsegocountyny/NY%20Connects%20Resource%20Directory.pdf | 2026-11-12 | Host robots.txt disallows all crawling - not used |
| Delaware County OFA (delcony.gov) - NOT used [Damian Garcia] | https://delcony.gov/departments/ofa/Nutrition.htm | 2026-11-12 | robots.txt explicitly disallows AI agents (ClaudeBot, anthropic-ai, Claude-Web, GPTBot) - not used |
| Ulster County OFA Community Cafes page - NOT used [Damian Garcia] | https://www.ulstercountyny.gov/Departments/Aging/Services/Food-and-Nutrition/Community-Cafes | 2026-11-12 | Returned HTTP 403 to automated access - not circumvented |

**Sources checked and NOT used:**
- **American Legion post locator (legion.org):** Terms of Use prohibit "any robot, spider, scraper or other automated means to access the Services for any purpose without our express written permission". Not used.
- **VFW Find-a-Post (vfw.org):** Terms of Use allow only personal, non-commercial use and prohibit copying or reproducing site content. Not used.
- **OpenStreetMap (Overpass API):** approved by you, but every Overpass server tried (overpass-api.de and two mirrors) reset or timed out from this cloud machine. Not used this round.
- **NYS Library public library directory (nysl.nysed.gov):** the site serves an incomplete TLS certificate chain, so secure connections fail. I did not bypass certificate checking. It appeared in web search results during the spot-check only.
- **NYS Division of Veterans' Services:** publishes no post or hall directory, only benefits-advisor offices, so it was not useful for halls.

## 5. Spot-check

Per group: a random sample of about 10% of that group's venue records (minimum 25), stratified by type. Total 196 of 1897 records (10%). **Sue Merrell and Austin Ponce:** every sampled record was checked against the Census Geocoder (address exists, ZIP, county) AND a web source (the venue's own or official site where found, otherwise public directories). **Other five groups:** every sampled record was checked against the Census Geocoder. Records the geocoder could not match, records with a ZIP/county difference, and a selection of senior centers were then checked by web search. Library and college records the geocoder could not match were not all web-checked; they are labeled that way below.

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
| V-0250 | Library | Penfield Public Library | 1985 Baird Rd, Penfield 14526 | Census Geocoder; directories | Match (address, phone) |
| V-0207 | Library | West Elmira Library | 1231 W Water St, Elmira 14905 | Census Geocoder; chemunglibraries.org | Match (address, phone) |
| V-0244 | Library | Fairport Public Library | 1 Village Landing, Fairport 14450 | Directories; library listings | Match (1 Fairport Village Landing, phone); geocoder matched wrong street |
| V-0313 | Library | Bristol Library | 6750 County Road 32, Canandaigua 14424 | Census Geocoder; directories | Match (address, phone) |
| V-0376 | Library | Groton Public Library | 112 E Cortland St, Groton 13073 | FLLS annual reports; directories | Match (112 E Cortland St, phone); geocoder wrongly matched W Cortland St |
| V-0206 | Library | Steele Memorial Library | 101 E Church St, Elmira 14901 | Census Geocoder; chemunglibraries.org | Match (address, phone) |
| V-0334 | Library | Watkins Glen Cen Sch Dis Free Pub Lib | 610 S Decatur St, Watkins Glen 14891 | Census Geocoder; library website | Match (address, phone) |
| V-0226 | Library | Wadsworth Library | 24 Center St, Geneseo 14454 | Census Geocoder; directories | Match (address, phone) |
| V-0348 | Library | Arkport Public Library | 2 East Ave, Arkport 14807 | Census Geocoder; Village of Arkport | Match (address); phone not confirmed |
| V-0230 | Library | Bell Memorial Library | 16 East St, Nunda 14517 | Census Geocoder; directories | Match (address, phone) |
| V-0224 | Library | Caledonia Library Association | 3108 Main St, Caledonia 14423 | Census Geocoder; town site | Match (address, phone) |
| V-0294 | Senior Center | Ibero American Action League | 817 E Main St, Rochester 14605 | Hispanic Federation; 211 Lifeline | MISMATCH: 817 E Main St is Ibero's office; its senior center is Centro de Oro (already listed) |
| V-0215 | Senior Center | George Bragg Towers Meal Site | 115 Dewitt Ave, Elmira 14901 | Census Geocoder; county inspection records | Match (congregate nutrition program at 115 Dewitt Ave) |
| V-0304 | Senior Center | Ogden Senior Center | 200 S Union St, Spencerport 14559 | Census Geocoder; Town of Ogden site | Match (address, phone) |
| V-0219 | Senior Center | North County Senior Center | 800 W Broad St, Horseheads 14845 | Chemung County centers list (via search); senior living listing | MISMATCH: North County Senior Center now listed at Appleridge, 168 Miller St, Horseheads |
| V-0327 | Senior Center | Salvation Army (Golden Spot Senior Center) | 110 Saltonstall St, Canandaigua 14424 | Census Geocoder; Salvation Army site | Match (address) |
| V-0288 | Senior Center | Brighton - Brookside Community Center | 220 Idlewood Rd, Rochester 14610 | Town of Brighton site; Census Geocoder | MISMATCH: 220 Idlewood Rd is mail-only; ZIP 14618 not 14610; property sold, center's future uncertain |
| V-0213 | Senior Center | Chemung County Family Fitness Center | 425 Pennsylvania Ave, Elmira 14904 | Census Geocoder; county listings | Match (county facility with senior programs) |
| V-0372 | Veterans Hall | American Legion Post 440 - Arthur H Cunningham | 72 Seneca St, Hornell 14843 | Census Geocoder; IRS-based directories | Match (address) |
| V-0423 | Veterans Hall | American Legion Post 660 - Bradley Jessop | 10 Spring St, Dundee 14837 | Census Geocoder; directories | Match (address) |
| V-0222 | Veterans Hall | VFW Post 6083 | 246 Horseheads Blvd, Elmira Hts 14903 | Census Geocoder; county inspection report | Match (address) |
| V-0424 | Veterans Hall | American Legion Post 355 - Johnson Costello | 2001 Himrod Rd, Penn Yan 14527 | Yates County Chamber listing | Match (address; phone (315) 536-8222 not added); geocoder no match |
| V-0412 | Veterans Hall | American Legion Post 286 - August Mauer | 200 E Union St, Newark 14513 | Census Geocoder; directories | Match (address) |
| V-0276 | College Campus | Nazareth University | 4245 East Ave, Rochester 14618 | Census Geocoder; directories | Match (address, phone) |
| V-0211 | College Campus | Elmira College | One Park Pl, Elmira 14901 | Directories | Match (address, phone); geocoder no match (campus address) |
| V-0433 | Library | Cuba Circulating Library | 39 E Main St, Cuba 14727 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0475 | Library | Ashville Free Library | 2200 N Maple St, Ashville 14710 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0535 | Library | Anna M. Reinstein Memorial Library | 2580 Harlem Rd, Cheektowaga 14225 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0540 | Library | Eden Library | 2901 E Church St, Eden 14057 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0725 | Library | Perry Public Library | 70 N Main St, Perry 14530 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0526 | Library | East Clinton Branch Library | 1929 E Clinton St, Buffalo 14206 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0529 | Library | Isaías González-Soto Branch Library | 280 Porter Ave, Buffalo 14201 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0675 | Library | Hollwedel Memorial Library | 5 Woodrow Dr, Pavilion 14525 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0441 | Library | Whitesville Public Library | 500 Main St, Whitesville 14897 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0528 | Library | Frank E. Merriweather, Jr. Library | 1324 Jefferson Ave, Buffalo 14208 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0428 | Library | Angelica Free Library | 55 W Main St, Angelica 14709 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0521 | Library | Amherst Public Library | 350 John James Audubon Pkwyy, Amherst 14228 | Census Geocoder | MISMATCH (minor): source typo 'Pkwyy' in street |
| V-0557 | College Campus | Daemen University | 4380 Main St, Amherst 14226 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0563 | College Campus | Trocaire College | 360 Choate Ave, Buffalo 14220 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0576 | Senior Center | Buffalo Urban League | 86 Pine St, Buffalo 14204 | Census Geocoder; web search | Match: Erie County lists senior program at 86 Pine St (716-847-8951) |
| V-0465 | Senior Center | Olean SWAN Site | 112 N Barry St, Olean 14760 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| (dropped) | - | (record dropped after sampling) | -,   | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0731 | Senior Center | Attica Nutrition Site | Sokol Dr, Attica 14011 | Census Geocoder; web search | UNCONFIRMED: web search found no listing for a Sokol Dr meal site; Wyoming County OFA (585-786-8833) confirms program only |
| V-0696 | Senior Center | Dale Association- Lockport Senior Citizens Center | 33 Ontatio St, Lockport 14094 | Census Geocoder | MISMATCH (minor): source typo 'Ontatio St'; geocoder matches 33 Ontario St |
| (dropped) | - | (record dropped after sampling) | -,   | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0619 | Senior Center | Holland Senior Citizens | 47 Pearl St, Holland 14080 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0593 | Senior Center | Schiller Park Senior Center | 2057 Genesee St, Buffalo 14211 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0651 | Veterans Hall | American Legion Post 64 | 1770 S Park Ave, Buffalo 14220 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0653 | Veterans Hall | DAV Chapter 135 - Michael M Deoca Sr Mem | 2909 S Park Ave, Buffalo 14218 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0711 | Veterans Hall | VFW Post 313 | 434 3rd St, Youngstown 14174 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0517 | Veterans Hall | VFW Post 6472 | 13 N Main St, Silver Creek 14136 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0664 | Veterans Hall | VFW Post 6247 | 5784 Ellis Rd, Orchard Park 14127 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0718 | Veterans Hall | VFW Post 202 | 8 Veterans Dr, Holley 14470 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 8 VETERAN'S WAY, HOLLEY, NY, 14470) |
| V-0656 | Veterans Hall | VFW Post 8265 - Eden Memorial | 2551 March Rd, Eden 14057 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0896 | Library | Minoa Library | 242 N Main St, Minoa 13116 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0746 | Library | Nineveh Public Library of Colesville Township | 3029 NY State Hwy 7, Nineveh 13813 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 3029 STATE RTE 7, NINEVEH, NY, 13813) |
| V-1021 | Library | Berkshire Free Library | 12519 State Route 38, Berkshire 13736 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 12519 STATE RTE 38, BERKSHIRE, NY, 13736) |
| V-0829 | Library | Oneida Public Library | 459 Main St, Oneida 13421 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0909 | Library | Petit Branch Library | 105 Victoria Pl, Syracuse 13210 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0838 | Library | Camden Library Association | 57 Second St, Camden 13316 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 57 2ND ST, CAMDEN, NY, 13316) |
| V-1010 | Library | Richfield Springs Public Library | 102 Main St, Richfield Springs 13439 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0842 | Library | New Hartford Public Library | 2 Library Ln, New Hartford 13413 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0791 | Library | Sherburne Public Library | 2 E State St, Sherburne 13460 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0769 | Library | Stewart B. Lang Memorial Library | 2577 E Main St, Cato 13033 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0854 | Library | Dunham Public Library | 76 Main St, Whitesboro 13492 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0840 | Library | Kirkland Town Library | 55 1/2 College St, Clinton 13323 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0826 | Library | Hamilton Public Library | 13 Broad St, Hamilton 13346 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0776 | College Campus | Cayuga County Community College | 197 Franklin St, Auburn 13021 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0920 | College Campus | Syracuse University | 900 S Crouse Ave, Syracuse 13244 | Census Geocoder | Geocoder no match; campus/rural address (not separately verified) |
| V-0991 | Senior Center | Mexico Senior Dining and Activity Center | 4361 Church St, Mexico 13114 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0798 | Senior Center | Chenango County Area Agency on Aging | 5 Court St, Norwich 13815 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0993 | Senior Center | Parish Senior Dining Andf Activity Center | 814 Rider St, Parish 13131 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0927 | Senior Center | Camillus Senior Center | 25 1/2 First St, Camillus 13031 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 25 1/2 1ST ST, CAMILLUS, NY, 13031) |
| (dropped) | - | (record dropped after sampling) | -,   | Census Geocoder; web search | Placeholder record (no address) - now DROPPED as 'to be determined' |
| V-0795 | Senior Center | Windy Hill Senior Center | 1839 State Highway 235, Greene 13778 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 1839 STATE RTE 235, GREENE, NY, 13778) |
| (dropped) | - | (record dropped after sampling) | -,   | Census Geocoder; web search | Match: Onondaga County dining list (Nov 2025) lists 5655 Thompson Rd |
| V-0966 | Veterans Hall | American Legion Post 787 - James Harvey Spire | 5575 Legionnaire Dr, Cicero 13039 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0879 | Veterans Hall | DAV Chapter 82 - Wheeler Stars Stripes | 409 Herkimer Rd, Utica 13502 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0996 | Veterans Hall | American Legion Post 1552 | 226 Rochester St, Hannibal 13074 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0819 | Veterans Hall | American Legion Post 489 - Cortland City | 212 Tompkins St, Cortland 13045 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-0971 | Veterans Hall | American Legion Post 239 - Robert J Hydon | 1 Wainwright Dr, Skaneateles 13152 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1085 | Library | Seaford Public Library | 2234 Jackson Ave, Seaford 11783 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1086 | Library | Syosset Public Library | 225 S Oyster Bay Rd, Syosset 11791 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1216 | Library | Longwood Public Library | 800 Middle Country Rd, Middle Island 11953 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1199 | Library | Elwood Public Library | 1929 Jericho Tpke, Elwood 11731 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1195 | Library | Dix Hills | 55 Vanderbilt Pkwy, Dix Hills 11746 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1035 | Library | Bellmore Memorial Library | 2288 Bedford Ave, Bellmore 11710 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1080 | Library | Rockville Centre Public Library | 221 N Village Ave, Rockville Centre 11570 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1033 | Library | Baldwin Public Library | 2385 Grand Ave, Baldwin 11510 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1241 | Library | Wyandanch Public Library | 14 S 20th St, Wyandanch 11798 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1206 | Library | Huntington Public Library | 338 Main St, Huntington 11743 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1175 | Library | Amagansett Free Library | 215 Main St, Amagansett 11930 | Census Geocoder | Geocoder no match; campus/rural address (not separately verified) |
| V-1224 | Library | Port Jefferson Free Library | 100 Thompson St, Port Jefferson 11777 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1204 | Library | Hauppauge Public Library | 1373 Veterans Memorial Hwy, Hauppauge 11788 | Census Geocoder | Geocoder no match; campus/rural address (not separately verified) |
| V-1245 | College Campus | Suffolk County Community College | 533 College Rd, Selden 11784 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1102 | College Campus | Elmezzi Graduate School of Molecular Medicine | 350 Community Dr, Manhasset 11030 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1269 | Senior Center | West Islip Senior Nutrition Program | 90 Higbie Ln, West Islip 11795 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1261 | Senior Center | Rainbow Center | 293 Buffalo Ave, Lindenhurst 11757 | Census Geocoder; web search | Match: Village of Lindenhurst lists Rainbow Senior Center at 293 Buffalo Ave |
| V-1110 | Senior Center | East Meadow Senior Center | 1485 Front St, East Meadow 11554 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 1485 FRONT ST, EAST MEADOW, NY, 11554) |
| V-1122 | Senior Center | Massapequa Park Senior Community Service Center | 375 Linden St, Massapequa Park 11762 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 375 LINDEN ST, MASSAPEQUA PARK, NY, 11762) |
| V-1252 | Senior Center | Bridgehampton Senior Nutrition Program | 585 Sag Harbor Tpke, Bridgehampton 11932 | Census Geocoder; web search | Match: directories and Town of Southampton list 585 Sag Harbor Tpke (631-537-3027) |
| V-1166 | Veterans Hall | VFW Post 1819 | 29 Mohegan Ave, Prt Washingtn 11050 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1164 | Veterans Hall | VFW Post 5199 | 397 Weidner Ave, Oceanside 11572 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1168 | Veterans Hall | American Legion Post 175 - Eugene S Smith | 68 Berry Hill Rd, Syosset 11791 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1276 | Veterans Hall | VFW Post 8300 - South Bay | 330 N Dunton Ave, E Patchogue 11772 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1146 | Veterans Hall | American Legion Post 1033 - Elmont | 60 Hill Ave, Elmont 11003 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1285 | Veterans Hall | VFW Post 2913 - Jayne Lattin | 32 Edwards St, Patchogue 11772 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1355 | Library | Chester Public Library | 1784 Kings Hwy, Chester 10918 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1300 | Library | Fairview Public Library | 43 Walnut St, Margaretville 12455 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1407 | Library | Kent Public Library | 17 Sybils Crossing, Kent Lakes 10512 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1369 | Library | Tuxedo Park Library | 227 Route 17, Tuxedo Park 10987 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 227 STATE RTE 17, TUXEDO PARK, NY, 10987) |
| V-1403 | Library | Brewster Public Library | 79 Main St, Brewster 10509 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1471 | Library | Ethelbert B. Crawford Public Library | 479 Broadway, Monticello 12701 | Census Geocoder | Geocoder no match; campus/rural address (not separately verified) |
| V-1433 | Library | Suffern Free Library | 210 Lafayette Ave, Suffern 10901 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1472 | Library | Western Sullivan P L - Tusten-Cochecton | 198 Bridge St, Narrowsburg 12764 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1533 | Library | Chappaqua Central School District Public Library | 195 S Greeley Ave, Chappaqua 10514 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1313 | Library | Beekman Library | 11 Town Center Blvd, Hopewell Junction 12533 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1296 | Library | Cannon Free Library | 40 Elm St, Delhi 13753 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1474 | Library | Fallsburg Library | 12 Railroad Plz, South Fallsburg 12779 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1432 | Library | Rose Memorial Library Association | 79 E Main St, Stony Point 10980 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1429 | Library | Dennis P. Mchugh Piermont Public Library | 25 Flywheel Park West, Piermont 10968 | Census Geocoder; web search | Match: library website lists 25 Flywheel Park West (geocoder no match) |
| V-1537 | Library | Greenburgh Public Library | 300 Tarrytown Rd, Elmsford 10523 | Census Geocoder | Geocoder no match; campus/rural address (not separately verified) |
| V-1328 | Library | Morton Memorial Library and Community Hous | 82 Kelly St, Rhinecliff 12574 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1517 | College Campus | Ulster County Community College | 491 Cottekill Rd, Stone Ridge 12484 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1585 | College Campus | Saint Vladimirs Orthodox Theological Seminary | 575 Scarsdale Rd, Yonkers 10707 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1451 | College Campus | Be'er Yaakov Talmudic Seminary | 12 Truman Ave, Spring Valley 10977 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1515 | College Campus | Yeshiva of Ocean | 7120 Highway 52, Greenfield Park 12435 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 7120 STATE RTE 52, GREENFIELD PARK, NY, 12435) |
| V-1378 | College Campus | United States Military Academy | 606 Thayer Rd, West Point 10996 | Census Geocoder | Geocoder no match; campus/rural address (not separately verified) |
| V-1459 | Senior Center | North Rockland Senior Center | 130 Samsondale Ave, West Haverstraw 10993 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 130 SAMSONDALE AVE, WEST HAVERSTRAW, NY, 10993) |
| V-1613 | Senior Center | Mount Vernon Swinging Seniors of Sacred Heart | 115 S Sharpe Blvd, Mt. Vernon 10550 | Census Geocoder; web search | UNCONFIRMED: no web listing found for this club |
| V-1479 | Senior Center | Forestburgh Nutrition Site | 332 King Rd, Forestburgh 12777 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1596 | Senior Center | Croton Springvale Senior Citizens | 2T Skytop Dr, Croton-On-Hundson 10520 | Census Geocoder | Match - source misspells city 'Croton-On-Hundson' |
| V-1487 | Senior Center | Narrowsburg Nutrition Site | 210 Bridge St, Narrowsburg 12764 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 210 BRIDGE ST, NARROWSBURG, NY, 12764) |
| V-1586 | Senior Center | Ardsley Senior Citizens Club | 18 Center St, Ardsley 10502 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1413 | Senior Center | Putnam Cty./Cold Spring Friendship Center | 10-14 Cedar St, Cold Spring 10516 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 10 CEDAR ST, COLD SPRING, NY, 10516) |
| V-1388 | Senior Center | Town Newburgh Senior Center | 311 Route 32, Newburgh 12550 | Census Geocoder; web search | PARTIAL: 311 Route 32 is the Town of Newburgh Recreation Center (senior bus and programs there); no separate 'Senior Center' listing found |
| V-1389 | Senior Center | Otisville Senior Center | Baker St, Otisville 10963 | Census Geocoder; web search | UNCONFIRMED: no listing found; Town of Mount Hope lists a Youth/Senior Center without address |
| V-1411 | Senior Center | Putnam County Office for Senior Resources | 110 Old Route 6 Building 3, Carmel 10512 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 110 OLD RTE 6, CARMEL, NY, 10512) |
| V-1457 | Senior Center | Rockland County Office for the Aging | 50 Sanatorium Rd Bldg F, Pomona 10970 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 50 SANITORIUM RD, POMONA, NY, 10970) |
| V-1478 | Senior Center | Eldred Nutrition Site | 725 Route 55, Eldred 12732 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 725 STATE RTE 55, ELDRED, NY, 12732) |
| V-1664 | Senior Center | Yorktown Saint Patrick's Seniors | 137 Moseman Rd, Yorktown Heights 10598 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 137 MOSEMAN RD, YORKTOWN HEIGHTS, NY, 10598) |
| V-1394 | Veterans Hall | VFW Post 692 | 34 Hoover Dr, Middletown 10940 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1352 | Veterans Hall | VFW Post 7765 | 30 Elizabeth St, Red Hook 12571 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1525 | Veterans Hall | American Legion Post 72 - Lamouree Hackett | 30 John St, Saugerties 12477 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1401 | Veterans Hall | VFW Post 7241 - Tri States Naval Ship | 46 Barcelow St, Port Jervis 12771 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1673 | Veterans Hall | American Legion Post 1038 - Adolph Pfister Dpt | 27 Legion Dr, Valhalla 10595 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1850 | Library | The Community Library | 110 Union St, Cobleskill 12043 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1733 | Library | Livingston Free Library | 90 Old Post Rd, Livingston 12541 | Census Geocoder; web search | Match: Mid-Hudson Library System directory lists 90 Old Post Rd (geocoder no match) |
| V-1767 | Library | Frothingham Free Library | 28 W Main St, Fonda 12068 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1688 | Library | Cohoes Public Library | 10 Cayuga Plz, Cohoes 12047 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 10 CAYUGA ST, COHOES, NY, 12047) |
| V-1684 | Library | North Albany Branch | 616 N Pearl St, Albany 12204 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1870 | Library | Richards Library | 36 Elm St, Warrensburg 12885 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1681 | Library | Delaware Branch | 331 Delaware Ave, Albany 12209 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1735 | Library | North Chatham Free Library | 4287 State Route 203, North Chatham 12132 | Census Geocoder | Geocoder no match; campus/rural address (not separately verified) |
| V-1777 | Library | Castleton Public Library | 85 S Main St, Castleton-On-Hudson 12033 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1764 | Library | Amsterdam Free Library | 28 Church St, Amsterdam 12010 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1805 | Library | Ballston Spa Public Library | 21 Milton Ave, Ballston Spa 12020 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1864 | Library | Hillview Free Library | 3717 Lake Shore Dr, Diamond Point 12824 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1770 | College Campus | Fulton-Montgomery Community College | 2805 State Hwy 67, Johnstown 12095 | Census Geocoder | MISMATCH (county): geocoder places '2805 STATE HWY 67, JOHNSTOWN, NY, 12095' in Fulton County; source county Montgomery kept (noted) |
| V-1841 | College Campus | Union College | 807 Union St, Schenectady 12308 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1703 | College Campus | Maria College of Albany | 700 New Scotland Ave, Albany 12208 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1744 | Senior Center | Philmont Area Senior Community Center | 93 Main St, Philmont 12565 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1845 | Senior Center | Schenectady County Department of Senior & Long Term Care Services | 107 Nott Terrace Schaffer Heights, Ste 305, Schenectady 12308 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 107 NOTT TER, SCHENECTADY, NY, 12308) |
| V-1710 | Senior Center | Albany County Department for Aging | 420 Western Ave, Albany 12203 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1745 | Senior Center | Stuyvesant Area Senior Community Center | Route 9, Stuyvesant 12173 | Census Geocoder; web search | MISMATCH: Town of Stuyvesant calendar says Columbia County OFA hosts the Senior Community Center at Stuyvesant Town Hall, 5 Sunset Dr (Tue/Thu); a health-dept record lists 1820 Route 9, Stuyvesant Falls |
| V-1821 | Senior Center | Corinth Senior Center | 22 Hamilton Ave, Corinth 12822 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1713 | Senior Center | Cohoes Multi-Service Center | 10 Cayuga Plz, Cohoes 12047 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 10 CAYUGA ST, COHOES, NY, 12047) |
| V-1772 | Senior Center | Montgomery County Office for the Aging, Inc. | 135 Guy Park Ave, Amsterdam 12010 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1719 | Veterans Hall | American Legion Post 1520 - Joseph E Zaloga | 4 Everett Rd Ext, Albany 12205 | Census Geocoder | Match - minor spelling/abbreviation difference (geocoder: 4 EVERETT RD EXD, ALBANY, NY, 12205) |
| V-1725 | Veterans Hall | VFW Post 9594 | 13 Whitbeck St, Ravena 12143 | Census Geocoder | Match (Census Geocoder: same address, ZIP and county) |
| V-1763 | Veterans Hall | VFW Post 1545 | 5565 State Route 23, Windham 12496 | Census Geocoder; web search | Match (post exists on State Route 23, Windham per local news); house number 5565 not independently confirmed |

**19 of 196 sampled records had a mismatch or could not be confirmed** (14 substantive, the rest minor street-name differences). Every mismatch was added to that record's Notes. In short: OFA and IRS-sourced records need more staff verification than the library and college records do.

## 6. Incomplete or uncertain

**All groups:**

- Every address from the NYSOFA 2021 senior center directory and the IRS file was also run through the Census Geocoder (batch service). 84 could not be matched, and 21 matched with a different ZIP or house number. Each is flagged in that record's Notes ('Census Geocoder could not match this address - verify'). No data was changed based on these checks.
- OpenStreetMap (approved as a supplement) was never reachable from this cloud machine, so it was not used for any group.
- Hours (J) are filled only where a current county list gave them (Essex, Clinton, St. Lawrence, Lewis, Fulton, Monroe, Livingston, Chemung, Tompkins/Foodnet, Onondaga). Each has an 'as of' note.

**Sue Merrell group:**

- **Hours (J)** are filled only where a county OFA source published them (34 senior-center rows). IMLS and IPEDS publish no weekly schedules (IMLS has annual hours only, which were not used).
- **Library websites** are blank: IMLS outlet data has no web address, and the NYS Library directory could not be reached (TLS error).
- **Veterans halls:** IRS addresses are the address of record, not a confirmed hall. 26 records that looked residential were dropped as you instructed: care of a named individual with no other veterans group at the same address, or an apartment/unit/lot address. 60 PO Box records were dropped too, so many posts are missing (e.g., several Legion posts in Hamilton, Essex and Franklin use PO Boxes). Phone numbers are blank because the IRS file has none.
- **Senior centers:** Franklin and Jefferson rely on the NYSOFA 2021 directory (Jefferson County's web page lists no sites). Herkimer County says it runs 5 congregate sites at senior housing (Dolgeville, Little Falls, Herkimer, Ilion, West Winfield) but publishes no addresses, so only the Herkimer OFA office is listed. Essex sites in the NYSOFA 2021 directory all used the OFA PO Box and were dropped; the 2026 county list replaced them.
- **Office for the Aging offices** are included as Type 'Senior Center' (the closest allowed type), with a note that they are administrative offices. Warren/Hamilton's joint OFA office is in Lake George (Warren County), so it will appear with Buck Bobbin's group.
- **College branch campuses** not separately reported to IPEDS are missing, e.g., North Country Community College's Malone and Ticonderoga campuses and Jefferson CC's Fort Drum site. IPEDS also shows North Country CC's main campus in Essex County although its Saranac Lake ZIP (12983) is mainly Franklin; the source county was kept and the conflict noted.
- **Name cleaning:** veterans post names were built from IRS name fields (e.g., 'American Legion Post 61 - Watertown Army & Navy'). IRS truncates long names, so a few post names may be cut short. Where a post's own IRS record had no post number, the number was taken from an affiliated record (e.g., its auxiliary) at the same address, and this is noted.

**Austin Ponce group:**

- **Monroe** senior centers come from the county's current Lunch Club list (19 centers with hours). Five NYSOFA 2021 entries at older addresses (Sweden, Pittsford, Irondequoit, Chili, Gates) were dropped as superseded. Town senior centers that are not OFA Lunch Club sites (e.g., Penfield, Perinton, East Rochester) are NOT in any public source used and are missing.
- **Ontario, Seneca, Schuyler and Yates** have no current county site lists online, so they rely on the NYSOFA 2021 directory plus the OFA office. Ontario County says it runs 8 dining sites but publishes no list. A September 2026 news report said Seneca County OFA had cancelled all meal services, including meals at gathering sites; no reopening date was found. Yates' only site list found is from 2012 and was not used.
- **Wayne** senior centers (4) come from the 211 Lifeline directory and are marked LOW CONFIDENCE.
- **Tompkins:** the county's own nutrition page blocked automated access (HTTP 403), so the 3 dining sites come from Foodnet Meals on Wheels, the county's contracted meal provider.
- **Veterans halls:** only 33 survived in this group, with only 5 in Monroe County. Most Monroe posts list PO Boxes or care-of-individual addresses in the IRS file. This category is the least complete.
- **Colleges:** 25 from IPEDS. University of Rochester's IPEDS address ('Wilson Blvd - Wallis Hall') has no street number, and Cornell's ('300 Day Hall') is an administrative building. Both were kept as reported. Wells College (Aurora) closed in 2024 and correctly does not appear.

**Courtney Ball group:**

- **Erie** senior centers come from the county's August 2025 list (57 centers, with phones; no hours). 18 NYSOFA 2021 Erie entries not on the county list were kept and flagged 'possibly no longer an OFA site'. Hamburg ('temporarily at ECC South') and Sardinia ('contact Town Hall') have no street address in the source.
- **Genesee, Orleans, Allegany, Chautauqua, Cattaraugus, Niagara, Wyoming:** no usable current county site list could be read (Genesee's site blocks automated access; Chautauqua lists towns only), so these rely on the NYSOFA 2021 directory plus the OFA office. Allegany has no NYSOFA senior centers at all; only its OFA office is listed.
- Veterans halls: 67 in this group, the most of any group, but many Erie County posts were dropped for PO Box or residential-looking addresses.

**Jamie Fuess group:**

- **Onondaga** senior dining sites come from the county's October 2025 list (30 open sites with meal days). The county list gives no city or ZIP for many sites; those were filled from the Census Geocoder only when it returned an exact match in Onondaga County, otherwise left blank. North Syracuse Community Center is marked 'Closed' on the list and was dropped.
- **Madison and Otsego** have no NYSOFA senior centers and no readable county list (Otsego's directory host disallows crawling), so only their OFA offices are listed. Tioga has one NYSOFA entry plus the office.
- A NYSOFA placeholder ('Sandy Creek/Pulaski - To Be Determined', Oswego) was dropped.

**Michael Scheid group:**

- **Nassau and Suffolk** senior centers rely on the NYSOFA 2021 directory (53 entries) plus the OFA offices. No county lists were fetched for Long Island. Many town-run senior centers in these counties may be missing or outdated.
- Libraries are well covered (129 outlets from IMLS).

**Damian Garcia group:**

- **Delaware County's** OFA website explicitly blocks AI agents in robots.txt, so it was not used. Delaware's senior meal program was taken over by the county in May 2026 after the previous operator stopped, and Delaware has no NYSOFA senior centers, so only the OFA office is listed.
- **Ulster's** OFA page blocked automated access (HTTP 403). Ulster relies on 2 NYSOFA entries plus the office, although news reports describe 4 'Community Cafe' sites (Ellenville, Saugerties, Rosendale, Kingston Senior Hub).
- **Westchester** has 92 NYSOFA 2021 entries, many of them small clubs or meal programs in churches. These are the most likely to be out of date.
- Two NYSOFA ZIPs were invalid (Tarrytown 10592, Philmont 12535 [Buck group]) and were replaced from the Census Geocoder, with a note.

**Buck Bobbin group:**

- Senior centers rely on the NYSOFA 2021 directory plus the OFA offices (no county lists fetched). Montgomery and Washington counties have only 2 NYSOFA entries each.
- The Warren/Hamilton joint OFA office (Lake George, Warren County) appears in this group.
- Fulton-Montgomery Community College: IPEDS lists Montgomery County, but the campus address (2805 State Hwy 67, Johnstown) geocodes to Fulton County; the source county was kept and the conflict noted. Samaritan Hospital School of Nursing: IPEDS county Rensselaer, but ZIP 12065 is in Saratoga County (noted).
