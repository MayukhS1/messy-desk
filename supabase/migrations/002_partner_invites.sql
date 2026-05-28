-- Partner invite flow: solo creator + async partner join (no realtime required)

-- Allow solo couples (partner joins later via invite code)
alter table public.couples
  alter column user_b_id drop not null;

alter table public.couples
  add column if not exists invite_code text unique;

-- Backfill invite codes for existing couples
update public.couples
set invite_code = upper(substring(md5(id::text || random()::text) from 1 for 8))
where invite_code is null;

alter table public.couples
  alter column invite_code set not null;

create unique index if not exists couples_invite_code_idx on public.couples (invite_code);

-- Helper: generate unique invite code
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

-- Seed shared space for a couple
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

-- Public invite preview (for signup page)
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

-- Updated partner lookup (nullable user_b)
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

-- Signup: solo couple OR join via partner invite code in user metadata
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
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));

  insert into public.desks (owner_id) values (new.id);

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

    update public.couples
    set user_b_id = new.id
    where id = existing_couple_id;
  else
    new_invite_code := public.generate_invite_code();

    insert into public.couples (user_a_id, user_b_id, invite_code)
    values (new.id, null, new_invite_code)
    returning id into new_couple_id;

    perform public.seed_couple_space(new_couple_id);
  end if;

  return new;
end;
$$;

-- Backfill: solo users who signed up before this migration (no couple yet)
do $$
declare
  r record;
  cid uuid;
  code text;
begin
  for r in
    select p.id
    from public.profiles p
    where not exists (
      select 1 from public.couples c
      where c.user_a_id = p.id or c.user_b_id = p.id
    )
  loop
    code := public.generate_invite_code();
    insert into public.couples (user_a_id, user_b_id, invite_code)
    values (r.id, null, code)
    returning id into cid;
    perform public.seed_couple_space(cid);
  end loop;
end;
$$;

grant execute on function public.generate_invite_code() to authenticated;
grant execute on function public.seed_couple_space(uuid) to authenticated;
grant execute on function public.get_invite_info(text) to anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
