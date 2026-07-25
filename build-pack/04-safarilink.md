# 04 — Safarilink Aviation

> ⚠️ **READ THIS SPEC ALONGSIDE `companies/safarilink/SPEC-CORRECTIONS.md`.**
> Five facts below were drawn from third-party travel sites and are **wrong**.
> The corrections doc supersedes this spec wherever they conflict. The big ones:
> **15 aircraft** (not ~12); **Entebbe IS served** (off-network test is now **Kigali/KGL**, not Entebbe);
> 20kg routes are **Zanzibar, Kisumu, Diani, Lamu, Malindi, Entebbe, Mombasa** (not Kitale/Lodwar);
> **no published max bag dimension** (do not state one); **Kitale & Lodwar are not in the network** (Tsavo West/Kilaguni is).
> Do not build from the uncorrected figures in sections 1, 4 and 6 below.

**Vertical:** Ramco Oritsu (Services & Trading)
**Agent pattern:** Inventory query + identity verification
**Tenant:** `safarilink`
**Effort:** 3 days after the spine

---

## 1. The business

Kenya's premier safari airline, founded 2004, based at Wilson Airport, Nairobi. Approximately 12 aircraft — Cessna 208B Caravans (12 seats) and De Havilland Dash 8-100/200/300 (35–50 seats). Daily scheduled services to ~18 destinations across Kenya and northern Tanzania. **20,000+ passengers per month at peak.** 251 staff including 46 pilots. Codeshare with Kenya Airways.

Destinations include Maasai Mara (multiple airstrips — Olkiombo, Keekorok, Kichwa Tembo, Mara Serena, Mara North, Angama, Ol Seki, Olare), Amboseli, Samburu, Lewa, Loisaba, Nanyuki, Naivasha, Lamu, Kiwayu, Malindi, Mombasa, Diani (Ukunda), Kisumu, Kitale, Lodwar, Kilimanjaro and Zanzibar.

## 2. Why this bot exists

This is the only **consumer-facing** build and the only one with genuine round-the-clock demand. Safari travellers are largely international, in other time zones, asking operational questions at 2am Nairobi time when nobody is at the desk.

It is also the only build where a wrong answer carries **regulatory and reputational weight**. Aviation is unforgiving.

## 3. Demo narrative

> A traveller messages at 02:14 asking about baggage for Diani. The bot answers from the knowledge base instantly — including the fact that Diani is one of the 20kg exceptions, not the standard 15kg. Then it offers to confirm the exact allowance on their specific booking. They give a PNR and surname, and the bot returns their itinerary, flight times, per-passenger allowance and check-in time.

**Why this wins the room:** nobody is at the desk, and the whole thing resolves without a human. Then say the number — 20,000 passengers a month at peak — and let them do the arithmetic themselves.

**Second beat:** they ask to change the flight. The bot does **not** do it. It captures the request, states what happens next, and hands to a human. Showing the limit is the credibility move with an airline audience.

---

## 4. Knowledge base documents

Namespace `kb/safarilink/`.

> **This is the highest-risk knowledge base in the pack.** A hallucinated baggage rule gets a passenger charged at a remote airstrip with no recourse, and that is Safarilink's problem caused by our bot. Every operational fact here must be verbatim and verified. Schedules and fares must NOT appear.

| Filename | Contents |
|---|---|
| `kb-baggage.md` | **Most-read file.** Standard allowance 15kg total including hand baggage and personal items (cameras, laptops). 20kg on Zanzibar, Kisumu, Kitale, Diani, Lodwar. Soft-sided bags only — no hard shells, no rigid frames. Maximum dimensions 90 × 65 × 35cm. Excess baggage policy. Why the limits exist (Caravan payload into bush strips). |
| `kb-prohibited-items.md` | Items not permitted in hold or cabin, with the aviation reasoning |
| `kb-check-in.md` | Check-in windows by route type, where the Safarilink desk is at Wilson, arrival guidance, what ID is needed, boarding process |
| `kb-wilson-airport.md` | Getting to Wilson, parking, the Executive Safari Lounge, transfer time from JKIA, typical traffic allowances |
| `kb-destinations.md` | Which destinations are served, which airstrips serve which conservancies, typical flight durations, what to expect at a bush airstrip. **No schedules, no times, no days of operation.** |
| `kb-charters.md` | Private charter enquiry process, what information is needed, aircraft types available, how it differs from scheduled |
| `kb-safari-bonus.md` | Frequent flyer programme, earning, redeeming, tiers |
| `kb-codeshare-kq.md` | Kenya Airways codeshare — what it covers, through-baggage, connection guidance at JKIA/Wilson |
| `kb-children-infants.md` | Infant and child policies, seat requirements, unaccompanied minors, baggage for children |
| `kb-special-assistance.md` | Reduced mobility, medical requirements, oxygen, what to declare in advance and how |
| `kb-weather-delays.md` | How weather affects bush airstrip operations, what happens on a delay or diversion, what passengers should expect. Sets expectations without committing to specifics |
| `kb-about.md` | Founded 2004, fleet composition, network scale, KAAO membership, IATA standard safety assessment |

