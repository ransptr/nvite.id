-- ============================================================
-- 001_initial_schema.sql
-- profiles, invitations, rsvps tables + RLS + signup trigger
-- ============================================================

-- ---- profiles ----
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "user reads own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "user updates own profile"
  on profiles for update
  using (auth.uid() = id);

-- auto-create profile row when a new auth user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ---- invitations ----
create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade not null,
  slug text unique not null,
  is_published boolean not null default false,
  content jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table invitations enable row level security;

-- owner can do everything
create policy "owner full access"
  on invitations for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- anyone can read published invitations (for the /:slug public route)
create policy "public reads published"
  on invitations for select
  using (is_published = true);

-- keep updated_at current
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists invitations_updated_at on invitations;
create trigger invitations_updated_at
  before update on invitations
  for each row execute procedure set_updated_at();

-- ---- rsvps ----
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations(id) on delete cascade not null,
  guest_name text not null,
  attendance text not null, -- 'attending' | 'not_attending'
  guest_count integer not null default 1,
  wishes text,
  qr_value text,
  created_at timestamptz not null default now()
);

alter table rsvps enable row level security;

-- any visitor can submit an RSVP
create policy "anyone can rsvp"
  on rsvps for insert
  with check (true);

-- only the invitation owner can read RSVPs
create policy "owner reads rsvps"
  on rsvps for select
  using (
    auth.uid() = (
      select owner_id from invitations where id = invitation_id
    )
  );

-- only the invitation owner can delete RSVPs
create policy "owner deletes rsvps"
  on rsvps for delete
  using (
    auth.uid() = (
      select owner_id from invitations where id = invitation_id
    )
  );
