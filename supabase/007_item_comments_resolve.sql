-- Add resolve tracking to item_comments (same pattern as 005_highlights_resolve).
-- Run after 006_item_comments.sql.

alter table public.item_comments
  add column if not exists resolved_at  timestamptz,
  add column if not exists resolved_by  uuid references public.profiles(id);

-- Any project member may resolve / unresolve
create policy "members can update item comments"
  on public.item_comments for update to authenticated
  using  (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));
