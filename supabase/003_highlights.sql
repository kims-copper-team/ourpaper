-- Highlights & comments: select text in a section, highlight it, attach a
-- note. The highlighted span itself is embedded as a <mark class="hl"> in
-- the section's HTML content (same pattern as inline figures/tables); this
-- table only holds the metadata (author, note, the quoted text for display
-- in the Comments panel). Run after 002_auth_and_membership.sql.

create table if not exists public.highlights (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  section_key text not null,
  user_id uuid not null references public.profiles(id),
  quote_text text not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.highlights enable row level security;

create policy "members can view highlights"
  on public.highlights for select
  to authenticated
  using (public.is_project_member(project_id) or public.is_admin());

create policy "members can create highlights"
  on public.highlights for insert
  to authenticated
  with check (public.is_project_member(project_id) and user_id = auth.uid());

-- The author can edit their own note; the project owner can also edit
-- (e.g. to redact) any highlight left by a participant.
create policy "author or owner can update highlights"
  on public.highlights for update
  to authenticated
  using (user_id = auth.uid() or public.is_project_owner(project_id))
  with check (user_id = auth.uid() or public.is_project_owner(project_id));

create policy "author or owner can delete highlights"
  on public.highlights for delete
  to authenticated
  using (user_id = auth.uid() or public.is_project_owner(project_id));
