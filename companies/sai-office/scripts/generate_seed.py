#!/usr/bin/env python3
"""
Sai Office Supplies demo seed data generator.

Reflects SPEC-CORRECTIONS.md, which supersedes 02-sai-office.md:
  * seven product/service lines, not six consumable categories
  * NO published list prices anywhere -- price exists only per-account in
    price_lists. Anonymous enquiries produce quote_requests instead.
  * repair_jobs (Epson/APC service centre) and lease_contracts added
  * corrected brand list

Usage:
    python3 generate_seed.py --demo-date 2026-08-11 --out ../seed

FACT PROVENANCE
  Brand list, seven product lines, 48-hour delivery commitment, company
  structure and headcount: sai-office.com/kenya (retrieved 25 Jul 2026).
  All accounts, contacts, SKUs, prices, stock levels, orders, repair jobs and
  lease contracts are SYNTHETIC and invented for demonstration.
  Contract discount percentages are marked VERIFY -- confirm real banding.
"""

import argparse, csv, os, random, statistics, uuid
from datetime import datetime, timedelta

RNG = random.Random(19940725)

# --- SOURCE: sai-office.com brand wall -----------------------------------
BRANDS_IT    = ["Dell", "HP", "Canon", "Lenovo", "Epson", "Brother", "D-Link"]
BRANDS_POWER = ["APC", "Eaton", "Tripp Lite", "Schneider", "Blue Edge"]
BRANDS_STAT  = ["Crayola", "UHU", "Pritt", "Maped", "Helix Oxford", "Rexel",
                "Fellowes", "Kangaro", "Ortea"]
BRANDS_OWN   = ["OfficePoint", "Veda", "Skoolpoint"]
ALL_BRANDS   = BRANDS_IT + BRANDS_POWER + BRANDS_STAT + BRANDS_OWN

# Brands wrongly listed in the original spec. Asserted absent.
SPEC_ERRORS = ["Konica Minolta", "Hisense", "Nataraj"]

# SOURCE: sai-office.com/kenya/products-services -- seven lines
PRODUCT_LINES = ["IT Solutions & Office Automation", "Stationery",
                 "Office Furniture", "Solar", "Cooling Solutions",
                 "Leasing", "Services"]

# Stockable lines only (Leasing and Services are not stocked)
STOCK_LINES = {
    "IT Solutions & Office Automation": 0.34,
    "Stationery":        0.38,
    "Office Furniture":  0.12,
    "Solar":             0.08,
    "Cooling Solutions": 0.08,
}

BRANCHES_KE = ["Westlands (Head Office)", "Industrial Area", "Mombasa Road",
               "Nairobi CBD", "Mombasa", "Kisumu"]
BRANCHES_TZ = ["Dar es Salaam", "Arusha", "Mwanza"]

INDUSTRIES = ["Banking", "Insurance", "Manufacturing", "FMCG", "Telecoms",
              "Education", "Healthcare", "Logistics", "NGO", "Government",
              "Legal", "Hospitality", "Agriculture", "Construction"]

CO_A = ["Acacia", "Rift", "Savannah", "Tuskys", "Nyali", "Karibu", "Mara",
        "Uhuru", "Jamii", "Bahari", "Kilimo", "Zawadi", "Imara", "Pamoja",
        "Serengeti", "Amani", "Baraka", "Chui", "Simba", "Tembo", "Nuru",
        "Anga", "Faraja", "Hazina", "Jua", "Kifaru", "Lulu", "Mwangaza",
        "Nia", "Rafiki", "Sanaa", "Taifa", "Upendo", "Wema", "Zuri",
        "Aurora", "Meridian", "Cardinal", "Summit", "Vantage"]
CO_B = ["Holdings", "Group", "Limited", "Industries", "Africa", "Partners",
        "Enterprises", "Kenya", "Trading", "Systems", "Solutions", "Capital"]

FIRST = ["Grace", "Peter", "Mary", "James", "Faith", "David", "Esther",
         "Samuel", "Joyce", "Daniel", "Mercy", "John", "Alice", "Kevin",
         "Naomi", "Brian", "Winnie", "Dennis", "Caroline", "Victor",
         "Sharon", "Michael", "Lucy", "Anthony", "Beatrice", "Paul"]
