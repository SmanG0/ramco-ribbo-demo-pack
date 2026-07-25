# Ramco Printing Works — Ribbo Implementation Package

> **In one line:** an assistant that turns a vague print enquiry into a complete order, and tells a
> customer when a job is stuck waiting on them. **For the plain-English demo walkthrough — the exact
> conversation and what each moment proves — see [`../../DEMO-FLOWS.md`](../../DEMO-FLOWS.md) (Bot 3).**

Package 3 of 3 for the Ramco Group demo. Companion to `03-ramco-printing.md`.

**Read `SPEC-CORRECTIONS.md` first** — though for once it is good news. The spec was materially correct. Corrections are additive.

## What this bot is for (use case)

**Type: B2B · customer-facing.** The people messaging this bot are **corporate print buyers** ordering
jobs for their company (business cards, notebooks, packaging, banners). Unlike Sai Office this is
**not a catalogue** — a print job is *configured*, not picked off a shelf, so a price cannot simply be
looked up.

**What the bot does:** asks the right questions to build a complete, valid spec, routes it to the
correct division (UNO/DUO/HEX/IX), gives an indicative range on standard items, and hands a tidy brief
to a human estimator. It also answers "where's my job?" — and flags when a job is stuck waiting on the
customer's own proof approval. It never quotes a final price on custom work (deliberate).

## What each folder here is for

- **`kb/`** — fixed facts the bot reads to answer general questions (division routing, proofing, how
  quoting works). Never contains prices, job status or turnaround times — those come from tools.
- **`seed/`** — realistic fake demo data (customers, jobs, proofs, rate cards) engineered so the
  rehearsed demo questions always return a good answer.
- **`scripts/`** — `generate_seed.py`, which regenerates that data relative to the demo date.
- **`site-mirror/`** — an offline copy of two real Ramco Printing web pages to drop the widget onto.

## What each knowledge base file is for

| File | The customer situation it covers |
|---|---|
| `kb-divisions.md` | **The most important file.** "Which of your divisions handles my job?" UNO/DUO/HEX/IX definitions + 18 worked routing examples (6 flagged for the client to settle, including branded notebooks). |
| `kb-about.md` | "Who is Ramco Printing?" Since 1994, 650+ staff, 160,000 sq ft, four divisions, ISO 9001, offset/digital/screen/large-format capability. |
| `kb-locations.md` | "Where do I collect / which site?" Two physical sites split by division — collection location depends on which division holds the job (opposite sides of Nairobi). |
| `kb-payment-credit.md` | "How do I pay / open an account?" The published M-PESA path and the Apply-for-Credit flow. |
| `kb-proofing.md` | "What's a proof, what am I signing off, what happens while it waits?" **Powers the "your job is stuck waiting on your approval" beat.** |
| `kb-quote-process.md` | "How do I get a quote / why can't you just tell me the price?" What an estimator needs; the hard no-auto-pricing rule. |
| `kb-artwork-spec.md` | "What file format / resolution do you need?" ⚠️ *Numbers deliberately withheld* (bleed/dpi/colour marked unconfirmed) — a wrong spec gets a file rejected, so the bot explains what it *can* do without them. |
| `kb-turnaround.md` | "How long will it take?" ⚠️ *States no timings* — turnaround is planner knowledge; the bot won't promise dates it can't guarantee. |
| `kb-stock-and-finishing.md` | "What paper and finishes do you offer?" Categories only; specific range/availability is a tool call or needs confirming. |

## Contents

```
kb/      9 knowledge base documents (~5,100 words)
seed/    9 seed data CSVs (generated)
scripts/ generate_seed.py — 19 assertions
SPEC-CORRECTIONS.md
README.md
```

## Regenerating

```bash
cd scripts && python3 generate_seed.py --demo-date YYYY-MM-DD --out ../seed
```

All 19 assertions must pass. One failed on first run — and it was a genuine logic bug, not a threshold. My test for "the proof wait caused the delay" was trivially true on any job where production alone had already blown the deadline, so it counted 31 instead of 19. The corrected definition is the defensible one:

> **The job would have shipped on time but for the proof wait.**

