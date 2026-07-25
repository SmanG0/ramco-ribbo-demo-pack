# Ramco Group — Ribbo AI Demo Build Pack

Everything needed to build three demonstration WhatsApp chatbots for **Ramco Group**
(Nairobi conglomerate — 40+ companies, ~4,500 staff, ~USD 320M revenue, operating across
Kenya, Tanzania, Uganda and Rwanda). Prepared by Kitstek.

The three bots each run a **different agent pattern** on **one shared platform**. That is the
whole point of the demo: to prove Ribbo is a platform, not a point solution. If all three ran
the same way, the demo would prove nothing.

| Bot | Company | Vertical | Agent pattern | Package status |
|---|---|---|---|---|
| 02 | Sai Office Supplies | Kora — Office & IT | Lookup and transact | ⏳ **pending** |
| 03 | Ramco Printing Works | Plexus — Print & Packaging | Structured capture | ⏳ **pending** |
| 04 | Safarilink Aviation | Oritsu — Services & Trading | Inventory query + identity verification | ✅ **ready** |

---

## Start here (build order)

Do these in order. **Do not start a company bot until the shared spine passes its acceptance checklist** — every bot depends on it.

1. **`build-pack/00-overview.md`** — read first. Global conventions that apply to all three bots.
2. **`build-pack/01-shared-spine.md`** — build this completely. ~70% of total effort (4–5 eng days). Multi-tenant WhatsApp platform, Postgres schema, tool router, RLS isolation, auth. No company-specific code lives here.
3. Then each company, in any order (they're independent once the spine exists):
   - **Safarilink** → spec `build-pack/04-safarilink.md` + package `companies/safarilink/` ✅ ready to build now
   - **Sai Office** → spec `build-pack/02-sai-office.md` (package pending)
   - **Ramco Printing** → spec `build-pack/03-ramco-printing.md` (package pending)

---

## Repo map

```
README.md                     ← you are here
build-pack/                   ← the specs (what to build)
  00-overview.md                global conventions + acceptance for the whole pack
  01-shared-spine.md            the shared platform — BUILD FIRST
  02-sai-office.md              Sai Office spec
  03-ramco-printing.md          Ramco Printing spec
  04-safarilink.md              Safarilink spec  ⚠️ see its corrections doc
companies/                    ← the deliverables (KBs + data to build with)
  safarilink/     ✅ READY
    README.md                   package guide + demo beats the data supports
    SPEC-CORRECTIONS.md         ⚠️ SUPERSEDES parts of 04-safarilink.md — read before building
    kb/                         12 knowledge base docs (markdown)
    seed/                       11 seed CSVs (generated)
    scripts/generate_seed.py    reproducible generator, 20 assertions
  sai-office/     ⏳ pending
  ramco-printing/ ⏳ pending
```

**Specs** (`build-pack/`) tell you *what to build*. **Packages** (`companies/`) give you the
*content and data* to build it with. For each bot, read its spec and its package README together.

---

## Three rules that override everything

**1. Any fact that can change lives ONLY behind a tool, and is deleted from the knowledge base.**
No schedules, prices, stock levels, seat counts, statuses or booking details in any `.md` KB file.
(A previous Kitstek deployment hallucinated because a fact existed in both a KB doc and a data
path, and the model answered from the stale copy. The Safarilink generator enforces this with an
assertion; enforce it in review of every KB edit.)

**2. Never hardcode dates. Everything is relative to one `DEMO_DATE`.**
Set it to the actual demo date and generate all seed data from it, so the data never goes stale:
```bash
cd companies/safarilink/scripts
python3 generate_seed.py --demo-date 2026-08-11 --out ../seed
```
The generator asserts all 20 demo-skew conditions and exits non-zero on any failure.
**If an assertion fails, fix the generator — never relax the assertion.** Each one underwrites a
specific moment in the live demo.

**3. Where the spec and a `SPEC-CORRECTIONS.md` disagree, the correction wins.**
During KB authoring, several "facts" in the specs turned out to be wrong (drawn from
contradictory third-party sites). Those are recorded, not quietly patched — see below.

---

## ⚠️ Safarilink: the spec has been corrected in 5 places

`companies/safarilink/SPEC-CORRECTIONS.md` **supersedes `build-pack/04-safarilink.md`** where they
conflict. The spec file now carries a banner at the top, but in short:

| Wrong in spec | Correct |
|---|---|
| ~12 aircraft | **15 aircraft**, 18 destinations, 250+ staff |
| Entebbe = off-network failure test | **Entebbe is served.** Off-network test is now **Kigali (KGL)** |
| 20kg on Zanzibar, Kisumu, Kitale, Diani, Lodwar | 20kg on **Zanzibar, Kisumu, Diani, Lamu, Malindi, Entebbe, Mombasa** |
| Max bag dimensions 90×65×35cm | **Not published — do not state any dimension limit** |
| Kitale, Lodwar in the network | Not served. **Tsavo West (Kilaguni)** is. |

Build from the corrected figures, not the ones in sections 1, 4 and 6 of the spec.

---

## `[VERIFY]` markers = the client questionnaire

The KBs contain 30+ `[VERIFY]` markers. That is **not** incompleteness — it's the honest boundary
of what's publicly knowable (check-in windows, frequent-flyer mechanics, special assistance,
prohibited items). Four Safarilink KB files are deliberately "structure only": the bot hands off
rather than inventing an answer until the client fills them in.

Pull the full list into a questionnaire to take to each client meeting:
```bash
grep -rn "\[VERIFY" companies/safarilink/kb/ | sed 's/`//g'
```
Asking an airline precise operational questions is a far better first impression than a bot that
confidently invented the answers.

---

## Website mockups (per company)

Build a lightweight styled replica of ~3 key pages per company's brand — colours, type, layout —
with the Ribbo widget embedded. **Do not scrape live site mirrors:** they break, pull in assets you
don't control, are slow, look worse live, and raise a needless ToS question in a sales conversation.
A clean three-page mockup is faster to build and better to present.

---

## Acceptance — the whole pack is done when

- [ ] All three bots run on the same spine with no company-specific code in shared components
- [ ] Switching tenant changes language, currency, catalogue and bot identity with no redeploy
- [ ] Every tool returns within 800ms at p95
- [ ] Every authenticated tool is provably isolated (account A cannot retrieve account B's data)
- [ ] Each demo script runs start to finish without intervention, three times consecutively
- [ ] Each bot has a rehearsed graceful failure
- [ ] No volatile fact appears in any knowledge base file

---

## Stack (from the spec — don't substitute)

- **Serving DB:** Supabase (Postgres), row-level security on every table with customer data
- **Conversation layer:** Ribbo
- **Channel:** WhatsApp Business API
- **Tool transport:** Supabase Edge Functions (Deno), typed HTTP endpoints
- **No Snowflake in the serving path** — it's a phase-two analytics layer only
- **No admin UI** — this is a demo, not a product
