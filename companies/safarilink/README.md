# Safarilink Aviation — Ribbo Implementation Package

> **In one line:** an assistant that answers travellers instantly at 2am, and shows a booking only
> after confirming it's really them. **For the plain-English demo walkthrough — the exact
> conversation and what each moment proves — see [`../../DEMO-FLOWS.md`](../../DEMO-FLOWS.md) (Bot 1).**

Package 1 of 3 for the Ramco Group demo. Companion to `04-safarilink.md` in the build spec pack.

**Read `SPEC-CORRECTIONS.md` first.** It supersedes the original spec in five places.

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
