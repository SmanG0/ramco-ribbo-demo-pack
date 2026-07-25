# Paper Stock and Finishing

> `[VERIFY]` **Stock ranges, availability and finishing options must be supplied by Ramco Printing.** The categories below are general print knowledge to structure the conversation, not Ramco Printing's actual range.
> The bot must not state that a specific stock is held, or quote a lead time on it, without a tool call.

## The one rule

**Stock availability is volatile and belongs behind a tool, never in this document.** Whether a particular board is in the warehouse today changes daily. If the bot answers that from a knowledge base it will be wrong, and a customer will build a deadline on it.

This document describes *categories and trade-offs*. Anything about what is actually available comes from a tool.

## Stock — to populate

`[VERIFY]` Obtain the stock range held, by family, weight and finish, with typical order-in lead time for non-held stock.

General categories to structure the conversation:

**Uncoated** — natural feel, takes writing well. Letterheads, notebooks, journals, books.
**Coated silk or matt** — smooth, controlled sheen, good photographic reproduction. Brochures, catalogues, annual reports.
**Coated gloss** — high sheen, punchy colour. Flyers, promotional print.
**Board** — heavier weights for covers, business cards, packaging.
**Specialist** — textured, recycled, coloured, synthetic.

Weight in gsm. Roughly: 80–120gsm text stock, 130–170gsm quality text and brochures, 200–350gsm covers and cards, board above that.

**Do not quote gsm recommendations as Ramco Printing's advice.** Offer general guidance, then let the estimator or the showroom resolve it.

## Finishing — to populate

`[VERIFY]` Confirm which are offered, on which products, what each adds to lead time, and the cost band.

| Finish | Effect | Notes |
|---|---|---|
| Gloss lamination | High sheen, durable | Common on covers |
| Matt lamination | Flat, premium feel | Marks more easily than gloss |
| Soft-touch lamination | Velvet texture | Premium; confirm availability |
| Spot UV | Selective gloss on matt | Needs its own artwork layer |
| Foiling | Metallic detail | Adds lead time; needs a die |
| Embossing / debossing | Raised or recessed | Needs a die |
| Die-cutting | Custom shapes | Needs a die; **Ramco Group has a die-cutting company** |
| Perfect binding | Squared spine, paperback | In-house binding since 2013 |
| Saddle stitch | Stapled through spine | Page-count limited |
| Wiro / spiral | Lies flat | Good for manuals |
| Case binding | Hardcover | Confirm availability |

## Two capabilities worth knowing

**In-house book binding** since September 2013. Binding is not outsourced, which is good for lead time control on DUO publishing and perfect-bound work.

**The Die-Cutting Experts** is a Ramco Group company. `[VERIFY]` whether die-cutting for Ramco Printing jobs runs through them and how that affects lead time.

## The showroom

Where a customer cannot picture a stock or finish, send them to the **showroom at the Dunga Road unit**. Nothing the bot can say beats holding the sample. See `kb-locations.md`.

## What the bot does

- Explain the trade-offs — matt versus gloss, why soft-touch costs more, why foiling adds days
- Ask what the piece needs to *do*, then suggest categories: "Is this going in people's hands for a year, or read once at a conference?"
- **Call a tool** for anything about actual availability or lead time
- Offer the showroom when the conversation stalls on feel
- Record the customer's choice as unspecified if they cannot decide, and let the estimator advise

## What the bot does not do

- State that a stock is in or out of stock without a tool call
- Quote a lead time on a non-held stock from memory
- Recommend a specific gsm as Ramco Printing's house recommendation
- Confirm a finishing option is available on a given product without verification
