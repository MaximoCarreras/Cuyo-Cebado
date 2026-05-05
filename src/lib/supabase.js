/**
 * Supabase Client — Frontend (public, anon key)
 * Uses VITE_ prefixed environment variables for Vite bundling.
 * RLS policies protect data at the database level. [SFT]
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback for development when env vars aren't configured yet
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
