import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { supabase } from "../lib/supabase";

/*
========================================
PROTECTED ROUTE
========================================
Protects dashboard routes
from unauthorized access
========================================
*/

export default function ProtectedRoute({
  children,
}) {

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState(null);

  const location =
    useLocation();

  /*
  ========================================
  CHECK AUTH SESSION
  ========================================
  */
  useEffect(() => {

    let mounted = true;

    /*
    ========================================
    LOAD SESSION
    ========================================
    */
    const loadSession =
      async () => {

        try {

          const {
            data,
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error(
              "SESSION ERROR:",
              error
            );

            if (mounted) {
              setUser(null);
            }

            return;
          }

          const session =
            data?.session;

          /*
          ========================================
          USER FOUND
          ========================================
          */
          if (
            session?.user
          ) {

            if (mounted) {
              setUser(
                session.user
              );
            }

          } else {

            if (mounted) {
              setUser(null);
            }
          }

        } catch (err) {

          console.error(
            "PROTECTED ROUTE ERROR:",
            err
          );

          if (mounted) {
            setUser(null);
          }

        } finally {

          if (mounted) {
            setLoading(false);
          }
        }
      };

    /*
    ========================================
    INITIAL LOAD
    ========================================
    */
    loadSession();

    /*
    ========================================
    AUTH LISTENER
    ========================================
    */
    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          session
        ) => {

          if (!mounted) return;

          /*
          ========================================
          SIGNED OUT
          ========================================
          */
          if (
            event ===
            "SIGNED_OUT"
          ) {

            setUser(null);

            return;
          }

          /*
          ========================================
          SESSION ACTIVE
          ========================================
          */
          setUser(
            session?.user ||
              null
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

      subscription?.unsubscribe();
    };

  }, []);

  /*
  ========================================
  LOADING UI
  ========================================
  */
  if (loading) {

    return (
      <div className="min-h-screen bg-[#060816] flex items-center justify-center overflow-hidden relative">

        {/* BACKGROUND GLOW */}
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-purple-600/20 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-blue-600/20 blur-[140px] rounded-full"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center">

          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6"></div>

          <h2 className="text-white text-2xl font-bold">
            Loading AIAERA...
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Verifying your session
          </p>

        </div>

      </div>
    );
  }

  /*
  ========================================
  NOT AUTHENTICATED
  ========================================
  */
  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  /*
  ========================================
  AUTHORIZED
  ========================================
  */
  return children;
}