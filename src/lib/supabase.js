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
SAFE STORAGE
========================================
*/
const safeStorage =
  typeof window !==
  "undefined"
    ? window.localStorage
    : undefined;

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
        SESSION
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
        SAFE STORAGE
        ========================================
        */
        storage:
          safeStorage,
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
      GLOBAL HEADERS
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