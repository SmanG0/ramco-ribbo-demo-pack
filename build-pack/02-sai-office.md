# 02 — Sai Office Supplies

**Vertical:** Ramco Kora (Office & IT Distribution)
**Agent pattern:** Lookup and transact
**Tenants:** `sai-ke` (primary), `sai-tz` (for the live tenant switch)
**Effort:** 3–4 days after the spine

---

## 1. The business

Sai Office Supplies distributes office consumables, stationery, print hardware and IT equipment. It operates as four legal entities — Kenya, Tanzania, Uganda, Rwanda — alongside sister retail brands Office Mart and Office Technologies. Brand relationships include Konica Minolta, Brother, Dell, Hisense, Rexel, UHU, Oxford and Nataraj.

Customers are overwhelmingly **B2B corporate accounts** with negotiated contract pricing and monthly reorder patterns.

## 2. Why this bot exists

Corporate procurement officers reorder the same consumables every month. Today that means a phone call or an email to a rep, who checks stock, quotes contract pricing, and raises the order. It is high-frequency, low-judgement work.

The bot does it on WhatsApp in under a minute. Because pricing is account-specific, **this is the build that proves authentication matters** — and it is the cleanest auth story of the three, because on WhatsApp the phone number *is* the identity.

## 3. Demo narrative

> A procurement officer messages at 08:40 to reorder toner. The bot recognises her number, pulls her last order, notices she is overdue against her own pattern, finds one item short at her usual branch but available at another, quotes her contract price, drafts the order, and holds it for confirmation. Then we switch to Tanzania and the same bot answers in Swahili with TZS pricing.

**Planted problem:** she is five weeks past a four-week reorder cycle. The bot surfaces this without being asked. The point lands as: *your customers are running out and nobody is telling them.*

---

## 4. Knowledge base documents

Static content only. **No prices, no stock levels, no order statuses.** Namespace `kb/sai-ke/` and `kb/sai-tz/`.

