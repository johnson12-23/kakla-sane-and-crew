-- Contact messages table for Admin Panel inbox
-- Run this in Supabase SQL Editor.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) >= 2),
  email text not null check (position('@' in email) > 1),
  message text not null check (char_length(trim(message)) between 10 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

-- Optional but recommended if RLS is enabled in your project.
alter table public.contact_messages enable row level security;

-- Allow inserts/selects from app requests (anon/authenticated).
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_messages'
      and policyname = 'Allow insert contact messages'
  ) then
    create policy "Allow insert contact messages"
      on public.contact_messages
      for insert
      to anon, authenticated
      with check (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_messages'
      and policyname = 'Allow read contact messages'
  ) then
    create policy "Allow read contact messages"
      on public.contact_messages
      for select
      to anon, authenticated
      using (true);
  end if;
end $$;
