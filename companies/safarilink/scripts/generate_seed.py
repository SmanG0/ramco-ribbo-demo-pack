#!/usr/bin/env python3
"""
Safarilink demo seed data generator.

Generates every CSV listed in 04-safarilink.md and then asserts the demo-skew
conditions. If an assertion fails, the generator is wrong -- fix the generator,
do not relax the assertion. The demo beats depend on these exact conditions.

Usage:
    python3 generate_seed.py --demo-date 2026-08-11 --out ../seed

FACT PROVENANCE
  Baggage allowances, the 20kg exception list, fleet size, destination list and
  excess baggage rates are sourced from flysafarilink.com (retrieved 25 Jul 2026).
  Flight numbers, schedule times, fares, PNRs, passenger names, seat counts and
  all availability are SYNTHETIC and invented for demonstration purposes.
  Airstrip IATA codes marked VERIFY below need confirmation from Safarilink Ops.
"""

import argparse
import csv
import os
import random
import uuid
from datetime import date, datetime, time, timedelta

RNG = random.Random(20260725)  # deterministic output

# --------------------------------------------------------------------------
# REFERENCE DATA — sourced from flysafarilink.com unless marked SYNTHETIC
# --------------------------------------------------------------------------

# 20kg destinations. SOURCE: flysafarilink.com/travel-information/baggageallowance
# "Zanzibar, Kisumu, Diani, Lamu, Malindi, Entebbe and Mombasa"
TWENTY_KG_IATA = {"ZNZ", "KIS", "UKA", "LAU", "MYD", "EBB", "MBA"}

# Airports. is_bush_strip drives demo narrative around airstrip conditions.
# [VERIFY] IATA codes for bush airstrips — several have no assigned IATA code.
#          Confirm internal station codes with Safarilink Operations.
AIRPORTS = [
    # code, name, region, bush, conservancy, verify_code
    ("WIL", "Wilson Airport, Nairobi",   "Nairobi",   False, "",                       False),
    ("NBO", "Jomo Kenyatta Intl",        "Nairobi",   False, "",                       False),
    ("OLX", "Olkiombo",                  "Masai Mara", True, "Mara Reserve / Talek",   True),
    ("KEU", "Keekorok",                  "Masai Mara", True, "Mara Reserve",           True),
    ("MRE", "Mara Serena",               "Masai Mara", True, "Mara Triangle",          True),
    ("KTJ", "Kichwa Tembo",              "Masai Mara", True, "Mara North / Oloololo",  True),
    ("MNA", "Mara North",                "Masai Mara", True, "Mara North Conservancy", True),
    ("OSE", "Ol Seki",                   "Masai Mara", True, "Naboisho Conservancy",   True),
    ("ASV", "Amboseli",                  "Amboseli",   True, "Amboseli NP",            False),
    ("UAS", "Samburu",                   "Samburu",    True, "Samburu / Buffalo Sp.",  False),
    ("LKU", "Lewa Downs",                "Laikipia",   True, "Lewa Conservancy",       False),
    ("LSB", "Loisaba",                   "Laikipia",   True, "Loisaba Conservancy",    True),
    ("NYK", "Nanyuki",                   "Laikipia",  False, "Ol Pejeta / Laikipia",   False),
    ("NVA", "Naivasha",                  "Rift Valley",True, "Lake Naivasha",          True),
    ("KIU", "Kilaguni, Tsavo West",      "Tsavo",      True, "Tsavo West NP",          False),
    ("UKA", "Ukunda (Diani Beach)",      "Coast",     False, "",                       False),
    ("MBA", "Moi Intl, Mombasa",         "Coast",     False, "",                       False),
    ("MYD", "Malindi",                   "Coast",     False, "",                       False),
    ("LAU", "Manda, Lamu",               "Coast",     False, "",                       False),
    ("KIS", "Kisumu",                    "Western",   False, "",                       False),
    ("ZNZ", "Zanzibar",                  "Tanzania",  False, "",                       False),
    ("EBB", "Entebbe",                   "Uganda",    False, "",                       False),
    ("JRO", "Kilimanjaro",               "Tanzania",  False, "",                       False),
    ("ARK", "Arusha",                    "Tanzania",  False, "",                       False),
]

# NOTE: Kigali (KGL) is deliberately ABSENT. It is the off-network graceful
# failure test. Do NOT add it. Entebbe IS served -- an earlier draft of the
# spec wrongly used Entebbe as the off-network test.