---

## 5. Seed data files

| Filename | Rows | Notes |
|---|---|---|
| `seed-airports.csv` | 24 | All served airstrips + Wilson + JKIA |
| `seed-aircraft.csv` | 12 | Actual fleet composition |
| `seed-routes.csv` | 38 | Origin/destination pairs |
| `seed-schedules.csv` | 210 | Flight numbers × days of operation |
| `seed-fares.csv` | 152 | Route × class |
| `seed-availability.csv` | ~6,300 | Flight × date, 30-day forward window |
| `seed-bookings.csv` | 340 | Mix of past and forward |
| `seed-passengers.csv` | 710 | 1–4 per booking |
| `seed-flight-status.csv` | ~450 | Recent operating history |

### Column definitions

**seed-airports.csv**
```
iata_code, icao_code, name, region, is_bush_strip, serves_conservancy,
timezone, notes
```

**seed-aircraft.csv**
```
registration, type, seats, is_pressurised, typical_routes
```
8 × Cessna 208B Caravan (12 seats), 1 × Dash 8-100 (35), 1 × Dash 8-200 (37), 2 × Dash 8-300 (50).

**seed-routes.csv**
```
route_id, origin_iata, destination_iata, typical_aircraft_type,
block_time_minutes, baggage_allowance_kg
```
**`baggage_allowance_kg` lives on the route, not globally.** 15 default; 20 for ZNZ, KIS, KTL, UKA, LOK. This is what makes `get_baggage_allowance` meaningful rather than a knowledge base lookup.

**seed-schedules.csv**
```
flight_no, route_id, days_of_week, departure_time, arrival_time,
aircraft_type, season, effective_from, effective_to
```
Flight numbers in the `F2xxx` format.

**seed-fares.csv**
```
fare_id, route_id, fare_class, price, currency, is_refundable,
change_fee, conditions
```
`fare_class`: `saver | flex | resident`. Kenyan resident fares are a real thing on this network — include them.

**seed-availability.csv**
```
flight_no, flight_date, seats_total, seats_sold, seats_remaining, status
```
30-day forward window from `DEMO_DATE`.

**seed-bookings.csv**
```
pnr, lead_passenger_surname, lead_passenger_name, contact_email, contact_phone,
booking_date, status, total_paid, currency, is_kq_codeshare
```
`pnr`: 6 alphanumeric characters, uppercase.
`status`: `confirmed | cancelled | flown | pending_change`

**seed-passengers.csv**
```
passenger_id, pnr, full_name, passenger_type, baggage_allowance_kg,
special_assistance
```
`passenger_type`: `adult | child | infant`

**seed-booking-segments.csv**
```
segment_id, pnr, flight_no, flight_date, origin_iata, destination_iata,
departure_time, arrival_time, segment_order
```

**seed-flight-status.csv**
```
flight_no, flight_date, scheduled_departure, actual_departure, status, reason
```
`status`: `on_time | delayed | departed | arrived | cancelled`

---

## 6. Data skew — engineer these conditions

### The hero booking — PNR `XKPT4M`

- Lead passenger **Whitfield**, first name Sarah
- 2 adults
- Segment: **F2-142, Wilson (WIL) → Ukunda (UKA)**, `DEMO_DATE + 15d`, departing 10:15, arriving 11:05
- Route baggage allowance: **20kg** (Diani is an exception route)
- Status `confirmed`, fare class `flex`
- Return segment: UKA → WIL, `DEMO_DATE + 21d`

This produces the core exchange: generic baggage question answered from the KB, then the specific confirmation from the booking.

### Peak season pressure

