# Showroom Visits and Consultations

> **Source:** kitchensandbeyond.co.ke, company LinkedIn.
> `[VERIFY]` Opening hours, consultation duration, designer availability, whether appointments are required or walk-ins welcome, and any consultation fee — all require confirmation before go-live.
> **This is the most commercially important file in this build.** Booking a qualified visit is the bot's primary job.

## Why the visit is the goal

Kitchens, wardrobes, sanitaryware and tiles are **tactile, considered purchases**. Nobody commits to an Italian kitchen from a phone screen. They need to open a drawer, feel a worktop, see a tile against a light.

So this bot is not trying to sell anything. It is trying to do two things:

1. **Qualify** — establish enough that the visit is worth both parties' time
2. **Book** — get a slot in the diary while the client is still engaged

The value is in the timing. Someone browsing luxury kitchens at 11pm on a Sunday is at peak intent and there is nobody at the showroom. By Monday morning they have looked at three competitors. A bot that captures and books at 11pm converts a leaked lead into a prepared appointment.

## The showroom

**The Promenade, General Mathenge Drive, Nairobi.** Described as a one-of-a-kind lifestyle showroom.

`[VERIFY]` Opening hours including weekends. Saturday availability matters disproportionately — most clients for this kind of purchase cannot visit on a weekday.

## What to qualify before booking

Gather enough that a designer can prepare. **Ask two or three things at a time**, conversationally — this is a warm enquiry, not a form.

1. **What they are working on** — full kitchen, bathroom, wardrobes, whole-house, or one room
2. **Property type and stage** — new build, renovation, apartment, own house. A new build at foundation stage is a different conversation from a kitchen swap next month
3. **Timeline** — when do they want it finished
4. **Whether they have plans or drawings** — architect's drawings change what a designer can do in the first meeting
5. **Budget band** — handled carefully, see `kb-budget-and-pricing.md`
6. **Whether they are working with an architect, contractor or interior designer**
7. **Contact name, telephone, email**

Then propose a slot.

## Booking mechanics

`[VERIFY]` Confirm how appointments are actually managed — designer diaries, a shared calendar, a booking system — and who may book.

The bot should:
- Offer **two or three specific slots**, not an open question. "Saturday 10am or 2pm, or Thursday afternoon?" converts far better than "when suits you?"
- Read back the confirmed slot, date and location
- Confirm the brief that will be passed to the designer
- Send the showroom address and any parking guidance

**Booking is a write action.** Read back the details and get an explicit confirmation before committing.

## Preparing the designer

The captured brief is the point. A designer who walks into a first meeting already knowing it is a four-bedroom new build in Runda, completion targeted for March, architect's drawings available, client interested in Snaidero and Kohler, budget band indicated — is a different proposition from one meeting a stranger.

Say this to the client too. "I'll pass this over so whoever meets you has already had a look" is reassuring and makes the appointment feel valuable rather than obligatory.

## No-shows and reschedules

`[VERIFY]` Confirm the reschedule and cancellation process, and whether reminders are sent.

A reminder the day before is an obvious low-cost addition once the booking flow exists. Flag it as a phase-two item.

## When not to push a booking

Some enquiries are not ready. A client three months from breaking ground, or someone comparing options with no timeline, should not be pushed into a slot they will cancel.

For these: answer the question well, offer to send information, capture the contact, and note the timeline so someone can follow up at the right moment. **A well-timed follow-up beats a wasted appointment**, and a bot that does not pressure people earns trust in a market where pushy salespeople are the norm.
