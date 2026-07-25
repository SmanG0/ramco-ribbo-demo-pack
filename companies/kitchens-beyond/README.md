# Kitchens & Beyond — Ribbo Implementation Package

> **In one line:** an assistant that catches an 11pm luxury-kitchen browser, qualifies them, and books
> the showroom visit before they shop around. **The only bot that books something, and the only one
> that makes money rather than saving it — demo it LAST.** For the plain-English walkthrough see
> [`../../DEMO-FLOWS.md`](../../DEMO-FLOWS.md) (Bot 4).

Package 4 of 4 for the Ramco Group demo. **No spec document exists for this one** — it was not in the original build pack. `RATIONALE.md` explains why it replaces the originally recommended Kentainers.

**Read `RATIONALE.md` first.** It contains a correction that affects two earlier deliverables.

## What this bot is for (use case)

**Type: B2C · customer-facing.** The people messaging this bot are **homeowners and renovators**
planning a luxury kitchen or interior — a big, considered, emotional purchase researched late at night
and easily lost to a competitor. There is nobody at the showroom at 11pm; the bot is.

**What the bot does:** it doesn't just answer — it **qualifies** the person (scope, property stage,
timeline, budget) and **books a showroom appointment** (a real calendar write), with the designer
briefed in advance. It answers the quality objection with the ten-year warranty floor, never quotes a
price, and honestly refers out enquiries below the range.

## What each folder here is for

- **`kb/`** — fixed facts the bot reads to answer general questions (brands, the warranty floor, how
  visits and the design process work). Never contains prices — there are none.
- **`seed/`** — realistic fake demo data (clients, enquiries, projects, appointment slots) engineered
  so the rehearsed demo questions always return a good answer (incl. a nearly-full Saturday).
- **`scripts/`** — `generate_seed.py`, which regenerates that data relative to the demo date.
- **`site-mirror/`** — an offline copy of two real Kitchens & Beyond web pages to drop the widget onto.

## What each knowledge base file is for

| File | The customer situation it covers |
|---|---|
| `kb-showroom-visits.md` | **The commercially critical file.** "Can I come in / see a designer?" The qualification questions and the booking flow. **Powers the appointment-booking beat.** |
| `kb-budget-and-pricing.md` | "How much does a kitchen cost?" — the first question everyone asks. How to **qualify budget without quoting a price**: explain what drives cost, then ask their range. |
| `kb-design-service.md` | "Do you design it for me?" In-house interior design and **3D visualisation** — the honest alternative to a number. |
| `kb-brands-and-range.md` | "What brands do you carry?" The eight brands (Snaidero, Kohler, Novamobili, Caesar, Ideagroup, Azzurra, Bosch, Franke) and the ten-year warranty floor. |
| `kb-warranty.md` | "Is it good quality / what's the warranty?" The **ten-year floor** answer — plus the caution: never state it as the warranty on a *specific* product (coverage differs by brand/component). |
| `kb-project-process.md` | "What are the steps, how long does it take?" The stage sequence and the **client-side blockers** (feeds the "your tile selection is holding your install" beat). |
| `kb-about.md` | "Who is Kitchens & Beyond?" 13+ years, Superbrands 2021–22, Ramco Ekon, the Promenade showroom. |
| `kb-locations-contact.md` | "Where are you / opening hours?" The Promenade, General Mathenge Drive (hours need confirming). |

## Contents

```
kb/      8 knowledge base documents (~4,100 words)
seed/    9 seed data CSVs (generated)
scripts/ generate_seed.py — 25 assertions
RATIONALE.md
README.md
```

```bash
cd scripts && python3 generate_seed.py --demo-date YYYY-MM-DD --out ../seed
```

All 25 assertions pass first run.

## Why this is the right fourth

**Fourth vertical** — Ekon, the building-materials arm and where Ramco began in 1948. The demo now covers four of six verticals.

**Fourth genuinely distinct agent pattern:**

