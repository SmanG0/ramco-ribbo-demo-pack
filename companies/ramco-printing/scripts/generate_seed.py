#!/usr/bin/env python3
"""
Ramco Printing Works demo seed data generator.

See SPEC-CORRECTIONS.md. Unlike the other two packages, 03-ramco-printing.md
was materially correct -- corrections here are additive. The one structural
addition is COLLECTION SITE: UNO is at Dunga Close, Industrial Area while DUO,
HEX and IX are at Ramco Group Industrial Park, Mombasa Road.

Usage:
    python3 generate_seed.py --demo-date 2026-08-11 --out ../seed

FACT PROVENANCE
  Four divisions, 650+ staff, 160,000 sq ft, 1994 founding, ISO 9001:2015,
  two sites and contact details: ramcoprinting.com (retrieved 25 Jul 2026).
  All customers, job numbers, rate cards, stock codes, timings and statuses
  are SYNTHETIC. Rate card figures are calibrated only to produce a plausible
  demo range and are NOT Ramco Printing pricing.
"""

import argparse, csv, os, random, statistics, uuid
from datetime import datetime, timedelta

RNG = random.Random(19940101)

DIVISIONS = ["UNO", "DUO", "HEX", "IX"]

# SOURCE: ramcoprinting.com/contact-us -- two sites, split by division
SITE = {
    "UNO": "Dunga Close, Industrial Area",
    "DUO": "Ramco Group Industrial Park, Mombasa Road",
    "HEX": "Ramco Group Industrial Park, Mombasa Road",
    "IX":  "Ramco Group Industrial Park, Mombasa Road",
}

PRODUCTS = {
    "UNO": ["business cards", "letterheads", "A5 flyers", "A4 brochure 8pp",
            "A4 booklet 24pp", "presentation folder", "compliment slips",
            "annual report 48pp"],
    "DUO": ["folding carton", "product label roll", "paperback book 300pp",
            "monthly magazine", "training manual perfect bound",
            "carton sleeve", "instruction leaflet"],
    "HEX": ["A5 hardcover notebook", "A5 softcover journal",
            "desk diary 2027", "pocket diary 2027", "B5 notebook"],
    "IX":  ["pull-up banner", "outdoor signage panel", "branded pens",
            "branded mugs", "vehicle branding set", "eco gift set",
            "exhibition backdrop"],
}

STAGES = ["received", "prepress", "proofing", "awaiting_approval", "plating",
          "on_press", "finishing", "dispatched", "delivered"]

CO_A = ["Zawadi", "Acacia", "Rift Valley", "Savannah", "Nyali", "Jamii",
        "Bahari", "Imara", "Pamoja", "Amani", "Baraka", "Simba", "Tembo",
        "Nuru", "Faraja", "Hazina", "Jua", "Lulu", "Mwangaza", "Rafiki",
        "Sanaa", "Taifa", "Upendo", "Wema", "Zuri", "Meridian", "Cardinal",
        "Summit", "Vantage", "Equator", "Highlands", "Coastline"]
CO_B = ["Financial Services", "Holdings", "Group", "Limited", "Industries",
        "Africa", "Bank", "Insurance", "Breweries", "Foods", "Telecom",
        "Sacco", "Publishers", "Pharmaceuticals", "Logistics"]

FIRST = ["Peter", "Grace", "James", "Mary", "David", "Faith", "Samuel",
         "Esther", "Daniel", "Joyce", "John", "Mercy", "Kevin", "Alice",
         "Brian", "Naomi", "Dennis", "Winnie", "Victor", "Caroline"]
LAST = ["Kariuki", "Mwende", "Ochieng", "Wanjiru", "Njoroge", "Otieno",
        "Kamau", "Achieng", "Wafula", "Mutiso", "Omondi", "Chebet",
        "Njeri", "Barasa", "Mureithi", "Kiptoo", "Odhiambo", "Muthoni"]

