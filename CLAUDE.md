# Tal Travel

Personal multi-trip travel planning platform for the Tal family (TripIt-inspired,
hybrid web + mobile PWA). First trip: family Japan trip 20.7 - 6.8.2026, so the MVP
must be functional before then.

## Full spec

The complete product spec lives in `docs/`. Read these at the start of a session:

1. `docs/START_HERE.md` - orientation
2. `docs/PRD.md` - product vision, modules, success metrics
3. `docs/DESIGN_GUIDE.md` - design system (colors, type, screens)
4. `docs/JAPAN_TRIP.md` - all current decisions for the first trip
5. `docs/DB_SCHEMA.md` - Supabase schema
6. `docs/OPEN_DECISIONS.md` - still being decided with Roy
7. `docs/CLAUDE.md` - the original detailed working instructions

## Dev environment

- **Node:** use v20 via nvm. The shell default is v16 which is too old for Next 16.
  Prefix commands: `export PATH="/Users/solo/.nvm/versions/node/v20.20.2/bin:$PATH"`
- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui.
- `npm run dev` starts the dev server on http://localhost:3000.

## Data layer

Supabase is not connected yet (free-tier project limit). Until then, the app reads
from a mock data layer in `lib/mock/` that mirrors `docs/DB_SCHEMA.md`. Keep types in
`lib/types.ts` aligned with the schema so swapping to Supabase is a thin change.

## Conventions (Roy's preferences)

- UI text in **Hebrew, RTL**. Code/variable names in English.
- **No em dashes** anywhere. Use hyphens, commas, parentheses, or rephrase.
- Hebrew date format: `ה' 23.7` (day-of-week + DD.MM).
- Date ranges as check-in -> check-out: `23.7 → 26.7 · 3 לילות`, never `23-25.7`.
- Brand names exact: Hoshino, Mimaru, OMO3, OMO7, RISONARE, KAI Poroto.
- App-first (cards, not tables), mobile-first (test at 375px), lavender as the
  platform default color. Do not hardcode "Japan" into core logic.
- RTL spacing: prefer `ms-`/`me-` over `ml-`/`mr-`.
