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
  PREVENT MULTIPLE INITIAL LOADS
  ========================================
  */
  const initializedRef =
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

        if (!userId)
          return;

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

        try {

          setLoading(true);

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

          if (error) {

            console.log(
              "SESSION ERROR:",
              error
            );

            setUser(null);

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
            "LOAD USER ERROR:",
            err
          );

          setUser(null);

        } finally {

          /*
          ========================================
          STOP LOADING ALWAYS
          ========================================
          */
          setLoading(false);
        }
      },
      [loadSubscription]
    );

  /*
  ========================================
  INITIAL SESSION LOAD
  ========================================
  */
  useEffect(() => {

    if (
      initializedRef.current
    ) {
      return;
    }

    initializedRef.current =
      true;

    loadUser();

  }, [loadUser]);

  /*
  ========================================
  AUTH LISTENER
  ========================================
  */
  useEffect(() => {

    const {
      data: listener,
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
          FINISH LOADING
          ========================================
          */
          setLoading(false);
        }
      );

    return () => {

      listener?.subscription?.unsubscribe();

    };

  }, [loadSubscription]);

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