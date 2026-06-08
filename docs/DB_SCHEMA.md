# Database Schema - Supabase PostgreSQL

## Design Principles

1. **Multi-tenancy from day one** - Every row scoped to user or trip
2. **Row Level Security (RLS)** on every table - users see only what they should
3. **UUIDs for all primary keys** - safer for sharing
4. **Timestamps everywhere** - `created_at`, `updated_at` on all tables
5. **Soft deletes** for important data - `deleted_at` field instead of hard delete
6. **JSONB for flexible fields** - settings, metadata, theming

## Core Tables

### `users`

Synced with Supabase Auth. One row per registered user.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'he',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `trips`

Top-level container. One row per trip.

```sql
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,                          -- "יפן 2026"
  destination_country TEXT,                    -- "Japan"
  destination_country_code TEXT,               -- "JP"
  start_date DATE NOT NULL,                    -- 2026-07-20
  end_date DATE NOT NULL,                      -- 2026-08-06
  cover_image_url TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning',    -- planning, upcoming, active, completed, archived
  theme JSONB DEFAULT '{}',                    -- colors, fonts, decorations
  settings JSONB DEFAULT '{}',                 -- timezone, currency, language
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_trips_owner ON trips(owner_id);
CREATE INDEX idx_trips_status ON trips(status) WHERE deleted_at IS NULL;
```

### `trip_members`

Many-to-many between users and trips.

```sql
CREATE TABLE trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,                          -- owner, editor, viewer
  invited_by UUID REFERENCES users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

CREATE INDEX idx_trip_members_user ON trip_members(user_id);
CREATE INDEX idx_trip_members_trip ON trip_members(trip_id);
```

### `trip_modules`

Which modules are enabled per trip.

```sql
CREATE TABLE trip_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL,                    -- hotels, flights, daily_plan, etc.
  enabled BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',                 -- module-specific config
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, module_key)
);
```

## Trip Structure Tables

### `bases`

Geographic bases within a trip (e.g., Sapporo, Asahikawa).

```sql
CREATE TABLE bases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                          -- "Sapporo"
  name_local TEXT,                             -- "札幌"
  display_order INTEGER NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights INTEGER GENERATED ALWAYS AS (check_out_date - check_in_date) STORED,
  latitude NUMERIC,
  longitude NUMERIC,
  region TEXT,                                 -- "Hokkaido"
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bases_trip ON bases(trip_id);
```

## Module Tables

### `hotels`

```sql
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  base_id UUID REFERENCES bases(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  chain TEXT,                                  -- "Hoshino", "Mimaru"
  location TEXT,
  check_in_date DATE,
  check_out_date DATE,
  nights INTEGER GENERATED ALWAYS AS (check_out_date - check_in_date) STORED,
  status TEXT DEFAULT 'researching',          -- researching, deciding, to_book, booked, paid, cancelled
  price_per_night NUMERIC,
  total_price NUMERIC,
  currency TEXT DEFAULT 'USD',
  url TEXT,
  booking_reference TEXT,
  notes TEXT,
  rating NUMERIC,
  cover_image_url TEXT,
  is_recommended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hotels_trip ON hotels(trip_id);
CREATE INDEX idx_hotels_status ON hotels(status);
```

### `flights`

```sql
CREATE TABLE flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  flight_type TEXT NOT NULL,                   -- international, domestic, connection
  airline TEXT NOT NULL,
  flight_number TEXT,
  departure_airport TEXT NOT NULL,             -- "TLV"
  departure_airport_name TEXT,
  arrival_airport TEXT NOT NULL,               -- "NRT"
  arrival_airport_name TEXT,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  price NUMERIC,
  currency TEXT DEFAULT 'USD',
  seat_class TEXT,                             -- economy, premium, business
  booking_reference TEXT,
  status TEXT DEFAULT 'researching',          -- researching, booked, checked_in, completed, cancelled
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flights_trip ON flights(trip_id);
CREATE INDEX idx_flights_departure ON flights(departure_time);
```

### `daily_plan`

```sql
CREATE TABLE daily_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  base_id UUID REFERENCES bases(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  day_number INTEGER,                          -- Day 1, 2, 3 of the trip
  title TEXT,
  activities TEXT,
  tag TEXT,                                    -- arrival, travel, exploration, rest
  hotel_id UUID REFERENCES hotels(id) ON DELETE SET NULL,
  notes TEXT,
  weather JSONB,                               -- {temp_min, temp_max, conditions}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, date)
);

CREATE INDEX idx_daily_plan_trip_date ON daily_plan(trip_id, date);
```

### `attractions`

