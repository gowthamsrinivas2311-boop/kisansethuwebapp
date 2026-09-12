create extension if not exists pgcrypto;

create table if not exists public.prices (
  id uuid primary key default gen_random_uuid(),
  crop text not null,
  market text not null,
  price numeric(12,2) not null,
  unit text not null default 'quintal',
  date date not null default current_date,
  source text not null default 'APMC daily bulletin'
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  farmer_name text not null,
  crop text not null,
  quantity numeric(12,2) not null,
  price numeric(12,2) not null,
  location text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('farmer', 'buyer')),
  phone text not null unique,
  preferred_language text not null default 'english' check (preferred_language in ('hindi', 'marathi', 'english'))
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  village text not null default '',
  taluka text not null default '',
  district text not null default '',
  preferred_language text not null default 'english' check (preferred_language in ('hindi', 'marathi', 'english')),
  avatar_url text,
  email text,
  onboarded_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.prices enable row level security;
alter table public.listings enable row level security;
alter table public.users enable row level security;
alter table public.profiles enable row level security;

create policy "public price access" on public.prices for all using (true) with check (true);
create policy "public listing access" on public.listings for all using (true) with check (true);
create policy "public user access" on public.users for all using (true) with check (true);
create policy "profiles are self managed" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
