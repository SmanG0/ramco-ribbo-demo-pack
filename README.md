# Ramco Group — Ribbo AI Demo Build Pack

Everything needed to build **four** demonstration WhatsApp chatbots for **Ramco Group**
(Nairobi conglomerate — 40+ companies, ~4,500 staff, ~USD 320M revenue, operating across
Kenya, Tanzania, Uganda and Rwanda). Prepared by Kitstek.

The four bots each run a **different agent pattern** on **one shared platform**, across **four of
Ramco's six verticals**. That is the whole point of the demo: to prove Ribbo is a platform, not a
point solution. If all four ran the same way, the demo would prove nothing.

> ### 👉 Start with two files:
> - **[`TALK-TRACK.md`](TALK-TRACK.md)** — the positioning: *why* it's **four unique implementations**,
>   the demo quality bar, the running order, and the exact language to use (and avoid) in the room.
> - **[`DEMO-FLOWS.md`](DEMO-FLOWS.md)** — plain-English, no-assumptions walkthrough of each bot: the
>   exact conversation to show and what each moment proves.
>
> This README below is the *build* reference (where files live, what's corrected, how to run things).
> `TALK-TRACK.md` is *why and how we present it*; `DEMO-FLOWS.md` is *what each bot does*.

**The framing in one line:** four **unique agent implementations**, each purpose-built for a different
Ramco business — proof that we can build the right agent for *any* of them, fast. Not one bot shown
four times.

| Bot | Company | Vertical | Agent pattern | Package status |
|---|---|---|---|---|
| 02 | Sai Office Supplies | Kora — Office & IT | Lookup and transact | ✅ **ready** |
| 03 | Ramco Printing Works | Plexus — Print & Packaging | Structured capture | ✅ **ready** |
| 04 | Safarilink Aviation | Oritsu — Services & Trading | Inventory query + identity verification | ✅ **ready** |
| — | Kitchens & Beyond | Ekon — Building Materials | Consultative qualification + appointment booking | ✅ **ready** |

All four packages are delivered. Each `companies/<name>/` folder is complete and includes a
`site-mirror/` — the company's real homepage + one more page, mirrored for offline use, for
dropping the Ribbo widget onto (see "Website mirrors" below).

> **Kitchens & Beyond replaces the originally-suggested Kentainers.** Ramco **exited Kentainers in
> 2023** — do not build it. See `companies/kitchens-beyond/RATIONALE.md`. K&B has **no spec file** in
> `build-pack/` (it wasn't in the original pack); build it from its package README + `RATIONALE.md`.
> Put this bot **last** in the demo — it's the only one that *makes* money rather than saving it.

---

## Start here (build order)

Do these in order. **Do not start a company bot until the shared spine passes its acceptance checklist** — every bot depends on it.

1. **`build-pack/00-overview.md`** — read first. Global conventions that apply to all four bots.
2. **`build-pack/01-shared-spine.md`** — build this completely. ~70% of total effort (4–5 eng days). Multi-tenant WhatsApp platform, Postgres schema, tool router, RLS isolation, auth. No company-specific code lives here.
3. Then each company, in any order (they're independent once the spine exists):
   - **Safarilink** → spec `build-pack/04-safarilink.md` + package `companies/safarilink/` ✅
   - **Sai Office** → spec `build-pack/02-sai-office.md` + package `companies/sai-office/` ✅
   - **Ramco Printing** → spec `build-pack/03-ramco-printing.md` + package `companies/ramco-printing/` ✅
   - **Kitchens & Beyond** → **no spec** — package `companies/kitchens-beyond/` (README + `RATIONALE.md`) ✅ — **demo this one last**

---

## Repo map

```
README.md                     ← you are here
build-pack/                   ← the specs (what to build) — note: no spec for Kitchens & Beyond
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
    site-mirror/                real homepage + About, mirrored offline (widget target)
  sai-office/     ✅ READY
    README.md                   package guide + demo beats the data supports
    SPEC-CORRECTIONS.md         ⚠️ SUPERSEDES parts of 02-sai-office.md — read before building
    kb/                         7 knowledge base docs (markdown)
    seed/                       14 seed CSVs (generated)
    scripts/generate_seed.py    reproducible generator, 26 assertions
    site-mirror/                real homepage + Contact, mirrored offline (widget target)
  ramco-printing/ ✅ READY
    README.md                   package guide + demo beats the data supports
    SPEC-CORRECTIONS.md         additive — spec was materially correct; new facts only
    kb/                         9 knowledge base docs (markdown)
    seed/                       9 seed CSVs (generated)
    scripts/generate_seed.py    reproducible generator, 19 assertions
    site-mirror/                real homepage + The Company, mirrored offline (widget target)
  kitchens-beyond/ ✅ READY   (no build-pack spec — built from source)
    README.md                   package guide + demo beats the data supports
    RATIONALE.md                why K&B, and why NOT Kentainers (Ramco exited it 2023)
    kb/                         8 knowledge base docs (markdown)
    seed/                       9 seed CSVs (generated)
    scripts/generate_seed.py    reproducible generator, 25 assertions
    site-mirror/                real homepage + About Us, mirrored offline (widget target)
DEMO-FLOWS.md                 ← plain-English: what each bot is + exact demo to show
MIRRORS.md                    ← how the site mirrors were made / how to refresh
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

## ⚠️ Sai Office: the spec under-described the business

`companies/sai-office/SPEC-CORRECTIONS.md` **supersedes `build-pack/02-sai-office.md`**. This isn't
detail-fixing — the spec treated Sai Office as a consumables reseller. It is a **seven-line operation**,
and two of the best demo beats only exist once you know that:

| Wrong / missing in spec | Correct |
|---|---|
| Toner/paper/stationery reseller | **Seven lines:** IT & automation, stationery, furniture, **solar**, **cooling/AC**, **printer & copier leasing**, **authorised Epson/APC service centre** |
| — | **Repair-job status** beat ("your printer's been ready since Tuesday") — from the service centre |
| — | **Lease & meter queries** beat — from Office Technologies leasing |
| Published list price → contract price on auth | **No prices published anywhere** (quote-request form). New beat: *anonymous enquiry → captured lead* vs *recognised account → contract price* |
| Brands incl. Konica Minolta, Hisense, Nataraj | Those **do not appear**; corrected brand list in the doc |
| Delivery unspecified | **48-hour delivery** is a published SLA the bot can state |

The `products` table deliberately has **no `list_price` column** (asserted in the generator) — price
lives only in `price_lists`, per account.

---

## ✅ Ramco Printing: spec is correct — corrections are additive

`companies/ramco-printing/SPEC-CORRECTIONS.md` did **not** need to fix the spec — the four divisions
(UNO/DUO/HEX/IX), 650+ staff and 160,000 sq ft are all confirmed. Two additions change the build:

| New fact | Why it matters |
|---|---|
| **Two physical sites, split by division** | UNO → Dunga Close/Industrial Area (+ showroom); DUO/HEX/IX → Ramco Industrial Park, Mombasa Road. **Collection site depends on which division holds the job** — opposite sides of Nairobi. `collection_site` is a column on `jobs`. |
| **M-PESA + "Apply for Credit" are published** | A real payment path and an account-opening lead-capture flow the bot can route into. |
| **ISO 9001:2015 certified** | Job statuses/stages exist formally — de-risks the Tier 2 job-status integration. |

**Open item:** 6 of the 18 division-routing examples in `kb-divisions.md` are genuinely ambiguous
(catalogues, product labels, **branded notebooks**, annual reports, presentation folders, books
needing binding) — take them to the client meeting. Settle **branded notebooks** first; it's the
opening enquiry in the demo. And read **section 13** of the spec (the estimator who challenges
automated quoting) before demoing.

---

## ⚠️ Kitchens & Beyond: the fourth bot — and NOT Kentainers

The original pack suggested **Kentainers** as an optional fourth. **Do not build it — Ramco exited
Kentainers in 2023** (Vantage Capital buy-out of Aquasantec; the Ramco/family shareholding was sold).
Both kentainers.co.ke and ramco-group.com are stale on this. Pitching a family conglomerate a demo
built on a business they sold three years ago would burn the credibility the other three buy.

**Kitchens & Beyond** (Ramco **Ekon** — building materials, the heritage vertical) replaces it, and is
verified current (ramco-group.com, kitchensandbeyond.co.ke). It has **no spec file** — build from
`companies/kitchens-beyond/README.md` + `RATIONALE.md`. Why it's the right fourth:

| | |
|---|---|
| **New agent pattern** | Consultative qualification + **appointment booking**. Its write action is a **calendar slot**, not an order — nothing else in the demo books anything. |
| **The only revenue bot** | The other three save money (deflection). This one makes it: an 11pm luxury-kitchen browser is peak-intent with nobody at the showroom. Qualify → capture brief → book the visit. **Demo it last.** |
| **One fact worth owning** | *No product in the range carries a warranty under ten years.* Answers the quality objection in one line — without quoting a price. |
| **No prices** | Like Sai Office, K&B publishes none. The generator asserts no seeded table has a price field. |

**The close for the whole demo:** three of the four bots surface the *same* planted problem from
unrelated businesses — Ramco Printing (job waiting on the client's proof approval), Sai Office (a
repair waiting on collection / a quote waiting on a yes), Kitchens & Beyond (an installation waiting
on the client's tile selection). One line: *"In every one of your businesses, the same kind of
problem is hiding, and the same kind of agent catches it."* Land the versatility and the speed of
building — let them pick which business to start with. (See `TALK-TRACK.md` for the full positioning
and the say/don't-say language.)

---

## `[VERIFY]` markers = the client questionnaire

The KBs contain 30+ `[VERIFY]` markers. That is **not** incompleteness — it's the honest boundary
of what's publicly knowable (check-in windows, frequent-flyer mechanics, special assistance,
prohibited items). Four Safarilink KB files are deliberately "structure only": the bot hands off
rather than inventing an answer until the client fills them in.

Sai Office has the same pattern — B2B distributors don't publish credit terms, discount bands or
returns policy, so `kb-accounts-and-ordering.md` is structured as the client questionnaire.

Pull the full list into a questionnaire to take to each client meeting:
```bash
grep -rn "\[VERIFY" companies/*/kb/ | sed 's/`//g'
```
Asking an airline precise operational questions is a far better first impression than a bot that
confidently invented the answers.

---

## Website mirrors — drop the widget on and demo

Each company has an **offline mirror of two real pages** (homepage + one more), captured with all
assets so they render without internet. These are for embedding the Ribbo chat widget and showing
the client what it looks like on *their own site*.

| Company | Open these files |
|---|---|
| Safarilink | `companies/safarilink/site-mirror/flysafarilink.com/index.html` · `…/about-us/about.html` |
| Sai Office | `companies/sai-office/site-mirror/www.sai-office.com/kenya/index.html` · `…/kenya/contact-us/index.html` |
| Ramco Printing | `companies/ramco-printing/site-mirror/www.ramcoprinting.com/index.html` · `…/the-company.html` |
| Kitchens & Beyond | `companies/kitchens-beyond/site-mirror/kitchensandbeyond.co.ke/index.html` · `…/about-us.html` |

**To add the widget:** open a mirror's `index.html` in an editor, paste the Ribbo embed snippet just
before `</body>`, save, and open the file in a browser. The widget loads live from Ribbo over the
page's static copy — exactly what the client would see on production.

```html
    <!-- Ribbo widget — paste your embed snippet here, then reload the page -->
    <script src="https://widget.ribbo.ai/embed.js" data-bot-id="YOUR_BOT_ID" defer></script>
  </body>
```

Notes:
- These are **static snapshots** — forms, booking and live data won't work, and that's fine; the
  point is the widget over a realistic page. Some third-party embeds (Google Maps, fonts) may not
  render offline.
- Mirrored on 25 Jul 2026. To refresh a page, re-run the mirror command in `MIRRORS.md`.
- ⚠️ These are copies of the companies' live sites, for **internal demo use only** — don't
  redistribute or host them publicly. (The package READMEs originally advised styled replicas over
  mirrors; real mirrors were used here by request for a faster, pixel-accurate widget preview.)

---

## Acceptance — the whole pack is done when

- [ ] All four bots run on the same spine with no company-specific code in shared components
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
