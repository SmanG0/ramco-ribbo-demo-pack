# Sai Office Supplies — Ribbo Implementation Package

Package 2 of 3 for the Ramco Group demo. Companion to `02-sai-office.md`.

**Read `SPEC-CORRECTIONS.md` first.** The original spec under-described this business — it is a seven-line operation including solar, cooling, equipment leasing and an authorised Epson/APC service centre, not a consumables reseller. That changes the demo.

## Contents

```
kb/      7 knowledge base documents (~3,800 words)
seed/    14 seed data CSVs (generated)
scripts/ generate_seed.py — 26 assertions
SPEC-CORRECTIONS.md
README.md
```

## Regenerating

```bash
cd scripts && python3 generate_seed.py --demo-date YYYY-MM-DD --out ../seed
```

All 26 assertions must pass. **If one fails, fix the generator, not the assertion.** Two did fail on first run — off-by-one errors in reorder-cadence arithmetic that would have silently killed the "overdue" demo beat. That is exactly what the assertions are for.

## The knowledge base

| File | Status |
|---|---|
| `kb-about.md` | Primary-sourced. |
| `kb-product-lines.md` | Primary-sourced. The seven lines and the routing table. |
| `kb-brands.md` | Primary-sourced from the brand wall; agreements need confirming. |
| `kb-service-centre.md` | Structure solid, stage names and turnaround need Service input. |
| `kb-leasing.md` | Structure solid, contract mechanics need Office Technologies input. |
| `kb-delivery.md` | 48-hour commitment is published; scope needs pinning down. |
| `kb-accounts-and-ordering.md` | **Mostly a questionnaire.** See below. |

### Why one file is mostly empty

Airlines publish baggage rules because passengers need them. B2B distributors do not publish credit terms, discount bands, payment details or returns policy — it is commercially sensitive and negotiated per customer. None of it is public, and none of it should be invented.

`kb-accounts-and-ordering.md` is therefore structured as the client questionnaire. Extract every marker:

```bash
grep -rn "\[VERIFY" kb/ | sed 's/`//g'
```

## Design change: no prices exist

Sai Office publishes no prices and uses a Product Enquiry form rather than a cart. The `products` table deliberately has **no `list_price` column** — asserted in the generator. Price lives only in `price_lists`, per account.

So the demo splits:

- **Recognised account** → contract price returned instantly from a tool
- **Anyone else** → quote request captured, salesperson follows up

That contrast is a better beat than the original spec's list-vs-contract, because it shows the bot converting an anonymous enquiry into a qualified lead with a full specification. That is a revenue argument, not a convenience one.

## Demo beats the data supports

| Beat | Condition |
|---|---|
| Bot recognises the number, pulls last order | Grace Mwende, `wa_id` bound, KCH-0041 |
| "You're 8 days past your usual cycle" | last order DEMO_DATE−35d, median 27d |
| Contract price, not list | 21% discount on HP-CF226A |
| Stock shortfall → alternative branch | 4 at Industrial Area, 27 at Westlands |
| Write held for PIN confirmation | PIN 4417 |
| Invoice mentioned once, at the end | 1 outstanding, due DEMO_DATE+4d |
| **"Your printer's been ready since Tuesday"** | repair job, `ready_for_collection`, 3d |
| **"A repair quote is waiting on your approval"** | repair job, `awaiting_customer_approval`, KES 48,750 |
| Anonymous enquiry → captured lead | `quote_requests` |
| "9 accounts are overdue right now" | 9 accounts past own median by >7d |
| Tenant switch: TZS, Swahili, TZ catalogue | `sai-tz`, 12 TZ-only SKUs |
| Graceful failure — no compatibility answer | no device-to-consumable dataset seeded |

The two repair beats are the strongest additions. A bot that tells a customer their equipment is finished and sitting in the workshop is doing work no one is doing today, and it clears Sai Office's floor space.

## Still to do

Package 3 — Ramco Printing Works. **Pull ramcoprinting.com before drafting anything.** Two packages, two rounds of material corrections; assume the same for the third.

**On website mirrors:** build lightweight styled replicas from each company's brand rather than scraping. Sai Office runs WordPress/Elementor at sai-office.com with four country sites — the visual language is easy to reproduce cleanly, and a three-page mockup demos better than a broken mirror.
