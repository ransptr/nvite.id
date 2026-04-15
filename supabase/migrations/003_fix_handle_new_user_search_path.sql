-- Ensure auth signup trigger can always create profile rows reliably.
-- This prevents intermittent "Database error saving new user" failures caused
-- by search_path/qualification issues in SECURITY DEFINER trigger functions.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Keep trigger wired correctly in case environments drifted.
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
