import {
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
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
  PREVENT DUPLICATE REQUESTS
  ========================================
  */
  const loadingRef =
    useRef(false);

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
    useCallback(
      async (userId) => {

        if (!userId) return;

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

            return;
          }

          setSubscription(
            data || null
          );

          /*
          ========================================
          EXPIRED CHECK
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
      },
      []
    );

  /*
  ========================================
  LOAD USER
  ========================================
  */
  const loadUser =
    useCallback(
      async () => {

        /*
        ========================================
        PREVENT DUPLICATE CALLS
        ========================================
        */
        if (
          loadingRef.current
        ) {
          return;
        }

        loadingRef.current =
          true;

        try {

          setLoading(true);

          /*
          ========================================
          GET SESSION
          ========================================
          */
          const {
            data: { session },
            error,
          } =
            await supabase.auth.getSession();

          if (error) {

            console.log(
              "SESSION ERROR:",
              error
            );

            return;
          }

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
            "LOAD USER ERROR:",
            err
          );

        } finally {

          setLoading(false);

          loadingRef.current =
            false;
        }
      },
      [loadSubscription]
    );

  /*
  ========================================
  INITIAL LOAD
  ========================================
  */
  useEffect(() => {

    loadUser();

  }, [loadUser]);

  /*
  ========================================
  AUTH LISTENER
  ========================================
  */
  useEffect(() => {

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
          setLoading(false);
        }
      );

    /*
    ========================================
    CLEANUP
    ========================================
    */
    return () => {

      authListener?.subscription?.unsubscribe();

    };

  }, [loadSubscription]);

  /*
  ========================================
  REFRESH SUBSCRIPTION
  ========================================
  */
  const refreshSubscription =
    async () => {

      if (!user) return;

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