# Safarilink Aviation — Ribbo Implementation Package

> **In one line:** an assistant that answers travellers instantly at 2am, and shows a booking only
> after confirming it's really them. **For the plain-English demo walkthrough — the exact
> conversation and what each moment proves — see [`../../DEMO-FLOWS.md`](../../DEMO-FLOWS.md) (Bot 1).**

Package 1 of 3 for the Ramco Group demo. Companion to `04-safarilink.md` in the build spec pack.

**Read `SPEC-CORRECTIONS.md` first.** It supersedes the original spec in five places.

## What this bot is for (use case)

**Type: B2C · customer-facing.** The people messaging this bot are **individual travellers** — mostly
international leisure tourists flying to safari destinations, often writing at 2am the night before a
trip, from another time zone, when the airline desk is closed. They ask simple, high-stakes questions
("how much luggage?", "where's my flight?") and expect an instant, correct answer.

**What the bot does:** answers general travel questions instantly from the knowledge base, and — only
after confirming the traveller's identity (booking code + surname) — shows their private booking. It
never changes a booking; those go to a human.

## What each folder here is for

- **`kb/`** — fixed facts the bot reads to answer general questions ("what is a bush airstrip", baggage
  policy). Never contains anything that changes (times, fares, seats) — those come from tools.
- **`seed/`** — realistic fake demo data (bookings, passengers, flights) engineered so the rehearsed
  demo questions always return a good answer.
- **`scripts/`** — `generate_seed.py`, which regenerates that data relative to the demo date.
- **`site-mirror/`** — an offline copy of two real Safarilink web pages to drop the Ribbo widget onto.

## What each knowledge base file is for

| File | The customer situation it covers |
|---|---|
| `kb-baggage.md` | **The #1 question.** "How much luggage can I bring?" 15kg standard, 20kg exception routes, soft-bags-only, excess/freight options. Answered instantly, no lookup. |
| `kb-about.md` | "Who are you, how big, are you safe?" Founded 2004, 15 aircraft, 18 destinations, ISSA safety, based at Wilson Airport. |
| `kb-destinations.md` | "Do you fly to X? What's a bush airstrip like?" Describes the places served and what to expect — **not** schedules or times (those are tools). |
| `kb-wilson-airport.md` | "How do I get to the airport, where's your desk, how long from JKIA?" |
| `kb-charters.md` | "Can I charter a private plane?" The enquiry process and what info is needed. |
| `kb-codeshare-kq.md` | "I'm connecting on Kenya Airways — how does that work?" What the partnership covers, baggage, connections. |
| `kb-check-in.md` | "When do I check in, what ID?" ⚠️ *Structure only* — bot hands off until Safarilink supplies the timings. |
| `kb-prohibited-items.md` | "Can I bring X in my bag?" ⚠️ *Structure only* — official list must be loaded first. |
| `kb-frequent-flyer.md` | "Do you have a loyalty programme?" ⚠️ *Structure only* — programme mechanics needed. |
| `kb-children-infants.md` | "Travelling with a baby or child — seats, baggage, unaccompanied minors?" |
| `kb-special-assistance.md` | "I need wheelchair / medical / oxygen help." **Deliberately hands everything to a human** (safety). |
| `kb-weather-delays.md` | "What happens if weather delays my bush flight?" Sets expectations generally; live disruptions go to a human. |

## Contents

```
kb/      12 knowledge base documents (markdown, ~5,600 words)
seed/    11 seed data CSVs (generated)
scripts/ generate_seed.py — reproducible generator with 20 assertions
SPEC-CORRECTIONS.md
README.md
```

## Regenerating seed data

```bash
cd scripts
python3 generate_seed.py --demo-date 2026-08-11 --out ../seed
```

Set `--demo-date` to the actual demo date. Everything is generated relative to it, so the data never goes stale. The script asserts all 20 demo-skew conditions and exits non-zero on any failure.

**If an assertion fails, fix the generator — do not relax the assertion.** Each one underwrites a specific moment in the demo.

## The knowledge base

| File | Status |
|---|---|
| `kb-baggage.md` | Primary-sourced and complete. The most-read file. |
| `kb-about.md` | Primary-sourced. |
| `kb-destinations.md` | Primary-sourced; airstrip codes need Ops confirmation. |
| `kb-wilson-airport.md` | Partial — transfer timings and lounge rules need verification. |
| `kb-charters.md` | Structure complete; process needs confirmation. |
| `kb-codeshare-kq.md` | Partial — through-baggage handling unverified. |
| `kb-check-in.md` | **Structure only.** All timings need Safarilink input. |
| `kb-prohibited-items.md` | **Structure only.** Official list must be loaded. |
| `kb-frequent-flyer.md` | **Structure only.** Programme mechanics needed. |
| `kb-children-infants.md` | Partial — infant baggage confirmed, age bands not. |
| `kb-special-assistance.md` | Deliberately hands off everything. |
| `kb-weather-delays.md` | General context; disruption policy needs confirmation. |

The four `structure only` files are intentional. Each contains a `[VERIFY]` block listing exactly what Safarilink must supply, and instructions telling the bot to hand off rather than answer until populated. Extract every `[VERIFY]` marker into a questionnaire for the client meeting:

```bash
grep -rn "\[VERIFY" kb/ | sed 's/`//g'
```

## The one architectural rule

> Any fact that can change lives **only** behind a tool, and is deleted from the knowledge base.

No schedule, fare, seat count, booking detail or flight status appears in any KB file. `kb-destinations.md` describes places, not timetables. This is enforced by assertion in the generator and must be enforced in review of any KB edit.

## Demo beats the data supports

| Beat | Condition |
|---|---|
| 2am baggage question answered instantly | `kb-baggage.md`, no tool call |
| Diani is a 20kg exception, not the 15kg standard | route `WIL-UKA` = 20kg |
| Booking lookup returns a real itinerary | PNR `XKPT4M` / Whitfield, F2-142 |
| Per-segment allowance, not a global constant | allowance resolved from route |
| Flight is nearly full — genuine urgency | 3 seats remaining |
| Bot refuses to change a booking, hands off | `RM9K2T` / Osborne |
| Failed auth reveals nothing | wrong surname on `XKPT4M` |
| Off-network handled honestly | Kigali absent from `airports` |
| "41% of your inbound is out of hours" | 800 seeded conversations |
| "A quarter of everything is baggage" | intent distribution |

## For the Claude Code stage

Still to produce: the same package for Sai Office and Ramco Printing, then repo assembly.

**On website mirrors:** build lightweight styled replicas of the key pages from each company's brand — colours, type, layout — with the Ribbo widget embedded. Do not scrape mirrors. They break, they pull in assets you do not control, they are slow, they look worse in a live demo, and they raise a terms-of-service question you do not need in a sales conversation. A clean three-page mockup per company is faster to build and better to present.
