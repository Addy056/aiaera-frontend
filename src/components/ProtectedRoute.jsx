// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState(null);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      // Get existing session
      const { data: { session } } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!session?.user) {
        setSessionUser(null);
        setLoading(false);
        return;
      }

      setSessionUser(session.user);

      // Fetch subscription status
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("expires_at")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const active =
        sub?.expires_at &&
        new Date(sub.expires_at) > new Date();

      setSubscriptionActive(active);
      setLoading(false);
    }

    loadUser();

    // Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSessionUser(newSession?.user || null);
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Still loading user session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading...
      </div>
    );
  }

  // If not logged in → always redirect to login
  if (!sessionUser) {
    return <Navigate to="/login" replace />;
  }

  // Pages that require an ACTIVE plan
  const premiumPages = [
    "/builder",
    "/leads",
    "/appointments",
    "/integrations",
  ];

  // If user tries to access a premium feature without subscription
  if (!subscriptionActive && premiumPages.includes(location.pathname)) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
}
