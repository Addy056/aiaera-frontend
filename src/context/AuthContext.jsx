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
  LOAD USER
  ========================================
  */
  useEffect(() => {

    loadUser();

    /*
    ========================================
    AUTH CHANGES
    ========================================
    */
    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        async (
          _event,
          session
        ) => {

          const currentUser =
            session?.user ||
            null;

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
        }
      );

    return () => {

      listener.subscription.unsubscribe();

    };

  }, []);

  /*
  ========================================
  LOAD USER
  ========================================
  */
  const loadUser =
    async () => {

      try {

        setLoading(true);

        const {
          data,
        } =
          await supabase.auth.getUser();

        const currentUser =
          data.user;

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

        console.error(
          err
        );

      } finally {

        setLoading(false);

      }
    };

  /*
  ========================================
  LOAD SUBSCRIPTION
  ========================================
  */
  const loadSubscription =
    async (
      userId
    ) => {

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

        if (error)
          throw error;

        setSubscription(
          data || null
        );

        /*
        ========================================
        EXPIRED
        ========================================
        */
        if (
          data?.expires_at
        ) {

          const expired =
            new Date(
              data.expires_at
            ) <
            new Date();

          setIsExpired(
            expired
          );

        } else {

          setIsExpired(
            false
          );
        }

      } catch (err) {

        console.error(
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