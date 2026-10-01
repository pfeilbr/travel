-- Waypoint: user profiles, wishlists, reviews and personal trip plans.
-- Every table has row-level security; users only ever write their own rows.

-- Profiles --------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  avatar_url text check (char_length(avatar_url) <= 500),
  home_base text check (char_length(home_base) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles are public" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Create a profile whenever someone signs up (email, magic link, Google or Apple).
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)), 80),
    left(coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'), 500)
  );
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Wishlists -------------------------------------------------------------
create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 50),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);
create index wishlists_user_idx on public.wishlists (user_id);
alter table public.wishlists enable row level security;
create policy "Own wishlists" on public.wishlists for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create table public.wishlist_items (
  wishlist_id uuid not null references public.wishlists (id) on delete cascade,
  place_id text not null check (place_id ~ '^[a-z0-9-]{1,80}$'),
  note text check (char_length(note) <= 500),
  added_at timestamptz not null default now(),
  primary key (wishlist_id, place_id)
);
alter table public.wishlist_items enable row level security;
create policy "Own wishlist items" on public.wishlist_items for all
  using (exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = (select auth.uid())))
  with check (exists (select 1 from public.wishlists w where w.id = wishlist_id and w.user_id = (select auth.uid())));

-- Reviews ---------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  place_id text not null check (place_id ~ '^[a-z0-9-]{1,80}$'),
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 1 and 2000),
  visited_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, place_id)
);
create index reviews_place_idx on public.reviews (place_id, created_at desc);
alter table public.reviews enable row level security;
create policy "Reviews are public" on public.reviews for select using (true);
create policy "Users write own reviews" on public.reviews for insert with check ((select auth.uid()) = user_id);
create policy "Users edit own reviews" on public.reviews for update
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete own reviews" on public.reviews for delete using ((select auth.uid()) = user_id);
create trigger reviews_touch before update on public.reviews
  for each row execute function public.touch_updated_at();

-- Personal trip plans ---------------------------------------------------
create table public.trip_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  start_date date,
  end_date date,
  place_id text check (place_id ~ '^[a-z0-9-]{1,80}$'),
  notes text check (char_length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);
create index trip_plans_user_idx on public.trip_plans (user_id, start_date);
alter table public.trip_plans enable row level security;
create policy "Own trip plans" on public.trip_plans for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create trigger trip_plans_touch before update on public.trip_plans
  for each row execute function public.touch_updated_at();

-- Public aggregate for place pages (community rating).
create view public.place_review_stats with (security_invoker = true) as
  select place_id, round(avg(rating)::numeric, 1) as rating, count(*)::int as reviews
  from public.reviews group by place_id;
