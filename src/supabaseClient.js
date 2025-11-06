// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Make sure these variables exist in your .env file:
// VITE_SUPABASE_URL=your-supabase-url
// VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Supabase URL or anon key missing! Check your .env file.");
}

// Create Supabase client with session persistence
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,  // Keeps user logged in across reloads
    detectSessionInUrl: true,
  },
  global: {
    headers: { "X-Client-Info": "AIAERA-WebApp" }, // Optional but useful for analytics/debug
  },
});
