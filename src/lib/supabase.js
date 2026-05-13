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

  console.error(
    "Missing Supabase environment variables"
  );
}

/*
========================================
SUPABASE CLIENT
========================================
*/
export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {

        /*
        ========================================
        AUTH
        ========================================
        */
        persistSession:
          true,

        autoRefreshToken:
          true,

        detectSessionInUrl:
          true,

        /*
        ========================================
        FIX LOCK ISSUES
        ========================================
        */
        storage:
          window.localStorage,

        flowType:
          "pkce",
      },

      /*
      ========================================
      REALTIME
      ========================================
      */
      realtime: {
        params: {
          eventsPerSecond:
            10,
        },
      },

      /*
      ========================================
      GLOBAL FETCH
      ========================================
      */
      global: {

        headers: {
          "X-Client-Info":
            "aiaera-web",
        },
      },
    }
  );

/*
========================================
DEBUG
========================================
*/
console.log(
  "Supabase Initialized:",
  !!supabase
);