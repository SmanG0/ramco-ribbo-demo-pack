# 03 — Ramco Printing Works

> ✅ **This spec is materially correct** — see `companies/ramco-printing/SPEC-CORRECTIONS.md`. The four divisions (UNO/DUO/HEX/IX), 650+ staff and 160,000 sq ft are all confirmed. The corrections are **additive**, and two of them matter for the build:
> **Two physical sites split by division** — UNO at Dunga Close/Industrial Area (+ showroom); DUO/HEX/IX at Ramco Industrial Park, Mombasa Road. **Collection location depends on which division holds the job** (opposite sides of Nairobi), so `collection_site` is a column on `jobs`. New file `kb-locations.md`.
> **Published payment/credit paths** — M-PESA is live and there's an "Apply for Credit" flow (lead capture). New file `kb-payment-credit.md`. Also ISO 9001:2015 certified (job statuses exist formally). **Settle the 6 `[VERIFY]` division-routing questions with the client** — routing accuracy drives demo quality. And read section 13 (the estimator who challenges automated quoting) before the demo.

**Vertical:** Ramco Plexus (Print & Packaging)
**Agent pattern:** Structured capture
**Tenant:** `ramco-printing`
**Effort:** 3–4 days after the spine

---

## 1. The business

Ramco Printing Works is the flagship of Ramco Plexus and the emotional centre of the group. 650+ staff, 160,000 sq ft, four divisions:

| Division | Scope |
|---|---|
| **UNO** | Digital and commercial print — business cards, letterheads, flyers, brochures, reports |
| **DUO** | Packaging and publishing — cartons, labels, books, manuals |
| **HEX** | Diaries, journals, notebooks — corporate gifting, conference materials |
| **IX** | Branding, signage, promotional items — banners, pull-ups, branded merchandise |

## 2. Why this bot exists

This is **not** a catalogue business. A print job is *configured*, not selected. You cannot look up the price of "5,000 notebooks" because the answer depends on size, cover, stock, colours, finishing and quantity break.

So the agent's job is fundamentally different from Sai Office: **elicit a complete, valid specification**, route it to the right division, and hand a structured brief to an estimator. Plus answer the single highest-frequency inbound question in commercial print — *where is my job*.

## 3. Demo narrative

> A new prospect messages about conference notebooks with a tight deadline. The bot identifies the division, walks them through the spec, gives an indicative range, flags the deadline risk and creates a quote request. Then an existing customer asks where their job is — and the bot reveals the job has been sitting waiting for *their own* proof approval for three days.

**Planted problem:** the customer is the bottleneck. This is the strongest beat in the entire three-bot demo, because it reframes the bot from "answers questions" to "gets you paid faster." Follow it immediately with the aggregate: *across your last 200 jobs, an average of 2.3 days each is lost waiting for proof approval.*

---

## 4. Knowledge base documents

Namespace `kb/ramco-printing/`.

| Filename | Contents |
|---|---|
| `kb-divisions.md` | What UNO, DUO, HEX and IX each do, with worked examples of what belongs where. **Critical file** — division routing accuracy depends on it. Include edge cases: branded notebooks are HEX not IX; product labels are DUO not UNO; a pull-up banner is IX. |
| `kb-artwork-spec.md` | Bleed (3mm), safe area, CMYK vs RGB, minimum resolution (300dpi), fonts outlined, accepted formats (PDF/X-1a preferred, AI, INDD packaged), what causes artwork rejection |
| `kb-paper-stock.md` | Stock families, weights (gsm), coated vs uncoated, what suits which application, environmental options. General guidance only — availability is a tool call |
| `kb-finishing.md` | Lamination (gloss, matt, soft-touch), spot UV, foiling, embossing, die-cutting, perfect binding vs saddle stitch vs wiro, when each is appropriate and what each adds to lead time |
| `kb-turnaround.md` | Typical production windows by product type and quantity band, what "working days" means, what happens with rush jobs, why proof approval is on the critical path |
| `kb-minimum-quantities.md` | MOQs by product type and why they exist (plate setup, make-ready) |
| `kb-proofing.md` | Proofing process, digital vs wet proof, what the customer is signing off, how long approval typically takes, what happens to the schedule while a proof sits unapproved |
| `kb-delivery.md` | Delivery within Nairobi and upcountry, collection from the plant, packing standards, part-delivery options |
| `kb-quote-process.md` | What information an estimator needs, why some jobs can be priced instantly and others cannot, typical quote turnaround |
| `kb-about.md` | Company history from 1994, scale, the four divisions, Ramco Plexus and Ramco Group relationship, capabilities across offset, digital, screen and large format |

