-- Repair: ensure signup trigger + bootstrap for users created without profile/desk

-- Functions (idempotent — safe if 002 already ran)
create or replace function public.generate_invite_code()
returns text
language plpgsql
as $$
declare
  code text;
  taken boolean;
begin
  loop
    code := upper(substring(md5(gen_random_uuid()::text) from 1 for 8));
    select exists(select 1 from public.couples where invite_code = code) into taken;
    exit when not taken;
  end loop;
  return code;
end;
$$;

create or replace function public.seed_couple_space(p_couple_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.relationship_stats (couple_id)
  values (p_couple_id)
  on conflict (couple_id) do nothing;

  insert into public.shared_space_items (couple_id, item_type, slot_id)
  values
    (p_couple_id, 'journal', 'slot_journal'),
    (p_couple_id, 'record_player', 'slot_record_player'),
    (p_couple_id, 'flora_vase', 'slot_flora_vase'),
    (p_couple_id, 'haptic_photo_frame', 'slot_haptic_frame')
  on conflict (couple_id, slot_id) do nothing;
end;
$$;

-- Couple invite column (if 002 was skipped)
alter table public.couples
  alter column user_b_id drop not null;

alter table public.couples
  add column if not exists invite_code text;

update public.couples
set invite_code = upper(substring(md5(id::text || random()::text) from 1 for 8))
where invite_code is null;

-- Only enforce NOT NULL if every row has a code
do $$
begin
  if not exists (select 1 from public.couples where invite_code is null) then
    alter table public.couples alter column invite_code set not null;
  end if;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  partner_invite text;
  existing_couple_id uuid;
  new_couple_id uuid;
  new_invite_code text;
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  insert into public.desks (owner_id) values (new.id)
  on conflict (owner_id) do nothing;

  partner_invite := nullif(trim(new.raw_user_meta_data->>'partner_invite_code'), '');

  if partner_invite is not null then
    select c.id into existing_couple_id
    from public.couples c
    where c.invite_code = upper(partner_invite)
      and c.user_b_id is null
      and c.user_a_id != new.id;

    if existing_couple_id is null then
      raise exception 'Invalid or already-used partner invite code';
    end if;

    update public.couples set user_b_id = new.id where id = existing_couple_id;
  elsif not exists (
    select 1 from public.couples where user_a_id = new.id or user_b_id = new.id
  ) then
    new_invite_code := public.generate_invite_code();
    insert into public.couples (user_a_id, user_b_id, invite_code)
    values (new.id, null, new_invite_code)
    returning id into new_couple_id;
    perform public.seed_couple_space(new_couple_id);
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Bootstrap existing auth users missing profile/desk/couple
create or replace function public.ensure_user_setup()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  dname text;
  desk_id uuid;
  couple_id uuid;
  code text;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select coalesce(
    raw_user_meta_data->>'display_name',
    split_part(email, '@', 1),
    'User'
  ) into dname
  from auth.users where id = uid;

  insert into public.profiles (id, display_name)
  values (uid, dname)
  on conflict (id) do update set display_name = excluded.display_name;

  insert into public.desks (owner_id)
  values (uid)
  on conflict (owner_id) do nothing
  returning id into desk_id;

  if desk_id is null then
    select id into desk_id from public.desks where owner_id = uid;
  end if;

  if not exists (select 1 from public.couples where user_a_id = uid or user_b_id = uid) then
    code := public.generate_invite_code();
    insert into public.couples (user_a_id, user_b_id, invite_code)
    values (uid, null, code)
    returning id into couple_id;
    perform public.seed_couple_space(couple_id);
  end if;

  return jsonb_build_object(
    'profile_id', uid,
    'desk_id', desk_id,
    'ok', true
  );
end;
$$;

create or replace function public.get_invite_info(p_code text)
returns table (inviter_name text, valid boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select p.display_name, true
  from public.couples c
  join public.profiles p on p.id = c.user_a_id
  where c.invite_code = upper(trim(p_code))
    and c.user_b_id is null;
end;
$$;

-- Backfill all auth users
do $$
declare
  r record;
  cid uuid;
  code text;
begin
  for r in select id, email, raw_user_meta_data from auth.users loop
    insert into public.profiles (id, display_name)
    values (
      r.id,
      coalesce(r.raw_user_meta_data->>'display_name', split_part(r.email, '@', 1))
    )
    on conflict (id) do nothing;

    insert into public.desks (owner_id) values (r.id)
    on conflict (owner_id) do nothing;

    if not exists (
      select 1 from public.couples where user_a_id = r.id or user_b_id = r.id
    ) then
      code := public.generate_invite_code();
      insert into public.couples (user_a_id, user_b_id, invite_code)
      values (r.id, null, code)
      returning id into cid;
      perform public.seed_couple_space(cid);
    end if;
  end loop;
end;
$$;

grant execute on function public.ensure_user_setup() to authenticated;
grant execute on function public.get_invite_info(text) to anon, authenticated;
grant execute on function public.generate_invite_code() to authenticated;
grant execute on function public.seed_couple_space(uuid) to authenticated;
