-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)
-- to create the storage table the app uses.
--
-- The app talks to Supabase through a single key-value table, mirroring the
-- get/set/delete interface js/storage-shim.js exposes as window.storage.
-- Keys used by the app: 'projects-index', 'project:<id>', 'figures:<id>',
-- 'refs:<id>', 'authors:<id>', 'author-directory'.

create table if not exists public.app_storage (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_storage enable row level security;

-- This app has no login screen (personal, single-user tool), so the anon
-- (publishable) key is granted full read/write access to this one table.
-- If you later add multiple users, add a user_id column and replace this
-- policy with per-user scoping via auth.uid().
create policy "app_storage anon full access"
  on public.app_storage
  for all
  to anon
  using (true)
  with check (true);