---

## 5. Seed data files

| Filename | Rows | Notes |
|---|---|---|
| `seed-customers.csv` | 60 | Corporate print buyers |
| `seed-contacts.csv` | 95 | 1–3 per customer |
| `seed-jobs.csv` | 220 | 9 months of job history |
| `seed-job-status-history.csv` | ~1,400 | Stage transitions per job |
| `seed-proofs.csv` | 180 | Not every job needs a proof |
| `seed-rate-cards.csv` | 140 | Standard items with quantity breaks |
| `seed-stock-types.csv` | 45 | Paper and board |
| `seed-finishing-options.csv` | 18 | |
| `seed-quote-requests.csv` | 70 | Historical quote requests |

### Column definitions

**seed-customers.csv**
```
customer_id, customer_code, company_name, industry, account_manager,
credit_terms_days, status, onboarded_at
```

**seed-contacts.csv**
```
contact_id, customer_id, full_name, role, wa_id, email, is_proof_approver,
created_at
```
Bind `wa_id` for only 10 contacts.

**seed-jobs.csv**
```
job_no, customer_id, contact_id, division, product_type, description, quantity,
size, stock_code, colours, finishing, current_stage, received_at,
promised_dispatch, actual_dispatch, value
```
`division`: `UNO | DUO | HEX | IX`
`current_stage`: `received | prepress | proofing | awaiting_approval | plating | on_press | finishing | dispatched | delivered`

**seed-job-status-history.csv**
```
history_id, job_no, stage, entered_at, exited_at, duration_hours, note
```
This table is what produces the aggregate claims. Every stage transition, timestamped.

**seed-proofs.csv**
```
proof_id, job_no, version, sent_at, status, approved_at, approved_by_contact_id,
proof_url
```
`status`: `sent | approved | changes_requested | superseded`

**seed-rate-cards.csv**
```
rate_card_id, division, product_type, size, stock_code, colours, qty_from,
qty_to, unit_price, setup_cost
```
Quantity breaks so `estimate_price` returns believable bands.

**seed-stock-types.csv**
```
stock_code, name, gsm, family, finish, is_available, typical_lead_days
```

**seed-finishing-options.csv**
```
finishing_code, name, applies_to_product_types, adds_lead_days, cost_band
```

**seed-quote-requests.csv**
```
quote_ref, customer_id, contact_id, division, spec_json, status, created_at,
estimator, quoted_value, quoted_at
```
`status`: `new | with_estimator | quoted | won | lost`

---

## 6. Data skew — engineer these conditions

### The hero job — job 4471

- Customer **Zawadi Financial Services**, contact **Peter Kariuki**, `wa_id` bound, `is_proof_approver = true`
- Division **UNO**, product: 2,000 annual report booklets, A4, 48pp, 4/4, matt lamination, perfect bound
- `current_stage` = **`awaiting_approval`**
- Proof sent `DEMO_DATE - 3d`, `status = sent`, never approved
- `promised_dispatch` = `DEMO_DATE + 2d` — **now at risk because of the stall**
- Job status history shows: received → prepress (12h) → proofing (6h) → awaiting_approval (72h and counting)

This produces the demo's best line: *"Your job is ready and waiting — it's been sitting on your proof approval since Monday. Approve it and we'll still make Thursday. Every day it waits pushes dispatch."*

### The aggregate claim

Seed `seed-job-status-history.csv` across all 220 jobs so that:

- Mean time in `awaiting_approval` = **2.3 days** (55 hours). Vary realistically: many under 12h, a long tail up to 9 days.
- **31 jobs** dispatched late, and in **19 of those** the `awaiting_approval` duration exceeded the total schedule slack — i.e. the customer caused the delay
- Mean total production time excluding approval wait: **4.1 days**

The line this supports: *"2.3 days per job on average waiting for customers to approve proofs. On 19 late jobs in the last nine months, that wait was the entire cause."*

Verify these compute correctly with an assertion. This number is the business case.

### The new enquiry — conference notebooks

