// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// ✓ Make sure environment variables exist
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Supabase URL or anon key missing! Check your .env file.");
}

// ✓ Create Supabase client with proper session handling
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,       // Keeps user logged in
    autoRefreshToken: true,     // Refreshes expired tokens automatically
    detectSessionInUrl: true,   // Required for OAuth/Email logins
  },
  global: {
    headers: { "X-Client-Info": "AIAERA-WebApp" },
  },
});
