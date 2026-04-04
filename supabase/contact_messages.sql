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

-- Admin-managed app settings (used for slot capacity control).
create table if not exists public.app_settings (
  key text primary key,
  value numeric not null,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_app_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_settings_updated_at_trigger on public.app_settings;
create trigger app_settings_updated_at_trigger
before update on public.app_settings
for each row
execute function public.touch_app_settings_updated_at();

insert into public.app_settings (key, value)
values ('total_ticket_capacity', 120)
on conflict (key) do nothing;

alter table public.app_settings enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'app_settings'
      and policyname = 'Allow read app settings'
  ) then
    create policy "Allow read app settings"
      on public.app_settings
      for select
      to anon, authenticated
      using (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'app_settings'
      and policyname = 'Allow write app settings'
  ) then
    create policy "Allow write app settings"
      on public.app_settings
      for all
      to anon, authenticated
      using (true)
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
