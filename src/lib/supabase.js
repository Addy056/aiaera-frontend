import { createClient } from "@supabase/supabase-js";

/*
========================================
ENV VARIABLES
========================================
*/
const supabaseUrl =
  import.meta.env
    .VITE_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env
    .VITE_SUPABASE_ANON_KEY;

/*
========================================
VALIDATION
========================================
*/
if (
  !supabaseUrl ||
  !supabaseAnonKey
) {
  throw new Error(
    "❌ Missing Supabase environment variables"
  );
}

/*
========================================
SINGLETON CLIENT
========================================
*/
let supabaseInstance;

/*
========================================
CREATE CLIENT
========================================
*/
function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance =
    createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession:
            true,

          autoRefreshToken:
            true,

          detectSessionInUrl:
            false,

          flowType:
            "pkce",

          storageKey:
            "aiaera-auth",
        },

        realtime: {
          params: {
            eventsPerSecond:
              5,
          },
        },

        global: {
          headers: {
            "X-Client-Info":
              "aiaera-web",
          },
        },
      }
    );

  return supabaseInstance;
}

/*
========================================
EXPORT CLIENT
========================================
*/
export const supabase =
  getSupabaseClient();

/*
========================================
DEV LOG
========================================
*/
if (
  import.meta.env.DEV
) {
  console.log(
    "✅ Supabase Initialized"
  );
}