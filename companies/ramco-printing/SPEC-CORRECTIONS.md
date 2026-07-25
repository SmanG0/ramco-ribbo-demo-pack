# Spec Corrections — Ramco Printing Works

Issued 25 July 2026. Checked against ramcoprinting.com and ramco-group.com.

**The spec held up this time.** Unlike Safarilink and Sai Office, nothing in `03-ramco-printing.md` was materially wrong. The four divisions, headcount and facility size are all confirmed. What follows is **additive** — facts that strengthen the build rather than fix it.

## Confirmed

| Spec claim | Status |
|---|---|
| Four divisions: UNO, DUO, HEX, IX | Confirmed, exactly as described |
| UNO = digital & commercial print | Confirmed |
| DUO = packaging & publishing | Confirmed |
| HEX = diaries, journals, notebooks | Confirmed |
| IX = branding, signage, promotional | Confirmed |
| 650+ staff | Confirmed — "over 650 employees" |
| 160,000 sq ft production facility | Confirmed — "more than 160,000 square feet" |
| Founded 1994 | Confirmed — started with 2 machines and 12 employees |
| Flagship of Ramco Plexus | Confirmed |

## New facts — all useful

### 1. ISO 9001:2015 certified
Not in the spec. Directly relevant to the pitch: a quality-certified operation has documented processes, which means job statuses and stage definitions **already exist formally**. That materially de-risks the Tier 2 job-status integration — we are reading a system of record, not inventing one.

### 2. Two physical sites, split by division
- **UNO** — Dunga Close, Industrial Area (Plot LR 209/8303, Dunga Road)
- **DUO, HEX, IX** — Ramco Group Industrial Park, Mombasa Road

Each has its own telephone lines. This is operationally significant and was absent from the spec: **collection and delivery location depends on which division holds the job.** A customer collecting an IX banner goes to Mombasa Road; a customer collecting UNO business cards goes to Industrial Area. Getting this wrong sends someone across Nairobi for nothing.

New KB file added: `kb-locations.md`.

### 3. M-PESA payment is live and published
"You will receive a confirmation SMS from M-PESA immediately." Unlike Sai Office, there **is** a published payment path.

### 4. "Apply for Credit" flow exists on the website
There is a published credit application route. So account opening is a real, documented process the bot can explain and route into — a lead-capture opportunity the spec missed.

New KB file added: `kb-payment-credit.md`.

### 5. Book binding division since September 2013
In-house binding capability. Relevant to DUO publishing work and to perfect-bound jobs — binding is not outsourced, which affects lead times.

### 6. Contemporary showroom at the Dunga Road unit, opened January 2014
A physical showroom customers can visit. Worth the bot knowing — "you can see samples at our Dunga Road showroom" is a good answer to a specification question the bot cannot fully resolve.

### 7. Capability set
Off-set, digital, screen and large-format print, plus promotional items. Products cited include catalogues, diaries, books, magazines and eco-friendly gifts.

### 8. Contact detail
P.O. Box 27750-00506 Nairobi · info@ramcoprinting.com
UNO: +254 20 6535424-6 / 6535156 / 6535267 · +254 722 513 109
DUO / HEX / IX: +254 20 2502301-7 · +254 728 444 705

## Division routing — the one open question

The four division definitions are clear, but some real enquiries sit on a boundary. `kb-divisions.md` contains 18 worked routing examples. **Six are flagged `[VERIFY]`** because the correct division is genuinely ambiguous from public information:

- Catalogues — commercial print (UNO) or publishing (DUO)?
- Product labels — packaging (DUO) or branding (IX)?
- Branded notebooks — HEX manufactures notebooks, IX does branding
- Annual reports — commercial (UNO) or publishing/bound (DUO)?
- Presentation folders — commercial (UNO) or promotional (IX)?
- Books requiring binding — DUO, but confirm the binding division's place in the workflow

**Take these six to the client meeting.** Routing accuracy is the single biggest driver of demo quality for this bot, and an estimator can settle all six in two minutes. Guessing them is exactly the mistake the previous two packages taught us not to make.

## Unchanged advice

Section 13 of the original spec — on the estimator who will challenge automated quoting — stands and is more important than anything above. Read it before the demo.