- `DEMO_DATE` falls in high season, so seed availability accordingly
- **F2-142 on `DEMO_DATE + 15d`: `seats_remaining = 3`** out of 50. If asked about changes, the bot can honestly say the flight is nearly full
- Several Mara flights in the forward window at `seats_remaining` between 1 and 4
- Overall load factor across the forward window: **82%**

This creates genuine urgency without fabrication.

### The change request — where the bot stops

- Seed a second booking, PNR `RM9K2T`, surname **Osborne**, on a Mara route `DEMO_DATE + 6d`
- When the traveller asks to move to an earlier flight, the bot captures the request, states that a colleague will confirm within a stated window, and creates a handoff
- **`request_change` must not touch availability, bookings or segments.** It writes a handoff record only.

### Aircraft-type nuance

- Seed one Mara routing operated by a **Caravan** and one by a **Dash 8**
- Different baggage handling implications, different cabin. If asked "what plane is it", the bot answers from the schedule — a small detail that reads as genuine system access rather than a scripted demo

### Failed auth path

- Rehearse PNR `XKPT4M` with the wrong surname
- Bot must say the reference and surname do not match. It must **not** reveal that the PNR exists
- Three failures → lock, handoff

### Aggregate claim

Seed `core.messages` with 800 synthetic historical conversations timestamped across a 30-day window, distributed so that:

- **41% fall outside 08:00–18:00 East Africa Time**
- The top five intents are baggage (24%), schedules (19%), booking lookup (17%), check-in (11%), destinations (8%)

Supports the pitch line: *"41% of your inbound arrives when the desk is closed, and a quarter of everything is one question about baggage."*

### Graceful failure — deliberate

Ask about a **destination Safarilink does not serve** (e.g. Entebbe). The bot must say it is not on the network and offer the charter route or the KQ codeshare, rather than inventing a flight. Rehearse this.

---

## 7. Database schema

```sql
create schema if not exists safarilink;

create table safarilink.airports (
  iata_code         text primary key,
  icao_code         text,
  name              text not null,
  region            text,
  is_bush_strip     boolean not null default false,
  serves_conservancy text,
  timezone          text not null default 'Africa/Nairobi',
  notes             text
);

create table safarilink.aircraft (
  registration    text primary key,
  type            text not null,
  seats           int not null,
  is_pressurised  boolean not null default false
);

create table safarilink.routes (
  route_id             text primary key,
  origin_iata          text not null references safarilink.airports(iata_code),
  destination_iata     text not null references safarilink.airports(iata_code),
  typical_aircraft_type text,
  block_time_minutes   int,
  baggage_allowance_kg int not null default 15,
  unique (origin_iata, destination_iata)
);

create table safarilink.schedules (
  flight_no      text not null,
  route_id       text not null references safarilink.routes(route_id),
  days_of_week   int[] not null,               -- 1=Mon .. 7=Sun
  departure_time time not null,
  arrival_time   time not null,
  aircraft_type  text,
  season         text,
  effective_from date not null,
  effective_to   date,
  primary key (flight_no, effective_from)
);
create index on safarilink.schedules (route_id);

create table safarilink.fares (
  fare_id       uuid primary key default gen_random_uuid(),
  route_id      text not null references safarilink.routes(route_id),
  fare_class    text not null check (fare_class in ('saver','flex','resident')),
  price         numeric(12,2) not null,
  currency      text not null default 'USD',
  is_refundable boolean not null default false,
  change_fee    numeric(12,2),
  conditions    text
);

create table safarilink.availability (
  flight_no       text not null,
  flight_date     date not null,
  seats_total     int not null,
  seats_sold      int not null default 0,
  seats_remaining int generated always as (seats_total - seats_sold) stored,
  status          text not null default 'open',
  primary key (flight_no, flight_date)
);
create index on safarilink.availability (flight_date);

create table safarilink.bookings (
  pnr                    text primary key,
  tenant_id              text not null references core.tenants(tenant_id),
  lead_passenger_surname text not null,
  lead_passenger_name    text not null,
  contact_email          text,
  contact_phone          text,
  booking_date           date not null,
  status                 text not null check (status in
                           ('confirmed','cancelled','flown','pending_change')),
  total_paid             numeric(12,2),
  currency               text not null default 'USD',
  is_kq_codeshare        boolean not null default false
);
create index on safarilink.bookings (lower(lead_passenger_surname));

create table safarilink.passengers (
  passenger_id         uuid primary key default gen_random_uuid(),
  pnr                  text not null references safarilink.bookings(pnr) on delete cascade,
  full_name            text not null,
  passenger_type       text not null check (passenger_type in ('adult','child','infant')),
  baggage_allowance_kg int,
  special_assistance   text
);

create table safarilink.booking_segments (
  segment_id       uuid primary key default gen_random_uuid(),
  pnr              text not null references safarilink.bookings(pnr) on delete cascade,
  flight_no        text not null,
  flight_date      date not null,
  origin_iata      text not null references safarilink.airports(iata_code),
  destination_iata text not null references safarilink.airports(iata_code),
  departure_time   time not null,
  arrival_time     time not null,
  segment_order    int not null
);
create index on safarilink.booking_segments (pnr, segment_order);

create table safarilink.flight_status (
  flight_no           text not null,
  flight_date         date not null,
  scheduled_departure timestamptz,
  actual_departure    timestamptz,
  status              text not null check (status in
                        ('on_time','delayed','departed','arrived','cancelled')),
  reason              text,
  primary key (flight_no, flight_date)
);

create table safarilink.change_requests (
  request_id   uuid primary key default gen_random_uuid(),
  pnr          text not null references safarilink.bookings(pnr),
  session_id   uuid,
  request_text text not null,
  status       text not null default 'open',
  created_at   timestamptz not null default now()
);
```