- `DEMO_DATE + 22d` is the stated conference date
- Rate card must produce an indicative range for 5,000 A5 hardcover notebooks, full-colour front branding, of roughly **KES 780,000–940,000**
- Standard HEX turnaround for that quantity in `kb-turnaround.md`: 15–18 working days
- So 22 calendar days is **genuinely tight but achievable** — the bot flags it as urgent without refusing. Do not make it impossible; a demo where the bot says no is a bad demo.

### Stock condition

- One premium stock, `STK-SILK-170`, `is_available = false`, `typical_lead_days = 12`
- Used to demonstrate the bot saying *"that stock is on 12-day lead — for your deadline I'd suggest STK-SILK-150 which we hold."* Good, specific, helpful.

### Division routing test set

Seed nothing for this, but the rehearsal must include four routing checks:

| Enquiry | Correct division |
|---|---|
| "5,000 branded notebooks for a conference" | HEX |
| "Product labels for our new juice range" | DUO |
| "500 business cards, double sided" | UNO |
| "A pull-up banner for a trade show" | IX |

### Graceful failure

The bot must **refuse to give a firm quote** on anything non-standard. Rehearse: *"we need a custom-shaped die-cut folder with a foiled logo and a magnetic closure"* → captures the spec fully, gives no number, explains an estimator will price it, creates the quote request. This is essential — see section 13.

---

## 7. Database schema

```sql
create schema if not exists printing;

create table printing.customers (
  customer_id       uuid primary key default gen_random_uuid(),
  tenant_id         text not null references core.tenants(tenant_id),
  customer_code     text not null unique,
  company_name      text not null,
  industry          text,
  account_manager   text,
  credit_terms_days int not null default 30,
  status            text not null default 'active',
  onboarded_at      date not null
);

create table printing.contacts (
  contact_id         uuid primary key default gen_random_uuid(),
  customer_id        uuid not null references printing.customers(customer_id) on delete cascade,
  tenant_id          text not null references core.tenants(tenant_id),
  full_name          text not null,
  role               text,
  wa_id              text,
  email              text,
  is_proof_approver  boolean not null default false,
  created_at         timestamptz not null default now()
);
create unique index on printing.contacts (tenant_id, wa_id) where wa_id is not null;

create table printing.stock_types (
  stock_code        text primary key,
  name              text not null,
  gsm               int,
  family            text,
  finish            text,
  is_available      boolean not null default true,
  typical_lead_days int not null default 0
);

create table printing.finishing_options (
  finishing_code           text primary key,
  name                     text not null,
  applies_to_product_types text[] not null,
  adds_lead_days           int not null default 0,
  cost_band                text
);

create table printing.jobs (
  job_no            text primary key,             -- '4471'
  customer_id       uuid not null references printing.customers(customer_id),
  contact_id        uuid references printing.contacts(contact_id),
  tenant_id         text not null references core.tenants(tenant_id),
  division          text not null check (division in ('UNO','DUO','HEX','IX')),
  product_type      text not null,
  description       text,
  quantity          int not null,
  size              text,
  stock_code        text references printing.stock_types(stock_code),
  colours           text,
  finishing         text[],
  current_stage     text not null check (current_stage in
                      ('received','prepress','proofing','awaiting_approval',
                       'plating','on_press','finishing','dispatched','delivered')),
  received_at       timestamptz not null,
  promised_dispatch date,
  actual_dispatch   date,
  value             numeric(14,2)
);
create index on printing.jobs (customer_id, received_at desc);
create index on printing.jobs (current_stage);

create table printing.job_status_history (
  history_id     uuid primary key default gen_random_uuid(),
  job_no         text not null references printing.jobs(job_no) on delete cascade,
  stage          text not null,
  entered_at     timestamptz not null,
  exited_at      timestamptz,
  duration_hours numeric(8,2),
  note           text
);
create index on printing.job_status_history (job_no, entered_at);

create table printing.proofs (
  proof_id              uuid primary key default gen_random_uuid(),
  job_no                text not null references printing.jobs(job_no) on delete cascade,
  version               int not null default 1,
  sent_at               timestamptz not null,
  status                text not null check (status in
                          ('sent','approved','changes_requested','superseded')),
  approved_at           timestamptz,
  approved_by_contact_id uuid references printing.contacts(contact_id),
  proof_url             text
);
create index on printing.proofs (job_no, version desc);

create table printing.rate_cards (
  rate_card_id uuid primary key default gen_random_uuid(),
  division     text not null,
  product_type text not null,
  size         text,
  stock_code   text references printing.stock_types(stock_code),
  colours      text,
  qty_from     int not null,
  qty_to       int not null,
  unit_price   numeric(12,4) not null,
  setup_cost   numeric(12,2) not null default 0
);
create index on printing.rate_cards (division, product_type, qty_from, qty_to);

create table printing.quote_requests (
  quote_ref     text primary key,                 -- 'QR-2291'
  customer_id   uuid references printing.customers(customer_id),
  contact_id    uuid references printing.contacts(contact_id),
  tenant_id     text not null references core.tenants(tenant_id),
  division      text not null,
  spec_json     jsonb not null,
  is_urgent     boolean not null default false,
  needed_by     date,
  status        text not null default 'new' check (status in
                  ('new','with_estimator','quoted','won','lost')),
  estimator     text,
  quoted_value  numeric(14,2),
  quoted_at     timestamptz,
  created_at    timestamptz not null default now()
);
```

