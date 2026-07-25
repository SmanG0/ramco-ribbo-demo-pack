# Spec Corrections — Safarilink

Issued 25 July 2026. **These corrections supersede `04-safarilink.md` where they conflict.**

During KB authoring, facts in the original spec were checked against the primary source (flysafarilink.com). Several were wrong. They had been drawn from third-party travel sites which contradict each other and each other's figures.

This is the exact failure mode the spec itself warns about. It is recorded here rather than quietly fixed, because the same trap applies to the Sai Office and Ramco Printing packages.

## Corrections

| # | Original spec | Corrected | Source |
|---|---|---|---|
| 1 | 20kg on Zanzibar, Kisumu, **Kitale**, Diani, **Lodwar** | 20kg on **Zanzibar, Kisumu, Diani, Lamu, Malindi, Entebbe, Mombasa** | flysafarilink.com baggage page |
| 2 | Entebbe used as the off-network failure test | **Entebbe is served.** Network is Kenya, Uganda, Tanzania & Zanzibar. Failure test changed to **Kigali (KGL)** | flysafarilink.com destinations |
| 3 | ~12 aircraft | **15 aircraft**, 18 destinations, 30+ daily flights, 250+ staff | flysafarilink.com stats panel |
| 4 | Max bag dimensions 90 × 65 × 35cm | **Not published by Safarilink.** Third parties give 60×45×30, 70×60×35 and 90×65×35. Marked `[VERIFY]`; bot must not state a dimension limit | absence from primary source |
| 5 | Kitale, Lodwar in the network | Not in the destination list. **Tsavo West (Kilaguni)** is, and was missing | flysafarilink.com destinations |

## Facts gained that strengthen the demo

Not in the original spec, all primary-sourced, all now in `kb/kb-baggage.md`:

- **Freight seat** at adult rate carries an extra **75kg** — Y class, safari routes only. The right answer for a photographer with equipment, and a genuinely impressive thing for a bot to know.
- **Advance excess bundles** of 10/20/30kg bookable up to 48 hours out, at materially lower rates than at check-in.
- **2kg leeway** at check-in staff discretion.
- Excess beyond that is at the **captain's sole discretion**, payload permitting — a real operational limit, not a fee.
- **Complimentary secure luggage store** at the Wilson office. Under-known and highly useful.
- **Infants without a paid seat get no baggage allowance.** Two adults plus a baby on a safari route is 30kg for everything.
- Sports equipment not carried without advance arrangement; **golf bags on Dash 8 only, USD 20 per bag per sector**.
- Booking system caps infants at 6 per booking and **blocks unaccompanied minors online**, routing them to the airline.

Excess baggage rates are published as "2023/2024" and are marked `[VERIFY]`.

## Process change for the remaining two packages

For Sai Office and Ramco Printing:

1. Draft KB content **only** from primary sources — the company's own site, published documents, or material supplied by Riff.
2. Where sources disagree, treat the fact as unknown and mark `[VERIFY]`. Do not average, do not pick the most common, do not pick the most confident-sounding.
3. Where no primary source exists, write the section **structure** with a `[VERIFY]` block listing exactly what the client must supply. A structured gap is useful; an invented answer is a liability.
4. Add a cross-check assertion wherever a KB fact is mirrored in the data. `generate_seed.py` asserts that the 20kg route list in the database matches the published list exactly — that single assertion would have caught correction #1 at build time.

## Note on `[VERIFY]` markers

There are 30+ `[VERIFY]` markers across the 12 KB files. That is not incompleteness — it is the honest boundary of what is publicly knowable. Most concern check-in windows, frequent flyer mechanics, special assistance and prohibited items, all of which are operational policy Safarilink has not published in full.

**Take the marker list to the Safarilink meeting as a questionnaire.** It doubles as evidence of rigour, and asking an airline precise operational questions is a much better first impression than presenting a bot that confidently invented the answers.
