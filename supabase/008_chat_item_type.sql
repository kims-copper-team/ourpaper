-- Allow 'chat' as a valid item_type in item_comments (for team chat).
-- The existing check constraint only permitted figure / table / reference.
-- Drop and re-add it with 'chat' included.

alter table public.item_comments
  drop constraint if exists item_comments_item_type_check;

alter table public.item_comments
  add constraint item_comments_item_type_check
  check (item_type in ('figure', 'table', 'reference', 'chat'));
