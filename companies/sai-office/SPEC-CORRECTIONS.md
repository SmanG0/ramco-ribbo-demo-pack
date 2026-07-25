# Spec Corrections — Sai Office Supplies

Issued 25 July 2026. **These supersede `02-sai-office.md` where they conflict.**

Checked against sai-office.com/kenya (primary) and ramco-group.com. The original spec was not just wrong on detail — it **under-described the business**, and that changes the demo design.

## The big one: this is a seven-line business, not a consumables reseller

The spec treated Sai Office as toner, paper and stationery reordering. It actually operates **seven product and service lines**:

1. **I.T Solutions & Office Automation**
2. **Stationery**
3. **Office Furniture**
4. **Solar** — solar equipment supply
5. **Cooling Solutions** — air conditioners, commercial outdoor units, cassette ACs
6. **Leasing** — printers and photocopiers, via Office Technologies Ltd, plus digital document storage
7. **Services** — an **authorised service centre for Epson and APC**, in-warranty and out-of-warranty, staffed by qualified engineers with a fully stocked spare parts division

Lines 6 and 7 were entirely absent from the spec and are the two most interesting bot use cases in the whole package. See "New use cases" below.

## Corrections

| # | Original spec | Corrected | Source |
|---|---|---|---|
| 1 | Brands: Konica Minolta, Brother, Dell, Hisense, Rexel, UHU, Oxford, Nataraj | **Konica Minolta, Hisense and Nataraj do not appear.** Actual list below | sai-office.com brand wall |
| 2 | Six consumable categories | **Seven product/service lines** including Solar, Cooling, Leasing and Services | sai-office.com |
| 3 | Published list price, then contract price on auth | **No prices are published anywhere.** The site uses a "Product Enquiry" quote-request form, not e-commerce | sai-office.com |
| 4 | Delivery lead times unspecified | **"Efficient Delivery 48 Hours"** is a published commitment | sai-office.com |
| 5 | Headcount unstated | **500+ trained staff** at Sai Office alone | sai-office.com |
| 6 | Sister companies vague | Sai Office comprises **5 companies: Office Technologies Ltd, Officemart Ltd, Lino Stationers, Sai** (+1 unnamed) under the **Ramco Kora** vertical | sai-office.com / ramco-group.com |
| 7 | Incorporation not stated | **Incorporated 1994**, 30 years heritage. Sai Office Uganda established 2010 | sai-office.com / Africa Business Directory |

### Actual brand list

Distributed and represented brands, from the sai-office.com brand wall:

**IT & power** — Dell, HP, Canon, Lenovo, Epson, Brother, APC, Eaton, Tripp Lite, Schneider, D-Link, Blue Edge
**Stationery & office** — Crayola, UHU, Pritt, Maped, Helix Oxford, Rexel, Fellowes, Kangaro, Ortea
**Own brands** — OfficePoint, Veda, Skoolpoint

Appointed distributor for Crayola and UHU in East Africa. Also cited as distributor for Verbatim and Micron PC, and appointed service centre for Epson and APC.

`[VERIFY]` One logo on the brand wall is unlabelled. Confirm the full current list with Sai Office — brand agreements change and the site may lag.

## New use cases the corrections unlock

### Service centre — repair job status

Sai Office is the authorised Epson and APC service centre with in-house engineers and a spare parts division. That means there is a **repair workflow with jobs that have statuses** — received, diagnosed, awaiting parts, awaiting customer approval, under repair, ready for collection.

This is structurally the same high-value beat as Ramco Printing's proof-approval blocker: *"your printer has been ready for collection since Tuesday"* or *"we're waiting on your approval for the out-of-warranty quote."* It is a genuinely strong addition and it is now in the demo script.

### Leasing — contract and meter queries

Office Technologies leases printers and photocopiers. Lease customers ask a predictable set of questions: contract end date, monthly volume against allowance, how to report a fault, how to request a toner delivery under the lease, how to submit a meter reading.

High-frequency, low-judgement, perfectly suited to a bot.

## Design implications — read before building

**Pricing.** Since nothing is published, the "unrecognised number gets list price" beat in the original spec does not work. Replace it with something better: an unrecognised enquiry gets a **captured quote request** and a promise of a response, while a recognised corporate account gets its **contract price** immediately. That contrast is a stronger demo — it shows the bot converting an anonymous enquiry into a qualified lead, which is a revenue argument rather than a convenience argument.

Contract pricing for corporate accounts is still almost certainly real; it is simply not public. Keep it in the data model, mark the rates `[VERIFY]`.

**The 48-hour delivery commitment** is a published promise and therefore a KB fact the bot can state confidently. Use it — a bot that knows the SLA and confirms the order will meet it is doing real work.

**Breadth is a feature.** Seven lines means the bot must first work out which line an enquiry belongs to — a stationery reorder, an AC installation, a solar enquiry, a lease fault, a repair. That is the same triage pattern as Ramco Printing's four divisions, and it means the bot needs a routing step before anything else.

## Process note

Two packages, two rounds of significant corrections. For Ramco Printing, draft nothing from memory. Pull ramcoprinting.com first, then write.