STOCKS = [
    ("STK-BOND-80",  "Bond uncoated",       80,  "uncoated", "natural", True, 0),
    ("STK-BOND-100", "Bond uncoated",      100,  "uncoated", "natural", True, 0),
    ("STK-SILK-130", "Silk coated",        130,  "coated",   "silk",    True, 0),
    ("STK-SILK-150", "Silk coated",        150,  "coated",   "silk",    True, 0),
    ("STK-SILK-170", "Silk coated premium",170,  "coated",   "silk",   False, 12),
    ("STK-GLOSS-130","Gloss coated",       130,  "coated",   "gloss",   True, 0),
    ("STK-GLOSS-170","Gloss coated",       170,  "coated",   "gloss",   True, 0),
    ("STK-BOARD-250","Board",              250,  "board",    "silk",    True, 0),
    ("STK-BOARD-300","Board",              300,  "board",    "silk",    True, 0),
    ("STK-BOARD-350","Board",              350,  "board",    "matt",    True, 3),
    ("STK-REC-120",  "Recycled uncoated",  120,  "uncoated", "natural", True, 5),
    ("STK-KRAFT-280","Kraft board",        280,  "board",    "natural", True, 0),
]

FINISHING = [
    ("FIN-GLOSSLAM", "Gloss lamination",   ["cover", "card", "brochure"], 1, "low"),
    ("FIN-MATTLAM",  "Matt lamination",    ["cover", "card", "brochure"], 1, "low"),
    ("FIN-SOFTLAM",  "Soft-touch lamination", ["cover", "card"],          2, "medium"),
    ("FIN-SPOTUV",   "Spot UV",            ["cover", "card"],             2, "medium"),
    ("FIN-FOIL",     "Foiling",            ["cover", "card", "notebook"], 3, "high"),
    ("FIN-EMBOSS",   "Embossing",          ["cover", "card", "notebook"], 3, "high"),
    ("FIN-DIECUT",   "Die-cutting",        ["carton", "folder", "label"], 2, "medium"),
    ("FIN-PERFECT",  "Perfect binding",    ["book", "manual", "report"],  2, "medium"),
    ("FIN-SADDLE",   "Saddle stitch",      ["booklet", "magazine"],       1, "low"),
    ("FIN-WIRO",     "Wiro binding",       ["manual", "notebook"],        1, "low"),
    ("FIN-CASE",     "Case binding",       ["book", "notebook"],          4, "high"),
]


