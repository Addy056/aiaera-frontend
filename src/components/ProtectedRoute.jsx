// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState(null);
  const [subscriptionActive, setSubscriptionActive] = useState(true); // FREE plan = active
  const [plan, setPlan] = useState("free");

  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        setSessionUser(null);
        setLoading(false);
        return;
      }

      setSessionUser(session.user);

      /** Fetch subscription */
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan, expires_at")
        .eq("user_id", session.user.id)
        .maybeSingle();

      // If no subscription found → FREE plan
      if (!sub) {
        setPlan("free");
        setSubscriptionActive(true);
        setLoading(false);
        return;
      }

      setPlan(sub.plan || "free");

      // Free plan = always active
      if (sub.plan === "free") {
        setSubscriptionActive(true);
        setLoading(false);
        return;
      }

      // Basic/Pro → check expiry
      const expired = !sub.expires_at || new Date(sub.expires_at) < new Date();
      setSubscriptionActive(!expired);

      setLoading(false);
    }

    loadUser();

    // Auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSessionUser(newSession?.user || null);
      }
    );

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
  // User not logged in → redirect login
  // -------------------------
  if (!sessionUser) {
    return <Navigate to="/login" replace />;
  }

  // -------------------------
  // Premium pages
  // -------------------------
  const premiumPages = [
    "/builder",
    "/leads",
    "/appointments",
    "/integrations",
  ];

  // Only expire PAID users
  if (!subscriptionActive && plan !== "free" && premiumPages.includes(location.pathname)) {
    return <Navigate to="/pricing" replace />;
  }

  // All good → render page
  return children;
}
