# 01 — Shared Spine

Build this first and completely. Every company bot depends on it. No company-specific logic belongs here.

Estimated effort: **4–5 engineering days.**

---

## 1. Components

| Component | Purpose |
|---|---|
| WhatsApp channel | Inbound webhook, message threading, session keying |
| Identity resolver | Map `wa_id` to a contact record; manage step-up auth |
| Tool router | Validate arguments, dispatch, timeout, retry, fail gracefully |
| Serving database | Supabase Postgres with per-tenant row-level security |
| Tenant registry | Bot identity, locale, currency, knowledge base binding |
| Handoff | Escalate to human with transcript |
| Audit log | Every tool call and every answer |

---

## 2. Shared database schema

These tables are tenant-agnostic and live in the `core` schema. Company tables live in their own schemas (`sai`, `printing`, `safarilink`).

```sql
create schema if not exists core;

-- Tenant registry -----------------------------------------------------------
create table core.tenants (
  tenant_id        text primary key,              -- 'sai-ke', 'sai-tz', 'ramco-printing', 'safarilink'
  display_name     text not null,
  company_schema   text not null,                 -- 'sai', 'printing', 'safarilink'
  country_code     text not null,                 -- 'KE','TZ','UG','RW'
  currency_code    text not null,                 -- 'KES','TZS','UGX','RWF'
  default_language text not null default 'en',    -- 'en','sw'
  languages        text[] not null default '{en}',
  bot_display_name text not null,
  system_prompt_id text not null,
  kb_namespace     text not null,
  created_at       timestamptz not null default now()
);

-- Conversation sessions -----------------------------------------------------
create table core.sessions (
  session_id     uuid primary key default gen_random_uuid(),
  tenant_id      text not null references core.tenants(tenant_id),
  wa_id          text not null,                   -- WhatsApp phone number, E.164, no '+'
  contact_ref    text,                            -- company-schema contact identifier once resolved
  auth_level     int not null default 0,          -- 0 anon, 1 identified, 2 verified
  auth_expires_at timestamptz,
  language       text not null default 'en',
  started_at     timestamptz not null default now(),
  last_seen_at   timestamptz not null default now(),
  unique (tenant_id, wa_id)
);
create index on core.sessions (tenant_id, wa_id);

-- Messages ------------------------------------------------------------------
create table core.messages (
  message_id  uuid primary key default gen_random_uuid(),
  session_id  uuid not null references core.sessions(session_id) on delete cascade,
  direction   text not null check (direction in ('inbound','outbound')),
  body        text not null,
  created_at  timestamptz not null default now()
);
create index on core.messages (session_id, created_at);

-- Audit log — every tool invocation ----------------------------------------
create table core.tool_calls (
  call_id      uuid primary key default gen_random_uuid(),
  session_id   uuid not null references core.sessions(session_id) on delete cascade,
  tenant_id    text not null references core.tenants(tenant_id),
  tool_name    text not null,
  arguments    jsonb not null,
  result       jsonb,
  status       text not null check (status in ('ok','error','timeout','denied')),
  error_detail text,
  latency_ms   int,
  created_at   timestamptz not null default now()
);
create index on core.tool_calls (tenant_id, created_at);
create index on core.tool_calls (session_id, created_at);

-- Human handoff -------------------------------------------------------------
create table core.handoffs (
  handoff_id  uuid primary key default gen_random_uuid(),
  session_id  uuid not null references core.sessions(session_id),
  tenant_id   text not null references core.tenants(tenant_id),
  reason      text not null check (reason in
                ('low_confidence','tool_failure','customer_request','tier3_write','auth_lockout')),
  transcript  jsonb not null,
  status      text not null default 'open' check (status in ('open','claimed','closed')),
  created_at  timestamptz not null default now()
);

-- Auth attempt throttling ---------------------------------------------------
create table core.auth_attempts (
  attempt_id uuid primary key default gen_random_uuid(),
  session_id uuid not null references core.sessions(session_id) on delete cascade,
  succeeded  boolean not null,
  created_at timestamptz not null default now()
);
create index on core.auth_attempts (session_id, created_at);
```

### Relationship summary

```
core.tenants  1 ──< core.sessions  1 ──< core.messages
                          │
                          ├──< core.tool_calls
                          ├──< core.handoffs
                          └──< core.auth_attempts

core.sessions.contact_ref ──> {company schema}.contacts / customers / passengers
   (soft reference, resolved per tenant — no FK across schemas)
```

---

## 3. Auth levels

| Level | Name | How reached | Grants |
|---|---|---|---|
| 0 | Anonymous | Default | Tier 0 knowledge base, Tier 1 public tools |
| 1 | Identified | `wa_id` matches a known contact | Tier 2 read on that account only |
| 2 | Verified | PIN / PNR+surname / named-approver check | Tier 3 writes |

Rules:

- Level 1 persists for the session. Level 2 expires after **15 minutes** — set `auth_expires_at`.
- Three consecutive failed level-2 attempts → lock the session, create a handoff with reason `auth_lockout`, stop accepting auth attempts.
- **Never reveal whether an identifier exists on a failed match.** "That reference and surname don't match our records" — never "that PNR exists but the surname is wrong."
- Isolation is enforced by **row-level security in Postgres**, never by instructions in the prompt. Assume the prompt can be talked around; the database cannot.

### RLS pattern

Every company table containing customer data follows this shape:

```sql
alter table sai.orders enable row level security;

create policy tenant_isolation on sai.orders
  using (tenant_id = current_setting('app.tenant_id', true));

create policy account_isolation on sai.orders
  using (account_id = current_setting('app.account_id', true)::uuid);
```

