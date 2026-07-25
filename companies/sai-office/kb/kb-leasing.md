# Leasing — Printers and Photocopiers

> **Source:** sai-office.com/kenya/products-services/leasing, ramco-group.com. Retrieved 25 July 2026.
> `[VERIFY]` Contract structures, billing mechanics, inclusive volumes, service response times and fault escalation all require confirmation from Office Technologies before go-live.

## What this is

**Office Technologies Limited**, part of the Sai Office group, provides leasing solutions for printing and scanning equipment, described as the first of its kind in the market for quality leasing, together with **digital document storage**.

Leasing means the customer does not buy the machine. They pay to use it, typically with service and consumables bundled, and Office Technologies retains ownership and responsibility for keeping it running.

## Why this is good bot territory

Lease customers ask a small, highly repetitive set of questions:

- My machine has a fault — how do I get someone out
- I need toner
- What is my contract end date
- How much volume have I used against my allowance
- How do I submit a meter reading
- I need another machine at a new office
- Can I upgrade

Almost all of it is lookup and logging. None of it needs judgement. It is exactly what a bot should absorb.

## What the bot does

**Fault reporting.** Capture machine identifier or location, the fault, whether the machine is completely down or degraded, and site contact. Log it and give a reference. `[VERIFY]` — confirm the service response commitment before stating one.

**Consumables under lease.** Where toner and consumables are included in the lease, a request should be logged rather than quoted. Confirm the machine and delivery location and log the request.

**Contract queries.** Contract end date, machine list on the account, billing cycle. These come from a tool, never from this document.

**Meter readings.** `[VERIFY]` — confirm whether readings are submitted by the customer, collected automatically, or read by a technician. If customers submit them, this is a very good bot flow: capture the reading, validate it against the previous one, and log it.

## What the bot does not do

- **Quote a lease.** Lease pricing depends on machine, volume, term and service level. Capture the requirement and hand to a salesperson.
- **Vary a contract.** Extensions, upgrades, early termination, adding or removing machines — all commercial decisions. Capture and hand off.
- **Commit to a service response time** until the SLA is verified.
- **Discuss billing disputes.** Hand off.

## Lease versus purchase versus repair

A common confusion worth resolving early. If a customer reports a broken machine, establish whether it is:

- **Leased from Office Technologies** → this is a lease fault, log it under the lease
- **Bought from Sai Office, Epson or APC** → this is a service centre job, see `kb-service-centre.md`
- **Bought elsewhere** → capture and hand off

Asking "is this machine on a lease with us, or did you buy it?" early saves the customer being routed twice.

## Digital document storage

Office Technologies also offers digital document storage. `[VERIFY]` — obtain the scope of this service. Until then, capture enquiries and hand off rather than describing a service we cannot accurately characterise.

## What to capture on a new leasing enquiry

1. Number of machines and locations
2. Approximate monthly print or copy volume
3. Colour or mono, and any scanning or finishing requirements
4. Preferred term
5. Whether they currently lease from someone else and when that contract ends
6. Company name and contact details
