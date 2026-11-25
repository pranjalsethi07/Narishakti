-- Phase 1c: coin bag + lesson feedback. Run after 0001 and 0002. Safe to run again.

-- ---------------------------------------------------------------- coin ledger
-- Every coin earned or spent is one row. The balance is the sum. The row id is made on the device
-- from what happened ('lesson:health:3', 'daily:2026-11-25', 'restore:2026-11:1'), so two devices
-- (or a retry) can never count the same event twice.
create table if not exists public.coin_ledger (
  account_id uuid not null references public.accounts (id) on delete cascade,
  id text not null check (char_length(id) between 1 and 80),
  kind text not null check (kind in ('lesson', 'daily', 'restore')),
  amount integer not null,
  created_at timestamptz not null default now(),
  primary key (account_id, id),
  -- the only amounts the app ever gives or takes
  check (
    (kind = 'lesson' and amount = 50) or
    (kind = 'daily' and amount = 10) or
    (kind = 'restore' and amount in (-100, -200, -300))
  )
);

alter table public.coin_ledger enable row level security;

drop policy if exists "own coins read" on public.coin_ledger;
create policy "own coins read" on public.coin_ledger for select to authenticated
  using (account_id = (select public.current_account_id()));

drop policy if exists "own coins add" on public.coin_ledger;
create policy "own coins add" on public.coin_ledger for insert to authenticated
  with check (account_id = (select public.current_account_id()));

-- No update or delete: history cannot be rewritten from the browser.
revoke all on public.coin_ledger from anon;
revoke all on public.coin_ledger from authenticated;
grant select, insert on public.coin_ledger to authenticated;

-- ---------------------------------------------------------------- lesson feedback
-- Same table as app feedback. A lesson's feedback says which lesson it is about and may have no text.
alter table public.feedback add column if not exists course text;
alter table public.feedback add column if not exists lesson_id text;

alter table public.feedback drop constraint if exists feedback_category_check;
alter table public.feedback add constraint feedback_category_check
  check (category in ('idea', 'problem', 'content', 'praise', 'other', 'lesson'));

alter table public.feedback drop constraint if exists feedback_message_check;
alter table public.feedback add constraint feedback_message_check
  check (char_length(message) <= 1000 and (category = 'lesson' or char_length(message) >= 1));

alter table public.feedback drop constraint if exists feedback_lesson_ref_check;
alter table public.feedback add constraint feedback_lesson_ref_check
  check (
    coalesce(
      (category = 'lesson' and course in ('health', 'finance') and char_length(lesson_id) between 1 and 20)
      or (category <> 'lesson' and course is null and lesson_id is null),
      false)
  );
