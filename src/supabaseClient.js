// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Make sure these variables exist in your .env file:
// VITE_SUPABASE_URL=your-supabase-url
// VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or anon key missing! Check your .env file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
