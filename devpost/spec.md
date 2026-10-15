---
doc: spec
status: approved
---

# HydroLog — Technical Specification

## How This Works, In Plain Language

HydroLog is a single-page web app with three main pieces:

1. **Frontend (Next.js)** — The dashboard UI that users see and interact with. Built with React components styled using Tailwind CSS and shadcn/ui. Runs in the browser.

2. **Backend (Supabase)** — Handles two things: authentication (who you are) and database (your drink logs). Supabase is a hosted service, so no server to manage.

3. **State (Zustand)** — Keeps the UI in sync. When you log a drink, Zustand updates the local state immediately (so the UI feels instant), then syncs to Supabase in the background.

Why this shape: It's the simplest architecture that gives us auth, persistence, and a responsive UI. No custom backend server needed — Supabase handles auth and database, Next.js handles the frontend.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`

1. **User opens app** → Next.js serves the dashboard page → Supabase auth checks session
2. **Not logged in** → Redirect to `/login` → User enters email/password → Supabase Auth validates → Session stored in cookie → Redirect to dashboard
3. **Logged in** → Dashboard loads → Zustand fetches today's logs from Supabase → UI renders stats, breakdown, recent logs
4. **User taps Add** → Modal opens (local state) → User selects drink type, enters amount
5. **User saves** → react-hook-form validates → Zustand optimistically updates UI → Supabase insert in background
6. **Success** → Modal closes, dashboard shows new totals immediately
7. **Error** → Toast notification, UI reverts to previous state

## Stack

| Layer | Technology | Version | Docs |
|-------|------------|---------|------|
| Framework | Next.js | 16.x | https://nextjs.org/docs |
| React | React | 19.x | https://react.dev |
| Language | TypeScript | 5.x | https://typescriptlang.org/docs |
| Styling | Tailwind CSS | 4.x | https://tailwindcss.com/docs |
| UI Components | shadcn/ui | latest | https://ui.shadcn.com |
| State | Zustand | 5.x | https://zustand.docs.pmnd.rs |
| Forms | react-hook-form | 7.x | https://react-hook-form.com |
| Validation | Zod | 3.x | https://zod.dev |
| Auth & DB | Supabase | latest | https://supabase.com/docs |
| Icons | Lucide React | latest | https://lucide.dev |

**Rationale:**
- **shadcn/ui** — Learner choice. Pre-built accessible components, customizable with Tailwind. Tradeoff: adds setup time, but saves time on building buttons/modals/inputs from scratch.
- **Zustand** — Learner choice. Simpler than Redux, no boilerplate. Tradeoff: less structure than Redux, but perfect for this app's scale.
- **react-hook-form** — Learner choice. Performant form handling, integrates well with Zod for validation.
- **Supabase** — Learner choice. Auth + Postgres in one service, generous free tier. Tradeoff: vendor lock-in, but acceptable for personal project.

## Where It Runs and How Someone Tries It

**Runtime:** Browser (client-side React app served by Next.js)

**Environment requirements:**
- Node.js 20+
- pnpm (package manager)
- Supabase project (free tier works)

**Environment variables needed:**
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

**Start command:**
```bash
pnpm install
pnpm dev
```
Then open http://localhost:3000

**Demo recording:** Show the full journey — sign up, log a few drinks of different types, watch the dashboard update. Highlight the drink type breakdown showing different categories.

**Deployment (optional):** Vercel. Connect GitHub repo, add env vars, deploy. URL will be `<project>.vercel.app`.

## Look and Feel

PRD ref: `prd.md > Look and Feel`, `scope.md > Inspiration & Identity`

**Color palette (learner-provided):**
- Primary green: `#6BBF4E` (bright), `#3D6F2B` (dark accent)
- Accent orange: `#D55A32` (for warnings, alcohol indicator)
- Neutral gray: `#666666` (text, borders)
- Background: `#FFFFFF` (white), `#F5F5F5` (subtle gray for cards)

**Typography:**
- System font stack (Inter if available)
- Large bold numbers for stats (32-48px)
- Medium weight for labels (16-18px)
- Regular for body text (14-16px)

**Density:** Spacious and calm. Generous padding, rounded corners (8-12px radius), soft shadows on cards.

**Tone:** Friendly, encouraging. "Great job!" when hitting goal, not clinical health-app language.

**shadcn/ui customization:** Override CSS variables to match the green/orange palette. Use their Card, Button, Dialog, Input components as base.

## Components

### Layout Shell
Wraps all pages. Contains header with app name and user menu (logout).
PRD ref: `prd.md > Screens and Layout > Dashboard > Header`

### DashboardPage
Main page component. Fetches data on mount, renders child components.
PRD ref: `prd.md > Screens and Layout > Dashboard`

### HeroStats
Large display of today's total ml with progress bar toward goal.
PRD ref: `prd.md > Screens and Layout > Dashboard > Hero Stats`

### DrinkTypeBreakdown
Horizontal row of cards showing ml per category (Water, Coffee, Soda, Alcohol, Other).
PRD ref: `prd.md > Screens and Layout > Dashboard > Drink Type Breakdown`

### RecentLogs
List of last 5 drink entries with amount, type emoji, and timestamp.
PRD ref: `prd.md > Screens and Layout > Dashboard > Recent Logs`

### EmptyState
Shown when user has no logs today. Displays example logs from sample data.
PRD ref: `prd.md > States and Boundaries > First use (empty state)`

### AddDrinkModal
Dialog with drink type picker, amount presets, custom input, save button.
PRD ref: `prd.md > Screens and Layout > Add Drink Modal`

### DrinkTypePicker
Grid of drink type options with emoji icons. Single selection.
PRD ref: `prd.md > Features and Behavior > Log Intake`

