// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(session.user);

      // ---- FIXED 406 + SUPABASE POLICY ISSUE ----
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("expires_at")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const active =
        sub &&
        sub.expires_at &&
        new Date(sub.expires_at) > new Date();

      setSubscriptionActive(active);
      setLoading(false);
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setUser(nextSession?.user || null);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Premium routes protection
  const premium = ["/builder", "/leads", "/appointments", "/integrations"];
  if (!subscriptionActive && premium.includes(location.pathname)) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
}