| Company | Vertical | Pattern | Write action |
|---|---|---|---|
| Sai Office | Kora | Lookup and transact | An order |
| Ramco Printing | Plexus | Structured capture | A proof approval |
| Safarilink | Oritsu | Inventory query + identity | *None — deliberately* |
| **Kitchens & Beyond** | **Ekon** | **Consultative qualification + booking** | **A calendar slot** |

**It is the only one that makes money rather than saving it.** The other three are deflection arguments — queries absorbed, staff time freed, jobs unblocked. This one is revenue. Someone browsing Italian kitchens at 11pm is at peak intent with nobody at the showroom; by morning they have looked at three competitors.

**Put it last in the demo.** Three bots that save money, then one that makes money.

## The knowledge base

| File | Status |
|---|---|
| `kb-about.md` | Primary-sourced. |
| `kb-brands-and-range.md` | Primary-sourced. Eight brands, ten-year floor. |
| `kb-showroom-visits.md` | **The commercially critical file.** Qualification and booking. |
| `kb-budget-and-pricing.md` | How to handle the price question without quoting. |
| `kb-design-service.md` | 3D visualisation as the alternative to a number. |
| `kb-project-process.md` | Stage sequence and the client-side blockers. |
| `kb-warranty.md` | The ten-year floor, and its one dangerous misuse. |
| `kb-locations-contact.md` | The Promenade; hours need confirming. |

### The one fact worth owning

**No product in the range carries a warranty of less than ten years.** Snaidero, Kohler, Novamobili, Caesar, Ideagroup, Azzurra, Bosch, Franke — all selected against that floor.

It answers the quality objection in one line without going near a price. `kb-warranty.md` also flags the misuse: the *range* floor is ten years, but the bot must never state it as the warranty on a **specific product**, because coverage differs by brand and component.

### No prices, again

Like Sai Office, Kitchens & Beyond publishes nothing. The generator asserts that **no seeded table carries a price field**. `kb-budget-and-pricing.md` is about handling "how much does a kitchen cost" — the first question every client asks and the one with no honest short answer. The approach is budget *qualification*, not deflection: explain what actually drives cost, then ask their range.

## Demo beats the data supports

| Beat | Condition |
|---|---|
| 11pm enquiry, nobody at the showroom | 44% of enquiries arrive out of hours |
| Bot qualifies: scope, property stage, timeline, budget | qualification flow |
| **Bot books a Saturday slot — a real write** | first Saturday has 2 of 12 free |
| Genuine scarcity, honestly stated | Saturday demand seeded at 86% booked |
| Designer arrives briefed | `brief_note` on appointments |
| **"Your tile selection is holding your October install"** | KB-1201, outstanding 12 days |
| Consequence stated, unblocking step offered | target installation DEMO_DATE+60d |
| Quality objection answered without a price | ten-year warranty floor |
| Under-budget enquiry referred out honestly | 40 `under` budget signals |
| **"61 enquiries never got booked"** | of 180 over 90 days |

## The line to close the whole demo on

Three of the four bots surface the same planted problem from completely unrelated businesses:

- **Ramco Printing** — a job waiting on the client's proof approval
- **Sai Office** — a repair finished and waiting on collection; a quote waiting on a yes
- **Kitchens & Beyond** — an installation waiting on the client's tile selection

> In every one of your businesses, work is sitting still waiting on your own customers, and nobody is telling them.

That is a group-level insight rather than four product demos, and it is the argument for a group platform agreement rather than four projects. Build the close around it.

## All four packages

| Package | Vertical | KB | CSVs | Assertions | Spec accuracy |
|---|---|---|---|---|---|
| Safarilink | Oritsu | 12 | 11 | 20 | 5 material errors |
| Sai Office | Kora | 7 | 14 | 26 | Business under-described |
| Ramco Printing | Plexus | 9 | 9 | 19 | Materially correct |
| Kitchens & Beyond | Ekon | 8 | 9 | 25 | *No spec — built from source* |

Four verticals, four agent patterns, 36 KB files, 90 assertions.