# Fleet: 15 aircraft. SOURCE: flysafarilink.com ("15 Aircraft In Fleet").
# [VERIFY] exact type split and registrations with Safarilink Operations.
FLEET = (
    [(f"5Y-SL{i:02d}", "Cessna 208B Grand Caravan", 12, False) for i in range(1, 11)]
    + [("5Y-SLA", "De Havilland Dash 8-100", 37, True),
       ("5Y-SLB", "De Havilland Dash 8-200", 37, True),
       ("5Y-SLC", "De Havilland Dash 8-300", 50, True),
       ("5Y-SLD", "De Havilland Dash 8-300", 50, True),
       ("5Y-SLE", "De Havilland Dash 8-100", 37, True)]
)

# Routes ex-Wilson. SYNTHETIC block times and aircraft assignment.
ROUTE_DEFS = [
    ("OLX", "Cessna 208B Grand Caravan", 45),
    ("KEU", "Cessna 208B Grand Caravan", 50),
    ("MRE", "Cessna 208B Grand Caravan", 55),
    ("KTJ", "Cessna 208B Grand Caravan", 50),
    ("MNA", "Cessna 208B Grand Caravan", 50),
    ("OSE", "Cessna 208B Grand Caravan", 48),
    ("ASV", "Cessna 208B Grand Caravan", 40),
    ("UAS", "Cessna 208B Grand Caravan", 60),
    ("LKU", "Cessna 208B Grand Caravan", 50),
    ("LSB", "Cessna 208B Grand Caravan", 55),
    ("NYK", "Cessna 208B Grand Caravan", 35),
    ("NVA", "Cessna 208B Grand Caravan", 25),
    ("KIU", "Cessna 208B Grand Caravan", 45),
    ("UKA", "De Havilland Dash 8-300",   50),
    ("MBA", "De Havilland Dash 8-300",   55),
    ("MYD", "De Havilland Dash 8-100",   65),
    ("LAU", "De Havilland Dash 8-100",   80),
    ("KIS", "De Havilland Dash 8-300",   55),
    ("ZNZ", "De Havilland Dash 8-300",  110),
    ("EBB", "De Havilland Dash 8-300",  105),
    ("JRO", "De Havilland Dash 8-100",   75),
    ("ARK", "De Havilland Dash 8-100",   80),
]

SEATS_FOR_TYPE = {
    "Cessna 208B Grand Caravan": 12,
    "De Havilland Dash 8-100": 37,
    "De Havilland Dash 8-200": 37,
    "De Havilland Dash 8-300": 50,
}

FIRST_NAMES = ["Sarah", "James", "Anna", "Thomas", "Claire", "Michael", "Emma", "David",
               "Sophie", "Daniel", "Laura", "Peter", "Hannah", "Robert", "Grace",
               "Mark", "Julia", "Simon", "Rachel", "Andrew", "Nicole", "Paul",
               "Elena", "Christopher", "Maria", "Stefan", "Ingrid", "Lars", "Freya", "Johan"]
SURNAMES = ["Whitfield", "Osborne", "Lindqvist", "Bauer", "Moreau", "Rossi", "Novak",
            "Andersen", "Fitzgerald", "Kowalski", "Van der Berg", "Schneider",
            "Bennett", "Castellano", "Okonkwo", "Petrov", "Hargreaves", "Dubois",
            "Nakamura", "Silva", "Kaufmann", "Blackwood", "Ferreira", "Lindgren",
            "Marchetti", "Holloway", "Vasquez", "Thornton", "Bergman", "Ellingsen"]

INTENTS = [("baggage", 0.24), ("schedules", 0.19), ("booking_lookup", 0.17),
           ("check_in", 0.11), ("destinations", 0.08), ("charters", 0.06),
           ("changes", 0.06), ("frequent_flyer", 0.04), ("other", 0.05)]


def pnr():
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return "".join(RNG.choice(chars) for _ in range(6))


