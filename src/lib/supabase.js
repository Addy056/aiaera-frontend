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
PREVENT MULTIPLE CLIENTS
========================================
*/
let supabaseInstance =
  null;

/*
========================================
CREATE CLIENT
========================================
*/
const createSupabaseClient =
  () => {

    if (
      supabaseInstance
    ) {

      return supabaseInstance;
    }

    supabaseInstance =
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

            /*
            ========================================
            AUTO REFRESH
            ========================================
            */
            autoRefreshToken:
              true,

            /*
            ========================================
            URL DETECTION
            ========================================
            */
            detectSessionInUrl:
            true,

            /*
            ========================================
            STORAGE
            ========================================
            */
            storage:
              safeStorage,

            /*
            ========================================
            STORAGE KEY
            ========================================
            */
            storageKey:
              "aiaera-auth",

            /*
            ========================================
            FLOW TYPE
            ========================================
            */
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
                5,
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

    return supabaseInstance;
  };

/*
========================================
EXPORT CLIENT
========================================
*/
export const supabase =
  createSupabaseClient();

/*
========================================
DEBUG
========================================
*/
if (
  import.meta.env.DEV
) {

  console.log(
    "✅ Supabase Initialized"
  );
}