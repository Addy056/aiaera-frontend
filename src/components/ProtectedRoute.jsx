// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState(null);
  const [plan, setPlan] = useState("free");
  const [subscriptionActive, setSubscriptionActive] = useState(true);

  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        setSessionUser(null);
        setLoading(false);
        return;
      }

      setSessionUser(session.user);

      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan, expires_at")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!mounted) return;

      // FREE plan = always active
      if (!sub || sub.plan === "free") {
        setPlan("free");
        setSubscriptionActive(true);
        setLoading(false);
        return;
      }

      setPlan(sub.plan);

      const expired = !sub.expires_at || new Date(sub.expires_at) < new Date();
      setSubscriptionActive(!expired);

      setLoading(false);
    }

    init();

    // Supabase auth listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSessionUser(newSession?.user || null);
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
        Loading...
      </div>
    );
  }

  // -------------------------
  // User not logged in
  // -------------------------
  if (!sessionUser) {
    return <Navigate to="/login" replace />;
  }

  // -------------------------
  // Premium route access check
  // -------------------------
  const premiumPages = ["/builder", "/leads", "/appointments", "/integrations"];

  // only block PAID users who have expired subscriptions
  if (plan !== "free" && !subscriptionActive && premiumPages.includes(location.pathname)) {
    return <Navigate to="/pricing" replace />;
  }

  // Authenticated + allowed
  return children;
}
