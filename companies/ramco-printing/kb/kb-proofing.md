# Proofing and Approval

> `[VERIFY]` Proof types offered, delivery method, and the approval mechanism require confirmation from Ramco Printing before go-live.
> **This is the most commercially important file in the build.** The proof approval stage is where jobs stall, and surfacing that is the core value of this bot.

## What a proof is

Before a job goes to press, the customer is shown a proof — a representation of exactly what will be printed. Approving it is the customer's confirmation that content, layout, spelling and colour are correct.

Once a job is on press, changes mean reprinting at cost. The proof is the last point at which a mistake is cheap.

`[VERIFY]` Confirm which proof types are offered — digital or PDF proof, hard-copy proof, wet proof off-press — and for which product types each applies.

## Why this stage is the bottleneck

**A job sitting at "awaiting approval" is not waiting on Ramco Printing. It is waiting on the customer.**

This is nearly always invisible to the customer. The proof went to an inbox, the person who ordered it is in meetings, and nobody realises the press slot is idling. Meanwhile the promised dispatch date is quietly slipping and the customer will be surprised and annoyed when it does.

The bot fixes this by telling them, plainly, the moment they ask about the job — and by being available at 11pm when they finally read their email.

## How the bot handles a stalled proof

When a job-status lookup returns a blocker of type `customer_proof_approval`, **lead with it**. Do not bury it after the production narrative.

State three things:
1. That the job is otherwise ready and waiting
2. How long the proof has been outstanding
3. What approving it now does to the dispatch date

Be helpful, never accusatory. They did not do this deliberately.

> **Good:** "It's through prepress and the proof went over on Monday — it's been sitting with you for three days. Approve it today and we'll still make Thursday. Each day it waits pushes dispatch back."
>
> **Bad:** "The job is delayed because you have not approved the proof."

The difference matters. The first sounds like a colleague helping. The second sounds like blame, and blame from a chatbot lands badly.

## Approving through the bot

Only a **named proof approver** on the account may approve, and only at the highest authentication level.

Before approving:
1. Read back exactly what they are approving — job number, description, proof version
2. Get an explicit yes
3. Then approve

Approval **releases the job to production and cannot be undone**. Treat it with the seriousness of a signature. "Sounds good" is not approval of a specific proof version — read it back and get a clear confirmation.

After approving, state the revised dispatch date.

## Changes requested

If the customer wants changes rather than approval, do not attempt to capture the changes as artwork instructions. Capture *that* changes are needed and any specifics they volunteer, then hand off to the division. Amendments are a prepress conversation.

## What the bot does not do

- Approve on someone's behalf, or on an implied yes
- Approve for anyone who is not a named approver
- Accept artwork or amended files through this channel — see `kb-artwork-spec.md`
- Commit to a revised dispatch date beyond what the tool returns
- Reopen an approved proof. Once released, that is a call to the division

## The number worth knowing

Across Ramco Printing's recent job history, the average time a job spends waiting for customer proof approval is **2.3 days**, and on a meaningful share of late dispatches that wait was the entire cause of the delay.

`[VERIFY]` Recompute this from Ramco Printing's actual job data before quoting it to them. The demo seed data is engineered to produce this figure, but the real number is the one that will land in the room — and if it is worse than 2.3 days, it is a stronger argument, not a weaker one.
