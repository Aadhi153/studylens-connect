-- StudyLens Connect: profiles
-- Not in the original spec, but required to show a display name for a
-- message sender — auth.users isn't queryable via PostgREST, so we mirror
-- the bits we need into a public table via a trigger.

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- Display names aren't sensitive; any authenticated user can look one up.
create policy "select_profiles_authenticated" on profiles for select
  using (auth.role() = 'authenticated');

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
