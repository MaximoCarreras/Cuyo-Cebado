import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bbqnusdjanbusrrtsotg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicW51c2RqYW5idXNycnRzb3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NTE1MjYsImV4cCI6MjA5MzUyNzUyNn0.9jP_xlQIrHHD8iRyyMKYUdVF0Q8PE-349AtFGAdbIcw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)