def write(path, header, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print(f"  {os.path.basename(path):34s} {len(rows):>6,} rows")


# --------------------------------------------------------------------------
def generate(demo_date, out):
    os.makedirs(out, exist_ok=True)
    print(f"\nDEMO_DATE = {demo_date}\nOutput    = {out}\n")

    # ---- airports ----------------------------------------------------------
    ap_rows = []
    for code, name, region, bush, cons, verify in AIRPORTS:
        ap_rows.append([code, "", name, region, bush, cons, "Africa/Nairobi",
                        "VERIFY station code with Safarilink Ops" if verify else ""])
    write(f"{out}/seed-airports.csv",
          ["iata_code", "icao_code", "name", "region", "is_bush_strip",
           "serves_conservancy", "timezone", "notes"], ap_rows)

    # ---- aircraft ----------------------------------------------------------
    write(f"{out}/seed-aircraft.csv",
          ["registration", "type", "seats", "is_pressurised"],
          [[r, t, s, p] for r, t, s, p in FLEET])

    # ---- routes (outbound ex-WIL + return) --------------------------------
    routes, route_rows = [], []
    for dest, ac_type, block in ROUTE_DEFS:
        for o, d in (("WIL", dest), (dest, "WIL")):
            rid = f"{o}-{d}"
            # Allowance keys off the NON-Wilson end of the route.
            non_wil = d if o == "WIL" else o
            bag = 20 if non_wil in TWENTY_KG_IATA else 15
            routes.append((rid, o, d, ac_type, block, bag))
            route_rows.append([rid, o, d, ac_type, block, bag])
    write(f"{out}/seed-routes.csv",
          ["route_id", "origin_iata", "destination_iata", "typical_aircraft_type",
           "block_time_minutes", "baggage_allowance_kg"], route_rows)

    # ---- schedules ---------------------------------------------------------
    sched, sched_rows = [], []
    fn = 100
    eff_from = demo_date - timedelta(days=180)
    eff_to = demo_date + timedelta(days=180)
    for rid, o, d, ac_type, block, _ in routes:
        n_daily = 2 if o == "WIL" and d in ("OLX", "KEU", "MRE", "UKA") else 1
        for k in range(n_daily):
            fn += 2
            flight_no = f"F2-{fn}"
            dep_h = 7 + (k * 3) + (0 if o == "WIL" else 2)
            dep_m = RNG.choice([0, 15, 30, 45])
            dep = time(min(dep_h, 16), dep_m)
            arr_total = dep.hour * 60 + dep.minute + block
            arr = time((arr_total // 60) % 24, arr_total % 60)
            days = [1, 2, 3, 4, 5, 6, 7] if not any(a[0] == d and a[3] for a in AIRPORTS) \
                else RNG.choice([[1, 2, 3, 4, 5, 6, 7], [1, 3, 5, 7], [2, 4, 6]])
            sched.append((flight_no, rid, days, dep, arr, ac_type))
            sched_rows.append([flight_no, rid, "{" + ",".join(map(str, days)) + "}",
                               dep.strftime("%H:%M"), arr.strftime("%H:%M"),
                               ac_type, "year_round", eff_from, eff_to])

    # ---- HERO FLIGHT: force F2-142 to be WIL-UKA, 10:15 -> 11:05 ----------
    hero_flight = "F2-142"
    for i, (f, rid, days, dep, arr, ac) in enumerate(sched):
        if f == hero_flight:
            sched[i] = (f, "WIL-UKA", [1, 2, 3, 4, 5, 6, 7], time(10, 15), time(11, 5),
                        "De Havilland Dash 8-300")
            break
    else:
        sched.append((hero_flight, "WIL-UKA", [1, 2, 3, 4, 5, 6, 7],
                      time(10, 15), time(11, 5), "De Havilland Dash 8-300"))
    sched_rows = [r for r in sched_rows if r[0] != hero_flight]
    sched_rows.append([hero_flight, "WIL-UKA", "{1,2,3,4,5,6,7}", "10:15", "11:05",
                       "De Havilland Dash 8-300", "year_round", eff_from, eff_to])
    write(f"{out}/seed-schedules.csv",
          ["flight_no", "route_id", "days_of_week", "departure_time", "arrival_time",
           "aircraft_type", "season", "effective_from", "effective_to"], sched_rows)

    # ---- fares (SYNTHETIC) -------------------------------------------------
    fare_rows = []
    for rid, o, d, ac_type, block, _ in routes:
        base = 95 + block * 1.6
        for cls, mult, refund, fee in (("saver", 1.0, False, 40),
                                       ("flex", 1.42, True, 0),
                                       ("resident", 0.68, False, 40)):
            fare_rows.append([str(uuid.UUID(int=RNG.getrandbits(128))), rid, cls,
                              round(base * mult, 2), "USD", refund, fee,
                              "Resident fare - valid Kenyan ID required at check-in"
                              if cls == "resident" else ""])
    write(f"{out}/seed-fares.csv",
          ["fare_id", "route_id", "fare_class", "price", "currency",
           "is_refundable", "change_fee", "conditions"], fare_rows)

    # ---- availability: 30-day forward window, ~82% load factor ------------
    avail, avail_rows = {}, []
    for offset in range(0, 30):
        fd = demo_date + timedelta(days=offset)
        dow = fd.isoweekday()
        for flight_no, rid, days, dep, arr, ac_type in sched:
            if dow not in days:
                continue
            total = SEATS_FOR_TYPE[ac_type]
            sold = min(total, max(0, int(round(RNG.gauss(total * 0.82, total * 0.13)))))
            avail[(flight_no, fd)] = [total, sold]

    # Force scarcity on the hero flight and a handful of Mara services.
    hero_date = demo_date + timedelta(days=15)
    avail[(hero_flight, hero_date)] = [50, 47]          # 3 remaining
    scarce = 0
    for (f, fd), v in avail.items():
        if scarce >= 5 or f == hero_flight:
            continue
        rid = next((s[1] for s in sched if s[0] == f), "")
        if rid.endswith(("OLX", "KEU", "MRE", "KTJ")) and fd > demo_date:
            v[1] = v[0] - RNG.randint(1, 4)
            scarce += 1

    # Nudge global load factor to 82% exactly.
    for _ in range(400):
        tot = sum(v[0] for v in avail.values())
        sld = sum(v[1] for v in avail.values())
        lf = sld / tot
        if abs(lf - 0.82) < 0.002:
            break
        for k, v in avail.items():
            if k == (hero_flight, hero_date):
                continue
            if lf < 0.82 and v[1] < v[0]:
                v[1] += 1
            elif lf > 0.82 and v[1] > 0:
                v[1] -= 1
            break_now = abs(sum(x[1] for x in avail.values()) / tot - 0.82) < 0.002
            if break_now:
                break

    for (f, fd), (total, sold) in sorted(avail.items(), key=lambda x: (x[0][1], x[0][0])):
        avail_rows.append([f, fd, total, sold, total - sold,
                           "open" if total - sold > 0 else "closed"])
    write(f"{out}/seed-availability.csv",
          ["flight_no", "flight_date", "seats_total", "seats_sold",
           "seats_remaining", "status"], avail_rows)

    # ---- bookings / passengers / segments ---------------------------------
    bookings, passengers, segments = [], [], []
    used = set()

    def add_booking(code, surname, first, npax, flight_no, rid, fd, dep, arr,
                    status="confirmed", ret=None, codeshare=False):
        o, d = rid.split("-")
        bag = next(r[5] for r in routes if r[0] == rid)
        bookings.append([code, "safarilink", surname, first,
                         f"{first.lower()}.{surname.lower().replace(' ', '')}@example.com",
                         f"+4470{RNG.randint(10000000, 99999999)}",
                         fd - timedelta(days=RNG.randint(20, 120)), status,
                         round(RNG.uniform(180, 640) * npax, 2), "USD", codeshare])
        for i in range(npax):
            nm = f"{first} {surname}" if i == 0 else f"{RNG.choice(FIRST_NAMES)} {surname}"
            passengers.append([str(uuid.UUID(int=RNG.getrandbits(128))), code, nm,
                               "adult", bag, ""])
        segments.append([str(uuid.UUID(int=RNG.getrandbits(128))), code, flight_no, fd,
                         o, d, dep.strftime("%H:%M"), arr.strftime("%H:%M"), 1])
        if ret:
            r_flight, r_rid, r_fd, r_dep, r_arr = ret
            ro, rd = r_rid.split("-")
            segments.append([str(uuid.UUID(int=RNG.getrandbits(128))), code, r_flight,
                             r_fd, ro, rd, r_dep.strftime("%H:%M"),
                             r_arr.strftime("%H:%M"), 2])

    # HERO BOOKING -- XKPT4M / Whitfield, 2 adults, WIL-UKA, 20kg
    ret_flight = next((s for s in sched if s[1] == "UKA-WIL"), None)
    add_booking("XKPT4M", "Whitfield", "Sarah", 2, hero_flight, "WIL-UKA",
                hero_date, time(10, 15), time(11, 5),
                ret=(ret_flight[0], "UKA-WIL", demo_date + timedelta(days=21),
                     ret_flight[3], ret_flight[4]) if ret_flight else None)
    used.add("XKPT4M")

    # SECOND BOOKING -- RM9K2T / Osborne, Mara route, for the change-request beat
    mara = next(s for s in sched if s[1] == "WIL-OLX")
    add_booking("RM9K2T", "Osborne", "Thomas", 2, mara[0], "WIL-OLX",
                demo_date + timedelta(days=6), mara[3], mara[4])
    used.add("RM9K2T")

    # Filler bookings
    while len(bookings) < 340:
        code = pnr()
        if code in used:
            continue
        used.add(code)
        s = RNG.choice(sched)
        offset = RNG.randint(-120, 29)
        fd = demo_date + timedelta(days=offset)
        if fd.isoweekday() not in s[2]:
            continue
        add_booking(code, RNG.choice(SURNAMES), RNG.choice(FIRST_NAMES),
                    RNG.choice([1, 2, 2, 2, 3, 4]), s[0], s[1], fd, s[3], s[4],
                    status="flown" if offset < 0 else "confirmed",
                    codeshare=RNG.random() < 0.14)

    write(f"{out}/seed-bookings.csv",
          ["pnr", "tenant_id", "lead_passenger_surname", "lead_passenger_name",
           "contact_email", "contact_phone", "booking_date", "status",
           "total_paid", "currency", "is_kq_codeshare"], bookings)
    write(f"{out}/seed-passengers.csv",
          ["passenger_id", "pnr", "full_name", "passenger_type",
           "baggage_allowance_kg", "special_assistance"], passengers)
    write(f"{out}/seed-booking-segments.csv",
          ["segment_id", "pnr", "flight_no", "flight_date", "origin_iata",
           "destination_iata", "departure_time", "arrival_time", "segment_order"],
          segments)

    # ---- flight status (recent operating history) --------------------------
    st_rows = []
    for offset in range(-14, 1):
        fd = demo_date + timedelta(days=offset)
        for flight_no, rid, days, dep, arr, ac in sched:
            if fd.isoweekday() not in days or RNG.random() > 0.45:
                continue
            r = RNG.random()
            if r < 0.80:
                status, delay, reason = "arrived", 0, ""
            elif r < 0.94:
                status, delay, reason = "arrived", RNG.randint(15, 70), "Operational"
            else:
                status, delay, reason = "cancelled", 0, "Weather - airstrip conditions"
            sd = datetime.combine(fd, dep)
            st_rows.append([flight_no, fd, sd.isoformat(),
                            (sd + timedelta(minutes=delay)).isoformat()
                            if status != "cancelled" else "", status, reason])
    write(f"{out}/seed-flight-status.csv",
          ["flight_no", "flight_date", "scheduled_departure", "actual_departure",
           "status", "reason"], st_rows)

    # ---- historical conversations: 41% outside 08:00-18:00 EAT ------------
    conv_rows = []
    intents = [i for i, _ in INTENTS]
    weights = [w for _, w in INTENTS]
    target_out = int(round(800 * 0.41))
    for n in range(800):
        d = demo_date - timedelta(days=RNG.randint(1, 30))
        if n < target_out:
            h = RNG.choice(list(range(0, 8)) + list(range(18, 24)))
        else:
            h = RNG.randint(8, 17)
        ts = datetime.combine(d, time(h, RNG.randint(0, 59)))
        conv_rows.append([str(uuid.UUID(int=RNG.getrandbits(128))), "safarilink",
                          ts.isoformat(),
                          RNG.choices(intents, weights=weights, k=1)[0],
                          "outside_hours" if (h < 8 or h >= 18) else "in_hours"])
    RNG.shuffle(conv_rows)
    write(f"{out}/seed-historical-conversations.csv",
          ["conversation_id", "tenant_id", "started_at", "primary_intent",
           "hours_bucket"], conv_rows)

    return dict(routes=routes, sched=sched, avail=avail, bookings=bookings,
                passengers=passengers, segments=segments, conv=conv_rows,
                hero_flight=hero_flight, hero_date=hero_date, airports=AIRPORTS)


# --------------------------------------------------------------------------
def assert_all(d, demo_date):
    print("\nASSERTIONS")
    fails = []

    def check(label, cond, detail=""):
        print(f"  [{'PASS' if cond else 'FAIL'}] {label}" + (f"  {detail}" if detail else ""))
        if not cond:
            fails.append(label)

    bk = {b[0]: b for b in d["bookings"]}
    segs = [s for s in d["segments"] if s[1] == "XKPT4M"]
    pax = [p for p in d["passengers"] if p[1] == "XKPT4M"]

    check("XKPT4M exists, surname Whitfield",
          "XKPT4M" in bk and bk["XKPT4M"][2] == "Whitfield")
    check("XKPT4M has 2 adult passengers", len(pax) == 2 and all(p[3] == "adult" for p in pax),
          f"got {len(pax)}")
    out_seg = next((s for s in segs if s[8] == 1), None)
    check("outbound is F2-142 WIL->UKA",
          out_seg and out_seg[2] == "F2-142" and out_seg[4] == "WIL" and out_seg[5] == "UKA")
    check(f"outbound date = DEMO_DATE + 15d ({d['hero_date']})",
          out_seg and out_seg[3] == d["hero_date"], str(out_seg[3]) if out_seg else "")
    check("outbound times 10:15 / 11:05",
          out_seg and out_seg[6] == "10:15" and out_seg[7] == "11:05")

    wil_uka = next(r for r in d["routes"] if r[0] == "WIL-UKA")
    check("route WIL-UKA baggage_allowance_kg = 20", wil_uka[5] == 20, f"got {wil_uka[5]}")
    check("passenger allowance on XKPT4M = 20kg", all(int(p[4]) == 20 for p in pax))

    total, sold = d["avail"][(d["hero_flight"], d["hero_date"])]
    check("F2-142 on hero date has 3 seats remaining", total - sold == 3,
          f"got {total - sold}")

    lf = sum(v[1] for v in d["avail"].values()) / sum(v[0] for v in d["avail"].values())
    check("forward-window load factor = 82% +/-1%", abs(lf - 0.82) <= 0.01,
          f"got {lf:.1%}")

    check("RM9K2T exists, surname Osborne",
          "RM9K2T" in bk and bk["RM9K2T"][2] == "Osborne")
    r_seg = next((s for s in d["segments"] if s[1] == "RM9K2T"), None)
    check("RM9K2T on a Mara route at DEMO_DATE + 6d",
          r_seg and r_seg[5] == "OLX" and r_seg[3] == demo_date + timedelta(days=6))

    check("800 historical conversations", len(d["conv"]) == 800, f"got {len(d['conv'])}")
    oh = sum(1 for c in d["conv"] if c[4] == "outside_hours") / len(d["conv"])
    check("41% of conversations outside 08:00-18:00", abs(oh - 0.41) <= 0.01,
          f"got {oh:.1%}")
    bag_share = sum(1 for c in d["conv"] if c[3] == "baggage") / len(d["conv"])
    check("baggage is the top intent at ~24%", 0.20 <= bag_share <= 0.28,
          f"got {bag_share:.1%}")

    codes = {a[0] for a in d["airports"]}
    check("KGL (Kigali) absent - off-network failure test", "KGL" not in codes)
    check("EBB (Entebbe) IS served - spec correction", "EBB" in codes)
    check("Tsavo West (KIU) served - spec correction", "KIU" in codes)
    check("Kitale/Lodwar NOT in network - spec correction",
          "KTL" not in codes and "LOK" not in codes)

    twenty = {r[0].split("-")[1] if r[0].startswith("WIL") else r[0].split("-")[0]
              for r in d["routes"] if r[5] == 20}
    check("20kg routes match published list exactly",
          twenty == TWENTY_KG_IATA, f"got {sorted(twenty)}")

    check("fleet is 15 aircraft", len(FLEET) == 15, f"got {len(FLEET)}")

    print()
    if fails:
        raise SystemExit(f"FAILED {len(fails)} assertion(s): {fails}\n"
                         "Fix the generator. Do not relax the assertion.")
    print("All assertions passed.\n")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--demo-date", required=True, help="YYYY-MM-DD")
    p.add_argument("--out", default="../seed")
    a = p.parse_args()
    dd = datetime.strptime(a.demo_date, "%Y-%m-%d").date()
    data = generate(dd, a.out)
    assert_all(data, dd)
