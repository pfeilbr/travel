-- Row-level security: users see and change only their own private data.
begin;
create extension if not exists pgtap with schema extensions;
select plan(12);

-- Two users (the signup trigger creates their profiles).
insert into auth.users (id, email, raw_user_meta_data, aud, role)
values ('11111111-1111-1111-1111-111111111111', 'ann@example.com', '{"full_name":"Ann"}', 'authenticated', 'authenticated'),
       ('22222222-2222-2222-2222-222222222222', 'bob@example.com', '{}', 'authenticated', 'authenticated');

select is((select display_name from public.profiles where id = '11111111-1111-1111-1111-111111111111'), 'Ann', 'profile created from full_name');
select is((select display_name from public.profiles where id = '22222222-2222-2222-2222-222222222222'), 'bob', 'profile falls back to email name');

-- Act as Ann.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);

insert into public.wishlists (id, name) values ('aaaaaaaa-0000-0000-0000-000000000001', 'Favorites');
insert into public.wishlist_items (wishlist_id, place_id) values ('aaaaaaaa-0000-0000-0000-000000000001', 'robert-h-treman');
insert into public.reviews (place_id, rating, body) values ('robert-h-treman', 5, 'Great cabin.');
insert into public.trip_plans (title, start_date, end_date, place_id) values ('Ithaca', '2026-10-04', '2026-10-05', 'robert-h-treman');

select is((select count(*)::int from public.wishlists), 1, 'Ann sees her wishlist');
select is((select user_id from public.wishlists limit 1), '11111111-1111-1111-1111-111111111111'::uuid, 'user_id defaults to auth.uid()');

select throws_ok(
  $$ insert into public.wishlists (user_id, name) values ('22222222-2222-2222-2222-222222222222', 'Spoof') $$,
  '42501', null, 'cannot create a wishlist for someone else');

select throws_ok(
  $$ insert into public.reviews (place_id, rating, body) values ('green-lakes', 6, 'x') $$,
  '23514', null, 'rating must be 1–5');

-- Act as Bob.
select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);

select is((select count(*)::int from public.wishlists), 0, 'Bob cannot see Ann''s wishlists');
select is((select count(*)::int from public.wishlist_items), 0, 'Bob cannot see Ann''s wishlist items');
select is((select count(*)::int from public.trip_plans), 0, 'Bob cannot see Ann''s trip plans');
select is((select count(*)::int from public.reviews), 1, 'reviews are public');

update public.reviews set body = 'hacked';
select is((select body from public.reviews limit 1), 'Great cabin.', 'Bob cannot edit Ann''s review');

-- Anonymous visitors can read public aggregates.
set local role anon;
select is((select reviews from public.place_review_stats where place_id = 'robert-h-treman'), 1, 'anon sees review stats');

select * from finish();
rollback;
