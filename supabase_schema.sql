-- StoX Supabase Database Schema
-- Run this SQL script in your Supabase SQL Editor to set up Authentication profiles, Holdings, and Watchlists with RLS.

-- 1. Create a public profiles table linked to Supabase auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  userid text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );


-- 2. Create Portfolio Holdings table for user investments
create table public.holdings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  symbol text not null,
  shares numeric not null check (shares > 0),
  avg_price numeric not null check (avg_price > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on holdings
alter table public.holdings enable row level security;

create policy "Users can view their own holdings."
  on public.holdings for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own holdings."
  on public.holdings for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own holdings."
  on public.holdings for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own holdings."
  on public.holdings for delete
  using ( auth.uid() = user_id );


-- 3. Create Watchlists table
create table public.watchlists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  symbol text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, symbol)
);

-- Enable RLS on watchlists
alter table public.watchlists enable row level security;

create policy "Users can view their own watchlist."
  on public.watchlists for select
  using ( auth.uid() = user_id );

create policy "Users can insert into their own watchlist."
  on public.watchlists for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete from their own watchlist."
  on public.watchlists for delete
  using ( auth.uid() = user_id );


-- 4. Automatically create a profile row when a new user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, userid)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'userid', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 5. Create Portfolio Snapshots table for historical daily valuation tracking
create table public.portfolio_snapshots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  total_value numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Enable RLS on portfolio_snapshots
alter table public.portfolio_snapshots enable row level security;

create policy "Users can view their own portfolio snapshots."
  on public.portfolio_snapshots for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own portfolio snapshots."
  on public.portfolio_snapshots for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own portfolio snapshots."
  on public.portfolio_snapshots for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own portfolio snapshots."
  on public.portfolio_snapshots for delete
  using ( auth.uid() = user_id );
