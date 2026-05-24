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

  /*
  ========================================
  STATES
  ========================================
  */
  const [loading, setLoading] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  const location =
    useLocation();

  /*
  ========================================
  CHECK AUTH
  ========================================
  */
  useEffect(() => {

    let mounted = true;

    /*
    ========================================
    VERIFY SESSION
    ========================================
    */
    const verifySession =
      async () => {

        try {

          const {
            data: { session },
            error,
          } =
            await supabase.auth.getSession();

          /*
          ========================================
          SESSION ERROR
          ========================================
          */
          if (error) {

            console.error(
              "AUTH SESSION ERROR:",
              error
            );

            if (mounted) {

              setAuthenticated(
                false
              );
            }

            return;
          }

          /*
          ========================================
          AUTH STATE
          ========================================
          */
          if (mounted) {

            setAuthenticated(
              !!session
            );
          }

        } catch (err) {

          console.error(
            "PROTECTED ROUTE ERROR:",
            err
          );

          if (mounted) {

            setAuthenticated(
              false
            );
          }

        } finally {

          if (mounted) {

            /*
            ========================================
            SMALL DELAY
            Prevents redirect flashing
            on slower devices
            ========================================
            */
            setTimeout(() => {

              if (mounted) {

                setLoading(
                  false
                );
              }

            }, 300);
          }
        }
      };

    /*
    ========================================
    INITIAL SESSION CHECK
    ========================================
    */
    verifySession();

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

          if (!mounted)
            return;

          console.log(
            "AUTH EVENT:",
            event
          );

          /*
          ========================================
          SIGNED IN
          ========================================
          */
          if (
            event ===
              "SIGNED_IN" ||
            event ===
              "TOKEN_REFRESHED"
          ) {

            setAuthenticated(
              !!session
            );

            setLoading(
              false
            );
          }

          /*
          ========================================
          SIGNED OUT
          ========================================
          */
          if (
            event ===
            "SIGNED_OUT"
          ) {

            setAuthenticated(
              false
            );

            setLoading(
              false
            );
          }
        }
      );

    /*
    ========================================
    FAILSAFE
    Prevent infinite loading
    ========================================
    */
    const failsafe =
      setTimeout(() => {

        if (mounted) {

          setLoading(
            false
          );
        }

      }, 5000);

    /*
    ========================================
    CLEANUP
    ========================================
    */
    return () => {

      mounted = false;

      clearTimeout(
        failsafe
      );

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

      <div className="min-h-screen bg-[#050816] flex items-center justify-center overflow-hidden relative">

        {/* GLOW */}
        <div className="absolute top-[-150px] left-[-150px] w-[340px] h-[340px] bg-purple-600/20 blur-[160px] rounded-full"></div>

        <div className="absolute bottom-[-150px] right-[-150px] w-[340px] h-[340px] bg-blue-600/20 blur-[160px] rounded-full"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center">

          {/* SPINNER */}
          <div className="relative mb-6">

            <div className="absolute inset-0 bg-purple-500/20 blur-[30px] rounded-full"></div>

            <div className="relative w-16 h-16 rounded-full border-[5px] border-purple-500/10 border-t-purple-500 animate-spin"></div>

          </div>

          {/* TEXT */}
          <h2 className="text-white text-2xl font-bold mb-2">

            Loading AIAERA...

          </h2>

          <p className="text-gray-400 text-sm">

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
  if (!authenticated) {

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