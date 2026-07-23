-- Multi-user schema: replaces the single anon-open app_storage KV table
-- (supabase/schema.sql) with real per-user accounts and per-project
-- membership. Run this once in the Supabase SQL editor, AFTER schema.sql.
--
-- Roles:
--   - admin (profiles.is_admin): manages all accounts (activate/deactivate,
--     grant/revoke admin), can see every project.
--   - project owner: whoever created the project (projects.owner_id). Any
--     signed-in user becomes an owner simply by creating a project.
--   - participant: invited by the owner into project_members.
--
-- Before running: make sure Authentication > Providers > Email is enabled
-- in your Supabase project (it is by default for new projects).

create extension if not exists pgcrypto;

-- ============== profiles ==============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  is_admin boolean not null default false,
  is_active boolean not null default true,
  -- 개인 저자 주소록 (Author Ledger의 "주소록에서 선택"). 이제 프로젝트가
  -- 여러 사용자 소유가 될 수 있으므로, 계정마다 자기 것을 따로 가진다.
  author_directory jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Every signed-in user can see every profile — needed to look someone up
-- by email when inviting them to a project, to show author names, and for
-- the admin panel's user list. This is a small internal tool, not a public
-- multi-tenant product, so this tradeoff (emails visible to any member) is
-- intentional; tighten it with a dedicated lookup RPC if that ever matters.
create policy "profiles readable by any authenticated user"
  on public.profiles for select
  to authenticated
  using (true);

-- Only admins can change is_admin/is_active on any profile (including
-- their own). Regular users have no self-service profile edits yet.
create policy "admins manage profiles"
  on public.profiles for update
  to authenticated
  using (exists (select 1 from public.profiles me where me.id = auth.uid() and me.is_admin))
  with check (exists (select 1 from public.profiles me where me.id = auth.uid() and me.is_admin));

-- Auto-create a profile row whenever someone signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lets a user update ONLY their own author_directory, without going
-- through a general "update your own profile" RLS policy that would also
-- have to guard is_admin/is_active from self-escalation.
create or replace function public.update_my_author_directory(new_list jsonb)
returns void
language sql security definer
set search_path = public
as $$
  update public.profiles set author_directory = new_list where id = auth.uid();
$$;

-- ============== projects ==============
-- Manuscript content, figures, references, authors and tables are kept as
-- jsonb columns on the project row (same shape the app already used in its
-- single-user KV version) rather than split into more tables — this keeps
-- the migration small while still letting RLS gate the whole project by
-- membership in one place.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null default '제목 없음',
  journal_id text not null default 'custom',
  custom_sections jsonb not null default '[]'::jsonb,
  content jsonb not null default '{}'::jsonb,
  figures jsonb not null default '[]'::jsonb,
  references_list jsonb not null default '[]'::jsonb,
  authors jsonb not null default '[]'::jsonb,
  tables jsonb not null default '[]'::jsonb,
  editor_font_size integer,
  owner_id uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'participant' check (role in ('participant')),
  invited_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

alter table public.project_members enable row level security;

-- Ownership lives on projects.owner_id (not in project_members) so there is
-- no chicken-and-egg problem inserting the first membership row when a
-- project is created.
create or replace function public.is_project_owner(pid uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (select 1 from public.projects p where p.id = pid and p.owner_id = auth.uid());
$$;

create or replace function public.is_project_member(pid uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select
    exists (select 1 from public.projects p where p.id = pid and p.owner_id = auth.uid())
    or exists (select 1 from public.project_members m where m.project_id = pid and m.user_id = auth.uid());
$$;

create or replace function public.is_admin()
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (select 1 from public.profiles me where me.id = auth.uid() and me.is_admin);
$$;

create policy "members can view project"
  on public.projects for select
  to authenticated
  using (public.is_project_member(id) or public.is_admin());

create policy "members can update project"
  on public.projects for update
  to authenticated
  using (public.is_project_member(id))
  with check (public.is_project_member(id));

create policy "authenticated users can create projects"
  on public.projects for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "owner can delete project"
  on public.projects for delete
  to authenticated
  using (public.is_project_owner(id));

create policy "members can view membership"
  on public.project_members for select
  to authenticated
  using (public.is_project_member(project_id) or public.is_admin());

create policy "owner can add members"
  on public.project_members for insert
  to authenticated
  with check (public.is_project_owner(project_id));

create policy "owner can remove members"
  on public.project_members for delete
  to authenticated
  using (public.is_project_owner(project_id));

create policy "member can leave project"
  on public.project_members for delete
  to authenticated
  using (user_id = auth.uid());

-- ============== retire the old single-user KV table ==============
-- The app no longer uses app_storage; drop it once you've confirmed you
-- don't need anything out of it (it only ever held throwaway test data
-- from the single-user prototype).
-- drop table if exists public.app_storage;
