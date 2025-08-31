// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        // Check subscription
        const { data: sub, error } = await supabase
          .from("user_subscriptions")
          .select("expires_at")
          .eq("user_id", session.user.id)
          .single();

        if (sub && new Date(sub.expires_at) < new Date()) {
          setIsExpired(true);
        } else {
          setIsExpired(false);
        }
      }

      setLoading(false);
    };

    fetchSession();

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  // Redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Redirect if subscription expired and trying to access premium pages
  const premiumPages = ["/builder", "/leads", "/appointments", "/integrations"];
  if (isExpired && premiumPages.includes(location.pathname)) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
}
