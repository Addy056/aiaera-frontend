import {
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { supabase } from "../lib/supabase";

export const AuthContext = createContext();

const ADMIN_EMAILS = [
  "dhawaleaditya077@gmail.com",
];

export default function AuthProvider({
  children,
}) {
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

  const loadSubscription =
    useCallback(
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
          } = await supabase
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
      },
      []
    );

  /*
  ========================================
  INITIAL AUTH
  ========================================
  */
  useEffect(() => {
    let mounted = true;

    const initializeAuth =
      async () => {
        try {
          console.log(
            "GETTING SESSION..."
          );

          const {
            data: {
              session,
            },
            error,
          } =
            await supabase.auth.getSession();

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
        } catch (err) {
          console.error(
            "INITIAL AUTH ERROR:",
            err
          );
        } finally {
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
        (
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

          setUser(
            currentUser
          );

          setIsAdmin(
            ADMIN_EMAILS.includes(
              currentUser?.email?.toLowerCase()
            )
          );

          if (!currentUser) {
            setSubscription(
              null
            );

            setIsExpired(
              false
            );
          }

          setLoading(
            false
          );
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
  LOAD SUBSCRIPTION WHEN USER CHANGES
  ========================================
  */
  useEffect(() => {
    if (!user?.id) {
      setSubscription(
        null
      );

      setIsExpired(
        false
      );

      return;
    }

    loadSubscription(
      user.id
    );
  }, [
    user?.id,
    loadSubscription,
  ]);

  /*
  ========================================
  REFRESH SUBSCRIPTION
  ========================================
  */
  const refreshSubscription =
    async () => {
      if (!user?.id)
        return;

      try {
        await loadSubscription(
          user.id
        );
      } catch (err) {
        console.error(
          "REFRESH SUBSCRIPTION ERROR:",
          err
        );
      }
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