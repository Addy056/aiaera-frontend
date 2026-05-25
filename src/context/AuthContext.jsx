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

      /*
      ========================================
      NO USER
      ========================================
      */
      if (!userId) {

        setSubscription(
          null
        );

        setIsExpired(
          false
        );

        return;
      }

      try {

        /*
        ========================================
        GET SUBSCRIPTION
        ========================================
        */
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

        /*
        ========================================
        QUERY ERROR
        ========================================
        */
        if (error) {

          console.log(
            "SUBSCRIPTION ERROR:",
            error
          );

          setSubscription(
            null
          );

          setIsExpired(
            false
          );

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

        setSubscription(
          null
        );

        setIsExpired(
          false
        );
      }
    };

  /*
  ========================================
  INITIAL AUTH + LISTENER
  ========================================
  */
  useEffect(() => {

    let mounted =
      true;

    /*
    ========================================
    INITIAL SESSION
    ========================================
    */
    const initializeAuth =
      async () => {

        try {

          /*
          ========================================
          GET SESSION
          ========================================
          */
          const {
            data: {
              session,
            },
            error,
          } =
            await supabase.auth.getSession();

          /*
          ========================================
          SESSION ERROR
          ========================================
          */
          if (error) {

            console.log(
              "SESSION ERROR:",
              error
            );

            return;
          }

          /*
          ========================================
          COMPONENT UNMOUNTED
          ========================================
          */
          if (!mounted)
            return;

          const currentUser =
            session?.user ||
            null;

          /*
          ========================================
          SET USER
          ========================================
          */
          setUser(
            currentUser
          );

          /*
          ========================================
          ADMIN CHECK
          ========================================
          */
          setIsAdmin(
            ADMIN_EMAILS.includes(
              currentUser?.email
            )
          );

          /*
          ========================================
          LOAD SUBSCRIPTION
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

        } catch (err) {

          console.log(
            "INITIAL AUTH ERROR:",
            err
          );

        } finally {

          /*
          ========================================
          FINISH LOADING
          ========================================
          */
          if (mounted) {

            setLoading(
              false
            );
          }
        }
      };

    /*
    ========================================
    RUN INITIAL AUTH
    ========================================
    */
    initializeAuth();

    /*
    ========================================
    AUTH STATE LISTENER
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

          /*
          ========================================
          COMPONENT UNMOUNTED
          ========================================
          */
          if (!mounted)
            return;

          const currentUser =
            session?.user ||
            null;

          /*
          ========================================
          UPDATE USER
          ========================================
          */
          setUser(
            currentUser
          );

          /*
          ========================================
          ADMIN CHECK
          ========================================
          */
          setIsAdmin(
            ADMIN_EMAILS.includes(
              currentUser?.email
            )
          );

          /*
          ========================================
          LOAD SUBSCRIPTION
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
          STOP LOADING
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

      mounted =
        false;

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

        /*
        ========================================
        USER
        ========================================
        */
        user,

        /*
        ========================================
        LOADING
        ========================================
        */
        loading,

        /*
        ========================================
        SUBSCRIPTION
        ========================================
        */
        subscription,

        /*
        ========================================
        EXPIRED
        ========================================
        */
        isExpired,

        /*
        ========================================
        ADMIN
        ========================================
        */
        isAdmin,

        /*
        ========================================
        REFRESH
        ========================================
        */
        refreshSubscription,

      }}
    >

      {children}

    </AuthContext.Provider>
  );
}