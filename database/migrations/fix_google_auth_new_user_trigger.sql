-- Fix Supabase Auth error: "Database error saving new user"
-- Run this in the Supabase SQL Editor for the Preserve project.
--
-- The Auth service creates rows in auth.users, then this trigger mirrors the
-- user into public.users. If the trigger function is owned by the wrong role,
-- has an unsafe search_path, or public.users lacks permissions for the Auth
-- service role, Google OAuth can succeed but user creation fails.

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);

alter table public.users
  add column if not exists email text,
  add column if not exists full_name text,
  add column if not exists created_at timestamptz default now();

alter table public.users enable row level security;

drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Users can insert own profile" on public.users;

create policy "Users can view own profile"
  on public.users for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Users can insert own profile"
  on public.users for insert
  with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.users.full_name);

  return new;
exception
  when others then
    -- Do not block Auth user creation if the app profile mirror has an issue.
    raise warning 'handle_new_user failed for auth user %: %', new.id, sqlerrm;
    return new;
end;
$$;

alter function public.handle_new_user() owner to postgres;

revoke all on function public.handle_new_user() from public;
grant execute on function public.handle_new_user() to supabase_auth_admin;
grant execute on function public.handle_new_user() to authenticated;
grant execute on function public.handle_new_user() to service_role;

grant usage on schema public to supabase_auth_admin;
grant insert, update, select on public.users to supabase_auth_admin;
grant select, insert, update on public.users to authenticated;
grant select, insert, update on public.users to service_role;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