That is now what the assertion checks, and it is the claim to make in the room. It is stronger and harder to argue with than "approval exceeded slack."

## The knowledge base

| File | Status |
|---|---|
| `kb-divisions.md` | Primary-sourced. **The most important file.** 18 routing examples. |
| `kb-about.md` | Primary-sourced. |
| `kb-locations.md` | Primary-sourced. Two sites — new, and operationally important. |
| `kb-payment-credit.md` | M-PESA and the credit route are published; terms are not. |
| `kb-proofing.md` | The commercially critical file. Structure solid. |
| `kb-quote-process.md` | Structure solid. Contains the hard no-pricing limit. |
| `kb-artwork-spec.md` | **Deliberately withheld.** See below. |
| `kb-turnaround.md` | **Structure only.** All timings need production planning. |
| `kb-stock-and-finishing.md` | Categories only. Range and availability need confirming. |

### Two files that deliberately refuse to answer

`kb-artwork-spec.md` contains a table of print-industry conventions — 3mm bleed, 300dpi, CMYK, PDF/X-1a — every one marked unconfirmed. Those figures are *probably* right, and "probably right" is exactly how a bot gets a customer's file rejected and takes the blame for the delay. Prepress requirements vary by press, product and division. The file explains what the bot *can* usefully do without them, which turns out to be quite a lot — including asking whether the customer has print-ready artwork at all, a question that changes the quote.

`kb-turnaround.md` states no timing whatsoever. Turnaround is planner knowledge, not published information, and a bot promising dates the floor cannot hit destroys trust in Ramco Printing rather than in us.

## Six routing questions for the client

`kb-divisions.md` has 18 worked routing examples. Six are genuinely ambiguous from public information and are flagged: catalogues, product labels, **branded notebooks**, annual reports, presentation folders, and books needing binding.

**Settle branded notebooks first** — HEX manufactures notebooks, IX does branding, and it is the opening enquiry in the demo script. An estimator will resolve all six in two minutes. Guessing them is the mistake the first two packages taught us to avoid.

## New: two sites, split by division

- **UNO** → Dunga Close, Industrial Area (also the showroom)
- **DUO, HEX, IX** → Ramco Group Industrial Park, Mombasa Road

Collection location depends on which division holds the job, and these are on opposite sides of Nairobi. `collection_site` is now a column on `jobs`, derived from division and asserted both ways. Telling a customer the right site is a small thing that reads as real system access.

## Demo beats the data supports

| Beat | Condition |
|---|---|
| Enquiry routed to HEX, spec captured | routing table + rate card |
| Indicative range on standard work | KES 780,000–940,000 for 5,000 A5 hardcover |
| Bot **refuses** to price custom work | no rate-card row for die-cut + foil |
| Deadline tight but not impossible | 22 days vs HEX turnaround |
| Unavailable stock → alternative offered | STK-SILK-170 unavailable, 150 held |
| **"Your job is waiting on your approval"** | job 4471, `awaiting_approval`, proof sent 3d ago |
| Dispatch at risk, and what fixing it does | promised DEMO_DATE+2d |
| Correct collection site named | 4471 is UNO → Industrial Area |
| **"2.3 days average lost to proof approval"** | mean across 220 jobs |
| **"19 late jobs would have shipped on time"** | but for the proof wait |
| Approval requires a named approver | Peter Kariuki, `is_proof_approver` |

## Before the demo

Read section 13 of the original spec. **An estimator will challenge automated quoting**, and they will be right to. The bot does not quote — it gives indicative ranges on rate-carded items and produces complete structured briefs for everything else. Lead with the refusal demo, not the capability. The value proposition to an estimator is fewer incomplete briefs, not fewer estimators.

## All three packages now complete

| Package | KB files | CSVs | Assertions | Spec accuracy |
|---|---|---|---|---|
| Safarilink | 12 | 11 | 20 | 5 material errors |
| Sai Office | 7 | 14 | 26 | Business under-described |
| Ramco Printing | 9 | 9 | 19 | Materially correct |

Next: Claude Code for repo assembly, per-company READMEs, and lightweight styled page mockups with the widget embedded. **Do not scrape site mirrors** — build clean replicas from each brand instead.