def w(path, header, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        cw = csv.writer(f); cw.writerow(header); cw.writerows(rows)
    print(f"  {os.path.basename(path):38s} {len(rows):>6,} rows")


def uid():
    return str(uuid.UUID(int=RNG.getrandbits(128)))


def generate(dd, out):
    os.makedirs(out, exist_ok=True)
    print(f"\nDEMO_DATE = {dd}\nOutput    = {out}\n")

    # ---- reference tables ------------------------------------------------
    w(f"{out}/seed-stock-types.csv",
      ["stock_code", "name", "gsm", "family", "finish", "is_available",
       "typical_lead_days"], [list(s) for s in STOCKS])
    w(f"{out}/seed-finishing-options.csv",
      ["finishing_code", "name", "applies_to_product_types", "adds_lead_days",
       "cost_band"],
      [[c, n, "{" + ",".join(a) + "}", d, b] for c, n, a, d, b in FINISHING])

    # ---- rate cards ------------------------------------------------------
    # Calibrated so 5,000 A5 hardcover notebooks with full-colour front
    # branding returns KES 780,000 - 940,000. NOT real Ramco pricing.
    rc = []
    def add_rc(div, prod, size, stock, colours, qf, qt, ulow, uhigh, setup):
        rc.append([uid(), div, prod, size, stock, colours, qf, qt,
                   ulow, uhigh, setup])

    add_rc("HEX", "A5 hardcover notebook", "A5", "STK-BOARD-300", "4/0",
           2001, 10000, 147.00, 179.00, 45000.00)
    add_rc("HEX", "A5 hardcover notebook", "A5", "STK-BOARD-300", "4/0",
           500, 2000, 210.00, 268.00, 45000.00)
    add_rc("HEX", "A5 softcover journal", "A5", "STK-BOARD-250", "4/0",
           500, 10000, 92.00, 128.00, 30000.00)
    add_rc("HEX", "desk diary 2027", "A4", "STK-BOARD-300", "4/0",
           250, 5000, 340.00, 480.00, 60000.00)
    for prod, sz, stk, lo, hi, su in (
        ("business cards", "90x54mm", "STK-BOARD-350", 6.5, 11.0, 4500),
        ("letterheads", "A4", "STK-BOND-100", 9.0, 14.0, 5000),
        ("A5 flyers", "A5", "STK-GLOSS-130", 7.5, 12.5, 6000),
        ("A4 brochure 8pp", "A4", "STK-SILK-150", 48.0, 72.0, 18000),
        ("A4 booklet 24pp", "A4", "STK-SILK-130", 118.0, 165.0, 24000),
        ("presentation folder", "A4", "STK-BOARD-350", 82.0, 124.0, 22000)):
        for qf, qt, m in ((100, 999, 1.6), (1000, 4999, 1.0), (5000, 50000, 0.82)):
            add_rc("UNO", prod, sz, stk, "4/4",
                   qf, qt, round(lo * m, 2), round(hi * m, 2), su)
    for prod, lo, hi, su in (("pull-up banner", 8500, 13500, 0),
                             ("branded pens", 62, 118, 8000),
                             ("branded mugs", 340, 580, 9000)):
        add_rc("IX", prod, "std", "", "4/0", 1, 10000, lo, hi, su)
    w(f"{out}/seed-rate-cards.csv",
      ["rate_card_id", "division", "product_type", "size", "stock_code",
       "colours", "qty_from", "qty_to", "unit_price_low", "unit_price_high",
       "setup_cost"], rc)

    # ---- customers / contacts -------------------------------------------
    customers, crows, contacts, ctrows = [], [], [], []

    def add_customer(code, name, industry):
        cid = uid()
        customers.append((cid, code, name))
        crows.append([cid, "ramco-printing", code, name, industry,
                      f"{RNG.choice(FIRST)} {RNG.choice(LAST)}",
                      RNG.choice([14, 30, 30, 45]), "active",
                      dd - timedelta(days=RNG.randint(300, 3600))])
        return cid

    def add_contact(cust, name, role, wa, approver):
        cid = uid()
        contacts.append((cid, cust, name, wa, approver))
        ctrows.append([cid, cust, "ramco-printing", name, role, wa or "",
                       f"{name.split()[0].lower()}@example.co.ke", approver, dd])
        return cid

    # HERO CUSTOMER
    zawadi = add_customer("ZFS-0117", "Zawadi Financial Services", "Banking")
    peter = add_contact(zawadi, "Peter Kariuki", "Marketing Manager",
                        "254722513109", True)
    add_contact(zawadi, "Faith Njeri", "Marketing Assistant", None, False)

    bound = 1
    while len(customers) < 60:
        cid = add_customer(f"C-{RNG.randint(1000, 9999)}",
                           f"{RNG.choice(CO_A)} {RNG.choice(CO_B)}",
                           RNG.choice(["Banking", "Insurance", "FMCG",
                                       "Manufacturing", "Telecoms", "NGO",
                                       "Education", "Publishing", "Healthcare"]))
        for _ in range(RNG.randint(1, 3)):
            give = bound < 10 and RNG.random() < 0.35
            if give:
                bound += 1
            add_contact(cid, f"{RNG.choice(FIRST)} {RNG.choice(LAST)}",
                        RNG.choice(["Marketing Manager", "Procurement Officer",
                                    "Brand Manager", "Office Manager"]),
                        f"2547{RNG.randint(10000000, 99999999)}" if give else None,
                        RNG.random() < 0.5)

    w(f"{out}/seed-customers.csv",
      ["customer_id", "tenant_id", "customer_code", "company_name", "industry",
       "account_manager", "credit_terms_days", "status", "onboarded_at"], crows)
    w(f"{out}/seed-contacts.csv",
      ["contact_id", "customer_id", "tenant_id", "full_name", "role", "wa_id",
       "email", "is_proof_approver", "created_at"], ctrows)

    # ---- jobs: engineer the aggregates ----------------------------------
    # Targets: mean awaiting_approval = 55.2h (2.3d); exactly 31 late;
    #          in exactly 19 of those, approval wait exceeded total slack.
    N = 220
    TARGET_MEAN_H = 55.2

    approval = []
    for i in range(N):
        r = RNG.random()
        if r < 0.42:   approval.append(RNG.uniform(1, 12))     # same/next day
        elif r < 0.72: approval.append(RNG.uniform(12, 48))
        elif r < 0.90: approval.append(RNG.uniform(48, 120))
        else:          approval.append(RNG.uniform(120, 220))  # long tail
    # rescale to hit the mean exactly
    scale = TARGET_MEAN_H / statistics.fmean(approval)
    approval = [a * scale for a in approval]

    prod_h = [max(36.0, RNG.gauss(98, 26)) for _ in range(N)]   # ~4.1d excl approval
    promised_h = [p + RNG.uniform(30, 130) for p in prod_h]     # slack 30-130h

    idx = list(range(N))
    RNG.shuffle(idx)
    late_by_approval = set(idx[:19])
    late_other = set(idx[19:31])
    late_all = late_by_approval | late_other

    # "Approval caused it" means: production alone WOULD have met the promise,
    # and the proof wait is what pushed it past. That is the defensible claim.
    #   late_by_approval : prod_h <= promised_h  AND  prod_h + approval > promised_h
    #   late_other       : prod_h  > promised_h  (production overran on its own)
    for i in range(N):
        if i in late_by_approval:
            if prod_h[i] >= promised_h[i]:                  # ensure production fits
                prod_h[i] = promised_h[i] - RNG.uniform(20, 90)
            slack = promised_h[i] - prod_h[i]
            approval[i] = slack + RNG.uniform(8, 60)
        elif i in late_other:
            prod_h[i] = promised_h[i] + RNG.uniform(6, 40)  # late regardless
            approval[i] = RNG.uniform(1, 10)
        else:
            slack = promised_h[i] - prod_h[i]
            if approval[i] >= slack:
                approval[i] = max(1.0, slack - RNG.uniform(4, 24))
    # restore the mean after adjustments, without breaking late/on-time status
    for _ in range(600):
        cur = statistics.fmean(approval)
        if abs(cur - TARGET_MEAN_H) < 0.05:
            break
        delta = TARGET_MEAN_H - cur
        movable = [i for i in range(N) if i not in late_all]
        step = delta * N / max(1, len(movable))
        for i in movable:
            slack = promised_h[i] - prod_h[i]
            approval[i] = min(max(1.0, approval[i] + step), max(1.0, slack - 2))

    jobs, hist, proofs, jseq = [], [], [], 4300
    hero_job = "4471"

    def build_job(job_no, cust, contact, div, prod, qty, appr_h, pr_h,
                  prom_h, recv_off, stage="delivered", proof_status="approved"):
        recv = datetime.combine(dd, datetime.min.time()) - timedelta(days=recv_off)
        promised = (recv + timedelta(hours=prom_h)).date()
        elapsed = pr_h + appr_h
        actual = (recv + timedelta(hours=elapsed)).date() if stage in ("dispatched", "delivered") else ""
        stock = RNG.choice([s[0] for s in STOCKS if s[5]])
        fin = RNG.sample([f[0] for f in FINISHING], RNG.randint(0, 2))
        jobs.append([job_no, cust, contact, "ramco-printing", div, prod,
                     f"{qty:,} x {prod}", qty,
                     RNG.choice(["A4", "A5", "A3", "std", "90x54mm"]),
                     stock, RNG.choice(["4/4", "4/0", "1/0"]),
                     "{" + ",".join(fin) + "}", stage, recv, promised, actual,
                     SITE[div], round(qty * RNG.uniform(8, 210), 2)])
        # stage history
        cur = recv
        seq = STAGES[:STAGES.index(stage) + 1]
        for st in seq:
            if st == "awaiting_approval":
                dur = appr_h
            elif st == "received":
                dur = RNG.uniform(1, 5)
            else:
                dur = pr_h / max(1, len(seq) - 2)
            ex = cur + timedelta(hours=dur)
            last = (st == stage)
            hist.append([uid(), job_no, st, cur, "" if last else ex,
                         "" if last else round(dur, 2),
                         "waiting on customer" if st == "awaiting_approval" else ""])
            cur = ex
        # proof
        sent = recv + timedelta(hours=RNG.uniform(6, 40))
        proofs.append([uid(), job_no, 1, sent, proof_status,
                       (sent + timedelta(hours=appr_h)) if proof_status == "approved" else "",
                       contact if proof_status == "approved" else "",
                       f"https://proofs.ramcoprinting.example/{job_no}-v1.pdf"])

    # HERO JOB 4471 -- awaiting_approval, proof sent DEMO_DATE-3d,
    # promised dispatch DEMO_DATE+2d
    recv_hero = datetime.combine(dd, datetime.min.time()) - timedelta(days=5)
    jobs.append([hero_job, zawadi, peter, "ramco-printing", "UNO",
                 "annual report 48pp",
                 "2,000 x A4 48pp annual report, 4/4, matt lamination, perfect bound",
                 2000, "A4", "STK-SILK-150", "4/4",
                 "{FIN-MATTLAM,FIN-PERFECT}", "awaiting_approval",
                 recv_hero, (dd + timedelta(days=2)), "", SITE["UNO"], 486000.00])
    _c = recv_hero
    for st, dur in (("received", 3.0), ("prepress", 12.0), ("proofing", 6.0)):
        hist.append([uid(), hero_job, st, _c, _c + timedelta(hours=dur),
                     round(dur, 2), ""])
        _c += timedelta(hours=dur)
    hist.append([uid(), hero_job, "awaiting_approval", _c, "", "",
                 "waiting on customer"])
    proof_sent = datetime.combine(dd, datetime.min.time()) - timedelta(days=3)
    proofs.append([uid(), hero_job, 1, proof_sent, "sent", "", "",
                   f"https://proofs.ramcoprinting.example/{hero_job}-v1.pdf"])

    # Filler jobs carrying the aggregates
    for i in range(N):
        jseq += 1
        job_no = str(jseq)
        if job_no == hero_job:
            jseq += 1; job_no = str(jseq)
        cust = RNG.choice(customers)
        cont = next((c[0] for c in contacts if c[1] == cust[0]), None)
        div = RNG.choice(DIVISIONS)
        build_job(job_no, cust[0], cont, div, RNG.choice(PRODUCTS[div]),
                  RNG.choice([250, 500, 1000, 2000, 5000, 10000]),
                  approval[i], prod_h[i], promised_h[i],
                  RNG.randint(10, 270),
                  stage=RNG.choice(["delivered", "delivered", "dispatched"]))

    w(f"{out}/seed-jobs.csv",
      ["job_no", "customer_id", "contact_id", "tenant_id", "division",
       "product_type", "description", "quantity", "size", "stock_code",
       "colours", "finishing", "current_stage", "received_at",
       "promised_dispatch", "actual_dispatch", "collection_site", "value"], jobs)
    w(f"{out}/seed-job-status-history.csv",
      ["history_id", "job_no", "stage", "entered_at", "exited_at",
       "duration_hours", "note"], hist)
    w(f"{out}/seed-proofs.csv",
      ["proof_id", "job_no", "version", "sent_at", "status", "approved_at",
       "approved_by_contact_id", "proof_url"], proofs)

    # ---- quote requests --------------------------------------------------
    qr = []
    for i in range(70):
        div = RNG.choice(DIVISIONS)
        qr.append([f"QR-{2200 + i}", RNG.choice(customers)[0], "ramco-printing",
                   div, f'{{"product":"{RNG.choice(PRODUCTS[div])}"}}',
                   RNG.random() < 0.25,
                   dd + timedelta(days=RNG.randint(5, 60)),
                   RNG.choice(["new", "with_estimator", "quoted", "won", "lost"]),
                   f"{RNG.choice(FIRST)} {RNG.choice(LAST)}",
                   round(RNG.uniform(40000, 1400000), 2),
                   dd - timedelta(days=RNG.randint(1, 90))])
    w(f"{out}/seed-quote-requests.csv",
      ["quote_ref", "customer_id", "tenant_id", "division", "spec_json",
       "is_urgent", "needed_by", "status", "estimator", "quoted_value",
       "created_at"], qr)

    return dict(jobs=jobs, hist=hist, proofs=proofs, rc=rc,
                approval=approval, prod_h=prod_h, promised_h=promised_h,
                late_all=late_all, late_by_approval=late_by_approval,
                hero=hero_job, zawadi=zawadi, peter=peter)


def assert_all(d, dd):
    print("\nASSERTIONS")
    fails = []
    def chk(label, cond, detail=""):
        print(f"  [{'PASS' if cond else 'FAIL'}] {label}" + (f"  {detail}" if detail else ""))
        if not cond: fails.append(label)

    jd = {j[0]: j for j in d["jobs"]}
    h = jd[d["hero"]]
    chk("job 4471 exists", d["hero"] in jd)
    chk("4471 current_stage = awaiting_approval", h[12] == "awaiting_approval", h[12])
    chk("4471 promised_dispatch = DEMO_DATE + 2d",
        h[14] == dd + timedelta(days=2), str(h[14]))
    chk("4471 not yet dispatched", h[15] == "")
    chk("4471 collection site = UNO / Industrial Area (spec addition)",
        h[16] == "Dunga Close, Industrial Area", h[16])

    hp = [p for p in d["proofs"] if p[1] == d["hero"]]
    chk("4471 proof status = sent (unapproved)", hp and hp[0][4] == "sent")
    chk("4471 proof sent DEMO_DATE - 3d",
        hp and hp[0][3].date() == dd - timedelta(days=3),
        str(hp[0][3].date()) if hp else "")

    # --- the business case number ---
    mean_h = statistics.fmean(d["approval"])
    chk("mean awaiting_approval = 2.3 days (+/-0.1)",
        abs(mean_h / 24 - 2.3) <= 0.1, f"got {mean_h/24:.2f}d ({mean_h:.1f}h)")

    n_late = sum(1 for i in range(len(d["approval"]))
                 if d["prod_h"][i] + d["approval"][i] > d["promised_h"][i])
    chk("exactly 31 jobs dispatched late", n_late == 31, f"got {n_late}")

    # Meaningful test: the job WOULD have shipped on time but for the proof wait.
    n_caused = sum(1 for i in range(len(d["approval"]))
                   if d["prod_h"][i] + d["approval"][i] > d["promised_h"][i]
                   and d["prod_h"][i] <= d["promised_h"][i])
    chk("in exactly 19, the job would have shipped on time but for the proof wait",
        n_caused == 19, f"got {n_caused}")

    mean_prod = statistics.fmean(d["prod_h"]) / 24
    chk("mean production time excl approval ~4.1d", 3.6 <= mean_prod <= 4.8,
        f"got {mean_prod:.2f}d")

    # --- rate card calibration ---
    row = next(r for r in d["rc"] if r[1] == "HEX"
               and r[2] == "A5 hardcover notebook" and r[6] == 2001)
    low = row[8] * 5000 + row[10]
    high = row[9] * 5000 + row[10]
    chk("5,000 A5 hardcover notebooks -> KES 780,000 low",
        abs(low - 780000) < 1, f"got {low:,.0f}")
    chk("5,000 A5 hardcover notebooks -> KES 940,000 high",
        abs(high - 940000) < 1, f"got {high:,.0f}")

    # --- stock condition ---
    s170 = next(s for s in STOCKS if s[0] == "STK-SILK-170")
    chk("STK-SILK-170 unavailable, 12-day lead",
        s170[5] is False and s170[6] == 12)
    chk("STK-SILK-150 available as the alternative",
        next(s for s in STOCKS if s[0] == "STK-SILK-150")[5] is True)

    # --- two-site split (spec addition) ---
    chk("all UNO jobs collect at Industrial Area",
        all(j[16] == "Dunga Close, Industrial Area"
            for j in d["jobs"] if j[4] == "UNO"))
    chk("all DUO/HEX/IX jobs collect at Mombasa Road",
        all(j[16] == "Ramco Group Industrial Park, Mombasa Road"
            for j in d["jobs"] if j[4] in ("DUO", "HEX", "IX")))

    # --- coverage ---
    divs = {j[4] for j in d["jobs"]}
    chk("all four divisions present in job history", divs == set(DIVISIONS),
        str(sorted(divs)))
    chk("220 filler jobs + hero", len(d["jobs"]) == 221, f"got {len(d['jobs'])}")

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
