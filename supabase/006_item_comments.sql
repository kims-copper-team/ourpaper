-- Threaded comments on figures, tables, and references (the "item comment"
-- system). Multiple team members can leave comments on the same item; each
-- comment records who wrote it so authorship is always visible.
-- Run after 002_auth_and_membership.sql.

create table if not exists public.item_comments (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  item_type   text not null check (item_type in ('figure', 'table', 'reference')),
  item_id     text not null,   -- uuid of the figure / table / reference as text
  user_id     uuid not null references public.profiles(id),
  content     text not null,
  created_at  timestamptz not null default now()
);

alter table public.item_comments enable row level security;

create policy "members can view item comments"
  on public.item_comments for select to authenticated
  using (public.is_project_member(project_id) or public.is_admin());

create policy "members can create item comments"
  on public.item_comments for insert to authenticated
  with check (public.is_project_member(project_id) and user_id = auth.uid());

create policy "only author can delete item comment"
  on public.item_comments for delete to authenticated
  using (user_id = auth.uid());
