-- Adds resolve tracking to highlights and tightens delete to author-only.
-- Run after 003_highlights.sql.

alter table public.highlights
  add column if not exists resolved_at  timestamptz,
  add column if not exists resolved_by  uuid references public.profiles(id);

-- Any project member may resolve/unresolve (previously only author/owner could update)
drop policy if exists "author or owner can update highlights" on public.highlights;
create policy "members can update highlights"
  on public.highlights for update to authenticated
  using  (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

-- Only the original author can delete their highlight (owner exception removed per UX spec)
drop policy if exists "author or owner can delete highlights" on public.highlights;
create policy "only author can delete highlights"
  on public.highlights for delete to authenticated
  using (user_id = auth.uid());
