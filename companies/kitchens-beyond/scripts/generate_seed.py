#!/usr/bin/env python3
"""
Kitchens & Beyond demo seed data generator.

Fourth demo, fourth agent pattern: consultative qualification + appointment
booking. See RATIONALE.md -- this replaces the originally recommended
Kentainers, which Ramco Group DISPOSED OF in June 2023.

The write action here is a CALENDAR SLOT, not an order. No other bot in the
demo books anything.

Usage:
    python3 generate_seed.py --demo-date 2026-08-11 --out ../seed

FACT PROVENANCE
  Brand roster (Snaidero, Kohler, Novamobili, Caesar, Ideagroup, Azzurra,
  Bosch, Franke), the ten-year warranty floor, Superbrands 2021-22, 13+ years
  trading, in-house 3D visualisation, and The Promenade showroom location:
  kitchensandbeyond.co.ke, company LinkedIn, ramco-group.com (25 Jul 2026).
  All clients, projects, enquiries, designers, slots and timings are SYNTHETIC.
  NO PRICES appear anywhere -- Kitchens & Beyond publishes none.
"""

import argparse, csv, os, random, uuid
from datetime import datetime, timedelta, time

RNG = random.Random(20110811)

# SOURCE: kitchensandbeyond.co.ke / LinkedIn
RANGE = [
    ("Kitchens",            "Snaidero",   "Italy"),
    ("Sanitaryware",        "Kohler",     "Kenyan retailer"),
    ("Wardrobes",           "Novamobili", ""),
    ("Porcelain tiles",     "Caesar",     ""),
    ("Vanities",            "Ideagroup",  ""),
    ("Vanities",            "Azzurra",    ""),
    ("Built-in appliances", "Bosch",      ""),
    ("Sinks & faucets",     "Franke",     ""),
]
BRANDS = sorted({b for _, b, _ in RANGE})

# Client-side stages block the project; K&B-side stages do not.
STAGES = ["enquiry", "showroom_consultation", "survey", "design_3d",
          "client_selections", "quotation_approval", "order_placed",
          "delivery", "installation", "handover"]
CLIENT_BLOCKING = {"client_selections", "quotation_approval"}

SELECTION_ITEMS = ["Caesar tile selection", "worktop material", "door finish",
                   "cabinet handles", "tap finish", "appliance package",
                   "wardrobe internal layout", "grout colour"]

AREAS = ["Runda", "Kitisuru", "Lavington", "Muthaiga", "Karen", "Westlands",
         "Gigiri", "Nyari", "Rosslyn", "Spring Valley", "Loresho", "Kileleshwa"]

FIRST = ["Amina", "Nikhil", "Wanjiku", "Rajesh", "Achieng", "Tariq", "Nadia",
         "Suresh", "Njeri", "Omar", "Priya", "Kamau", "Zainab", "Anand",
         "Muthoni", "Yusuf", "Sanjay", "Grace", "Hassan", "Meera", "Brian",
         "Fatuma", "Vikram", "Waweru", "Leila", "Deepak", "Nyambura"]
LAST = ["Karanja", "Shah", "Mwangi", "Patel", "Otieno", "Hussein", "Bhatt",
        "Kariuki", "Mehta", "Abdi", "Njoroge", "Rana", "Wanjala", "Desai",
        "Kimani", "Farah", "Joshi", "Ochieng", "Ali", "Gupta", "Maina"]

DESIGNERS = ["Priya Shah", "Daniel Mwangi", "Aisha Noor", "Kevin Otieno"]

ENQ_SOURCES = ["whatsapp", "website_form", "instagram", "walk_in",
               "referral", "phone"]
ENQ_INTENTS = [("kitchen", 0.34), ("bathroom_sanitaryware", 0.20),
               ("wardrobes", 0.14), ("tiles", 0.11),
               ("whole_house", 0.09), ("appliances", 0.06),
               ("pricing_only", 0.06)]