```sql
CREATE TABLE attractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  base_id UUID REFERENCES bases(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  name_local TEXT,
  description TEXT,
  category TEXT,                               -- nature, culture, food, entertainment, shopping
  priority TEXT,                               -- must, recommended, optional
  status TEXT DEFAULT 'suggested',             -- suggested, selected, scheduled, visited, skipped
  price_per_person NUMERIC,
  currency TEXT DEFAULT 'JPY',
  duration_minutes INTEGER,
  url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  cover_image_url TEXT,
  scheduled_date DATE,
  scheduled_time TIME,
  notes TEXT,
  rating_after_visit NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attractions_trip ON attractions(trip_id);
CREATE INDEX idx_attractions_status ON attractions(status);
```

### `tasks`

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,                               -- urgent, soon, before_departure, during_trip
  status TEXT DEFAULT 'open',                  -- open, in_progress, done, cancelled
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_trip ON tasks(trip_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

### `documents`

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  category TEXT NOT NULL,                      -- passport, flight_ticket, hotel_confirmation, visa, insurance, license, other
  title TEXT NOT NULL,                         -- "Passport - Roy"
  related_to_user_id UUID REFERENCES users(id), -- Whose document is it
  related_to_entity_type TEXT,                 -- hotel, flight, attraction
  related_to_entity_id UUID,
  file_path TEXT NOT NULL,                     -- Path in Supabase Storage
  file_size_bytes INTEGER,
  mime_type TEXT,
  expiry_date DATE,                           -- For passports, visas
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_trip ON documents(trip_id);
CREATE INDEX idx_documents_category ON documents(category);
```

## V2 Tables

### `expenses` (V2)

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  paid_by UUID NOT NULL REFERENCES users(id),
  category TEXT NOT NULL,                      -- food, transport, accommodation, attraction, shopping, other
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  amount_ils NUMERIC,                          -- Converted to base currency
  exchange_rate NUMERIC,
  description TEXT,
  expense_date DATE NOT NULL,
  location TEXT,
  split_between UUID[],                        -- Array of user IDs sharing this expense
  receipt_document_id UUID REFERENCES documents(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `journal_entries` (V2)

```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  entry_date DATE NOT NULL,
  title TEXT,
  content TEXT,
  mood TEXT,
  weather TEXT,
  location TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  is_shared BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `photos` (V2)

```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  caption TEXT,
  photo_date DATE,
  location TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  base_id UUID REFERENCES bases(id),
  journal_entry_id UUID REFERENCES journal_entries(id),
  attraction_id UUID REFERENCES attractions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security Policies

### Example: trips table

```sql
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Users can see trips they own or are members of
CREATE POLICY "Users can view their trips"
  ON trips FOR SELECT
  USING (
    auth.uid() = owner_id 
    OR auth.uid() IN (
      SELECT user_id FROM trip_members WHERE trip_id = trips.id
    )
  );

-- Only owners can update
CREATE POLICY "Only owners can update trips"
  ON trips FOR UPDATE
  USING (auth.uid() = owner_id);

-- Only owners can delete
CREATE POLICY "Only owners can delete trips"
  ON trips FOR DELETE
  USING (auth.uid() = owner_id);

-- Authenticated users can create
CREATE POLICY "Authenticated users can create trips"
  ON trips FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
```

Apply similar pattern for all tables: users can see/modify only data tied to trips they're members of.

## Storage Buckets

```
- trip-documents/      (Private, requires auth)
  - {trip_id}/
    - {document_id}.{ext}
    
- trip-photos/         (Private, accessible to trip members)
  - {trip_id}/
    - {photo_id}.{ext}
    - thumbnails/
      - {photo_id}_thumb.{ext}

- trip-covers/         (Public, for trip cover images)
  - {trip_id}/
    - cover.{ext}

- user-avatars/        (Public)
  - {user_id}.{ext}
```

## Initial Data (Seed for Japan Trip)

After schema creation, seed the Japan trip with:
- 1 trip (Japan 2026)
- 2 users (Roy, Leahy)
- 2 trip_members
- 7 enabled modules
- 6 bases (Tokyo Start, Sapporo, Asahikawa, Tomamu, Toya, KAI Poroto, Tokyo End)
- 6 hotels
- 4 flights (2 international + 2 internal)
- ~17 daily plan entries
- ~50+ attractions (organized by base)
- ~25 pre-trip tasks

See `JAPAN_TRIP.md` for full content to seed.

## Migration Strategy

Use Supabase migrations:

```bash
npx supabase migration new initial_schema
# Edit the file in supabase/migrations/
npx supabase db push
```

Keep migrations small and reversible. Don't ever modify migrations after they've been pushed to production.
