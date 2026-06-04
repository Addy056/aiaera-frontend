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

        console.log(
          "START SUBSCRIPTION QUERY:",
          userId
        );

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

        console.log(
          "END SUBSCRIPTION QUERY"
        );

        console.log(
          "SUB DATA:",
          data
        );

        console.log(
          "SUB ERROR:",
          error
        );

        if (error) {

          console.error(
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

        setSubscription(
          data || null
        );

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

        console.error(
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

    const initializeAuth =
      async () => {

        try {

          console.log(
            "STEP 1: GET SESSION"
          );

          const {
            data: {
              session,
            },
            error,
          } =
            await supabase.auth.getSession();

          console.log(
            "STEP 2: SESSION RECEIVED"
          );

          console.log(
            session
          );

          if (error) {

            console.error(
              "SESSION ERROR:",
              error
            );

            return;
          }

          if (!mounted)
            return;

          const currentUser =
            session?.user ||
            null;

          setUser(
            currentUser
          );

          setIsAdmin(
            ADMIN_EMAILS.includes(
              currentUser?.email?.toLowerCase()
            )
          );

          if (
            currentUser
          ) {

            console.log(
              "STEP 3: LOAD SUBSCRIPTION"
            );

            await loadSubscription(
              currentUser.id
            );

            console.log(
              "STEP 4: SUBSCRIPTION FINISHED"
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

          console.error(
            "INITIAL AUTH ERROR:",
            err
          );

        } finally {

          console.log(
            "STEP 5: SET LOADING FALSE"
          );

          if (mounted) {

            setLoading(
              false
            );
          }
        }
      };

    initializeAuth();

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          session
        ) => {

          try {

            console.log(
              "AUTH EVENT:",
              event
            );

            if (!mounted)
              return;

            const currentUser =
              session?.user ||
              null;

            setUser(
              currentUser
            );

            setIsAdmin(
              ADMIN_EMAILS.includes(
                currentUser?.email?.toLowerCase()
              )
            );

            if (
              currentUser
            ) {

              console.log(
                "AUTH LISTENER LOAD SUB"
              );

              await loadSubscription(
                currentUser.id
              );

              console.log(
                "AUTH LISTENER SUB COMPLETE"
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

            console.error(
              "AUTH LISTENER ERROR:",
              err
            );

          } finally {

            console.log(
              "AUTH LISTENER SET LOADING FALSE"
            );

            if (mounted) {

              setLoading(
                false
              );
            }
          }
        }
      );

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

  console.log(
    "AUTH CONTEXT STATE"
  );

  console.log(
    {
      loading,
      user:
        user?.email,
      subscription,
      isExpired,
      isAdmin,
    }
  );

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