The Edge Function sets `app.tenant_id` and `app.account_id` from the resolved session **before** any query. If `app.account_id` is unset, authenticated queries return zero rows by design.

---

## 4. Tool router contract

Every tool endpoint conforms to:

**Request**
```json
{
  "tenant_id": "sai-ke",
  "session_id": "uuid",
  "auth_level": 1,
  "tool": "get_order_status",
  "arguments": { "order_id": "SO-2291" }
}
```

**Response — success**
```json
{
  "status": "ok",
  "data": { },
  "latency_ms": 142
}
```

**Response — failure**
```json
{
  "status": "error",
  "error_code": "not_found | denied | invalid_args | upstream_timeout",
  "message": "Human-readable, safe to surface to the customer."
}
```

Router behaviour:

- Validate arguments against the tool's JSON schema **before** dispatch. Invalid → return `invalid_args`, do not call.
- Timeout at **3 seconds**. Retry once. Second failure → `upstream_timeout`.
- If `auth_level` is below the tool's requirement → `denied`, never dispatch.
- Log every call to `core.tool_calls` regardless of outcome.
- **A failed tool must never become an invented answer.** On error the bot says it cannot retrieve that right now and offers a handoff. This is a hard requirement and must be stated in every bot system prompt.

---

## 5. Shared system prompt fragment

Prepend this to every company system prompt.

```
You are a customer assistant for {{BOT_DISPLAY_NAME}}, part of the Ramco Group.
You communicate over WhatsApp. Keep replies short and scannable — most people
are reading on a phone. Two or three short paragraphs maximum. No markdown
headers, no bullet lists unless you are presenting three or more parallel items.

LANGUAGE
Reply in the language the customer writes in. You support {{LANGUAGES}}.
Default to {{DEFAULT_LANGUAGE}} if unclear.

WHAT YOU KNOW
You have two sources of information and they are not interchangeable.

1. Your knowledge base holds policies, procedures and facts that do not change.
   Use it freely.
2. Tools return live data: prices, stock, statuses, bookings, schedules.

Anything that can change MUST come from a tool. Never state a price, a stock
level, a status, a schedule or a booking detail from memory or from the
knowledge base. If you catch yourself about to, call the tool instead.

WHEN A TOOL FAILS
Say you cannot retrieve it right now and offer to connect a colleague. Never
guess, never approximate, never fill the gap from general knowledge. A wrong
specific answer is far worse than an honest "let me get someone."

IDENTITY
You are currently at auth level {{AUTH_LEVEL}}.
- Level 0: you may not disclose any account-specific information whatsoever.
- Level 1: you may discuss this contact's own account only.
- Level 2: you may perform confirmed write actions.
Never disclose information about any other customer, account or booking.
If asked to, decline plainly without explaining the security model.

CONFIRMATIONS
Never commit a write action without an explicit confirmation in the customer's
own words. Present what you are about to do, then wait.

TONE
Warm, direct, competent. You work here. Do not apologise repeatedly, do not
use exclamation marks, do not say "I'd be happy to." Answer the question.

HANDOFF
Escalate when: the customer asks for a person, a tool fails twice, the request
is outside your tools, or the customer is upset. Escalating well is not a
failure.
```

Template variables are filled from `core.tenants`.

---

## 6. Build agent prompt — shared spine

Paste this to the agent building this component.

```
Build the shared infrastructure for a multi-tenant WhatsApp customer assistant
platform. Three separate company bots will run on it.

Stack: Supabase (Postgres + Edge Functions in Deno). Ribbo handles the
conversation layer and calls our Edge Functions as tools over HTTP.

Deliver, in this order:

1. Postgres migration creating the `core` schema exactly as specified in
   section 2 of this document. Do not add tables. Do not rename columns.

2. A tenant resolution module: given an inbound WhatsApp `wa_id` and the
   receiving business number, resolve the tenant, find or create a session,
   and attempt identity resolution against that tenant's contact table.
   Return session state including auth_level.

3. A tool router Edge Function implementing the exact request/response
   contract in section 4. It must:
   - validate arguments against a per-tool JSON schema before dispatch
   - enforce the tool's minimum auth_level and return `denied` otherwise
   - set `app.tenant_id` and `app.account_id` via `set_config()` before any
     query, so RLS applies
   - time out at 3s, retry once, then return `upstream_timeout`
   - write a row to core.tool_calls for every invocation including failures

4. An RLS helper module applying the policy pattern in section 3 to any
   company table, parameterised by schema and table name.

5. A handoff function writing to core.handoffs with the full transcript.

6. A test suite proving isolation. At minimum:
   - a session authenticated to account A cannot retrieve account B's rows
     via any tool, including with crafted arguments
   - an unauthenticated session receives zero rows from any Tier 2 tool
   - a tool call exceeding 3s returns upstream_timeout and is logged
   - three failed auth attempts lock the session and create a handoff

Do not build any company-specific tools, tables or knowledge base content.
Do not build an admin UI. Do not integrate Snowflake or any analytics store.

Acceptance: the isolation test suite passes, and a stub tool round-trips
through the router in under 800ms at p95.
```

---

## 7. Acceptance checklist

- [ ] `core` schema created, matches spec exactly
- [ ] Tenant resolution works for all four tenant IDs
- [ ] Tool router enforces auth levels — verified by test, not by inspection
- [ ] RLS proven: account A cannot reach account B's data through any path
- [ ] Failed tool returns a safe error and is logged; bot does not invent
- [ ] Three failed auth attempts lock and hand off
- [ ] Level 2 auth expires after 15 minutes
- [ ] p95 round trip under 800ms with a stub tool
- [ ] No company-specific code present in this layer
