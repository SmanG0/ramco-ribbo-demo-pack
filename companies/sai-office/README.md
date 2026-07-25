# Sai Office Supplies — Ribbo Implementation Package

> **In one line:** an assistant that reorders your usual supplies in under a minute, at your own
> contract price, and spots when you're running low. **For the plain-English demo walkthrough — the
> exact conversation and what each moment proves — see [`../../DEMO-FLOWS.md`](../../DEMO-FLOWS.md) (Bot 2).**

Package 2 of 3 for the Ramco Group demo. Companion to `02-sai-office.md`.

**Read `SPEC-CORRECTIONS.md` first.** The original spec under-described this business — it is a seven-line operation including solar, cooling, equipment leasing and an authorised Epson/APC service centre, not a consumables reseller. That changes the demo.

## What this bot is for (use case)

**Type: B2B · customer-facing.** The people messaging this bot are **procurement/admin officers
ordering on behalf of their company** — busy repeat buyers who reorder the same supplies every month.
On WhatsApp their phone number *is* their identity, so the bot can recognise them and use their own
confidential contract pricing.

**What the bot does:** recognises the customer, pulls their order history, checks stock across
branches, quotes *their* contract price, and places the order (held for a PIN). It also handles
repair-status and leasing questions. For an unknown number it stays generic (list price only) and
captures a lead instead.

## What each folder here is for

- **`kb/`** — fixed facts the bot reads to answer general questions (who Sai Office is, the seven
  lines, delivery promise). Never contains prices, stock or order status — those come from tools.
- **`seed/`** — realistic fake demo data (accounts, contacts, orders, stock, repair jobs) engineered
  so the rehearsed demo questions always return a good answer.
- **`scripts/`** — `generate_seed.py`, which regenerates that data relative to the demo date.
- **`site-mirror/`** — an offline copy of two real Sai Office web pages to drop the Ribbo widget onto.

## What each knowledge base file is for

| File | The customer situation it covers |
|---|---|
| `kb-product-lines.md` | **The routing file — read first.** "What do you sell / who handles my enquiry?" The seven lines (IT, stationery, furniture, solar, cooling, leasing, service) and how the bot works out which one an enquiry belongs to. |
| `kb-about.md` | "Who is Sai Office?" 30 years (since 1994), Ramco Kora vertical, four countries, 500+ staff, Epson/APC service centre. |
| `kb-brands.md` | "Do you carry brand X?" The brands distributed/represented, plus own brands (OfficePoint, Veda, Skoolpoint). |
| `kb-service-centre.md` | "My Epson/APC is broken — where's my repair?" The authorised service centre, repair stages, what to bring, warranty handling. **Powers the "your printer's been ready since Tuesday" beat.** |
| `kb-leasing.md` | "I lease a copier — contract end date, meter reading, report a fault, toner under lease." Office Technologies leasing queries. |
| `kb-delivery.md` | "How fast is delivery?" The published **48-hour** commitment and its scope. |
| `kb-accounts-and-ordering.md` | "How do I open an account, credit terms, returns?" ⚠️ *Mostly a client questionnaire* — B2B distributors don't publish credit terms, so the bot captures the request and hands off. |

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