### Relationships

```
airports 1 ──< routes >── airports
             route_id 1 ──< schedules
                       1 ──< fares

schedules.flight_no ──< availability     (soft join on flight_no)
                    ──< flight_status

bookings 1 ──< passengers
         1 ──< booking_segments ──> airports
         1 ──< change_requests
```

### RLS

`bookings`, `passengers`, `booking_segments`, `change_requests` gated on a resolved PNR held in session state — set `app.pnr` after successful auth. `airports`, `routes`, `schedules`, `fares`, `availability`, `flight_status` are public within the tenant.

---

## 8. Tools

| Tool | Auth | Arguments | Returns |
|---|---|---|---|
| `search_flights` | 0 | `origin`, `destination`, `date`, `passengers?` | Flights, times, aircraft type, seats remaining band |
| `get_fare` | 0 | `route_id`, `fare_class?`, `passengers?` | Price, conditions, change fee |
| `get_flight_status` | 0 | `flight_no`, `date` | Status, scheduled vs actual |
| `verify_booking` | 0 → 1 | `pnr`, `surname` | Success/failure only. On success elevates to level 1 |
| `get_booking` | 1 | — | Itinerary, segments, passengers, times |
| `get_baggage_allowance` | 1 | — | Per-segment allowance from route, per passenger |
| `request_change` | 1 | `request_text` | Handoff reference, expected response window |

### The two that matter

```json
{
  "name": "verify_booking",
  "description": "Verify a booking reference against a passenger surname. Returns only whether the pair matched — never any booking detail. On success the session is elevated to auth level 1 for that PNR. Never reveal whether a PNR exists when the surname does not match.",
  "input_schema": {
    "type": "object",
    "properties": {
      "pnr":     { "type": "string", "pattern": "^[A-Z0-9]{6}$" },
      "surname": { "type": "string", "minLength": 2 }
    },
    "required": ["pnr", "surname"]
  }
}
```

Returns exactly:
```json
{ "verified": true, "lead_passenger_first_name": "Sarah" }
```
or
```json
{ "verified": false, "attempts_remaining": 2 }
```

Nothing else. No hints.

```json
{
  "name": "get_baggage_allowance",
  "description": "Baggage allowance for the authenticated booking, resolved per segment from the route. Allowances differ by route — do not assume the standard applies.",
  "input_schema": { "type": "object", "properties": {}, "required": [] }
}
```

Returns:
```json
{
  "segments": [
    { "flight_no": "F2-142", "route": "WIL-UKA", "date": "2026-XX-XX",
      "allowance_kg": 20, "is_exception": true,
      "note": "Diani is one of our higher-allowance routes" }
  ],
  "passengers": [
    { "name": "Sarah Whitfield", "type": "adult", "allowance_kg": 20 },
    { "name": "James Whitfield", "type": "adult", "allowance_kg": 20 }
  ],
  "conditions": "Total includes hand baggage and personal items. Soft bags only."
}
```

---