### Relationships

```
core.tenants 1 ──< customers 1 ──< contacts
                       │              │
                       ├──< jobs ─────┘
                       │      ├──< job_status_history
                       │      └──< proofs >── contacts (approver)
                       │      └── stock_code ──> stock_types
                       └──< quote_requests

rate_cards        (reference, no FK to jobs — priced by lookup)
finishing_options (reference)
```

### RLS

Tenant + customer isolation on `customers`, `contacts`, `jobs`, `job_status_history`, `proofs`, `quote_requests`. Tenant only on `stock_types`, `finishing_options`, `rate_cards`.

---

## 8. Tools

| Tool | Auth | Arguments | Returns |
|---|---|---|---|
| `check_stock_type` | 0 | `stock_code?`, `gsm?`, `family?` | Availability, lead days, alternatives |
| `estimate_price` | 0 | `division`, `product_type`, `quantity`, `size`, `stock_code?`, `colours?`, `finishing?` | Indicative range or `not_standard` |
| `create_quote_request` | 0 | Full validated spec object, `needed_by`, contact details | `quote_ref`, urgency flag |
| `get_job_status` | 1 | `job_no` | Stage, entered_at, promised dispatch, blocker if any |
| `get_my_jobs` | 1 | `status_filter?` | Open jobs for this customer |
| `get_proof` | 1 | `job_no` | Latest proof, version, status, days waiting, URL |
| `approve_proof` | 2 | `proof_id`, `confirm` | Releases to production, revised dispatch date |

### The two that carry the demo

```json
{
  "name": "estimate_price",
  "description": "Return an indicative price range for a STANDARD print product from the rate card. Returns status 'not_standard' when the specification falls outside rate-card coverage — in that case do NOT invent a number, create a quote request instead.",
  "input_schema": {
    "type": "object",
    "properties": {
      "division":     { "type": "string", "enum": ["UNO","DUO","HEX","IX"] },
      "product_type": { "type": "string" },
      "quantity":     { "type": "integer", "minimum": 1 },
      "size":         { "type": "string" },
      "stock_code":   { "type": "string" },
      "colours":      { "type": "string", "description": "e.g. '4/4', '1/0'" },
      "finishing":    { "type": "array", "items": { "type": "string" } }
    },
    "required": ["division", "product_type", "quantity"]
  }
}
```

Returns either:
```json
{ "status": "ok", "low": 780000, "high": 940000, "currency": "KES",
  "basis": "rate_card", "excludes": ["artwork origination", "delivery"] }
```
or:
```json
{ "status": "not_standard",
  "reason": "Custom die-cut with foiling is not on the rate card." }
```

```json
{
  "name": "get_job_status",
  "description": "Current production stage for a job. Returns a blocker object when the job is held waiting on something the customer must do — surface this prominently.",
  "input_schema": {
    "type": "object",
    "properties": { "job_no": { "type": "string" } },
    "required": ["job_no"]
  }
}
```

Returns:
```json
{
  "job_no": "4471",
  "description": "2,000 × A4 48pp annual report, 4/4, matt lam, perfect bound",
  "division": "UNO",
  "current_stage": "awaiting_approval",
  "stage_since_hours": 72,
  "promised_dispatch": "2026-XX-XX",
  "at_risk": true,
  "blocker": {
    "type": "customer_proof_approval",
    "detail": "Proof v1 sent 3 days ago, not yet approved",
    "proof_id": "uuid",
    "days_waiting": 3
  }
}
```

