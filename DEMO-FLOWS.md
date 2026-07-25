# What each bot does and what to show — in plain English

Read this before anything else. No prior knowledge assumed. If you only read one file, read this one.

---

## The big picture (read this first)

We are building **three little assistants that live inside WhatsApp.**

A customer opens WhatsApp — the same app they text friends on — and messages a company's number.
An assistant answers **instantly, any time of day or night**, using that company's **real
information**. It can look things up, and it can get things done (place an order, log a repair,
book-in a print job).

We are building **three** of these, for **three different Ramco companies**. Ramco owns 40+
companies, and we want to prove that Ribbo works for **any** of them — not just one. So we picked
three companies that need **three different kinds of assistant**, to show the range:

| # | Company | What the customer wants | The kind of assistant it shows off |
|---|---|---|---|
| 1 | **Safarilink** (safari airline) | "What can I bring? Where's my flight?" | **Looks things up + checks who you are** before showing private booking info |
| 2 | **Sai Office** (office supplies) | "Reorder my usual stuff" | **Does a task for you** — checks your price, checks stock, places the order |
| 3 | **Ramco Printing** (printing works) | "Quote my print job / where is it?" | **Asks the right questions** to build a complete order, and chases nothing |

**Why three different ones?** If all three assistants did the same thing, the demo would prove
nothing. The whole point is: *"Look — same platform, three totally different jobs. We can do this
for your whole group."*

### A few words we use

- **Bot / assistant** — the thing that reads the WhatsApp message and writes back.
- **Knowledge base (KB)** — a folder of plain documents with facts that *don't change* (policies,
  "what is a bush airstrip", "how proofing works"). The bot reads these to answer general questions.
- **Tool** — a live lookup or action. Anything that *can change* (a price, a stock number, a flight
  time, your booking) is **never** written in a document — the bot must call a tool to fetch it
  fresh. This is the one rule that matters most: it stops the bot from repeating stale/wrong facts.
- **"Recognises your number"** — on WhatsApp, your phone number *is* your identity. If the number is
  known, the bot can safely show that person's own account. If not, it stays generic.
- **Hand off** — the bot stops and passes you to a human. Knowing when to stop is a feature, not a
  failure.

Each demo also has **one planted "aha" moment** (the thing that makes the client sit up) and **one
moment where the bot politely says "I can't do that"** (which builds trust — a bot that pretends to
know everything is scarier than one with sensible limits).

---

## Bot 1 — Safarilink (the safari airline)

**What it is:** an assistant for travellers flying on safari. Most are tourists in other time zones,
messaging at 2am the night before a trip, nervous, asking simple questions when no one is at the
desk.

**The one thing it proves:** the bot answers general questions instantly from the knowledge base,
and — only after checking who you are — shows your *private* booking details safely.

### The exact demo (say out loud: "it's 2:14am in Nairobi, the office is closed")

| Step | The traveller types… | The bot does… | What to point at on screen |
|---|---|---|---|
| 1 | "how much luggage can I take to Diani?" | Answers from the KB, **no lookup needed**, in under a second: 20kg — and explains that's *more* than the normal 15kg. | "Nobody is awake at the airline. It just answered, correctly, at 2am." |
| 2 | "it's XKPT4M, Whitfield" (their booking code + surname) | Checks the pair matches, then pulls their real trip: flight F2-142, Wilson→Ukunda, the date, times, 2 passengers at 20kg each. | "It only showed the private booking *after* it confirmed identity." |
| 3 | "can I move it to the morning before?" | **Does NOT change the flight.** It writes the request down, says a colleague will confirm, and hands off. | "Watch — it refuses to touch the booking. With an airline, showing the limit is what earns trust." |
| 4 | (Presenter) repeat step 2 with the **wrong** surname | "That reference and surname don't match." It does **not** reveal whether the code exists. | "It gives nothing away to someone guessing." |

**The aha moment:** step 1 + then say the number — *"20,000 passengers a month at peak, and 41% of
their messages arrive when the desk is closed."* The bot is doing work no human is currently awake
to do.

**The "I can't do that" moment:** ask "do you fly to Kigali?" → it says that's not on the network and
offers a charter or the Kenya Airways partner flight, instead of inventing a flight that doesn't
exist.

---

## Bot 2 — Sai Office (office supplies)

**What it is:** an assistant for company buyers who reorder the **same supplies every month** (toner,
paper, pens). Today that's a phone call to a rep. The bot does it on WhatsApp in under a minute.

**The one thing it proves:** because each company has its **own secret contract price**, this is the
bot that shows **identity and privacy matter** — and it doesn't just answer, it **completes a real
task** (places the order).

