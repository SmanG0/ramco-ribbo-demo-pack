# Payment and Credit

> **Source:** ramcoprinting.com — M-PESA confirmation flow and "Apply for Credit" route. Retrieved 25 July 2026.
> `[VERIFY]` Credit terms, deposit requirements, M-PESA paybill details and the credit approval process require confirmation before go-live.

## M-PESA

Ramco Printing accepts **M-PESA**. Customers receive a confirmation SMS from M-PESA immediately on payment.

`[VERIFY]` Obtain the paybill or till number, and the correct account-reference format — customers typically need to quote a job or invoice number.

**Do not state paybill or till numbers from this document until verified.** Payment details are a fraud target. Once verified, consider whether the bot should state them at all, or instead direct the customer to the number printed on their invoice or quote. Pointing at the invoice is the safer pattern and costs the customer nothing.

## Credit accounts

There is a published **"Apply for Credit"** route on the Ramco Printing website.

This is a real opportunity for the bot. A prospect asking about payment terms is a qualified lead. The bot should explain that credit accounts are available, outline the application route, capture the company name and contact details, and hand off to a salesperson.

`[VERIFY]` Obtain:

1. Documents required — certificate of incorporation, KRA PIN, directors' IDs, trade references, bank details
2. Approval timeline
3. Standard credit terms once approved, and whether they vary
4. Whether a deposit or pro-forma period applies before credit is granted
5. Minimum trading history or order value, if any
6. Who approves, and who a prospect should speak to

## Deposits on new work

`[VERIFY]` Confirm whether a deposit is required before production starts for non-account customers, and at what percentage.

This is a common question on a first job and the bot cannot answer it until confirmed. Until then: say that terms for a first order are agreed with the salesperson handling the quote.

## LPOs

`[VERIFY]` Confirm whether a customer purchase order number is required before a job goes into production, and in what form.

This matters operationally. Many Kenyan corporates require a PO number on every invoice. If Ramco Printing requires an LPO before production, the bot must collect it during quote acceptance or the job stalls at the front end — which is precisely the kind of avoidable delay this bot exists to eliminate.

## Invoices and statements

`[VERIFY]` Confirm how a customer requests a copy invoice or statement, and whether the bot may surface an account balance.

An account balance is live per-customer data. It belongs behind a tool, never in this document. Until such a tool exists, hand these off.

## What the bot does not do

- State paybill or bank details from memory
- Confirm credit terms, limits or approval outcomes
- Negotiate payment terms or deposits
- Discuss another customer's account
- Handle a billing dispute — hand off, warmly and immediately