## 9. Bot system prompt

Prepend the shared fragment, then:

```
You work for Safarilink Aviation, Kenya's safari airline, part of Ramco
Oritsu and the Ramco Group. You help travellers with baggage, schedules,
check-in, destinations and their bookings.

WHO YOU ARE TALKING TO
Mostly international leisure travellers heading to safari destinations. Many
are writing from other time zones, often the night before travel, often
anxious about a trip they have planned for a year. Be calm, clear and
reassuring. Answer the question first, then add what they will need next.

BAGGAGE — YOUR MOST COMMON QUESTION
The standard allowance is 15kg total including hand baggage and personal
items such as cameras and laptops. Several routes carry 20kg: Zanzibar,
Kisumu, Kitale, Diani and Lodwar. Bags must be soft-sided — no hard shells,
no rigid frames — because they load into the hold of a Caravan. Maximum
dimensions 90 x 65 x 35cm.

Always state whether the route they asked about is standard or an exception.
If they have a booking, offer to confirm the exact allowance on their specific
routing, because it is resolved per segment.

Never approximate a baggage figure. A passenger who arrives at a bush airstrip
over their limit has no options — there is no next flight and no left luggage.
Getting this right matters more than being brief.

SCHEDULES, FARES AND SEATS
Always from a tool. Never from memory, never from the knowledge base.
Never state a departure time, a price or seat availability you did not just
retrieve.

BOOKINGS
To access a booking you need the booking reference and the surname on the
booking. Ask for both together.

If verification fails, say the reference and surname do not match our records.
Do not say whether the reference exists. Do not hint. After three failures,
stop and connect them to a colleague.

Once verified, discuss only that booking. Never the lead passenger's full
details beyond what they need, never another booking, never a manifest.

CHANGES AND CANCELLATIONS
You do not change, cancel or rebook flights. This is deliberate.

When asked, capture what they want in their own words, call request_change,
and tell them a colleague will come back to them with options and any fare
difference. Give the expected response window. Do not quote a change fee as
if it were final — conditions vary by fare and by availability.

Be warm about this, not bureaucratic. "I can't move it myself, but I've passed
this to our reservations team with your details and they'll come back to you
within the hour with the options."

DESTINATIONS WE DO NOT SERVE
If asked about somewhere off our network, say so plainly and offer the
alternatives: a private charter enquiry, or the Kenya Airways codeshare where
it applies. Never invent a route.

WEATHER AND DELAYS
Bush airstrip operations are weather-dependent. You may explain generally what
happens on a delay or diversion. You may not predict, and you may not commit
to a departure on behalf of operations. For a live disruption, connect them
to a colleague immediately.

SAFETY AND MEDICAL
Anything touching medical requirements, oxygen, reduced mobility or an
unaccompanied minor — give the general policy, then hand off. These need a
human.
```

---

## 10. Demo script

**Set the scene out loud: it is 02:14 in Nairobi.**

| # | Speaker | Message | Expected behaviour |
|---|---|---|---|
| 1 | Traveller | "how much luggage can I take to Diani" | Tier 0, KB only, no tool call. States 20kg, explains it is above the 15kg standard, notes total includes hand baggage, soft bags only. Offers to confirm on their booking. Sub-second. |
| 2 | Traveller | "its XKPT4M, Whitfield" | `verify_booking` → level 1. `get_booking` + `get_baggage_allowance`. Returns F2-142 WIL→UKA, date, 10:15/11:05, 2 passengers at 20kg each, check-in time. |
| 3 | Traveller | "can I move it to the morning before" | `request_change`. Does NOT modify anything. Captures request, gives handoff reference and response window, stays warm. |
| 4 | Presenter | Repeat step 2 with the wrong surname | "Reference and surname don't match." No confirmation the PNR exists. |

**Reserve — off-network:** "do you fly to Entebbe?" → not on the network, offers charter or KQ codeshare.

**Then say the numbers:** 20,000 passengers a month at peak. 41% of inbound outside desk hours. A quarter of everything is baggage.

---

## 11. On flight tracking APIs — do not use them

The build agent may be tempted to wire `get_flight_status` to a public aviation API (AviationStack, FlightAware AeroAPI, AeroDataBox, OpenSky). **Do not, for the demo.**

Reasons, in order of importance:

1. **Strategic.** Demonstrating Safarilink's own flight status pulled from a third-party aggregator shows them a worse copy of data they already own — and quietly answers "why would we give Ribbo access to our systems?" with "you wouldn't." It undercuts the entire Tier 2 conversation, which is where the contract lives.
2. **Coverage.** These feeds are ADS-B derived and coverage is thin outside dense regions. Ground receiver density over the Mara, Amboseli and Samburu is a fraction of Nairobi's, and satellite ADS-B sits behind expensive commercial feeds. The routes that matter most to Safarilink are the ones most likely to return nothing.
3. **Data depth.** Small regional operators are frequently thin or absent in these datasets. Whether F2 schedules are carried at usable depth is unverified — assume not until tested.
4. **Reliability.** Never demo live against an API you do not control.

**Where they are legitimately useful:** wire one tool to a live external API during development purely to prove the tool-calling path works against something real rather than a mock. Do not ship it in the demo. Post-sale, independent delay and diversion signals alongside their own ops data is a reasonable v2 feature.

---

## 12. Build agent prompt

```
Build the Safarilink Aviation demonstration bot on top of the shared spine
(01-shared-spine.md must exist and pass acceptance first).

Read this entire document before writing code, including section 11.

Deliver:

1. Migration creating the `safarilink` schema per section 7 with RLS as
   specified. Note that booking access is gated on a resolved PNR held in
   session state via app.pnr, not on an account id.

2. Seed generator producing the CSVs in section 5, all dates relative to
   DEMO_DATE, with assertions verifying every condition in section 6:
     - PNR XKPT4M exists, surname Whitfield, 2 adult passengers
     - its segment is F2-142 WIL->UKA on DEMO_DATE + 15 days, 10:15 / 11:05
     - route WIL-UKA has baggage_allowance_kg = 20
     - F2-142 on that date has seats_remaining = 3
     - forward-window load factor is 82% (+/- 1%)
     - PNR RM9K2T exists with surname Osborne on a Mara route DEMO_DATE + 6d
     - 800 seeded historical conversations, 41% outside 08:00-18:00 EAT
     - Entebbe (EBB) does NOT appear in airports or routes

3. The twelve knowledge base documents in section 4 as markdown in
   kb/safarilink/. 400-800 words each.

   kb-baggage.md is the highest-risk file in this entire build pack. Every
   figure in it must match the route table exactly. Cross-check: the 20kg
   exception routes listed in the KB must be precisely the routes with
   baggage_allowance_kg = 20 in seed-routes.csv. Write an assertion for this.

   DO NOT put schedules, times, days of operation, fares or seat availability
   in any knowledge base file. kb-destinations.md describes places, not
   timetables.

4. The seven tools in section 8 on the router contract.

   verify_booking must return ONLY the verified boolean and, on success, the
   lead passenger's first name. It must return an identical response shape
   whether the PNR does not exist or the surname does not match. Test this
   explicitly — an attacker must not be able to enumerate valid PNRs.

   get_baggage_allowance must resolve allowance per segment from
   routes.baggage_allowance_kg, never from a constant.

   request_change must write ONLY to safarilink.change_requests and create a
   core.handoffs row. It must not touch bookings, booking_segments or
   availability under any circumstances. Assert this.

5. The system prompt in section 9.

6. A rehearsal script replaying section 10 including the failed-auth path and
   the off-network reserve.

DO NOT wire any tool to a public flight tracking API for the demo. Read
section 11. Seeded data only.

DO NOT build flight changes, cancellations, rebooking or payment. Tier 3 is
explicitly out of scope for this build.

Acceptance: rehearsal passes three consecutive times; failed auth reveals
nothing about PNR existence; three failures lock and hand off; request_change
provably mutates no booking data; baggage KB figures match the route table.
```

---

## 13. Acceptance checklist

- [ ] All seed assertions pass
- [ ] `kb-baggage.md` figures match `routes.baggage_allowance_kg` exactly
- [ ] Step 1 answers from KB with no tool call, sub-second
- [ ] `verify_booking` response shape identical for bad PNR and bad surname
- [ ] Three failed attempts lock the session and create a handoff
- [ ] `get_baggage_allowance` resolves per segment, not from a constant
- [ ] `request_change` mutates nothing except `change_requests` and `handoffs`
- [ ] Off-network destination declined with alternatives offered, no invented route
- [ ] No schedule, fare or availability data in any `kb-*.md`
- [ ] No public flight tracking API in the demo path