| Filename | Contents |
|---|---|
| `kb-account-opening.md` | Corporate account application process, required documents (certificate of incorporation, KRA PIN, directors' IDs), credit application, typical approval timeline, who to contact |
| `kb-payment-terms.md` | Accepted payment methods, M-Pesa paybill procedure, bank transfer details, standard credit terms by account class, what happens when an account goes on hold |
| `kb-invoicing-tax.md` | VAT treatment, eTIMS electronic invoicing, how to request a copy invoice, credit note process, LPO requirements |
| `kb-delivery.md` | Delivery zones within Nairobi and upcountry, order cut-off times, lead times per zone, delivery charges, what happens if nobody is available to receive |
| `kb-returns.md` | Returns window, condition requirements, damaged-goods procedure, wrong-item procedure, non-returnable categories (opened consumables) |
| `kb-branches.md` | Branch names, physical addresses, opening hours, parking, which branches hold trade counters vs retail only |
| `kb-warranty.md` | Warranty terms by brand — Dell, Brother, Konica Minolta, Hisense. Duration, what is covered, how to raise a claim, turnaround expectations |
| `kb-bulk-quotes.md` | How to request a bulk or tender quote, what information is needed, typical response time, who handles government tenders |
| `kb-compatibility.md` | General guidance on matching consumables to devices — how to find a printer model number, what OEM vs compatible means. **General principles only. No SKU-to-price mappings.** |
| `kb-about.md` | Who Sai Office is, the four-country footprint, the Ramco Group relationship, brand partnerships |

**Swahili variants** for `sai-tz`: translate `kb-delivery`, `kb-payment-terms`, `kb-branches`, `kb-returns`, `kb-about` as `kb-<topic>.sw.md`. Others can remain English initially.

---

## 5. Seed data files

Generate all CSVs relative to `DEMO_DATE`.

| Filename | Rows | Notes |
|---|---|---|
| `seed-accounts.csv` | 40 | 32 Kenya, 8 Tanzania |
| `seed-contacts.csv` | 65 | 1–3 per account |
| `seed-branches.csv` | 9 | 6 Kenya, 3 Tanzania |
| `seed-products.csv` | 320 | Realistic catalogue spread |
| `seed-inventory.csv` | ~2,880 | products × branches |
| `seed-price-lists.csv` | ~1,200 | contract pricing, subset of products × accounts |
| `seed-orders.csv` | 480 | 12 months of history |
| `seed-order-lines.csv` | ~1,900 | 3–5 lines per order |
| `seed-invoices.csv` | 480 | one per order |

### Column definitions

**seed-accounts.csv**
```
account_id, tenant_id, account_code, company_name, industry, credit_terms_days,
credit_limit, account_class, status, onboarded_at
```
`account_class`: `platinum | gold | standard`. Drives discount depth.
`status`: `active | on_hold`.

**seed-contacts.csv**
```
contact_id, account_id, tenant_id, full_name, role, wa_id, email, pin_hash,
is_approver, created_at
```
`wa_id`: E.164 without `+`. **Leave blank for all but 12 contacts** — most real accounts will not have a bound number at demo time, and showing the unrecognised-number path is part of the story.
`pin_hash`: bcrypt of a 4-digit PIN. Document the plaintext PINs for demo contacts in a separate gitignored file.

**seed-branches.csv**
```
branch_id, tenant_id, branch_name, city, address, is_trade_counter, opening_hours
```
Kenya branches: Industrial Area, Kenyatta Avenue, Junction, Westlands, Mombasa, Kisumu.
Tanzania: Dar es Salaam, Arusha, Mwanza.

**seed-products.csv**
```
sku, tenant_id, brand, category, description, unit, list_price, is_active
```
Categories and rough weighting:
- Toner & ink (35%) — HP, Brother, Canon, Konica Minolta cartridges
- Paper (12%) — A4/A3 copier paper, various weights
- Stationery (20%) — pens, files, staplers, Nataraj, Oxford, UHU, Rexel
- IT hardware (15%) — Dell laptops/monitors, Hisense displays
- Print hardware (8%) — Brother and Konica Minolta printers/MFPs
- Janitorial & pantry (10%)

**seed-inventory.csv**
```
sku, branch_id, tenant_id, qty_on_hand, reorder_level, updated_at
```

**seed-price-lists.csv**
```
account_id, sku, tenant_id, contract_price, valid_from, valid_to
```
Only populate for SKUs an account actually buys — roughly 25–40 SKUs per account. Everything else falls back to list price.

Discount depth by class: platinum 18–24%, gold 12–17%, standard 5–11%.

**seed-orders.csv**
```
order_id, account_id, contact_id, tenant_id, order_date, status, branch_id,
delivery_date, subtotal, vat, total, currency
```
`status`: `draft | confirmed | picking | dispatched | delivered | cancelled`.

**seed-order-lines.csv**
```
order_line_id, order_id, sku, qty, unit_price, line_total
```
`unit_price` must reflect the contract price at time of order, not current list.

**seed-invoices.csv**
```
invoice_id, order_id, account_id, tenant_id, invoice_date, due_date,
amount, amount_paid, status
```
`status`: `paid | outstanding | overdue`.

---

## 6. Data skew — engineer these conditions

This is the part that makes the demo work. The data must produce these facts.

### The hero account — Kenya Commercial Holdings

- `account_code` **KCH-0041**, class `platinum`, credit terms 30 days
- Contact **Grace Mwende**, Procurement Officer, `wa_id` bound, `is_approver = true`, PIN `4417`
- **12 months of order history on a tight ~28-day cycle.** Consistent basket: 4× `HP-CF226A` black toner, 2× `BRO-TN2421`, 5 reams `PPR-A4-80`
- **Last order dated `DEMO_DATE - 35d`.** Seven days overdue against her own average. This is the planted problem.
- Contract pricing: 21% below list on the toner lines
- One invoice `status = outstanding`, due `DEMO_DATE + 4d`, amount ~KES 52,000. Close enough to mention naturally, not so overdue it sours the mood.

### Stock condition

- `HP-CF226A` at **Industrial Area** (her usual branch): `qty_on_hand = 4`, `reorder_level = 10`. Enough for her usual 4, **not** enough for the 6 she will ask for in the demo.
- `HP-CF226A` at **Westlands**: `qty_on_hand = 27`. The bot finds the alternative.
- `BRO-TN2421` at Industrial Area: `qty_on_hand = 31`. Comfortable.
- `PPR-A4-80` at Industrial Area: `qty_on_hand = 180`. Comfortable.

This produces the moment where the bot says *"I can only cover four from Industrial Area, but Westlands has 27 — shall I split it or source it all from Westlands?"* That is the single most impressive beat in this demo, because it is exactly what a good rep does.

### Isolation proof

- Second account **Nairobi Insurance Group**, `account_code` NIG-0088, class `standard`
- Buys the same `HP-CF226A` at a **9% discount instead of 21%**
- If anyone in the room asks whether the bot could leak pricing, we demonstrate the same query from an unbound number returning list price only.

### Aggregate claims

Seed the 480 orders so these are true when queried:

- Median reorder cycle across active accounts: **26–30 days**
- **9 accounts** are currently more than 7 days past their own median cycle. Supports the line: *"nine of your accounts are overdue on their own reorder pattern right now, and nobody has called them."*
- Toner and ink account for roughly **48% of order lines** — supports the claim that the bulk of reorder traffic is a handful of repeat SKUs

### Tanzania tenant

- Account **Kilimanjaro Trading Co**, contact with a Tanzanian `wa_id`
- Prices in TZS, Swahili as `default_language`
- Overlapping catalogue but not identical — a few TZ-only SKUs, a few KE SKUs absent

### Graceful failure

Do **not** seed compatibility data linking printer models to specific SKUs. When asked *"which toner fits a Konica Minolta bizhub C258?"* the bot should give general guidance from `kb-compatibility.md` and offer to have someone confirm. Rehearse this — it demonstrates honest limits.

---

## 7. Database schema

```sql
create schema if not exists sai;

create table sai.accounts (
  account_id        uuid primary key default gen_random_uuid(),
  tenant_id         text not null references core.tenants(tenant_id),
  account_code      text not null,
  company_name      text not null,
  industry          text,
  credit_terms_days int  not null default 30,
  credit_limit      numeric(14,2),
  account_class     text not null check (account_class in ('platinum','gold','standard')),
  status            text not null default 'active' check (status in ('active','on_hold')),
  onboarded_at      date not null,
  unique (tenant_id, account_code)
);

create table sai.contacts (
  contact_id  uuid primary key default gen_random_uuid(),
  account_id  uuid not null references sai.accounts(account_id) on delete cascade,
  tenant_id   text not null references core.tenants(tenant_id),
  full_name   text not null,
  role        text,
  wa_id       text,
  email       text,
  pin_hash    text,
  is_approver boolean not null default false,
  created_at  timestamptz not null default now()
);
create unique index on sai.contacts (tenant_id, wa_id) where wa_id is not null;

create table sai.branches (
  branch_id        uuid primary key default gen_random_uuid(),
  tenant_id        text not null references core.tenants(tenant_id),
  branch_name      text not null,
  city             text not null,
  address          text,
  is_trade_counter boolean not null default false,
  opening_hours    text
);

create table sai.products (
  sku         text not null,
  tenant_id   text not null references core.tenants(tenant_id),
  brand       text,
  category    text not null,
  description text not null,
  unit        text not null default 'each',
  list_price  numeric(12,2) not null,
  is_active   boolean not null default true,
  primary key (tenant_id, sku)
);
create index on sai.products using gin (to_tsvector('english', description));

create table sai.inventory (
  sku           text not null,
  branch_id     uuid not null references sai.branches(branch_id) on delete cascade,
  tenant_id     text not null references core.tenants(tenant_id),
  qty_on_hand   int not null default 0,
  reorder_level int not null default 0,
  updated_at    timestamptz not null default now(),
  primary key (tenant_id, sku, branch_id),
  foreign key (tenant_id, sku) references sai.products(tenant_id, sku)
);

create table sai.price_lists (
  account_id     uuid not null references sai.accounts(account_id) on delete cascade,
  sku            text not null,
  tenant_id      text not null references core.tenants(tenant_id),
  contract_price numeric(12,2) not null,
  valid_from     date not null,
  valid_to       date,
  primary key (account_id, sku, valid_from),
  foreign key (tenant_id, sku) references sai.products(tenant_id, sku)
);

create table sai.orders (
  order_id      text primary key,                -- 'SO-2291'
  account_id    uuid not null references sai.accounts(account_id),
  contact_id    uuid references sai.contacts(contact_id),
  tenant_id     text not null references core.tenants(tenant_id),
  branch_id     uuid references sai.branches(branch_id),
  order_date    date not null,
  status        text not null check (status in
                  ('draft','confirmed','picking','dispatched','delivered','cancelled')),
  delivery_date date,
  subtotal      numeric(14,2) not null,
  vat           numeric(14,2) not null,
  total         numeric(14,2) not null,
  currency      text not null,
  created_at    timestamptz not null default now()
);
create index on sai.orders (account_id, order_date desc);

create table sai.order_lines (
  order_line_id uuid primary key default gen_random_uuid(),
  order_id      text not null references sai.orders(order_id) on delete cascade,
  sku           text not null,
  tenant_id     text not null,
  qty           int not null check (qty > 0),
  unit_price    numeric(12,2) not null,
  line_total    numeric(14,2) not null,
  foreign key (tenant_id, sku) references sai.products(tenant_id, sku)
);
create index on sai.order_lines (order_id);

create table sai.invoices (
  invoice_id   text primary key,
  order_id     text not null references sai.orders(order_id),
  account_id   uuid not null references sai.accounts(account_id),
  tenant_id    text not null references core.tenants(tenant_id),
  invoice_date date not null,
  due_date     date not null,
  amount       numeric(14,2) not null,
  amount_paid  numeric(14,2) not null default 0,
  status       text not null check (status in ('paid','outstanding','overdue'))
);
create index on sai.invoices (account_id, status);
```

### Relationships

```
core.tenants 1 ──< accounts 1 ──< contacts
                      │
                      ├──< price_lists >── products
                      ├──< orders 1 ──< order_lines >── products
                      │        └──1 invoices
                      └── (branch_id) ──> branches

products 1 ──< inventory >── branches
```

### RLS

Apply to `accounts`, `contacts`, `price_lists`, `orders`, `order_lines`, `invoices`:
tenant isolation **plus** account isolation. `products`, `branches`, `inventory` need tenant isolation only — they are public within a tenant.

---

## 8. Tools

| Tool | Auth | Arguments | Returns |
|---|---|---|---|
| `search_products` | 0 | `query`, `category?`, `limit?` | SKU, description, brand, list price |
| `get_stock` | 0 | `sku`, `branch_id?` | Per-branch qty, nearest alternative branch |
| `get_my_price` | 1 | `sku[]` | Contract price per SKU, discount vs list |
| `get_last_order` | 1 | — | Order header, lines, date, days since |
| `get_order_status` | 1 | `order_id` | Status, branch, expected delivery |
| `get_account_summary` | 1 | — | Reorder cadence, days since last order, outstanding invoice count |
| `draft_order` | 1 | `lines[{sku, qty}]`, `branch_id?` | Draft with pricing, stock check, split suggestion |
| `confirm_order` | 2 | `draft_id`, `pin` | Order number, delivery date |

### Schemas — the two that matter

```json
{
  "name": "draft_order",
  "description": "Create an unconfirmed draft order for the authenticated account. Prices each line at contract rate, checks stock across branches, and proposes a fulfilment split if a single branch cannot cover the quantity. Does NOT commit anything.",
  "input_schema": {
    "type": "object",
    "properties": {
      "lines": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "sku": { "type": "string" },
            "qty": { "type": "integer", "minimum": 1 }
          },
          "required": ["sku", "qty"]
        },
        "minItems": 1
      },
      "branch_id": {
        "type": "string",
        "description": "Preferred fulfilment branch. Omit to use the account's usual branch."
      }
    },
    "required": ["lines"]
  }
}
```

```json
{
  "name": "get_account_summary",
  "description": "Reorder behaviour and account health for the authenticated account. Use this proactively when a customer opens a reorder conversation, so you can flag if they are overdue against their own pattern.",
  "input_schema": { "type": "object", "properties": {}, "required": [] }
}
```

`get_account_summary` returns:
```json
{
  "median_reorder_days": 28,
  "days_since_last_order": 35,
  "is_overdue": true,
  "usual_branch": "Industrial Area",
  "outstanding_invoices": 1,
  "outstanding_total": 52140,
  "next_due_date": "2026-08-XX"
}
```

---

## 9. Bot system prompt

Prepend the shared fragment from `01-shared-spine.md`, then:

```
You work for Sai Office Supplies, part of the Ramco Group. You help corporate
customers check stock, get their pricing, track orders and reorder supplies.

WHO YOU ARE TALKING TO
Almost everyone here is a procurement or admin professional ordering on behalf
of their company. They are busy and they order the same things repeatedly.
Respect that: be fast, be specific, do not make them repeat themselves.

REORDER BEHAVIOUR
When a recognised customer opens a conversation about ordering, call
get_account_summary and get_last_order before replying. If they are overdue
against their own median cycle, mention it once, naturally, as useful
information — not as a sales push.

Good:  "You're about a week past your usual cycle, so this is well timed."
Bad:   "You are OVERDUE! Would you like to order now?"

PRICING
Never quote a price without calling a tool. For a recognised customer always
use get_my_price — their contract rate, not list. For an unrecognised number
you may quote list price only, and you should say it is list price and that
account pricing may differ.

Never disclose one account's pricing to anyone else. If asked what another
company pays, decline plainly.

STOCK
Always check stock before drafting an order. If the preferred branch cannot
cover the quantity, do not silently reduce it and do not just report failure.
Check other branches and propose the options — split the order, source it all
from elsewhere, or part-ship now and follow up. Present the choice, let them
pick.

ORDERING
Drafting an order is safe and reversible. Confirming it is not.

1. Call draft_order. Present the full basket: items, quantities, unit prices,
   total including VAT, fulfilment branch, expected delivery date.
2. Wait for explicit confirmation.
3. Only then call confirm_order, which requires their PIN.

Never call confirm_order on an implied yes. "Sounds good" is not confirmation
of a specific basket — read the basket back and get a clear yes.

INVOICES
If the account has an outstanding invoice due within 7 days you may mention it
once at the end of a completed interaction. Do not lead with it, do not chase,
do not repeat it in the same conversation.

WHAT YOU DO NOT DO
- You do not confirm which consumable fits which specific device model. Give
  general guidance from the knowledge base and offer to have someone confirm.
- You do not negotiate prices or grant discounts.
- You do not open accounts or extend credit. Explain the process, hand off.
- You do not cancel or amend confirmed orders. Hand off.
```

---

## 10. Demo script

**Setup:** Grace Mwende's number bound. `DEMO_DATE` set. Tanzania tenant ready on a second number.

| # | Speaker | Message | Expected behaviour |
|---|---|---|---|
| 1 | Grace | "Morning, can I get the same toner order as last month" | Resolve `wa_id` → level 1. Call `get_account_summary` + `get_last_order`. Reply names her, states the basket, notes she's ~1 week past her usual cycle, gives contract-priced total. |
| 2 | Grace | "Yes but make it 6 of the HP" | Call `get_stock`. Industrial Area has 4. Surface Westlands has 27. Offer split or full source from Westlands. |
| 3 | Grace | "All from Westlands is fine" | Call `draft_order`. Read back full basket, total inc VAT, branch, delivery date. Request PIN. |
| 4 | Grace | "4417" | Call `confirm_order`. Return order number and delivery date. Mention the invoice due in 4 days, once, at the end. |
| 5 | — | *Switch to Tanzania number* | Same architecture, Swahili greeting, TZS pricing, Tanzanian catalogue. |
| 6 | Presenter | "What if I'm not a customer?" — message from an unbound number | List price only, no account data, offer account linking. |

**Reserve — graceful failure:** "which toner fits a bizhub C258?" → general guidance, offer to confirm with a colleague.

**Timing target:** steps 1–4 in under 90 seconds.

---

## 11. Build agent prompt

```
Build the Sai Office Supplies demonstration bot on top of the shared spine
(see 01-shared-spine.md — it must exist and pass its acceptance tests first).

Read this entire document before writing code.

Deliver:

1. Migration creating the `sai` schema exactly as specified in section 7.
   Apply RLS per section 7: tenant + account isolation on accounts, contacts,
   price_lists, orders, order_lines, invoices; tenant isolation only on
   products, branches, inventory.

2. A seed data generator producing the CSVs in section 5 at the stated row
   counts, then loading them. All dates relative to a DEMO_DATE constant
   defined in one place.

   CRITICAL: the generator must satisfy every condition in section 6 (Data
   skew). These are not suggestions — the demo depends on them. Write an
   assertion function that verifies each condition after generation and fails
   loudly if any is not met. At minimum assert:
     - Grace Mwende's last order is exactly DEMO_DATE - 35 days
     - her median reorder cycle computes to 26-30 days
     - HP-CF226A qty at Industrial Area is 4, at Westlands is 27
     - her contract discount on HP-CF226A is 21% (+/- 0.5%)
     - Nairobi Insurance Group's discount on the same SKU is 9%
     - exactly 9 accounts are >7 days past their own median cycle
     - she has exactly 1 outstanding invoice due DEMO_DATE + 4 days

3. The ten knowledge base documents in section 4, as markdown, in
   kb/sai-ke/. Write real content — these are read by the model at inference
   time and thin content produces thin answers. Aim for 400-800 words each.
   Swahili variants for the five listed files in kb/sai-tz/.

   DO NOT put any price, stock level, order status or other volatile fact in
   any knowledge base file. If you are unsure whether something is volatile,
   it is — leave it out and let a tool return it.

4. The eight tools in section 8 as Supabase Edge Functions conforming to the
   router contract in the spine spec. Full JSON schemas for each. Enforce the
   stated minimum auth levels.

   get_stock must return alternative branches when the requested branch cannot
   cover the quantity — this behaviour is central to the demo.

   draft_order must never write to sai.orders with status other than 'draft'.
   confirm_order is the only function permitted to move an order to
   'confirmed', and it must verify the PIN against contacts.pin_hash.

5. The system prompt in section 9, stored and referenced by
   core.tenants.system_prompt_id.

6. A demo rehearsal script that replays section 10 end to end against the
   running system and asserts the expected behaviour at each step.

Do not build an admin UI. Do not build order amendment or cancellation. Do not
add tools beyond the eight specified.

Acceptance: the rehearsal script passes three consecutive times, all seed
assertions pass, and RLS tests prove Nairobi Insurance Group's pricing is
unreachable from Grace's session.
```

---

## 12. Acceptance checklist

- [ ] All seed skew assertions pass
- [ ] Grace's number resolves to level 1 automatically
- [ ] Overdue flag surfaces unprompted on a reorder opener
- [ ] Stock shortfall triggers the alternative-branch offer
- [ ] `confirm_order` rejects a wrong PIN and locks after three
- [ ] Unbound number receives list price only, never contract price
- [ ] Tenant switch to `sai-tz` changes language, currency and catalogue with no redeploy
- [ ] Compatibility question produces honest guidance, not a fabricated SKU
- [ ] No volatile data in any `kb-*.md`
- [ ] Steps 1–4 complete in under 90 seconds
