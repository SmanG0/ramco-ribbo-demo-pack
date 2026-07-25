# Talk track — how to present this, and why it's built this way

This is the presentation bible for the Ramco demo. It explains the framing we chose, why we chose
it, the quality bar the demo has to clear, and the exact language to use in the room. Read it with
`DEMO-FLOWS.md` (the step-by-step of each bot).

---

## The framing: four unique implementations

We are showing **four unique agent implementations** — each purpose-built for a genuinely different
business, doing a genuinely different job. **Not one bot shown four times. Four different shapes of
agent.**

| # | Business | Shape of agent | What it *does* (write action) | Audience |
|---|---|---|---|---|
| 1 | Safarilink | **Lookup + identity verification** | Nothing — verifies, then hands off | B2C |
| 2 | Sai Office | **Lookup + transact** | Places an order / emits a ready ticket | B2B |
| 3 | Ramco Printing | **Structured capture** | Builds a complete brief + takes an approval | B2B |
| 4 | Kitchens & Beyond | **Consultative qualify + book** | Books a showroom appointment | B2C |

Four different jobs. Three different write actions plus one that deliberately doesn't write. Both
consumer and business. That spread **is** the point.

---

## Why this framing (and not "one impressive bot")

**The trap:** build one slick bot and the room thinks *"nice tool."* A single demo, however good,
reads as a point solution — a thing that does one thing.

**The move:** show four, each different, and the room thinks *"they can build the right agent for
any of our businesses."* Versatility is the product we're actually selling.

**Why we can afford to show four:** building an agent is **fast and cheap for us** — the knowledge
base, the tool router, the tools, and the testing are quick to stand up and quick to validate. So
four bespoke agents isn't four times the pain it sounds like; it's the demonstration that we can
spin up a correct, tailored agent for a new business in short order. **The speed and low cost of
building is itself part of the pitch.**

**What we are *not* doing:** we are **not** fully building out production systems for four companies.
We are capturing the **ideal scenario** for each use case and demoing that cleanly and correctly.
These are high-fidelity, rehearsed demos on seeded data — not shipped products. Be honest about that
if asked; the point being proven is *"we can build the right thing, fast,"* not *"these four are
live today."*

---

## The one thing the demo must prove

> Whatever the business, whatever the customer, we can build the **right** agent for it — quickly and
> correctly. Here are four completely different ones as proof.

Everything you say should ladder up to that sentence.

---

## Language — say this, not that

**Say:**
- "Four unique implementations — each purpose-built for a different business."
- "A different *shape* of agent each time: one looks up and verifies, one transacts, one captures a
  full spec, one qualifies and books."
- "Building one of these is fast and cheap for us, so we can do it for any of your businesses."
- "It's an **agent** — it doesn't just answer, it *does* something: places the order, books the
  visit, unblocks the job."
- "It knows when to **stop** and hand to a person." (This is a feature — say it with pride.)
- "Everything that can change comes from a live lookup — it never guesses a price or a time."

**Don't say:**
- ❌ "Group agreement" / "sign a group deal." Too salesy, and premature. Let the versatility make the
  argument; let them raise commercial scope.
- ❌ "Chatbot." Undersells it — these are agents that take actions.
- ❌ "It replaces your staff / your estimators." Say instead: *it frees them from the repetitive work
  and hands them complete, ready-to-action tickets.*
- ❌ Anything implying it's live in production, or that data is real-time from their systems today.

---

## The quality bar — what a good demo looks like

The idea is proven. From here the demo **lives or dies on execution.** Non-negotiables:

1. **Rehearsed end to end, three times clean.** No dead ends. Every rehearsed question returns a
   rich, specific answer — **never an empty result, never "I found nothing."**
2. **The "aha" beat lands, then you say the number.** Right after the hero moment, drop the stat:
   *"2.3 days average lost to proof approval"*, *"9 accounts overdue right now"*, *"44% of enquiries
   arrive out of hours."* The moment sets it up; the number closes it.
3. **Show the graceful limit in every bot.** The bot declining and handing off (wrong surname reveals
   nothing; won't quote custom print; refers an under-budget lead out) builds more trust than a bot
   that pretends to know everything. Rehearse these on purpose.
4. **Speed where speed is the point.** The instant knowledge answers must be instant — Safarilink's
   2am baggage reply is sub-second, no lookup.
5. **Show the structured output on screen.** The Sai Office order/lead ticket and the Ramco Printing
   brief are proof the agent *produces* something — put them on screen, don't just describe them.
6. **Prove identity/privacy at least once.** Wrong surname reveals nothing; an unknown number gets
   list price only, never another account's pricing.
7. **Set the scene out loud, every time.** *"It's 2am in Nairobi."* *"It's 11pm and they're browsing
   Italian kitchens."* Context is what makes the moment land.
8. **One bot at a time, clean transitions.** Don't blur them — the whole point is that they're
   different. Name the shape each time.
9. **Seeded data only — no live third-party APIs in the demo.** (See Safarilink spec §11 on flight
   tracking: demoing their own data from a third party undercuts the whole argument.)

If a beat can't clear this bar, cut it. A tight three-beat demo that never stumbles beats a
five-beat demo with one dead end.

---

## The running order (and why)

**Safarilink → Sai Office → Ramco Printing → Kitchens & Beyond.**

- **Safarilink first** — the most relatable, lowest-stakes to follow ("it's 2am, someone's asking
  about luggage"). Warms the room and establishes the always-on, knows-its-limits character.
- **Sai Office** — efficiency and catching silent churn; introduces identity and a real transaction.
- **Ramco Printing** — the strongest single beat (a job stuck waiting on the customer); introduces
  structured capture and the "get paid faster" angle.
- **Kitchens & Beyond last** — the only one that *makes* money rather than saving it. Three that save,
  then one that grows. End on that note.

Each is a different agent doing a different job correctly. That sequence *is* the versatility
argument, delivered live.

---

## The ideal run per bot (the hero moment to rehearse toward)

Full turn-by-turn is in `DEMO-FLOWS.md`. These are the ideal outcomes — the target for a clean run.

- **Safarilink.** 2am baggage question answered instantly and correctly; booking revealed only after
  the surname checks out; the flight-change request logged and handed off, not actioned. *A correct,
  safe answer when no one's at the desk — and it knows what not to touch.*
- **Sai Office.** Recognises Grace, flags she's overdue, finds stock at another branch, prices at her
  contract rate, places the order on a PIN, and drops a **complete order ticket** to the sales team.
  *One touch instead of five — and it spots the customers about to run dry.*
- **Ramco Printing.** Routes a vague enquiry to the right division, builds a **complete brief** in one
  pass, and tells an existing customer their job has been **stuck three days waiting on their own
  approval** — then unblocks it. *It turns a conversation into a ready order, and gets stalled jobs
  moving.*
- **Kitchens & Beyond.** Catches an 11pm luxury browser, qualifies them instead of quoting, and
  **books the showroom visit** with the designer briefed — before they shop around. *It converts
  a late-night browser into a booked, qualified appointment.*

---

## How to close (without overreaching)

Three of the four bots surface the **same hidden problem** from unrelated businesses — a print proof,
a finished repair, a kitchen tile selection — all *work sitting still, waiting on the company's own
customer, with nobody telling them.*

> "In every one of your businesses, the same kind of problem is hiding — and the same kind of agent
> catches it. Pick the business you'd want to start with, and we'll have an agent built for it faster
> than you'd expect."

Land the versatility and the speed. Let **them** raise how far they want to take it — don't push a
scope in the room.
