# CLAUDE.md - Instructions for Claude Code

## Project: Tal Travel

This is **Tal Travel** - a personal multi-trip travel planning platform for the Tal family. Inspired by TripIt's UX, with a hybrid web + mobile PWA approach. The first trip is a 16-night family trip to Japan (July 20 - August 6, 2026), so the MVP must be functional before then.

## Brand

- **Name:** Tal Travel
- **Primary color:** Lavender (#8b6fb8) - a nod to the lavender fields of Furano, Japan
- **Design inspiration:** TripIt (clean cards, bottom nav, mobile-first)
- **Approach:** Hybrid (desktop for planning, mobile PWA for trip use)

## Critical Context Files (Read First)

Always read these files at the start of every new session:

1. **START_HERE.md** - Quick orientation
2. **PRD.md** - Full product vision, modules, success metrics
3. **DESIGN_GUIDE.md** - Complete design system (colors, typography, screens)
4. **JAPAN_TRIP.md** - All current decisions and details for the first trip
5. **DB_SCHEMA.md** - Database structure for Supabase
6. **OPEN_DECISIONS.md** - Things still being decided in conversation with Roy

## Communication Style

Roy prefers responses in **Hebrew (RTL)**. Communication preferences:

- **No em dashes (--)** anywhere. Use regular hyphens, commas, parentheses, or rephrase
- **Concise but warm** - direct without being curt
- **Practical examples** over abstract explanations
- **Tables and structured data** when comparing options
- **Minimal emojis** - only when they genuinely add clarity
- **Hebrew dates format:** "ה' 23.7" (day of week + DD.MM)
- **Date ranges as check-in → check-out:** "23.7 → 26.7 · 3 לילות" never "23-25.7"
- **Brand names exact:** "Hoshino", "Mimaru", "OMO3", "OMO7", "RISONARE", "KAI Poroto"

When writing Hebrew code comments or UI text, keep proper RTL formatting. Code/variable names in English is fine.

## Family Context (Use Sparingly)

- **Roy Tal** - Main planner. CEO of SOLO (AI facial analytics company). Lives in Kfar Sirkin, Israel.
- **Leahy Tal** - Roy's wife. Hospital physician. Co-planner.
- **Children:** Ariel (~6), Itamar (~4.5), Michael (~3). Too young to use the platform.

Reference family only when relevant.

## Stack & Tools

### Frontend
- **Next.js 15** with App Router
- **React 19**, **TypeScript** strict mode
- **Tailwind CSS** + **shadcn/ui** for components
- **Lucide React** for icons
- **TanStack Query** for data fetching/caching
- **next-pwa** for Progressive Web App
- **next-intl** for Hebrew/English (RTL primary)
- **react-hook-form** + **zod** for forms
- **date-fns** with Hebrew locale

### Backend
- **Supabase** - PostgreSQL, Auth, Storage, Realtime, Row Level Security

### Hosting
- **Vercel** with GitHub integration

## Architectural Principles

### 1. App-First Design (TripIt Inspired)

This is **not** a document/dashboard - it's an **app**. That means:

- **Cards over tables** - hotels, flights, tasks are individual cards, not rows
- **Bottom tab navigation** on mobile (Trips, Today, Documents, Profile)
- **Floating Action Button (FAB)** for primary action on each screen
- **One screen = one task** - focused, not overwhelming
- **Master-Detail layout** on desktop (list left, details right)
- **Smooth transitions** between screens
- **Status badges** with colors for quick scanning

### 2. Hybrid Truly Hybrid

The desktop experience must be excellent for planning sessions. The mobile experience must be excellent for in-trip use. They share data but optimize for different contexts.

- Desktop: wide layouts, keyboard shortcuts, master-detail
- Mobile: bottom nav, large touch targets, FAB, gestures

Test both on every feature.

### 3. Multi-Tenancy From Day One

Every table has proper trip/user scoping. Supabase Row Level Security (RLS) policies on every table. A user only sees trips they're a member of.

### 4. Modular Module System

Modules (Hotels, Flights, etc.) are independent. Each trip activates needed modules. A romantic weekend trip uses Hotels + Flights + Documents. A long family trip uses everything.

Implementation:
- Each module is a separate React component tree under `/modules/[module-name]/`
- Modules register themselves in a central registry
- Trips have an `enabled_modules` array
- Adding a new module shouldn't require touching others

### 5. Don't Hardcode "Japan"

The current trip is to Japan, but the platform is generic. Avoid:
- Hardcoded vermilion/red color scheme (use lavender as platform default)
- Kanji decorations baked into core components
- Assumptions about 5 bases per trip
- JPY-only currency handling

Per-trip theming and configuration handles this.

### 6. Mobile-First, Always

Primary in-trip use is mobile. Test on 375px viewport before declaring done. Touch targets minimum 44px. Forms easy to fill one-handed.

### 7. Offline Resilience

Travelers don't always have WiFi. Critical data (hotel addresses, daily plans, documents) must be cached and viewable offline. Use service worker + IndexedDB via next-pwa.

## Database Schema Notes

See `DB_SCHEMA.md` for full schema. Key tables:

- `users` - Synced with Supabase Auth
- `trips` - Top-level container with theme JSON
- `trip_members` - Many-to-many with role (owner, editor, viewer)
- `trip_modules` - Which modules are enabled per trip
- `bases` - Locations within a trip (Sapporo, Asahikawa, etc.)
- `hotels`, `flights`, `attractions`, `tasks`, `daily_plan` - Module data
- `documents` - File metadata (files in Supabase Storage)
- `expenses`, `journal_entries`, `photos` - V2 modules

## Design System Quick Reference

See `DESIGN_GUIDE.md` for full details. Quick reference:

### Colors
- **Primary:** Lavender 500 (#8b6fb8)
- **Categories:** Blue (flights), Purple (hotels), Orange (activities), Red (food), Teal (transport), Indigo (docs), Green (tasks)
- **Background:** Neutral 50 (#fafafa) light mode

### Typography
- **Body:** Inter + Heebo (for Hebrew)
- **Display:** Manrope (optional, for headings)
- **Mono:** JetBrains Mono (for times, codes)

### Components
- **Cards:** rounded-2xl with subtle shadow
- **Buttons:** shadcn/ui Button component
- **Icons:** Lucide React
- **Forms:** shadcn/ui form components + zod validation

### Spacing
- Use Tailwind defaults (multiples of 4px)
- Common: gap-4 (16px), p-6 (24px), my-8 (32px)

## Roy's Working Style

- **Iterative and conversational** - he thinks through decisions in chat
- **Strategic thinking** - he wants to understand the "why"
- **Values polish but ships pragmatically** - MVP over perfection
- **Likes options compared** - present 2-3 options with tradeoffs

When unsure, ask one clarifying question (not three). Default to action over over-asking.

## Working Together on Plans While Building

Roy will continue making decisions about the Japan trip while you build the platform.

Workflow:
- He asks: "Should we stay at Mimaru Hatchobori or Akasaka?"
- You research, present options, he decides
- You update **both** `JAPAN_TRIP.md` **and** the actual database (if the app is running)
- The platform reflects the decision in real time

**Always keep `JAPAN_TRIP.md` and the live DB in sync.**

## Module Implementation Priority (MVP)

In order of importance for the Japan trip:

1. **Auth + User + Trip basics** - Foundation
2. **Trips List screen** - Mobile + desktop, TripIt-style cards
3. **Today screen** ⭐ - The critical in-trip screen
4. **Documents module** - Roy specifically requested. Passports, tickets, confirmations
5. **Hotels module** - 6 hotels to track for Japan
6. **Flights module** - 4 flights (2 international + 2 internal)
7. **Daily Plan module** - Calendar with timeline view
8. **Tasks module** - Pre-trip checklist with progress
9. **Attractions module** - 50+ optional attractions to select
10. **Weather module** - Static for now, API integration later

V2 (after Japan trip):
11. Expenses module with currency conversion
12. Journal module
13. Photos module
14. Smart notifications

V3 (next trip):
15. Trip templates
16. Insights from past trips

## Important Don'ts

- Don't use em dashes in any user-facing text or code comments
- Don't hardcode "יפן" or "Japan" in component logic
- Don't make Hebrew/RTL an afterthought
- Don't skip mobile testing
- Don't commit secrets - use environment variables
- Don't create separate hotel for each Tokyo period - reuse same Mimaru
- Don't display night dates as "21-22.7" - always check-in → check-out: "21.7 → 23.7"
- Don't build a "document/dashboard" - build an "app"

## Useful Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build           # Production build
npm run start           # Run production build locally
npm run lint            # ESLint

# Supabase
npx supabase start              # Local Supabase instance
npx supabase db push            # Push migrations
npx supabase gen types typescript --local > types/supabase.ts

# Vercel
vercel                  # Deploy preview
vercel --prod          # Deploy production

# shadcn/ui (add new components)
npx shadcn-ui@latest add [component-name]
```

## When in Doubt

1. Check `PRD.md` for product vision
2. Check `DESIGN_GUIDE.md` for design decisions
3. Check `JAPAN_TRIP.md` for current trip context
4. Check `OPEN_DECISIONS.md` for what's still being decided
5. Ask Roy one clear question rather than guessing

This project has been in conversation for many hours. Roy has shared a lot of context. Respect that history. Don't re-ask things that are documented.

## Reminders

- This is **Tal Travel** (not "Japan Travel Platform")
- The brand color is **lavender** (not vermilion - that was the previous static dashboard)
- The inspiration is **TripIt** (not document-style)
- The approach is **Hybrid** (not mobile-only or desktop-only)
- The first trip's theme can still use **Japanese accents** (vermilion accent color, kanji decorations) but the platform itself is generic