---

## 9. Bot system prompt

Prepend the shared fragment, then:

```
You work for Ramco Printing Works, part of Ramco Plexus and the Ramco Group.
You help customers scope print jobs, get indicative pricing, and track jobs in
production.

FOUR DIVISIONS
Every enquiry belongs to one:
  UNO — digital and commercial print: business cards, letterheads, flyers,
        brochures, reports, booklets
  DUO — packaging and publishing: cartons, labels, sleeves, books, manuals
  HEX — diaries, journals, notebooks, corporate gifting
  IX  — branding, signage, promotional items, banners, merchandise

Identify the division before anything else. If genuinely ambiguous, ask one
clarifying question. Do not guess silently.

CAPTURING A SPECIFICATION
This is your main job on new enquiries. A print job is configured, not chosen
off a shelf, and an incomplete spec cannot be priced.

Gather, in roughly this order, and only what applies:
  product type, quantity, finished size, stock, colours (e.g. 4/4 or 1/0),
  finishing, deadline, delivery or collection

Ask two or three things at a time, not one at a time and not all at once.
Use the customer's language and translate it yourself — if they say "shiny
cover" you record gloss lamination and confirm it back in plain words.

Never invent a spec value they did not give you. If they do not know, that is
fine — record it as unspecified and let the estimator ask.

PRICING — READ THIS CAREFULLY
You may give an indicative range for standard products, from estimate_price
only. Always call it indicative, always say an estimator will confirm, always
state what it excludes.

If estimate_price returns not_standard, you give NO number at all. Not a
guess, not a "probably around", not a comparison to something similar. You
capture the spec and tell them an estimator will price it, usually within a
few working hours.

Print estimating depends on paper cost, press time, imposition and wastage.
Getting this wrong costs real money and makes us look amateur. When in doubt,
no number.

DEADLINES
Always ask when they need it. Compare against typical turnaround from the
knowledge base plus any lead time on stock or finishing.

If it is tight, say so plainly and flag the request as urgent — do not refuse
and do not pretend it is comfortable. If it is genuinely not achievable, say
that too and offer what is: a reduced quantity, a simpler finish, a part
delivery.

JOB STATUS
When a customer asks where their job is, call get_job_status.

If the response contains a blocker of type customer_proof_approval, lead with
it. Be helpful, not accusatory — they usually do not realise the job is
waiting on them. Tell them exactly what approving it does to the dispatch
date.

Good:  "It's through prepress and the proof went to you on Monday — it's been
        waiting on your approval for three days. Approve it today and we'll
        still hit Thursday."
Bad:   "The job is delayed because you have not approved the proof."

PROOF APPROVAL
Only a named approver on the account may approve, and only at auth level 2.
Read back what they are approving and get an explicit yes before calling
approve_proof. Approval releases the job to production and cannot be undone.

WHAT YOU DO NOT DO
- You do not price non-standard work. Ever.
- You do not commit to a delivery date. You state typical turnaround and flag
  urgency; the estimator or planner commits.
- You do not accept artwork through this channel. Direct them to the email or
  upload route in the knowledge base.
- You do not discuss another customer's jobs, pricing or artwork.
```

---

## 10. Demo script

**Conversation A — new enquiry, unknown number**

| # | Speaker | Message | Expected behaviour |
|---|---|---|---|
| 1 | Prospect | "I need 5000 branded notebooks for a conference on the 15th" | Route to HEX. Ask 2–3 spec questions (size, cover, branding colours). |
| 2 | Prospect | "A5 hardcover, full colour logo on the front" | Call `estimate_price` → range. Call `create_quote_request`. Flag deadline as tight, mark urgent, give `quote_ref`. Offer spec sheet or artwork route. |

**Conversation B — existing customer, bound number**

| # | Speaker | Message | Expected behaviour |
|---|---|---|---|
| 3 | Peter | "where's job 4471" | Level 1 via `wa_id`. Call `get_job_status`. Lead with the blocker: proof waiting 3 days, dispatch at risk, what approving does. |
| 4 | Peter | "oh I didn't see that, can I approve it now" | Call `get_proof`, read back what he's approving, request confirmation. |
| 5 | Peter | "yes approve it" | Level 2 check (named approver), call `approve_proof`, return revised dispatch date. |

