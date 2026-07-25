# Turnaround and Lead Times

> `[VERIFY]` **All timings in this file must be supplied by Ramco Printing production planning.** Nothing below is published. The structure is the questionnaire.
> The bot must not state a turnaround figure until this file is populated.

## Why this file is empty

Turnaround depends on press availability, job complexity, quantity, finishing, binding and current workload. It is operational knowledge held by planners, not published information. Inventing it would mean the bot promising dates the floor cannot hit — the fastest way to destroy trust in both the bot and Ramco Printing.

## To populate — typical production windows

`[VERIFY]` per division and product type, in working days, excluding proof approval time:

**UNO** — business cards, letterheads, flyers, brochures, booklets, short-run digital
**DUO** — cartons, labels, books, magazines, manuals, perfect-bound work
**HEX** — diaries, journals, notebooks, by quantity band
**IX** — banners, signage, promotional items, vehicle branding

For each, capture: standard turnaround, minimum achievable with rush handling, and the quantity bands at which it changes.

## To populate — the critical path

`[VERIFY]` confirm the stage sequence and typical duration of each:

received → prepress → proofing → **awaiting customer approval** → plating → on press → finishing → binding → dispatched

Two things to establish clearly:

1. **Where the clock starts.** On enquiry, on quote acceptance, on artwork receipt, or on proof approval? This is the single most important thing to pin down, because it determines what the bot can honestly tell a customer about their deadline.
2. **That proof approval sits on the critical path.** Time spent waiting for the customer is time the job is not moving. See `kb-proofing.md`.

## To populate — additions to lead time

`[VERIFY]` how much each adds:

- Lamination, spot UV, foiling, embossing
- Die-cutting
- Perfect binding, saddle stitch, wiro
- Non-stock paper requiring order-in
- Delivery beyond Nairobi

Finishing is where deadlines are quietly lost. A customer asking for soft-touch lamination and foiling on a tight timeline needs to hear that before they commit, not after.

## To populate — rush work

`[VERIFY]`

1. Is expedited production offered, and on which products?
2. Is there a rush charge?
3. Who authorises it?
4. What is the genuine floor — the fastest a job can physically move?

## To populate — working days

`[VERIFY]` Confirm working days and hours, Saturday working, and how public holidays are handled. "Five working days" means different things depending on the answer.

## What the bot does before this is populated

It may:
- Ask when the customer needs it and record it
- Flag a request as urgent so the estimator sees it
- Explain that turnaround depends on product, quantity and finishing, and that the estimator will confirm a date with the quote
- Explain that proof approval affects the schedule, and that a fast approval protects the deadline

It may **not**:
- State any turnaround figure
- Confirm a deadline is achievable
- Commit to a dispatch or delivery date

Saying "I'll flag this as urgent and the estimator will confirm the date today" is a perfectly good answer. Saying "that'll take about ten days" when it takes eighteen is not.

## Once populated

The bot compares the customer's deadline against typical turnaround plus finishing and stock lead time, and gives one of three answers: comfortable, tight but achievable with a fast proof approval, or not achievable — with alternatives. See `kb-quote-process.md`.