def w(path, header, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        cw = csv.writer(f); cw.writerow(header); cw.writerows(rows)
    print(f"  {os.path.basename(path):38s} {len(rows):>6,} rows")


def uid():
    return str(uuid.UUID(int=RNG.getrandbits(128)))


def generate(dd, out):
    os.makedirs(out, exist_ok=True)
    print(f"\nDEMO_DATE = {dd}\nOutput    = {out}\n")

    # ---- range / brands. NO price column anywhere. -----------------------
    prows = []
    for cat, brand, note in RANGE:
        prows.append([f"{brand[:3].upper()}-{cat[:4].upper()}", "kandb",
                      cat, brand, note, 10, True])
    w(f"{out}/seed-range.csv",
      ["range_code", "tenant_id", "category", "brand", "note",
       "min_warranty_years", "is_active"], prows)

    # ---- designers -------------------------------------------------------
    designers, drows = {}, []
    for n in DESIGNERS:
        did = uid(); designers[n] = did
        drows.append([did, "kandb", n, "Interior Designer", True])
    w(f"{out}/seed-designers.csv",
      ["designer_id", "tenant_id", "full_name", "role", "is_active"], drows)

    # ---- appointment slots: 28-day forward window ------------------------
    # Saturdays deliberately scarce -- weekend demand is the real constraint.
    slots, srows = {}, []
    for off in range(0, 28):
        d = dd + timedelta(days=off)
        dow = d.isoweekday()
        if dow == 7:                       # closed Sunday [VERIFY]
            continue
        times = [time(10, 0), time(12, 0), time(14, 0), time(16, 0)] \
            if dow != 6 else [time(10, 0), time(11, 30), time(14, 0)]
        for nm, did in designers.items():
            for t in times:
                booked = RNG.random() < (0.86 if dow == 6 else 0.55)
                slots[(did, d, t)] = booked

    # FORCED: the first Saturday in the window has exactly 2 slots free
    first_sat = next(dd + timedelta(days=o) for o in range(0, 14)
                     if (dd + timedelta(days=o)).isoweekday() == 6)
    sat_keys = [k for k in slots if k[1] == first_sat]
    for k in sat_keys:
        slots[k] = True
    for k in RNG.sample(sat_keys, 2):
        slots[k] = False

    for (did, d, t), booked in sorted(slots.items(), key=lambda x: (x[0][1], x[0][2])):
        srows.append([uid(), "kandb", did, d, t.strftime("%H:%M"), booked])
    w(f"{out}/seed-appointment-slots.csv",
      ["slot_id", "tenant_id", "designer_id", "slot_date", "slot_time",
       "is_booked"], srows)

    # ---- clients ---------------------------------------------------------
    clients, crows = [], []
    def add_client(name, wa, area, ptype):
        cid = uid()
        clients.append((cid, name, wa))
        crows.append([cid, "kandb", name, wa or "",
                      f"{name.split()[0].lower()}@example.co.ke", area, ptype,
                      dd - timedelta(days=RNG.randint(10, 700))])
        return cid

    # HERO CLIENT
    hero_client = add_client("Amina Karanja", "254733204118", "Runda",
                             "new_build")
    for _ in range(74):
        add_client(f"{RNG.choice(FIRST)} {RNG.choice(LAST)}",
                   f"2547{RNG.randint(10000000, 99999999)}"
                   if RNG.random() < 0.55 else None,
                   RNG.choice(AREAS),
                   RNG.choice(["new_build", "renovation", "renovation",
                               "apartment"]))
    w(f"{out}/seed-clients.csv",
      ["client_id", "tenant_id", "full_name", "wa_id", "email", "area",
       "property_type", "first_contact_at"], crows)

    # ---- projects --------------------------------------------------------
    projects, phist, psel = [], [], []
    pseq = 1200

    def add_project(client, stage, scope, target_install_off, stage_days,
                    outstanding=None):
        nonlocal pseq
        pseq += 1
        ref = f"KB-{pseq}"
        start = dd - timedelta(days=RNG.randint(stage_days + 20, stage_days + 150))
        projects.append([ref, client, "kandb", scope,
                         RNG.choice(AREAS), stage, start,
                         dd + timedelta(days=target_install_off)
                         if target_install_off else "",
                         RNG.choice(DESIGNERS)])
        cur = datetime.combine(start, datetime.min.time())
        seq = STAGES[:STAGES.index(stage) + 1]
        for st in seq:
            last = (st == stage)
            dur = stage_days * 24 if last else RNG.uniform(48, 260)
            ex = "" if last else cur + timedelta(hours=dur)
            phist.append([uid(), ref, st, cur, ex,
                          "" if last else round(dur, 2),
                          "waiting on client" if st in CLIENT_BLOCKING else ""])
            if ex:
                cur = ex
        for item in (outstanding or []):
            psel.append([uid(), ref, item, "outstanding",
                         (dd - timedelta(days=stage_days)), ""])
        return ref

    # HERO PROJECT: stalled at client_selections for 12 days, tile selection
    # outstanding, installation targeted DEMO_DATE + 60d
    hero_project = add_project(
        hero_client, "client_selections",
        "Snaidero kitchen, Kohler bathrooms (x3), Caesar tiles, Novamobili wardrobes",
        60, 12, outstanding=["Caesar tile selection"])

    stalled = 1
    for cid, name, wa in clients[1:]:
        if RNG.random() < 0.42:
            continue
        stage = RNG.choice(STAGES[1:])
        days = RNG.randint(1, 26)
        out_items = []
        if stage in CLIENT_BLOCKING and RNG.random() < 0.7:
            out_items = RNG.sample(SELECTION_ITEMS, RNG.randint(1, 2))
            if days > 7:
                stalled += 1
        add_project(cid, stage,
                    RNG.choice(["Snaidero kitchen",
                                "Kohler bathroom refit",
                                "Novamobili wardrobes",
                                "Caesar tiling, whole ground floor",
                                "Snaidero kitchen + Bosch appliances",
                                "Full interior fit-out"]),
                    RNG.choice([0, 30, 45, 60, 90, 120]), days,
                    outstanding=out_items)

    w(f"{out}/seed-projects.csv",
      ["project_ref", "client_id", "tenant_id", "scope", "area",
       "current_stage", "started_at", "target_installation", "designer"],
      projects)
    w(f"{out}/seed-project-stage-history.csv",
      ["history_id", "project_ref", "stage", "entered_at", "exited_at",
       "duration_hours", "note"], phist)
    w(f"{out}/seed-project-selections.csv",
      ["selection_id", "project_ref", "item", "status", "outstanding_since",
       "confirmed_at"], psel)

    # ---- enquiries: the money stat --------------------------------------
    # 180 enquiries over 90 days. 44% arrive outside showroom hours.
    # 61 never converted to a booked appointment.
    enq = []
    intents = [i for i, _ in ENQ_INTENTS]
    weights = [x for _, x in ENQ_INTENTS]
    N_ENQ, TARGET_OOH, N_UNCONV = 180, 79, 61   # 79/180 = 43.9%
    booked_flags = [True] * (N_ENQ - N_UNCONV) + [False] * N_UNCONV
    RNG.shuffle(booked_flags)
    for i in range(N_ENQ):
        d = dd - timedelta(days=RNG.randint(1, 90))
        if i < TARGET_OOH:
            h = RNG.choice(list(range(0, 9)) + list(range(18, 24)))
        else:
            h = RNG.randint(9, 17)
        ts = datetime.combine(d, time(h, RNG.randint(0, 59)))
        enq.append([uid(), "kandb", ts, RNG.choice(ENQ_SOURCES),
                    RNG.choices(intents, weights=weights, k=1)[0],
                    RNG.choice(AREAS),
                    "outside_hours" if (h < 9 or h >= 18) else "in_hours",
                    booked_flags[i],
                    RNG.choice(["under", "in_range", "in_range", "in_range",
                                "not_stated"])])
    RNG.shuffle(enq)
    w(f"{out}/seed-enquiries.csv",
      ["enquiry_id", "tenant_id", "received_at", "source", "intent", "area",
       "hours_bucket", "converted_to_appointment", "budget_signal"], enq)

    # ---- appointments ----------------------------------------------------
    appts = []
    free = [k for k, v in slots.items() if not v]
    booked_slots = [k for k, v in slots.items() if v]
    for k in booked_slots[:90]:
        did, d, t = k
        cid, name, wa = RNG.choice(clients)
        appts.append([f"APT-{RNG.randint(3000, 9999)}", "kandb", cid, did, d,
                      t.strftime("%H:%M"),
                      RNG.choice(["first_consultation", "selections_review",
                                  "design_presentation"]),
                      "confirmed",
                      "Brief captured by assistant" if RNG.random() < 0.4 else ""])
    w(f"{out}/seed-appointments.csv",
      ["appointment_ref", "tenant_id", "client_id", "designer_id",
       "appointment_date", "appointment_time", "purpose", "status",
       "brief_note"], appts)

    return dict(prows=prows, slots=slots, first_sat=first_sat,
                projects=projects, psel=psel, phist=phist, enq=enq,
                hero_project=hero_project, hero_client=hero_client,
                clients=clients, designers=designers)


def assert_all(d, dd):
    print("\nASSERTIONS")
    fails = []
    def chk(label, cond, detail=""):
        print(f"  [{'PASS' if cond else 'FAIL'}] {label}" + (f"  {detail}" if detail else ""))
        if not cond: fails.append(label)

    pj = {p[0]: p for p in d["projects"]}
    h = pj[d["hero_project"]]
    chk("hero project exists", d["hero_project"] in pj)
    chk("hero stage = client_selections (client-blocking)",
        h[5] == "client_selections", h[5])
    chk("hero target installation = DEMO_DATE + 60d",
        h[7] == dd + timedelta(days=60), str(h[7]))

    hs = [s for s in d["psel"] if s[1] == d["hero_project"]]
    chk("hero has exactly 1 outstanding selection", len(hs) == 1, f"got {len(hs)}")
    chk("outstanding item is the Caesar tile selection",
        hs and hs[0][2] == "Caesar tile selection")
    chk("outstanding for 12 days",
        hs and hs[0][4] == dd - timedelta(days=12), str(hs[0][4]) if hs else "")

    hh = [x for x in d["phist"] if x[1] == d["hero_project"]
          and x[2] == "client_selections"]
    chk("hero stage history flags 'waiting on client'",
        hh and hh[0][6] == "waiting on client")

    # --- appointment scarcity (the urgency beat) ---
    sat = [k for k in d["slots"] if k[1] == d["first_sat"]]
    free_sat = sum(1 for k in sat if not d["slots"][k])
    chk(f"first Saturday ({d['first_sat']}) has exactly 2 free slots",
        free_sat == 2, f"got {free_sat}")
    chk("Saturday is genuinely scarcer than weekdays",
        free_sat / max(1, len(sat)) < 0.25,
        f"{free_sat}/{len(sat)} free")
    chk("some free slots exist overall (bot can always offer something)",
        sum(1 for v in d["slots"].values() if not v) > 10)

    # --- the money stat ---
    n = len(d["enq"])
    chk("180 enquiries seeded", n == 180, f"got {n}")
    ooh = sum(1 for e in d["enq"] if e[6] == "outside_hours") / n
    chk("44% of enquiries arrive outside showroom hours",
        abs(ooh - 0.44) <= 0.01, f"got {ooh:.1%}")
    unconv = sum(1 for e in d["enq"] if e[7] is False)
    chk("61 enquiries never converted to an appointment",
        unconv == 61, f"got {unconv}")
    ooh_unconv = sum(1 for e in d["enq"]
                     if e[6] == "outside_hours" and e[7] is False)
    chk("a meaningful share of the unconverted arrived out of hours",
        ooh_unconv >= 15, f"got {ooh_unconv}")

    # --- graceful failure path ---
    under = sum(1 for e in d["enq"] if e[8] == "under")
    chk("under-budget enquiries exist (honest-referral rehearsal)",
        under > 10, f"got {under}")

    # --- no prices anywhere (K&B publish none) ---
    hdr = ["range_code", "tenant_id", "category", "brand", "note",
           "min_warranty_years", "is_active"]
    chk("range table has NO price column", not any("price" in c for c in hdr))
    chk("no seeded table carries a price field",
        all(not any("price" in str(c).lower() for c in row) for row in d["prows"]))

    # --- brand roster ---
    brands = {r[3] for r in d["prows"]}
    for b in ["Snaidero", "Kohler", "Novamobili", "Caesar", "Ideagroup",
              "Azzurra", "Bosch", "Franke"]:
        chk(f"'{b}' present", b in brands)
    chk("ten-year warranty floor on every range item",
        all(int(r[5]) >= 10 for r in d["prows"]))

    print()
    if fails:
        raise SystemExit(f"FAILED {len(fails)}: {fails}\nFix the generator.")
    print("All assertions passed.\n")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--demo-date", required=True)
    p.add_argument("--out", default="../seed")
    a = p.parse_args()
    dd = datetime.strptime(a.demo_date, "%Y-%m-%d").date()
    assert_all(generate(dd, a.out), dd)