**Then say the number out loud:** *"Across your last 200 jobs, an average of 2.3 days each is lost waiting for proof approval. On 19 late dispatches in nine months, that wait was the entire cause."*

**Reserve — graceful failure:** custom die-cut folder with foiling and magnetic closure → full spec captured, no number given, quote request created.

---

## 11. Build agent prompt

```
Build the Ramco Printing Works demonstration bot on top of the shared spine
(01-shared-spine.md must exist and pass acceptance first).

Read this entire document before writing code.

Deliver:

1. Migration creating the `printing` schema per section 7, with RLS as
   specified.

2. Seed generator producing the CSVs in section 5, all dates relative to
   DEMO_DATE, with an assertion function verifying every condition in
   section 6. Assert at minimum:
     - job 4471 exists, current_stage = 'awaiting_approval', proof sent
       DEMO_DATE - 3 days, status 'sent', promised_dispatch = DEMO_DATE + 2d
     - mean duration in awaiting_approval across all jobs = 2.3 days (+/- 0.1)
     - exactly 31 jobs dispatched late
     - in exactly 19 of those, awaiting_approval duration exceeded total slack
     - rate card yields KES 780,000-940,000 for 5,000 A5 hardcover notebooks
       with full-colour front branding
     - STK-SILK-170 has is_available = false and typical_lead_days = 12

   The 2.3-day figure is the business case for this entire pitch. If the
   assertion fails, the seed generator is wrong — fix the generator, do not
   relax the assertion.

3. The ten knowledge base documents in section 4 as markdown in
   kb/ramco-printing/. 400-800 words each, real content.

   kb-divisions.md is the most important file in this build — division
   routing accuracy depends entirely on it. Include at least 15 worked
   examples of enquiries mapped to divisions, covering the ambiguous cases
   listed in section 6.

   No prices, no stock levels, no job statuses in any KB file.

4. The seven tools in section 8 as Edge Functions on the router contract.

   estimate_price MUST return status 'not_standard' rather than a number
   whenever the spec falls outside rate-card coverage. Test this explicitly
   with a custom die-cut request.

   get_job_status MUST return the blocker object described in section 8 when
   a job is held on customer proof approval. This drives the key demo moment.

   approve_proof must verify the contact is is_proof_approver = true for that
   customer, require auth level 2, and be idempotent.

5. The system prompt in section 9.

6. A rehearsal script replaying section 10 including both conversations, the
   four division-routing checks, and the graceful-failure reserve.

Do not build artwork upload. Do not build quote pricing beyond rate-card
lookup. Do not add tools beyond the seven specified.

Acceptance: rehearsal passes three consecutive times; all four division
routing checks correct; estimate_price refuses to price the custom die-cut;
the 2.3-day aggregate computes correctly from job_status_history.
```

---

## 12. Acceptance checklist

- [ ] All seed assertions pass, especially the 2.3-day aggregate
- [ ] Four division routing checks all correct
- [ ] Job 4471 surfaces the proof blocker unprompted and leads with it
- [ ] `approve_proof` requires named approver + level 2, returns revised dispatch
- [ ] `estimate_price` returns `not_standard` on custom work and the bot gives no number
- [ ] Unavailable stock triggers an alternative suggestion
- [ ] Deadline flagged tight but not refused on the notebook enquiry
- [ ] No volatile data in any `kb-*.md`

---

## 13. Objection handling — read before the demo

**Someone from Ramco Printing will challenge automated quoting.** Estimating is a craft: paper cost, press time, imposition, wastage, make-ready. An estimator in the room will assume we are claiming to replace them, and they will be looking for the moment to say so.

Get ahead of it. The framing:

> The bot does not quote. It gives an indicative range on standard, rate-carded items — the same range your estimator would give on the phone in ten seconds — and for everything else it produces a complete, structured brief so your estimator stops chasing customers for missing specifications.

Then hand them the reserve demo: the custom die-cut request where the bot explicitly declines to price and routes to an estimator. Showing the limit is more persuasive than claiming the capability.

The value proposition to an estimator is **fewer incomplete briefs**, not fewer estimators. Say that in those words.
