import { supabase }
  from "../lib/supabase";

/*
========================================
LOGIN
========================================
*/
export const loginUser =
  async (
    email,
    password
  ) => {

    return await supabase.auth.signInWithPassword({

      email,

      password,
    });
  };

/*
========================================
SIGNUP
========================================
*/
export const signupUser =
  async (
    email,
    password
  ) => {

    return await supabase.auth.signUp({

      email,

      password,
    });
  };

/*
========================================
LOGOUT
========================================
*/
export const logoutUser =
  async () => {

    return await supabase.auth.signOut();
  };

/*
========================================
RESET PASSWORD
========================================
*/
export const resetPassword =
  async (email) => {

    return await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
          `${window.location.origin}/reset-password`,
      }
    );
  };