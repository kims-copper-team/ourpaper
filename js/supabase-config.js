/*
 * Supabase project connection info.
 * The anon/publishable key is safe to ship in client-side code by design —
 * it is scoped by the Row Level Security policies on the project's tables
 * (see supabase/schema.sql), not by being kept secret.
 */
window.SUPABASE_CONFIG = {
  url: 'https://dotbseivigzqxdxfoboe.supabase.co',
  anonKey: 'sb_publishable_o5qomJAbGFNa3nyYgTnwLw_kJZfHqUj'
};