### AmountInput
Preset buttons (250ml, 500ml, 1L) plus custom number input.
PRD ref: `prd.md > Features and Behavior > Log Intake`

### AuthPages (Login, SignUp)
Simple forms for email/password auth.
PRD ref: `prd.md > Screens and Layout > Auth Screens`

## Data Model

### Supabase Tables

**profiles**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_goal_ml INTEGER DEFAULT 2000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**drink_logs**
```sql
CREATE TABLE drink_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  drink_type TEXT NOT NULL CHECK (drink_type IN ('water', 'coffee', 'soda', 'alcohol', 'other')),
  amount_ml INTEGER NOT NULL CHECK (amount_ml > 0 AND amount_ml <= 5000),
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drink_logs_user_date ON drink_logs(user_id, logged_at);
```

**Row Level Security:**
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drink_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own logs" ON drink_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON drink_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Zustand Store Shape

```typescript
interface HydroStore {
  // Data
  todayLogs: DrinkLog[];
  dailyGoal: number;
  isLoading: boolean;

  // Computed (derived in selectors)
  // totalMl, drinkTypeBreakdown, recentLogs

  // Actions
  fetchTodayLogs: () => Promise<void>;
  addLog: (type: DrinkType, amount: number) => Promise<void>;
}
```

### Drink Types (constant)
```typescript
const DRINK_TYPES = {
  water: { label: 'Water', emoji: '💧', color: '#6BBF4E' },
  coffee: { label: 'Coffee/Tea', emoji: '☕', color: '#8B4513' },
  soda: { label: 'Soda/Juice', emoji: '🥤', color: '#D55A32' },
  alcohol: { label: 'Alcohol', emoji: '🍺', color: '#DAA520' },
  other: { label: 'Other', emoji: '🧃', color: '#666666' },
} as const;
```

## File Structure

```
how-much-i-drink-today/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Login form
│   │   ├── signup/
│   │   │   └── page.tsx          # Sign up form
│   │   └── layout.tsx            # Auth layout (centered card)
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Dashboard layout with header
│   │   └── page.tsx              # Main dashboard
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Tailwind + custom CSS vars
│   └── page.tsx                  # Redirect to /dashboard or /login
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── progress.tsx
│   ├── dashboard/
│   │   ├── hero-stats.tsx
│   │   ├── drink-type-breakdown.tsx
│   │   ├── recent-logs.tsx
│   │   └── empty-state.tsx
│   ├── add-drink/
│   │   ├── add-drink-modal.tsx
│   │   ├── drink-type-picker.tsx
│   │   └── amount-input.tsx
│   └── layout/
│       └── header.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Auth middleware helper
│   ├── store/
│   │   └── hydro-store.ts        # Zustand store
│   ├── constants.ts              # Drink types, goals
│   └── utils.ts                  # Date helpers, cn()
├── types/
│   └── index.ts                  # TypeScript types
├── middleware.ts                 # Next.js auth middleware
├── devpost/                      # Planning docs
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
└── .env.local                    # Environment variables
```

## External Services and Dependencies

### Supabase

**Auth API:**
- `supabase.auth.signUp({ email, password })` — Create account
- `supabase.auth.signInWithPassword({ email, password })` — Login
- `supabase.auth.signOut()` — Logout
- `supabase.auth.getUser()` — Get current user

**Database API:**
- `supabase.from('drink_logs').select('*').eq('user_id', uid).gte('logged_at', todayStart)` — Get today's logs
- `supabase.from('drink_logs').insert({ user_id, drink_type, amount_ml })` — Add log

**Docs:** https://supabase.com/docs

**Keys needed:** `SUPABASE_URL`, `SUPABASE_ANON_KEY` (from Supabase dashboard)

**Rate limits:** 500 requests/second on free tier (more than enough)

**Cost:** Free tier includes 500MB database, 50k monthly active users

## Important Failure Modes

- **Supabase down** → Show cached data from Zustand if available, display "Unable to sync" banner. User can still view but not add logs.

- **Auth session expired** → Supabase client auto-refreshes tokens. If refresh fails, redirect to login with message "Session expired, please log in again."

- **Invalid form input** → react-hook-form + Zod prevents submit. Show inline error: "Amount must be between 1 and 5000 ml."

## What Was Simplified and Why

- **No edit/delete logs** — Would need additional UI and API calls. For POC, if user makes mistake, they just log again or ignore. Fuller version would add swipe-to-delete on recent logs.

- **Fixed drink types** — 5 preset categories instead of custom types. Covers 95% of cases. Fuller version would add "Manage types" settings page.

- **Default goal only** — 2000ml hardcoded instead of user-configurable. Fuller version would add settings page with goal slider.

- **Today only** — No historical data view. Simplifies queries and UI. Fuller version would add date picker and charts.

- **Sample data for empty state** — Hardcoded example logs instead of real anonymized data. Simpler than building a public feed.

## Decisions and Open Issues

**Learner decisions:**
- shadcn/ui for components — wants beautiful, accessible UI without building from scratch
- Zustand for state — familiar, lightweight, good DX
- react-hook-form for forms — performant, good validation integration
- Green/orange color palette — learner-provided design direction

**Implementation decisions (derived from above):**
- Tailwind CSS variables will override shadcn/ui defaults to match learner's palette
- Optimistic updates via Zustand for instant UI feedback
- RLS in Supabase ensures data isolation without extra backend logic

**Learning opportunity identified:**
- Supabase Row Level Security (RLS) — new concept for learner. Will explore how policies work when setting up database. Evidence: successfully configured RLS that prevents cross-user data access.

**Open issues:** None. Ready to build.
