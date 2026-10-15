---
doc: prd
status: approved
---

# HydroLog — Product Requirements

A minimal, clean dashboard for personal water intake tracking with drink-type awareness.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`

## The Core Journey

1. **Arrive** — User opens the app URL
2. **Authenticate** — Sign in with email (or sign up if first time)
3. **See Dashboard** — Immediately view today's hydration stats
4. **Log a Drink** — Tap add button, select drink type, enter ml, save
5. **Watch Update** — Dashboard reflects new total instantly
6. **Repeat** — Log throughout the day, building a picture of drinking habits
7. **Success** — At end of day, user can see what they actually drank vs. what they thought

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`

## Screens and Layout

### Dashboard (Main Screen)
Single-page layout, top to bottom:

1. **Header** — App name "HydroLog" on the left, add button (+ icon) on the right
2. **Hero Stats** — Large display of today's total ml, progress bar toward daily goal (default 2000ml), goal label below
3. **Drink Type Breakdown** — Horizontal row of cards showing ml per category: Water, Coffee, Soda, Alcohol. Each card has an emoji icon, category name, and ml amount
4. **Recent Logs** — Vertical list of last 3-5 drink entries, each showing: amount (ml), drink type, timestamp. Most recent at top

### Add Drink Modal
Overlay modal that appears when user taps the add button:

1. **Header** — "Add Drink" title with close (X) button
2. **Drink Type Picker** — Grid of drink type options with emoji icons: 💧 Water, ☕ Coffee/Tea, 🥤 Soda/Juice, 🍺 Alcohol, 🧃 Other. Selected type highlighted
3. **Amount Input** — Preset quick buttons (250ml, 500ml, 1L) plus custom number input field
4. **Save Button** — Full-width button at bottom, disabled until type selected and amount > 0

### Auth Screens
Simple, minimal forms:

1. **Login** — Email input, password input, login button, link to sign up
2. **Sign Up** — Email input, password input, confirm password, sign up button, link to login

## Look and Feel

- **Overall style**: Clean, minimal, modern — inspired by Apple Health simplicity
- **Colors**: Light background (off-white/gray), white cards with soft shadows, blue accent for water/primary actions, subtle color coding for drink types (blue=water, brown=coffee, orange=soda, amber=alcohol)
- **Typography**: System font stack, clear hierarchy — large bold numbers for stats, medium weight for labels, regular for body text
- **Spacing**: Generous whitespace, rounded corners on cards and buttons
- **Interactions**: Instant feedback, smooth transitions, no loading spinners for local actions

Source: `scope.md > Inspiration & Identity`

## Features and Behavior

### Dashboard Display
Implements `scope.md > The Core Loop` step 1.

- Shows today's data only (resets at midnight local time)
- Total ml updates immediately when new drink is logged
- Progress bar fills proportionally (total / goal)
- Drink type breakdown shows 0 for categories with no logs today
- Recent logs show newest first, limited to 5 entries

**Acceptance criteria:**
- [ ] Dashboard loads in under 2 seconds
- [ ] Total ml matches sum of all logs for today
- [ ] Progress bar percentage is accurate (total/goal * 100)
- [ ] Drink type cards show correct totals per category
- [ ] Recent logs display in reverse chronological order

### Log Intake
Implements `scope.md > The Core Loop` steps 2-3.

- Tap add button opens modal
- Select exactly one drink type (required)
- Enter amount via preset buttons OR custom input (required, must be > 0)
- Preset buttons: 250ml, 500ml, 1000ml (1L)
- Custom input accepts numbers only, max 5000ml
- Save persists to database and closes modal
- Dashboard updates immediately without page refresh

**Acceptance criteria:**
- [ ] Cannot save without selecting drink type
- [ ] Cannot save with amount ≤ 0 or empty
- [ ] Preset buttons populate the amount field
- [ ] Custom input overrides preset selection
- [ ] Save button disabled until form is valid
- [ ] After save, modal closes and dashboard shows new entry

### Authentication
Implements `scope.md > POC Boundary` — "Basic auth (so data is personal)".

- Email/password authentication
- Persistent session (stay logged in)
- Each user sees only their own data
- Redirect to login if not authenticated

**Acceptance criteria:**
- [ ] Can create account with email/password
- [ ] Can log in with existing account
- [ ] Session persists across browser refresh
- [ ] Logged-out users cannot access dashboard
- [ ] Users cannot see other users' data

## States and Boundaries

- **First use (empty state)** — Dashboard shows 0ml total, empty progress bar, 0 in all drink type cards. Recent logs section shows "No drinks logged yet" message with example logs from other users (anonymized) as inspiration: "💧 Sarah logged 500ml water", "☕ Mike logged 300ml coffee". Encourages user to log their first drink.

- **Normal use** — Dashboard populated with today's data, recent logs list shows actual entries.

- **Validation error** — If user tries to save with invalid input, show inline error message below the relevant field. Do not close modal. Button remains disabled.

- **Persistence** — All logs persist in database. Data survives browser refresh, device change, logout/login. Each day starts fresh (today's view only shows today's logs).

- **Midnight reset** — "Today" is defined by user's local timezone. At midnight, dashboard shows 0ml for the new day. Previous day's data still exists in database for future history feature.

## Product Decisions

- **Single day view only** — Keeps POC simple; history/trends deferred to later. User reason: prove core logging loop first.
- **Predefined drink types** — 5 fixed categories (Water, Coffee/Tea, Soda/Juice, Alcohol, Other) rather than custom types. Simpler UX, covers 95% of cases.
- **Default goal 2000ml** — Standard hydration recommendation. Goal customization deferred.
- **Email auth only** — Simplest to implement with Supabase. Social login deferred.
- **Empty state shows others' logs** — Provides social proof and shows how app works before user has data.

## What We're Building

1. Dashboard page showing today's hydration stats
2. Add drink modal with type picker and amount input
3. Drink type breakdown cards
4. Recent logs list
5. User authentication (sign up, login, logout)
6. Data persistence with Supabase
7. Empty state with example logs
8. Responsive design (works on mobile browsers)

## Deferred From the POC

- **Photo upload + AI analysis** — Core tech for ingredient reading exists but adds significant complexity. Prove logging loop first, then layer AI on top.
- **Historical data / trends** — Requires date picker, charts, more complex queries. Today-only view is sufficient for POC.
- **Custom drink types** — Requires type management UI. 5 preset types cover most cases.
- **Goal customization** — Requires settings page. Default 2000ml works for POC.
- **Edit/delete logs** — Nice to have but not essential for proving the concept.

## Possible Later Enhancements

- Weekly/monthly charts showing drinking patterns over time
- AI-powered ingredient analysis from drink label photos
- Health recommendations based on drinking habits and body stats
- Push notifications for hydration reminders
- Social features: friends, leaderboards, challenges
- Custom drink types and favorites
- Apple Health / Google Fit integration

## Non-Goals

- **Mobile native app** — Web-first, responsive design handles mobile. Native apps are out of scope.
- **Offline support** — Requires service workers, sync logic. Always-online is fine for POC.
- **Multi-language** — English only for POC.
- **Detailed nutrition tracking** — This is hydration tracking, not calorie counting. Sugar/caffeine content deferred.
- **Real-time sync across devices** — Page refresh is acceptable for POC.

## Open Questions

None — all consequential decisions resolved. Ready for spec.
