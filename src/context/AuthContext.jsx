import {
  createContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export const AuthContext =
  createContext();

export default function AuthProvider({
  children,
}) {

  /*
  ========================================
  STATES
  ========================================
  */
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    subscription,
    setSubscription,
  ] = useState(null);

  const [isExpired, setIsExpired] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  /*
  ========================================
  ADMIN EMAILS
  ========================================
  */
  const ADMIN_EMAILS = [
    "dhawaleaditya077@gmail.com",
  ];

  /*
  ========================================
  LOAD SUBSCRIPTION
  ========================================
  */
  const loadSubscription =
    async (userId) => {

      if (!userId) {

        setSubscription(null);
        setIsExpired(false);

        return;
      }

      try {

        const {
          data,
          error,
        } =
          await supabase
            .from(
              "user_subscriptions"
            )
            .select("*")
            .eq(
              "user_id",
              userId
            )
            .maybeSingle();

        if (error) {

          console.log(
            "SUBSCRIPTION ERROR:",
            error
          );

          setSubscription(null);

          setIsExpired(false);

          return;
        }

        /*
        ========================================
        SAVE SUBSCRIPTION
        ========================================
        */
        setSubscription(
          data || null
        );

        /*
        ========================================
        CHECK EXPIRY
        ========================================
        */
        if (
          data?.expires_at
        ) {

          const expired =
            new Date(
              data.expires_at
            ) < new Date();

          setIsExpired(
            expired
          );

        } else {

          setIsExpired(
            false
          );
        }

      } catch (err) {

        console.log(
          "LOAD SUBSCRIPTION ERROR:",
          err
        );

        setSubscription(null);

        setIsExpired(false);
      }
    };

  /*
  ========================================
  INITIAL SESSION
  ========================================
  */
  useEffect(() => {

    let mounted = true;

    const initialize =
      async () => {

        try {

          /*
          ========================================
          GET SESSION ONLY ONCE
          ========================================
          */
          const {
            data: {
              session,
            },
          } =
            await supabase.auth.getSession();

          if (!mounted)
            return;

          const currentUser =
            session?.user ||
            null;

          /*
          ========================================
          USER
          ========================================
          */
          setUser(
            currentUser
          );

          /*
          ========================================
          ADMIN
          ========================================
          */
          setIsAdmin(
            ADMIN_EMAILS.includes(
              currentUser?.email
            )
          );

          /*
          ========================================
          SUBSCRIPTION
          ========================================
          */
          if (
            currentUser
          ) {

            await loadSubscription(
              currentUser.id
            );
          }

        } catch (err) {

          console.log(
            "INITIAL AUTH ERROR:",
            err
          );

        } finally {

          if (mounted) {

            setLoading(false);
          }
        }
      };

    initialize();

    /*
    ========================================
    AUTH LISTENER
    ========================================
    */
    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          session
        ) => {

          console.log(
            "AUTH EVENT:",
            event
          );

          if (!mounted)
            return;

          const currentUser =
            session?.user ||
            null;

          /*
          ========================================
          USER
          ========================================
          */
          setUser(
            currentUser
          );

          /*
          ========================================
          ADMIN
          ========================================
          */
          setIsAdmin(
            ADMIN_EMAILS.includes(
              currentUser?.email
            )
          );

          /*
          ========================================
          SUBSCRIPTION
          ========================================
          */
          if (
            currentUser
          ) {

            await loadSubscription(
              currentUser.id
            );

          } else {

            setSubscription(
              null
            );

            setIsExpired(
              false
            );
          }

          /*
          ========================================
          LOADING COMPLETE
          ========================================
          */
          setLoading(
            false
          );
        }
      );

    /*
    ========================================
    CLEANUP
    ========================================
    */
    return () => {

      mounted = false;

      authListener?.subscription?.unsubscribe();
    };

  }, []);

  /*
  ========================================
  REFRESH SUBSCRIPTION
  ========================================
  */
  const refreshSubscription =
    async () => {

      if (!user)
        return;

      await loadSubscription(
        user.id
      );
    };

  return (

    <AuthContext.Provider
      value={{

        user,

        loading,

        subscription,

        isExpired,

        isAdmin,

        refreshSubscription,

      }}
    >

      {children}

    </AuthContext.Provider>
  );
}