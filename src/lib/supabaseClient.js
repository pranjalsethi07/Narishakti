import { createClient } from '@supabase/supabase-js';

// Both values are safe to ship in the browser: they only identify the project. What a visitor
// can actually do is limited by the row-level security rules in the database.
// Put them in .env (see .env.example). Without them the app simply runs without cloud backup.
const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    })
  : null;