### The exact demo (say out loud: "it's 8:40am, a procurement officer named Grace")

| Step | Grace types… | The bot does… | What to point at on screen |
|---|---|---|---|
| 1 | "Morning, can I get the same toner order as last month?" | Recognises her number, pulls her last order, and notices she's **a week overdue** against her own usual cycle. Quotes **her** contract price. | "It flagged she's overdue — *her customers are running out and nobody told them.*" |
| 2 | "Yes, but make it 6 of the HP" | Checks stock: her usual branch only has 4, but another branch (Westlands) has 27. Offers to split or source all from Westlands. | "That's exactly what a great rep does — it didn't just say 'out of stock'." |
| 3 | "All from Westlands is fine" | Builds the draft order, reads back the full basket + total incl. VAT + delivery date, and asks for her PIN. | "Nothing is ordered yet — it reads it back and waits." |
| 4 | "4417" (her PIN) | Places the order, gives the order number and delivery date, and mentions one invoice due in 4 days — once, politely. | "Done. Under 90 seconds, start to finish." |
| 5 | (Switch to a Tanzania number) | The **same bot** now greets in **Swahili**, prices in **Tanzanian shillings**, with the Tanzania catalogue. | "Same platform, different country — no rebuild." |

**The aha moment:** step 1's overdue flag, plus the line *"nine of your accounts are overdue on their
own pattern right now, and nobody has called them."*

**The "I can't do that" moment:** ask "which toner fits a Konica Minolta bizhub C258?" → it gives
general guidance and offers to have someone confirm, instead of guessing a part number (a wrong guess
would ship the wrong toner).

**The privacy proof:** message from an *unknown* number → it only shows public list price, never
Grace's secret contract price.

---

## Bot 3 — Ramco Printing (the printing works)

**What it is:** an assistant for people ordering printing (business cards, notebooks, packaging,
banners). Here's the catch: **you can't look up the price of "5,000 notebooks"** — the price depends
on size, cover, paper, colours, finishing and quantity. So the bot's job is to **ask the right
questions** and build a complete order, then hand a tidy brief to a human estimator.

**The one thing it proves:** the bot turns a vague enquiry into a complete, correctly-routed order —
and it **chases the customer's own to-do list** so jobs stop getting stuck.

### The exact demo (two short conversations)

**Conversation A — a brand-new customer (unknown number):**

| Step | The prospect types… | The bot does… | What to point at |
|---|---|---|---|
| 1 | "I need 5000 branded notebooks for a conference on the 15th" | Works out this belongs to the **HEX** division, then asks 2–3 spec questions (size? cover? logo colours?). | "It's not guessing — it's building a real spec." |
| 2 | "A5 hardcover, full colour logo on the front" | Gives an **indicative price range**, flags the deadline is tight, and saves a quote request for an estimator. | "It captured a complete lead an estimator can act on immediately." |

**Conversation B — an existing customer (known number), named Peter:**

| Step | Peter types… | The bot does… | What to point at |
|---|---|---|---|
| 3 | "where's job 4471?" | Finds the job and **leads with the blocker**: it's been waiting **3 days for Peter's own proof approval**, and dispatch is now at risk. | "The customer is the hold-up — and nobody told him until now." |
| 4 | "oh I didn't see that, can I approve it now?" | Shows him exactly what he's approving and asks him to confirm. | — |
| 5 | "yes approve it" | Confirms he's the authorised approver, approves it, and gives the new dispatch date. | "It just un-stuck a stalled job inside WhatsApp." |

**The aha moment (the strongest in the whole demo):** step 3 — the customer is the bottleneck —
followed by *"across your last 200 jobs, an average of 2.3 days each is lost waiting for proof
approval; on 19 late jobs, that wait was the entire cause."* This reframes the bot from "answers
questions" to **"gets you paid faster."**

**The "I can't do that" moment:** ask for a fancy custom job (die-cut folder, foiling, magnetic
closure) → it captures the full spec but **refuses to quote a number**, because custom work must be
priced by a human. (Important: there will be an estimator in the room who distrusts automated
quoting — leading with this refusal wins them over.)

---

## One line to remember for each

- **Safarilink:** "Answers instantly at 2am, and shows your booking only after checking it's really you."
- **Sai Office:** "Reorders your usual supplies in under a minute, at your price, and spots when you're running low."
- **Ramco Printing:** "Turns a vague print enquiry into a complete order, and tells you when a job is stuck waiting on you."

For the deeper build detail behind each flow (exact data, tools, acceptance tests), see each
company's `build-pack/0X-*.md` spec and `companies/<name>/README.md`.
