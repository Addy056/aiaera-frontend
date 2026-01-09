// src/components/ProtectedRoute.jsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState(null);
  const [plan, setPlan] = useState("free");
  const [subscriptionActive, setSubscriptionActive] = useState(true);

  const location = useLocation();

  // -------------------------
  // Init + Auth Sync
  // -------------------------
  useEffect(() => {
    let mounted = true;

    async function loadSessionAndSubscription(user) {
      if (!user) {
        setSessionUser(null);
        setPlan("free");
        setSubscriptionActive(true);
        setLoading(false);
        return;
      }

      setSessionUser(user);

      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan, expires_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!mounted) return;

      // Free plan = always active
      if (!sub || sub.plan === "free") {
        setPlan("free");
        setSubscriptionActive(true);
        setLoading(false);
        return;
      }

      setPlan(sub.plan);

      const expired =
        !sub.expires_at || new Date(sub.expires_at) < new Date();

      setSubscriptionActive(!expired);
      setLoading(false);
    }

    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      await loadSessionAndSubscription(session?.user || null);
    }

    init();

    // 🔑 KEEP AUTH + SUBSCRIPTION STATE IN SYNC
    const { data: listener } =
      supabase.auth.onAuthStateChange(async (_event, session) => {
        setLoading(true);
        await loadSessionAndSubscription(session?.user || null);
      });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // -------------------------
  // Loading state
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading…
      </div>
    );
  }

  // -------------------------
  // Not authenticated
  // -------------------------
  if (!sessionUser) {
    return <Navigate to="/login" replace />;
  }

  // -------------------------
  // Premium access control
  // -------------------------
  const premiumRoutes = [
    "/app/leads",
    "/app/appointments",
    "/app/integrations",
  ];

  const isPremiumRoute = premiumRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (plan !== "free" && !subscriptionActive && isPremiumRoute) {
    return <Navigate to="/pricing" replace />;
  }

  // -------------------------
  // Authenticated & allowed
  // -------------------------
  return <Outlet />;
}