LAST = ["Mwende", "Kariuki", "Ochieng", "Wanjiru", "Otieno", "Njoroge",
        "Achieng", "Kamau", "Mutiso", "Wafula", "Chebet", "Omondi",
        "Njeri", "Barasa", "Auma", "Mureithi", "Kiptoo", "Nyambura",
        "Odhiambo", "Wekesa", "Muthoni", "Kilonzo", "Adhiambo", "Gitau"]

REPAIR_STAGES = ["received", "diagnosed", "awaiting_customer_approval",
                 "awaiting_parts", "under_repair", "ready_for_collection",
                 "collected"]


def w(path, header, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        cw = csv.writer(f); cw.writerow(header); cw.writerows(rows)
    print(f"  {os.path.basename(path):36s} {len(rows):>6,} rows")


def uid():
    return str(uuid.UUID(int=RNG.getrandbits(128)))


def generate(dd, out):
    os.makedirs(out, exist_ok=True)
    print(f"\nDEMO_DATE = {dd}\nOutput    = {out}\n")

    # ---- branches -------------------------------------------------------
    branches, brows = {}, []
    for tid, names in (("sai-ke", BRANCHES_KE), ("sai-tz", BRANCHES_TZ)):
        for n in names:
            bid = uid(); branches[(tid, n)] = bid
            brows.append([bid, tid, n, n.split(" (")[0], "VERIFY - obtain address",
                          n in ("Industrial Area", "Mombasa Road"), "VERIFY - obtain hours"])
    w(f"{out}/seed-branches.csv",
      ["branch_id", "tenant_id", "branch_name", "city", "address",
       "is_trade_counter", "opening_hours"], brows)

    # ---- products: NO list_price column. Pricing is per-account only. ----
    products, prows = [], []
    n = 0
    for line, share in STOCK_LINES.items():
        for _ in range(int(320 * share)):
            n += 1
            if line == "Stationery":
                brand = RNG.choice(BRANDS_STAT + BRANDS_OWN)
                desc = RNG.choice(["A4 copier paper 80gsm", "ballpoint pen box of 50",
                                   "lever arch file", "stapler heavy duty",
                                   "glue stick 40g", "highlighter set of 4",
                                   "manila folder pack of 100", "whiteboard marker set",
                                   "scissors 210mm", "correction tape"])
            elif line == "IT Solutions & Office Automation":
                brand = RNG.choice(BRANDS_IT)
                desc = RNG.choice(["black toner cartridge", "colour toner cartridge",
                                   "ink cartridge black", "14in business laptop",
                                   "24in monitor", "wireless keyboard and mouse",
                                   "8-port gigabit switch", "A4 document scanner",
                                   "mono laser printer", "drum unit"])
            elif line == "Office Furniture":
                brand = "OfficePoint"
                desc = RNG.choice(["operator chair mesh back", "1400mm desk",
                                   "3-drawer pedestal", "boardroom table 8 seat",
                                   "reception counter", "4-door steel cabinet"])
            elif line == "Solar":
                brand = RNG.choice(BRANDS_POWER)
                desc = RNG.choice(["solar panel 450W", "hybrid inverter 5kVA",
                                   "lithium battery 5kWh", "solar charge controller"])
            else:
                brand = RNG.choice(BRANDS_POWER + ["Ortea"])
                desc = RNG.choice(["split air conditioner 18000BTU",
                                   "cassette AC 36000BTU", "commercial outdoor unit",
                                   "portable air conditioner"])
            sku = f"{brand[:3].upper().replace(' ', '')}-{1000 + n}"
            products.append((sku, line, brand))
            prows.append([sku, "sai-ke", brand, line, f"{brand} {desc}",
                          "each", True])

    # Hero SKUs -- kept from spec; both brands verified on the brand wall.
    for sku, brand, desc, line in (
        ("HP-CF226A", "HP", "HP 26A black toner cartridge",
         "IT Solutions & Office Automation"),
        ("BRO-TN2421", "Brother", "Brother TN-2421 black toner cartridge",
         "IT Solutions & Office Automation"),
        ("OFP-A4-80", "OfficePoint", "OfficePoint A4 copier paper 80gsm, ream",
         "Stationery")):
        products.append((sku, line, brand))
        prows.append([sku, "sai-ke", brand, line, desc, "each", True])

    # A few Tanzania-only SKUs for the tenant switch
    for i in range(12):
        sku = f"TZ-{2000 + i}"
        products.append((sku, "Stationery", "Veda"))
        prows.append([sku, "sai-tz", "Veda", "Stationery",
                      f"Veda stationery item {i + 1}", "each", True])

    w(f"{out}/seed-products.csv",
      ["sku", "tenant_id", "brand", "product_line", "description", "unit",
       "is_active"], prows)

    # ---- accounts / contacts --------------------------------------------
    accounts, arows, contacts, crows = [], [], [], []

    def add_account(code, name, tid, cls, industry, terms):
        aid = uid()
        accounts.append((aid, code, name, tid, cls))
        arows.append([aid, tid, code, name, industry, terms,
                      RNG.choice([500000, 1000000, 2500000, 5000000]), cls,
                      "active", dd - timedelta(days=RNG.randint(400, 3000))])
        return aid

    def add_contact(aid, tid, name, role, wa, approver, pin):
        cid = uid()
        contacts.append((cid, aid, name, wa))
        crows.append([cid, aid, tid, name, role, wa or "",
                      f"{name.split()[0].lower()}@example.co.ke", pin or "",
                      approver, dd])
        return cid

    # HERO ACCOUNT
    kch = add_account("KCH-0041", "Kenya Commercial Holdings", "sai-ke",
                      "platinum", "Banking", 30)
    grace = add_contact(kch, "sai-ke", "Grace Mwende", "Procurement Officer",
                        "254722114417", True, "4417")

    # ISOLATION-PROOF ACCOUNT -- same SKU, shallower discount
    nig = add_account("NIG-0088", "Nairobi Insurance Group", "sai-ke",
                      "standard", "Insurance", 30)
    add_contact(nig, "sai-ke", "Peter Kariuki", "Admin Manager",
                "254733889012", True, "8801")

    # TANZANIA TENANT
    ktc = add_account("KTC-0012", "Kilimanjaro Trading Co", "sai-tz",
                      "gold", "Logistics", 30)
    add_contact(ktc, "sai-tz", "Joyce Mwakasege", "Procurement",
                "255754220199", True, "2019")

    bound = 3
    while len(accounts) < 40:
        tid = "sai-ke" if len(accounts) < 32 else "sai-tz"
        code = f"{'KE' if tid == 'sai-ke' else 'TZ'}-{RNG.randint(1000, 9999)}"
        name = f"{RNG.choice(CO_A)} {RNG.choice(CO_B)}"
        aid = add_account(code, name, tid, RNG.choice(
            ["platinum", "gold", "gold", "standard", "standard"]),
            RNG.choice(INDUSTRIES), RNG.choice([14, 30, 30, 45]))
        for _ in range(RNG.randint(1, 3)):
            give_wa = bound < 12 and RNG.random() < 0.4
            if give_wa:
                bound += 1
            add_contact(aid, tid, f"{RNG.choice(FIRST)} {RNG.choice(LAST)}",
                        RNG.choice(["Procurement Officer", "Admin Manager",
                                    "Office Manager", "Finance Officer"]),
                        f"2547{RNG.randint(10000000, 99999999)}" if give_wa else None,
                        RNG.random() < 0.5,
                        f"{RNG.randint(1000, 9999)}" if give_wa else None)

    w(f"{out}/seed-accounts.csv",
      ["account_id", "tenant_id", "account_code", "company_name", "industry",
       "credit_terms_days", "credit_limit", "account_class", "status",
       "onboarded_at"], arows)
    w(f"{out}/seed-contacts.csv",
      ["contact_id", "account_id", "tenant_id", "full_name", "role", "wa_id",
       "email", "pin_plaintext_DEMO_ONLY", "is_approver", "created_at"], crows)

    # ---- inventory -------------------------------------------------------
    inv, irows = {}, []
    ke_products = [p for p in products if not p[0].startswith("TZ-")]
    for sku, line, brand in ke_products:
        for bname in BRANCHES_KE:
            q = RNG.choice([0, 3, 8, 14, 22, 31, 48, 70, 120, 180])
            inv[(sku, bname)] = q
    # FORCED: hero stock condition
    inv[("HP-CF226A", "Industrial Area")] = 4
    inv[("HP-CF226A", "Westlands (Head Office)")] = 27
    inv[("BRO-TN2421", "Industrial Area")] = 31
    inv[("OFP-A4-80", "Industrial Area")] = 180
    for (sku, bname), q in inv.items():
        irows.append([sku, branches[("sai-ke", bname)], "sai-ke", q,
                      10, dd])
    for sku, line, brand in [p for p in products if p[0].startswith("TZ-")]:
        for bname in BRANCHES_TZ:
            irows.append([sku, branches[("sai-tz", bname)], "sai-tz",
                          RNG.randint(5, 90), 10, dd])
    w(f"{out}/seed-inventory.csv",
      ["sku", "branch_id", "tenant_id", "qty_on_hand", "reorder_level",
       "updated_at"], irows)

    # ---- price_lists: the ONLY place a price exists ----------------------
    # [VERIFY] discount banding is invented. Confirm real structure.
    DISCOUNT = {"platinum": (0.18, 0.24), "gold": (0.12, 0.17),
                "standard": (0.05, 0.11)}
    REF = {}  # internal reference cost basis, never exposed
    for sku, line, brand in products:
        REF[sku] = round(RNG.uniform(180, 12000), 2)
    REF["HP-CF226A"] = 9800.00
    REF["BRO-TN2421"] = 6400.00
    REF["OFP-A4-80"] = 720.00

    plrows = []
    basket = ["HP-CF226A", "BRO-TN2421", "OFP-A4-80"]
    for aid, code, name, tid, cls in accounts:
        pool = [p[0] for p in products
                if (p[0].startswith("TZ-")) == (tid == "sai-tz")]
        skus = set(RNG.sample(pool, min(len(pool), RNG.randint(25, 40))))
        if aid == kch or aid == nig:
            skus |= set(basket)
        for sku in skus:
            lo, hi = DISCOUNT[cls]
            disc = RNG.uniform(lo, hi)
            if aid == kch and sku == "HP-CF226A":
                disc = 0.21                      # forced for assertion
            if aid == nig and sku == "HP-CF226A":
                disc = 0.09                      # forced for assertion
            plrows.append([aid, sku, tid,
                           round(REF[sku] * (1 - disc), 2),
                           round(disc * 100, 2),
                           dd - timedelta(days=180), dd + timedelta(days=180)])
    w(f"{out}/seed-price-lists.csv",
      ["account_id", "sku", "tenant_id", "contract_price",
       "discount_pct_VERIFY", "valid_from", "valid_to"], plrows)

    price_of = {(r[0], r[1]): r[3] for r in plrows}

    # ---- orders / lines / invoices ---------------------------------------
    orders, olines, invs = [], [], []
    seq = 2000

    def add_order(aid, tid, cid, offset_days, lines, status, branch):
        nonlocal seq
        seq += 1
        oid = f"SO-{seq}"
        od = dd - timedelta(days=offset_days)
        sub = sum(price_of.get((aid, s), REF[s]) * q for s, q in lines)
        vat = round(sub * 0.16, 2)
        orders.append([oid, aid, cid, tid, branches[(tid, branch)], od, status,
                       od + timedelta(days=2), round(sub, 2), vat,
                       round(sub + vat, 2),
                       "KES" if tid == "sai-ke" else "TZS"])
        for s, q in lines:
            up = price_of.get((aid, s), REF[s])
            olines.append([uid(), oid, s, tid, q, up, round(up * q, 2)])
        return oid, od, round(sub + vat, 2)

    # HERO: 12 months at ~28d cadence, LAST ORDER AT DEMO_DATE - 35d
    # 27-day cadence: last order 35d ago = 8 days past own median (>7 required)
    hero_offsets = [35, 62, 89, 116, 143, 170, 197, 224, 251, 278, 305, 332]
    hero_last = None
    for off in hero_offsets:
        oid, od, tot = add_order(
            kch, "sai-ke", grace, off,
            [("HP-CF226A", 4), ("BRO-TN2421", 2), ("OFP-A4-80", 5)],
            "delivered", "Industrial Area")
        if off == 35:
            hero_last = (oid, od, tot)

    # HERO invoice: outstanding, due DEMO_DATE + 4d
    invs.append([f"INV-{hero_last[0][3:]}", hero_last[0], kch, "sai-ke",
                 hero_last[1], dd + timedelta(days=4), hero_last[2], 0,
                 "outstanding"])
    for off in hero_offsets[1:]:
        oid = next(o[0] for o in orders
                   if o[1] == kch and o[5] == dd - timedelta(days=off))
        tot = next(o[10] for o in orders if o[0] == oid)
        invs.append([f"INV-{oid[3:]}", oid, kch, "sai-ke",
                     dd - timedelta(days=off), dd - timedelta(days=off - 30),
                     tot, tot, "paid"])

    # Other accounts. Exactly 8 more accounts >7d past their own median.
    others = [a for a in accounts if a[0] != kch]
    RNG.shuffle(others)
    overdue_targets = set(a[0] for a in others[:8])

    for aid, code, name, tid, cls in others:
        pool = [k[1] for k in price_of if k[0] == aid] or basket
        cadence = RNG.randint(24, 32)
        # Gap from DEMO_DATE to newest order determines "overdue against own median".
        # overdue  => newest_gap = cadence + 9  (9 > 7 threshold)
        # healthy  => newest_gap well inside cadence
        if aid in overdue_targets:
            newest = cadence + 9
        else:
            newest = RNG.randint(1, max(1, cadence - 9))
        offs = [newest + k * cadence for k in range(12)]
        cid = next((c[0] for c in contacts if c[1] == aid), None)
        br = RNG.choice(BRANCHES_KE if tid == "sai-ke" else BRANCHES_TZ)
        for off in offs:
            if off > 360:
                continue
            lines = [(s, RNG.randint(1, 8))
                     for s in RNG.sample(pool, min(len(pool), RNG.randint(3, 5)))]
            oid, od, tot = add_order(aid, tid, cid, off, lines,
                                     "delivered" if off > 3 else "picking", br)
            invs.append([f"INV-{oid[3:]}", oid, aid, tid, od,
                         od + timedelta(days=30), tot,
                         tot if off > 35 else 0,
                         "paid" if off > 35 else "outstanding"])

    w(f"{out}/seed-orders.csv",
      ["order_id", "account_id", "contact_id", "tenant_id", "branch_id",
       "order_date", "status", "delivery_date", "subtotal", "vat", "total",
       "currency"], orders)
    w(f"{out}/seed-order-lines.csv",
      ["order_line_id", "order_id", "sku", "tenant_id", "qty", "unit_price",
       "line_total"], olines)
    w(f"{out}/seed-invoices.csv",
      ["invoice_id", "order_id", "account_id", "tenant_id", "invoice_date",
       "due_date", "amount", "amount_paid", "status"], invs)

    # ---- NEW: repair jobs (Epson / APC service centre) -------------------
    rjobs, rhist = [], []
    rseq = 4400
    def add_repair(aid, cid, brand, model, serial, fault, stage, entered_off,
                   quote=None):
        nonlocal rseq
        rseq += 1
        jid = f"RJ-{rseq}"
        recv = dd - timedelta(days=entered_off + RNG.randint(2, 9))
        rjobs.append([jid, aid, cid, "sai-ke", brand, model, serial, fault,
                      stage, recv, quote if quote else "",
                      "in_warranty" if RNG.random() < 0.4 else "out_of_warranty"])
        cur = recv
        for st in REPAIR_STAGES:
            if REPAIR_STAGES.index(st) > REPAIR_STAGES.index(stage):
                break
            dur = RNG.randint(4, 30)
            ex = None if st == stage else cur + timedelta(hours=dur)
            rhist.append([uid(), jid, st, cur,
                          ex if ex else "", dur if ex else "", ""])
            if ex:
                cur = ex
        return jid

    # FORCED BEAT 1: ready for collection since DEMO_DATE - 3d
    ready_job = add_repair(kch, grace, "Epson", "WorkForce Pro WF-C5790",
                           "X4TY882031", "Paper feed jam, intermittent",
                           "ready_for_collection", 3)
    # FORCED BEAT 2: awaiting customer approval on an out-of-warranty quote
    quote_job = add_repair(nig, next(c[0] for c in contacts if c[1] == nig),
                           "APC", "Smart-UPS SRT 3000VA", "AS2419110776",
                           "Unit not holding charge, battery module suspect",
                           "awaiting_customer_approval", 5, quote=48750.00)

    for _ in range(70):
        aid, code, name, tid, cls = RNG.choice(
            [a for a in accounts if a[3] == "sai-ke"])
        cid = next((c[0] for c in contacts if c[1] == aid), None)
        b = RNG.choice(["Epson", "APC"])
        add_repair(aid, cid, b,
                   RNG.choice(["EcoTank L6290", "WorkForce WF-7840",
                               "Smart-UPS 1500VA", "Back-UPS Pro 1200"]),
                   f"{RNG.choice('XAB')}{RNG.randint(1000000, 9999999)}",
                   RNG.choice(["Will not power on", "Print quality streaking",
                               "Battery fault", "Network module failure",
                               "Scanner unit error"]),
                   RNG.choice(REPAIR_STAGES), RNG.randint(1, 40),
                   quote=round(RNG.uniform(4000, 90000), 2)
                   if RNG.random() < 0.4 else None)

    w(f"{out}/seed-repair-jobs.csv",
      ["repair_job_no", "account_id", "contact_id", "tenant_id", "brand",
       "model", "serial_no", "fault_description", "current_stage",
       "received_at", "quote_amount", "warranty_status"], rjobs)
    w(f"{out}/seed-repair-status-history.csv",
      ["history_id", "repair_job_no", "stage", "entered_at", "exited_at",
       "duration_hours", "note"], rhist)

    # ---- NEW: lease contracts (Office Technologies) -----------------------
    lc, lm = [], []
    for i in range(28):
        aid, code, name, tid, cls = RNG.choice(
            [a for a in accounts if a[3] == "sai-ke"])
        cid = uid()
        start = dd - timedelta(days=RNG.randint(200, 1400))
        term = RNG.choice([36, 48, 60])
        lc.append([cid, aid, "sai-ke", f"LC-{5000 + i}", start,
                   start + timedelta(days=term * 30), term,
                   RNG.choice([True, False]),
                   RNG.choice([5000, 10000, 20000, 40000]),
                   "VERIFY - confirm SLA", "active"])
        for m in range(RNG.randint(1, 4)):
            lm.append([uid(), cid, f"OT-{RNG.randint(10000, 99999)}",
                       RNG.choice(["Epson WorkForce Pro WF-C879R",
                                   "Canon imageRUNNER 2630i",
                                   "HP LaserJet Managed E82560"]),
                       RNG.choice(["Reception", "Finance", "3rd Floor",
                                   "Registry", "Boardroom"]),
                       RNG.randint(4000, 90000)])
    w(f"{out}/seed-lease-contracts.csv",
      ["lease_id", "account_id", "tenant_id", "contract_ref", "start_date",
       "end_date", "term_months", "includes_consumables",
       "monthly_volume_allowance", "service_sla_VERIFY", "status"], lc)
    w(f"{out}/seed-lease-machines.csv",
      ["machine_id", "lease_id", "asset_tag", "model", "location",
       "current_meter_reading"], lm)

    # ---- NEW: quote requests (the anonymous-enquiry path) ----------------
    qr = []
    for i in range(60):
        line = RNG.choice(PRODUCT_LINES[:5])
        qr.append([f"QR-{7000 + i}", "sai-ke", line,
                   RNG.choice(["", next(a[0] for a in accounts)]),
                   f"{RNG.choice(FIRST)} {RNG.choice(LAST)}",
                   f"2547{RNG.randint(10000000, 99999999)}",
                   f"Enquiry for {line.lower()}",
                   RNG.choice(["new", "with_sales", "quoted", "won", "lost"]),
                   dd - timedelta(days=RNG.randint(1, 60))])
    w(f"{out}/seed-quote-requests.csv",
      ["quote_ref", "tenant_id", "product_line", "account_id", "contact_name",
       "contact_phone", "requirement", "status", "created_at"], qr)

    return dict(products=products, prows=prows, accounts=accounts,
                contacts=contacts, orders=orders, invs=invs, inv=inv,
                plrows=plrows, rjobs=rjobs, ready_job=ready_job,
                quote_job=quote_job, kch=kch, nig=nig, grace=grace,
                overdue=overdue_targets, lc=lc)


def assert_all(d, dd):
    print("\nASSERTIONS")
    fails = []
    def chk(label, cond, detail=""):
        print(f"  [{'PASS' if cond else 'FAIL'}] {label}" + (f"  {detail}" if detail else ""))
        if not cond: fails.append(label)

    # --- hero reorder cadence ---
    ko = sorted([o for o in d["orders"] if o[1] == d["kch"]], key=lambda x: x[5])
    chk("hero account has 12 orders", len(ko) == 12, f"got {len(ko)}")
    last = max(o[5] for o in ko)
    chk("hero last order = DEMO_DATE - 35d", last == dd - timedelta(days=35), str(last))
    gaps = [(ko[i + 1][5] - ko[i][5]).days for i in range(len(ko) - 1)]
    med = statistics.median(gaps)
    chk("hero median reorder cycle 26-30d", 26 <= med <= 30, f"got {med}")
    chk("hero is >7d past own median", 35 - med > 7, f"{35 - med:.0f}d over")

    # --- stock condition ---
    chk("HP-CF226A @ Industrial Area = 4", d["inv"][("HP-CF226A", "Industrial Area")] == 4)
    chk("HP-CF226A @ Westlands = 27",
        d["inv"][("HP-CF226A", "Westlands (Head Office)")] == 27)

    # --- pricing isolation ---
    kd = next(r[4] for r in d["plrows"] if r[0] == d["kch"] and r[1] == "HP-CF226A")
    nd = next(r[4] for r in d["plrows"] if r[0] == d["nig"] and r[1] == "HP-CF226A")
    chk("hero discount on HP-CF226A = 21%", abs(kd - 21.0) < 0.5, f"got {kd}%")
    chk("isolation account discount = 9%", abs(nd - 9.0) < 0.5, f"got {nd}%")
    chk("two accounts, same SKU, different price", kd != nd)

    # --- NO published list price anywhere ---
    hdr_ok = "list_price" not in ",".join(
        ["sku", "tenant_id", "brand", "product_line", "description", "unit", "is_active"])
    chk("products table has NO list_price column (spec correction)", hdr_ok)

    # --- outstanding invoice ---
    oi = [i for i in d["invs"] if i[2] == d["kch"] and i[8] == "outstanding"]
    chk("hero has exactly 1 outstanding invoice", len(oi) == 1, f"got {len(oi)}")
    chk("due DEMO_DATE + 4d", oi and oi[0][5] == dd + timedelta(days=4),
        str(oi[0][5]) if oi else "")

    # --- overdue cohort ---
    per = {}
    for o in d["orders"]:
        per.setdefault(o[1], []).append(o[5])
    n_over = 0
    for aid, dates in per.items():
        ds = sorted(dates)
        if len(ds) < 4: continue
        g = [(ds[i + 1] - ds[i]).days for i in range(len(ds) - 1)]
        m = statistics.median(g)
        if (dd - max(ds)).days - m > 7: n_over += 1
    chk("9 accounts past their own median cycle by >7d", n_over == 9, f"got {n_over}")

    # --- NEW: repair jobs ---
    rj = {r[0]: r for r in d["rjobs"]}
    chk("repair job ready_for_collection exists",
        rj[d["ready_job"]][8] == "ready_for_collection")
    chk("repair job awaiting_customer_approval exists with a quote",
        rj[d["quote_job"]][8] == "awaiting_customer_approval"
        and rj[d["quote_job"]][10] != "")
    chk("repair jobs only Epson/APC (appointed service centre)",
        all(r[4] in ("Epson", "APC") for r in d["rjobs"]))

    # --- NEW: leasing ---
    chk("lease contracts seeded", len(d["lc"]) == 28, f"got {len(d['lc'])}")

    # --- brand corrections ---
    brands = {r[2] for r in d["prows"]}
    for bad in SPEC_ERRORS:
        chk(f"'{bad}' absent (spec correction)", bad not in brands)
    for good in ["Epson", "APC", "Crayola", "OfficePoint", "Veda"]:
        chk(f"'{good}' present", good in brands)

    # --- seven lines ---
    lines = {r[3] for r in d["prows"]}
    chk("all 5 stockable lines present", len(lines) == 5, f"got {sorted(lines)}")

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
