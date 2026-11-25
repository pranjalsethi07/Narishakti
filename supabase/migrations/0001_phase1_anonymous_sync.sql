-- NariShakti, phase 1: anonymous accounts + progress sync.
-- Run this once in the Supabase SQL editor (see supabase/README.md).
--
-- Model
--   * Every browser signs in anonymously (Supabase Auth). That gives it an auth user.
--   * An "account" holds the progress. A "device link" ties an auth user to an account.
--     A recovery code lets a new device link to an existing account, so progress follows her.
--   * No name, phone, email or photo is stored here. Only an age group, language and progress.
--   * Every data table is locked by row-level security: a device can only touch its own account.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------- accounts
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.device_links (
  auth_uid uuid primary key references auth.users (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists device_links_account_idx on public.device_links (account_id);

-- Only the hash of the code is stored, so nobody (including us) can read a code back.
create table if not exists public.recovery_codes (
  account_id uuid primary key references public.accounts (id) on delete cascade,
  code_hash text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- data tables
create table if not exists public.profiles (
  account_id uuid primary key references public.accounts (id) on delete cascade,
  age_group text check (age_group is null or age_group ~ '^[0-9]{1,2}(-[0-9]{1,2}|\+)$'),
  language text check (language is null or language in ('en', 'hi')),
  streak integer not null default 0 check (streak between 0 and 100000),
  last_active_date date,
  questions_asked integer not null default 0 check (questions_asked between 0 and 10000000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  account_id uuid not null references public.accounts (id) on delete cascade,
  course text not null check (char_length(course) between 1 and 40),
  lesson_id text not null check (char_length(lesson_id) between 1 and 40),
  done boolean not null default false,
  steps text[] not null default '{}'
    check (cardinality(steps) <= 10 and char_length(array_to_string(steps, ',')) <= 120),
  updated_at timestamptz not null default now(),
  primary key (account_id, course, lesson_id)
);

create table if not exists public.game_progress (
  account_id uuid not null references public.accounts (id) on delete cascade,
  game text not null check (char_length(game) between 1 and 40),
  level integer not null check (level between 1 and 50),
  stars integer not null check (stars between 1 and 3),
  updated_at timestamptz not null default now(),
  primary key (account_id, game, level)
);

create table if not exists public.test_results (
  account_id uuid not null references public.accounts (id) on delete cascade,
  topic text not null check (char_length(topic) between 1 and 40),
  best_score integer not null check (best_score >= 0),
  total integer not null check (total between 1 and 200),
  attempts integer not null default 1 check (attempts between 1 and 100000),
  last_attempt_at timestamptz not null default now(),
  primary key (account_id, topic),
  check (best_score <= total)
);

-- ---------------------------------------------------------------- helpers
-- The account the signed-in device belongs to (null if it has none yet).
create or replace function public.current_account_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select account_id from public.device_links where auth_uid = auth.uid() limit 1;
$$;

-- Creates this device's account the first time it is needed, then returns its id.
create or replace function public.ensure_account()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  aid uuid;
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;

  select account_id into aid from public.device_links where auth_uid = auth.uid();
  if aid is null then
    insert into public.accounts default values returning id into aid;
    insert into public.device_links (auth_uid, account_id) values (auth.uid(), aid);
  end if;
  return aid;
end;
$$;

-- ---------------------------------------------------------------- recovery
-- Makes a new recovery code for this account and returns it. It is the only time the
-- plain code exists. Any older code stops working.
create or replace function public.create_recovery_code()
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  aid uuid := public.ensure_account();
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; -- no I, L, O, 0 or 1, which are easy to misread
  raw bytea := gen_random_bytes(20);
  plain text := '';
  shown text;
  i integer;
begin
  for i in 0..19 loop
    plain := plain || substr(alphabet, (get_byte(raw, i) % 31) + 1, 1);
  end loop;

  shown := substr(plain, 1, 5) || '-' || substr(plain, 6, 5) || '-' || substr(plain, 11, 5) || '-' || substr(plain, 16, 5);

  insert into public.recovery_codes (account_id, code_hash)
  values (aid, encode(digest(plain, 'sha256'), 'hex'))
  on conflict (account_id) do update set code_hash = excluded.code_hash, created_at = now();

  return shown;
end;
$$;

-- When the current account's recovery code was made (null if it has none).
create or replace function public.recovery_code_created_at()
returns timestamptz
language sql
stable
security definer
set search_path = public
as $$
  select created_at from public.recovery_codes where account_id = public.current_account_id();
$$;

-- Links this device to the account that owns the code. Returns false for an unknown code.
create or replace function public.link_device_with_code(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  target uuid;
  mine uuid;
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;

  select account_id into target
  from public.recovery_codes
  where code_hash = encode(digest(upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g')), 'sha256'), 'hex');

  if target is null then
    return false;
  end if;

  select account_id into mine from public.device_links where auth_uid = auth.uid();
  if mine = target then
    return true;
  end if;

  insert into public.device_links (auth_uid, account_id) values (auth.uid(), target)
  on conflict (auth_uid) do update set account_id = excluded.account_id;

  -- The empty account this device made on its own is no longer needed.
  if mine is not null and not exists (select 1 from public.device_links where account_id = mine) then
    delete from public.accounts where id = mine;
  end if;

  return true;
end;
$$;

-- Deletes the whole account (progress, recovery code, every device link) and this device's identity.
create or replace function public.delete_my_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  aid uuid := public.current_account_id();
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  if aid is not null then
    delete from public.accounts where id = aid;
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

-- ---------------------------------------------------------------- access rules
alter table public.accounts        enable row level security;
alter table public.device_links    enable row level security;
alter table public.recovery_codes  enable row level security;
alter table public.profiles        enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.game_progress   enable row level security;
alter table public.test_results    enable row level security;

-- accounts, device_links and recovery_codes have no policies on purpose:
-- the browser can never read or write them directly, only through the functions above.

drop policy if exists "own account" on public.profiles;
create policy "own account" on public.profiles for all to authenticated
  using (account_id = (select public.current_account_id()))
  with check (account_id = (select public.current_account_id()));

drop policy if exists "own account" on public.lesson_progress;
create policy "own account" on public.lesson_progress for all to authenticated
  using (account_id = (select public.current_account_id()))
  with check (account_id = (select public.current_account_id()));

drop policy if exists "own account" on public.game_progress;
create policy "own account" on public.game_progress for all to authenticated
  using (account_id = (select public.current_account_id()))
  with check (account_id = (select public.current_account_id()));

drop policy if exists "own account" on public.test_results;
create policy "own account" on public.test_results for all to authenticated
  using (account_id = (select public.current_account_id()))
  with check (account_id = (select public.current_account_id()));

-- Visitors who are not signed in (the "anon" role) get nothing.
revoke all on public.accounts, public.device_links, public.recovery_codes,
              public.profiles, public.lesson_progress, public.game_progress, public.test_results
  from anon;
revoke all on public.accounts, public.device_links, public.recovery_codes from authenticated;

revoke execute on function public.current_account_id()        from public, anon;
revoke execute on function public.ensure_account()            from public, anon;
revoke execute on function public.create_recovery_code()      from public, anon;
revoke execute on function public.recovery_code_created_at()  from public, anon;
revoke execute on function public.link_device_with_code(text) from public, anon;
revoke execute on function public.delete_my_data()            from public, anon;

grant execute on function public.current_account_id()        to authenticated;
grant execute on function public.ensure_account()            to authenticated;
grant execute on function public.create_recovery_code()      to authenticated;
grant execute on function public.recovery_code_created_at()  to authenticated;
grant execute on function public.link_device_with_code(text) to authenticated;
grant execute on function public.delete_my_data()            to authenticated;
