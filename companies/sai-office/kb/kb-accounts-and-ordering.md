# Accounts, Ordering and Payment

> `[VERIFY]` **Almost everything in this document is internal commercial policy that Sai Office does not publish.** It must be supplied by Sai Office before go-live. The structure below is the questionnaire.
> Nothing here should be stated to a customer as policy until verified.

## Why this file is mostly empty

For an airline, baggage rules are published because passengers need them. For a B2B distributor, account terms, credit limits, discount structures and payment arrangements are **commercially sensitive and negotiated per customer**. None of it is on the website, and none of it should be invented.

This is the single largest gap in the Sai Office package. Take this file to the client meeting as a list of questions.

## To populate — corporate account opening

`[VERIFY]` each item:

1. Documents required — certificate of incorporation, KRA PIN certificate, directors' identification, bank details, trade references
2. Credit application process and who approves it
3. Typical approval timeline
4. Whether a deposit or pro-forma trading period applies before credit is granted
5. Minimum order value, if any
6. Who a prospective customer should contact

## To populate — payment

`[VERIFY]` each item:

1. Accepted payment methods
2. M-Pesa paybill or till number, if applicable
3. Bank account details and how they are shared securely
4. Standard credit terms, and whether they vary by account class
5. What happens when an account exceeds its limit or goes past due
6. Whether early settlement discounts exist

**Never state bank details or a paybill number from this document until verified.** Payment details are a fraud target. Once verified, consider whether the bot should state them at all or direct the customer to their invoice, which is the safer pattern.

## To populate — invoicing and tax

`[VERIFY]` each item:

1. VAT treatment and current rate applied
2. **eTIMS** electronic tax invoicing — Kenya Revenue Authority's electronic invoice system. Confirm how Sai Office issues eTIMS-compliant invoices and what the customer receives
3. How to request a copy invoice or statement
4. Credit note process
5. Whether a customer LPO is required before an order is processed, and in what form
6. Requirements for the four countries separately — tax regimes differ across Kenya, Tanzania, Uganda and Rwanda

The LPO question matters operationally. Many Kenyan corporates require a purchase order number on every invoice, and if Sai Office requires an LPO before processing, the bot must collect it during a reorder or the order will stall.

## To populate — returns and exchanges

`[VERIFY]` each item:

1. Returns window
2. Condition requirements
3. Which categories are non-returnable — opened consumables and toner cartridges usually are
4. Damaged-on-delivery procedure and the notification window
5. Wrong-item procedure
6. Who bears return carriage
7. Restocking charges, if any

## Pricing — the important design point

Sai Office does **not publish prices**. The website uses a Product Enquiry form rather than a shopping cart.

So the bot's behaviour splits cleanly:

**Recognised account customer** → quote their contract price from a tool. Never from this document.

**Anyone else** → do not quote, do not estimate, do not indicate a range. Capture a quote request with the specification and contact details, tell them a salesperson will come back with pricing, and give a response window once one is verified.

This is not a limitation. An anonymous enquiry converted into a captured, qualified lead with a full specification is worth more to Sai Office than a price quoted badly.

`[VERIFY]` Confirm the contract pricing and discount structure — whether accounts are banded, how discounts are set, and how long price lists hold.

## Handling these questions before verification

Confirm that corporate accounts exist and that pricing is quoted rather than listed. Explain that terms are set per account. Offer to connect them to the team, and capture their details so someone can call.

That is a genuinely helpful answer. An invented credit term is not.
