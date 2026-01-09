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

  useEffect(() => {
    let mounted = true;

    async function loadUser(user) {
      if (!user) {
        if (!mounted) return;
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

      if (!sub || sub.plan === "free") {
        setPlan("free");
        setSubscriptionActive(true);
        setLoading(false);
        return;
      }

      const expired =
        !sub.expires_at || new Date(sub.expires_at) < new Date();

      setPlan(sub.plan);
      setSubscriptionActive(!expired);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => {
      loadUser(data.session?.user || null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      loadUser(session?.user || null);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // -------------------------
  // Loading
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking authentication…
      </div>
    );
  }

  // -------------------------
  // Not logged in → Login page
  // -------------------------
  if (!sessionUser) {
    return <Navigate to="/" replace />;
  }

  // -------------------------
  // Premium route guard
  // -------------------------
  const premiumRoutes = [
    "/app/leads",
    "/app/appointments",
    "/app/integrations",
  ];

  const isPremiumRoute = premiumRoutes.some((r) =>
    location.pathname.startsWith(r)
  );

  if (plan !== "free" && !subscriptionActive && isPremiumRoute) {
    return <Navigate to="/pricing" replace />;
  }

  // -------------------------
  // Allowed
  // -------------------------
  return <Outlet />;
}
