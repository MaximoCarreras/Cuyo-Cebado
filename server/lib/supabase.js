/**
 * Supabase Admin Client — Server-side
 */
import { createClient } from '@supabase/supabase-js';

// Corregimos el nombre para que coincida con Render
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '⚠️  SUPABASE_URL o SUPABASE_KEY no configurados en el servidor.'
  );
}

export const supabaseAdmin = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;