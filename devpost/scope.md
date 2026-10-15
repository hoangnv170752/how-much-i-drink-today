---
doc: scope
status: approved
---

# HydroLog — Personal Water Intake Tracker

A minimal, clean dashboard to track daily water consumption with smart categorization of drink types.

## The Unique Kernel

Personal hydration accountability with drink-type awareness. Not just "how much water" but "what kind of drinks" — distinguishing healthy hydration from sugar/alcohol intake. The data tells you if you're actually hydrating or just drinking.

## Who It's For

The learner themselves — someone working on IoT water purifier products who wants to practice what they preach. Currently tracks nothing, relies on memory, and has no visibility into drinking patterns or problem areas (too much sugar, alcohol, forgetting to drink).

## The Core Loop

1. Open the app → see today's stats at a glance (total ml, drink count)
2. Log a drink → select type, enter amount, save
3. Watch the numbers update → immediate feedback
4. Repeat throughout the day

Why they come back: the dashboard becomes a quick health check habit, like checking the weather.

## Inspiration & Identity

- Clean, minimal interface — not cluttered health apps
- Light and modern feel — think Apple Health simplicity
- Quick interactions — log in seconds, not minutes
- Data visualization that's glanceable, not overwhelming

## Why This Matters to the Learner

- Learning new technologies (Next.js 16, Supabase, AI integration)
- Working efficiently with AI agents
- Creating beautiful, polished UI
- Building something personally useful while learning

## What "Working" Looks Like

User opens the app, immediately sees their hydration stats for today (total ml, number of drinks logged). They tap to add a new drink, select the type (water, coffee, soda, beer, etc.), enter the amount in ml, and save. The dashboard updates instantly. The "oh, that's cool" moment: seeing your drinking pattern visualized — you thought you drank enough water but the data shows mostly coffee.

## The POC Boundary

**In scope:**
- Dashboard showing today's intake (total ml, drink count by type)
- Log intake form (drink type selector, ml input)
- Persist data (Supabase)
- Basic auth (so data is personal)
- Clean, minimal UI

## Later

- Photo upload + AI ingredient analysis
- AI health recommendations based on body condition
- Historical trends (weekly/monthly charts)
- Notifications for forgotten logs
- Detailed drink categorization (sugar content, caffeine, alcohol levels)
- Social features (friends, leaderboard, ranking)

## Explicitly Cut

- **AI analysis in POC** — adds complexity; prove the core logging loop first
- **Social/gamification** — requires user system, invites, real-time sync; out of scope for personal tracker POC
- **Mobile app** — web-first; responsive design handles mobile use cases
- **Complex analytics** — simple daily view is enough to prove value; charts come later
- **Notifications/reminders** — requires background jobs, push infrastructure; manual logging first
