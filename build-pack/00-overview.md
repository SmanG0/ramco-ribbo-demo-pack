# Ramco Group — Ribbo AI Demo Build Pack

Build specification for three demonstration chatbots for Ramco Group of Companies (Nairobi, Kenya). Prepared by Kitstek.

---

## What this is

Ramco Group is a Kenyan conglomerate: 40+ operating companies, ~4,500 staff, ~USD 320M revenue, six named holding verticals, operating in Kenya, Tanzania, Uganda and Rwanda.

We are building **three demonstration bots**, one from each of three different verticals, to prove that Ribbo is a platform rather than a point solution. Each bot deliberately uses a **different agent pattern**:

| Build | Company | Vertical | Agent pattern |
|---|---|---|---|
| 02 | Sai Office Supplies | Kora — Office & IT | Lookup and transact |
| 03 | Ramco Printing Works | Plexus — Print & Packaging | Structured capture |
| 04 | Safarilink Aviation | Oritsu — Services & Trading | Inventory query + identity verification |

If all three ran on the same pattern the demo would prove nothing. The differences are the point.

---

## Build order

1. `01-shared-spine.md` — build this first, completely. Roughly 70% of total effort. Do not start a company build until the spine passes its acceptance checklist.
2. `02-sai-office.md`
3. `03-ramco-printing.md`
4. `04-safarilink.md`

Each company spec is self-contained after the spine exists. They can be built in parallel by separate agents.

---

## Global conventions — apply to all three

### The one rule that overrides everything

> **Any fact that can change lives ONLY behind a tool, and is deleted from the knowledge base.**

This is not stylistic. A previous Kitstek deployment (KTDA) hallucinated because the same fact existed in both a knowledge base document and a data path, and the model answered from the stale copy. Every knowledge base document in this pack has been written to exclude volatile data. Do not add schedules, prices, stock levels or statuses to any `.md` knowledge base file.

### Dates

**Never hardcode dates in seed data.** Define a single constant:

```
DEMO_DATE = <the date the demo will be given>
```

Generate all seed data relative to `DEMO_DATE`. Every spec below expresses dates as offsets (`DEMO_DATE - 35d`, `DEMO_DATE + 22d`). A demo that breaks because the data went stale is an avoidable embarrassment.

### Currency and locale

- Kenya: KES, English default, Swahili available
- Tanzania: TZS, Swahili default, English available
- Uganda: UGX, English
- Rwanda: RWF, English/Kinyarwanda

Format currency with thousands separators and no decimals for KES/TZS/UGX (e.g. `KES 61,180`).

### Naming conventions

- Tables: `snake_case`, plural (`order_lines`)
- Tools: `snake_case`, verb-first (`get_order_status`)
- Knowledge base files: `kb-<topic>.md`
- Seed data: `seed-<table>.csv`
- Tenant identifiers: `sai-ke`, `sai-tz`, `ramco-printing`, `safarilink`

### Stack

- **Serving DB:** Supabase (Postgres). Row-level security enabled on every table containing customer data.
- **Conversation layer:** Ribbo
- **Channel:** WhatsApp Business API
- **Tool transport:** Supabase Edge Functions (Deno) exposing typed HTTP endpoints
- **Do not** put Snowflake anywhere in the serving path. It is a phase-two analytics layer only.

### What NOT to build

- No booking/order writes without an explicit confirmation step
- No Tier 3 writes at all for Safarilink
- No live third-party API calls during the demo (see `04-safarilink.md`, section on flight tracking APIs)
- No admin UI. This is a demo, not a product.

---

## Demo data philosophy

Seed data is **not** filler. It is stage dressing engineered to make specific things happen during the demo. Each company spec contains a **Data skew** section that states exactly which conditions the data must produce.

General principles:

1. **Every demo query must have a satisfying answer.** Rehearsed paths must return rich, specific results — never empty sets, never "I found nothing."
2. **Plant one visible problem per demo.** Something the bot surfaces that the customer did not ask about, which makes them look at their own operation differently. These are specified per company.
3. **Create mild time pressure.** Deadlines near, stock low, seats limited. Urgency makes a demo feel alive. Overdo it and it looks fabricated — one or two pressure points per demo, not five.
4. **Seed enough volume for aggregate claims.** If we want to say "2.1 days average lost to proof approval," the data must actually contain 200+ jobs that produce that number when queried.
5. **Include one graceful failure.** Rehearse a question the bot correctly declines or escalates. A bot that appears omniscient is less trustworthy than one with visible, sensible limits.

---

## Acceptance — the whole pack

The build is done when:

- [ ] All three bots run on the same spine with no company-specific code in shared components
- [ ] Switching tenant changes language, currency, catalogue and bot identity with no redeploy
- [ ] Every tool returns within 800ms at p95
- [ ] Every authenticated tool is provably isolated (test: account A cannot retrieve account B's pricing)
- [ ] Each demo script runs start to finish without intervention, three times consecutively
- [ ] Each bot has a rehearsed graceful failure
- [ ] No volatile fact appears in any knowledge base file
