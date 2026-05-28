-- Messy Desk schema migration

create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Couples (creator + optional partner via invite code)
create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references public.profiles(id) on delete cascade,
  user_b_id uuid references public.profiles(id) on delete cascade,
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

-- Desks
create table if not exists public.desks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id) on delete cascade,
  layout_meta jsonb not null default '{}',
  max_capacity int not null default 12,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz
);

-- Desk items
create table if not exists public.desk_items (
  id uuid primary key default gen_random_uuid(),
  desk_id uuid not null references public.desks(id) on delete cascade,
  item_type text not null,
  pos_x float not null default 0,
  pos_y float not null default 0,
  rotation float not null default 0,
  z_index int not null default 0,
  scale float not null default 1,
  unlock_config jsonb not null default '{"type":"none"}',
  hidden_message text not null default '',
  hint text,
  is_hunt_eligible boolean not null default false,
  is_hunt_target boolean not null default false,
  media_url text,
  label text,
  created_at timestamptz not null default now()
);

-- Hunts
create table if not exists public.hunts (
  id uuid primary key default gen_random_uuid(),
  hunter_id uuid not null references public.profiles(id) on delete cascade,
  desk_owner_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'completed')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (hunter_id, desk_owner_id, status)
);

-- Hunt targets
create table if not exists public.hunt_targets (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid not null references public.hunts(id) on delete cascade,
  desk_item_id uuid not null references public.desk_items(id) on delete cascade,
  sort_order int not null default 0,
  found_at timestamptz
);

-- Journal
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content_md text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.journal_locks (
  couple_id uuid primary key references public.couples(id) on delete cascade,
  locked_by uuid not null references public.profiles(id) on delete cascade,
  expires_at timestamptz not null
);

-- Relationship stats
create table if not exists public.relationship_stats (
  couple_id uuid primary key references public.couples(id) on delete cascade,
  messages_7d int not null default 0,
  messages_30d int not null default 0,
  flora_stage int not null default 1,
  last_activity_at timestamptz
);

-- Playlist
create table if not exists public.playlist_tracks (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  title text not null,
  storage_url text not null,
  sort_order int not null default 0
);

-- Shared space items
create table if not exists public.shared_space_items (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  item_type text not null,
  slot_id text not null,
  config jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  unique (couple_id, slot_id)
);

-- Invite allowlist (optional email allowlist)
create table if not exists public.allowed_emails (
  email text primary key
);

-- Helper: get partner id
create or replace function public.get_partner_id(user_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select case
    when c.user_a_id = user_id then c.user_b_id
    when c.user_b_id = user_id then c.user_a_id
    else null
  end
  from public.couples c
  where c.user_a_id = user_id or c.user_b_id = user_id
  limit 1;
$$;

-- Auto-create profile on signup (see 002_partner_invites.sql for full trigger)
-- Placeholder: run 002 after 001 for invite-based couples

-- Update relationship stats on activity
create or replace function public.refresh_relationship_stats(p_couple_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  msg_count int;
  stage int;
begin
  select count(*) into msg_count
  from public.journal_entries
  where couple_id = p_couple_id
    and created_at > now() - interval '7 days';

  stage := case
    when msg_count >= 20 then 4
    when msg_count >= 10 then 3
    when msg_count >= 5 then 2
    when msg_count >= 1 then 1
    else 0
  end;

  insert into public.relationship_stats (couple_id, messages_7d, messages_30d, flora_stage, last_activity_at)
  values (p_couple_id, msg_count, msg_count, stage, now())
  on conflict (couple_id) do update set
    messages_7d = excluded.messages_7d,
    flora_stage = excluded.flora_stage,
    last_activity_at = excluded.last_activity_at;
end;
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.desks enable row level security;
alter table public.desk_items enable row level security;
alter table public.hunts enable row level security;
alter table public.hunt_targets enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_locks enable row level security;
alter table public.relationship_stats enable row level security;
alter table public.playlist_tracks enable row level security;
alter table public.shared_space_items enable row level security;
alter table public.allowed_emails enable row level security;

-- Profiles policies
create policy "Users can view own and partner profile"
  on public.profiles for select
  using (id = auth.uid() or id = public.get_partner_id(auth.uid()));

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

-- Couples policies
create policy "Couple members can view couple"
  on public.couples for select
  using (user_a_id = auth.uid() or user_b_id = auth.uid());

-- Desks policies
create policy "Owner full access to desk"
  on public.desks for all
  using (owner_id = auth.uid());

create policy "Partner can view published desk"
  on public.desks for select
  using (
    status = 'published'
    and owner_id = public.get_partner_id(auth.uid())
  );

-- Desk items policies
create policy "Owner full access to desk items"
  on public.desk_items for all
  using (
    desk_id in (select id from public.desks where owner_id = auth.uid())
  );

create policy "Partner can view published desk items"
  on public.desk_items for select
  using (
    desk_id in (
      select id from public.desks
      where owner_id = public.get_partner_id(auth.uid())
        and status = 'published'
    )
  );

-- Hunts policies
create policy "Hunt participants can view hunts"
  on public.hunts for select
  using (hunter_id = auth.uid() or desk_owner_id = auth.uid());

create policy "Hunter can create hunt"
  on public.hunts for insert
  with check (hunter_id = auth.uid());

create policy "Hunter can update hunt"
  on public.hunts for update
  using (hunter_id = auth.uid());

-- Hunt targets policies
create policy "Hunt participants can view targets"
  on public.hunt_targets for select
  using (
    hunt_id in (
      select id from public.hunts
      where hunter_id = auth.uid() or desk_owner_id = auth.uid()
    )
  );

create policy "Hunter can update targets"
  on public.hunt_targets for update
  using (
    hunt_id in (select id from public.hunts where hunter_id = auth.uid())
  );

create policy "Hunter can insert targets"
  on public.hunt_targets for insert
  with check (
    hunt_id in (select id from public.hunts where hunter_id = auth.uid())
  );

-- Couple-scoped tables
create policy "Couple access journal entries"
  on public.journal_entries for all
  using (
    couple_id in (
      select id from public.couples
      where user_a_id = auth.uid() or user_b_id = auth.uid()
    )
  );

create policy "Couple access journal locks"
  on public.journal_locks for all
  using (
    couple_id in (
      select id from public.couples
      where user_a_id = auth.uid() or user_b_id = auth.uid()
    )
  );

create policy "Couple access relationship stats"
  on public.relationship_stats for select
  using (
    couple_id in (
      select id from public.couples
      where user_a_id = auth.uid() or user_b_id = auth.uid()
    )
  );

create policy "Couple access playlist"
  on public.playlist_tracks for all
  using (
    couple_id in (
      select id from public.couples
      where user_a_id = auth.uid() or user_b_id = auth.uid()
    )
  );

create policy "Couple access shared space"
  on public.shared_space_items for all
  using (
    couple_id in (
      select id from public.couples
      where user_a_id = auth.uid() or user_b_id = auth.uid()
    )
  );

create policy "Anyone can read allowed emails"
  on public.allowed_emails for select
  to authenticated
  using (true);

grant execute on function public.refresh_relationship_stats(uuid) to authenticated;
grant execute on function public.get_partner_id(uuid) to authenticated;
