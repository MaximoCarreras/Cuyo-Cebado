/**
 * Supabase Admin Client — Server-side (service role key).
 * Has full access to all tables, bypasses RLS.
 * Used for order management, stock updates, and webhook processing. [SFT]
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    '⚠️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. ' +
    'Server will run but Supabase operations will fail.'
  );
}

export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
