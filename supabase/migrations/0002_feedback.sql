-- Phase 1b: app feedback. Run after 0001. Safe to run again.
-- Feedback belongs to the account (not to a name), so it stays anonymous. It is deleted with the
-- account (delete_my_data removes the account row and this cascades).

create table if not exists public.feedback (
  id uuid primary key,                       -- made on the device, so a retry never makes a duplicate
  account_id uuid not null references public.accounts (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  category text not null check (category in ('idea', 'problem', 'content', 'praise', 'other')),
  message text not null check (char_length(message) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists feedback_account_idx on public.feedback (account_id, created_at desc);

alter table public.feedback enable row level security;

-- She can add, read and remove her own feedback. Nobody can edit it after sending.
drop policy if exists "own feedback read" on public.feedback;
create policy "own feedback read" on public.feedback for select to authenticated
  using (account_id = (select public.current_account_id()));

drop policy if exists "own feedback add" on public.feedback;
create policy "own feedback add" on public.feedback for insert to authenticated
  with check (account_id = (select public.current_account_id()));

drop policy if exists "own feedback remove" on public.feedback;
create policy "own feedback remove" on public.feedback for delete to authenticated
  using (account_id = (select public.current_account_id()));

revoke all on public.feedback from anon;
revoke all on public.feedback from authenticated;
grant select, insert, delete on public.feedback to authenticated;
