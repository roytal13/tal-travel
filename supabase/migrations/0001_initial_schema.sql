-- Tal Travel - initial schema + RLS
-- Mirrors docs/DB_SCHEMA.md, plus packing_items and trips.budget_ils.

-- =========================================================
-- Helper: updated_at trigger
-- =========================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- =========================================================
-- users (synced with auth.users)
-- =========================================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  preferred_language text default 'he',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create a public.users row when an auth user is created.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- trips
-- =========================================================
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id),
  name text not null,
  destination_country text,
  destination_country_code text,
  start_date date not null,
  end_date date not null,
  cover_image_url text,
  description text,
  status text not null default 'planning',
  budget_ils numeric,
  theme jsonb default '{}',
  settings jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);
create index idx_trips_owner on public.trips(owner_id);
create trigger trg_trips_updated before update on public.trips
  for each row execute function public.set_updated_at();

-- =========================================================
-- trip_members
-- =========================================================
create table public.trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null,
  invited_by uuid references public.users(id),
  joined_at timestamptz default now(),
  unique(trip_id, user_id)
);
create index idx_trip_members_user on public.trip_members(user_id);
create index idx_trip_members_trip on public.trip_members(trip_id);

-- =========================================================
-- trip_modules
-- =========================================================
create table public.trip_modules (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  module_key text not null,
  enabled boolean default true,
  display_order integer default 0,
  settings jsonb default '{}',
  created_at timestamptz default now(),
  unique(trip_id, module_key)
);

-- =========================================================
-- bases
-- =========================================================
create table public.bases (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  name text not null,
  name_local text,
  display_order integer not null,
  check_in_date date not null,
  check_out_date date not null,
  nights integer generated always as (check_out_date - check_in_date) stored,
  latitude numeric,
  longitude numeric,
  region text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_bases_trip on public.bases(trip_id);

-- =========================================================
-- hotels
-- =========================================================
create table public.hotels (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  base_id uuid references public.bases(id) on delete set null,
  name text not null,
  chain text,
  location text,
  check_in_date date,
  check_out_date date,
  status text default 'researching',
  price_per_night numeric,
  total_price numeric,
  currency text default 'USD',
  url text,
  booking_reference text,
  notes text,
  rating numeric,
  cover_image_url text,
  is_recommended boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_hotels_trip on public.hotels(trip_id);

-- =========================================================
-- flights
-- =========================================================
create table public.flights (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  flight_type text not null,
  airline text not null,
  flight_number text,
  departure_airport text not null,
  departure_airport_name text,
  arrival_airport text not null,
  arrival_airport_name text,
  departure_time timestamptz not null,
  arrival_time timestamptz not null,
  duration_minutes integer,
  price numeric,
  currency text default 'USD',
  seat_class text,
  booking_reference text,
  status text default 'researching',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_flights_trip on public.flights(trip_id);

-- =========================================================
-- daily_plan
-- =========================================================
create table public.daily_plan (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  base_id uuid references public.bases(id) on delete set null,
  date date not null,
  day_number integer,
  title text,
  activities text,
  tag text,
  hotel_id uuid references public.hotels(id) on delete set null,
  notes text,
  weather jsonb,
  timeline jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(trip_id, date)
);
create index idx_daily_plan_trip_date on public.daily_plan(trip_id, date);

-- =========================================================
-- attractions
-- =========================================================
create table public.attractions (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  base_id uuid references public.bases(id) on delete set null,
  name text not null,
  name_local text,
  description text,
  category text,
  priority text,
  status text default 'suggested',
  price_per_person numeric,
  currency text default 'JPY',
  duration_minutes integer,
  url text,
  latitude numeric,
  longitude numeric,
  cover_image_url text,
  scheduled_date date,
  scheduled_time time,
  notes text,
  rating_after_visit numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_attractions_trip on public.attractions(trip_id);

-- =========================================================
-- tasks
-- =========================================================
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  title text not null,
  description text,
  category text,
  status text default 'open',
  assigned_to uuid references public.users(id) on delete set null,
  due_date date,
  completed_at timestamptz,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_tasks_trip on public.tasks(trip_id);

-- =========================================================
-- documents (file_path in Supabase Storage)
-- =========================================================
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  uploaded_by uuid references public.users(id),
  category text not null,
  title text not null,
  related_to_user_id uuid references public.users(id),
  related_to_entity_type text,
  related_to_entity_id uuid,
  file_path text,
  file_size_bytes integer,
  mime_type text,
  expiry_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index idx_documents_trip on public.documents(trip_id);

-- =========================================================
-- expenses
-- =========================================================
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  paid_by uuid references public.users(id),
  category text not null,
  amount numeric not null,
  currency text not null,
  amount_ils numeric,
  exchange_rate numeric,
  description text,
  expense_date date not null,
  location text,
  receipt_document_id uuid references public.documents(id),
  created_at timestamptz default now()
);
create index idx_expenses_trip on public.expenses(trip_id);

-- =========================================================
-- packing_items
-- =========================================================
create table public.packing_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  category text not null,
  name text not null,
  quantity integer,
  packed boolean default false,
  display_order integer default 0,
  created_at timestamptz default now()
);
create index idx_packing_trip on public.packing_items(trip_id);

-- =========================================================
-- RLS helpers (SECURITY DEFINER to avoid policy recursion)
-- =========================================================
create or replace function public.is_trip_member(_trip_id uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from trips t where t.id = _trip_id and t.owner_id = auth.uid())
      or exists (select 1 from trip_members m where m.trip_id = _trip_id and m.user_id = auth.uid());
$$;

create or replace function public.is_trip_owner(_trip_id uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from trips t where t.id = _trip_id and t.owner_id = auth.uid());
$$;

-- =========================================================
-- Enable RLS
-- =========================================================
alter table public.users         enable row level security;
alter table public.trips         enable row level security;
alter table public.trip_members  enable row level security;
alter table public.trip_modules  enable row level security;
alter table public.bases         enable row level security;
alter table public.hotels        enable row level security;
alter table public.flights       enable row level security;
alter table public.daily_plan    enable row level security;
alter table public.attractions   enable row level security;
alter table public.tasks         enable row level security;
alter table public.documents     enable row level security;
alter table public.expenses      enable row level security;
alter table public.packing_items enable row level security;

-- users: see/update own row
create policy users_select_self on public.users for select using (id = auth.uid());
create policy users_update_self on public.users for update using (id = auth.uid());

-- trips
create policy trips_select on public.trips for select using (public.is_trip_member(id));
create policy trips_insert on public.trips for insert with check (owner_id = auth.uid());
create policy trips_update on public.trips for update using (owner_id = auth.uid());
create policy trips_delete on public.trips for delete using (owner_id = auth.uid());

-- trip_members
create policy members_select on public.trip_members for select using (public.is_trip_member(trip_id));
create policy members_insert on public.trip_members for insert with check (public.is_trip_owner(trip_id));
create policy members_update on public.trip_members for update using (public.is_trip_owner(trip_id));
create policy members_delete on public.trip_members for delete using (public.is_trip_owner(trip_id));

-- Child tables: full access for trip members. Generated below for each table.
create policy modules_all on public.trip_modules for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy bases_all on public.bases for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy hotels_all on public.hotels for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy flights_all on public.flights for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy daily_plan_all on public.daily_plan for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy attractions_all on public.attractions for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy tasks_all on public.tasks for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy documents_all on public.documents for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy expenses_all on public.expenses for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
create policy packing_all on public.packing_items for all using (public.is_trip_member(trip_id)) with check (public.is_trip_member(trip_id));
