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
    const fetchSessionAndSubscription = async () => {
      // ✅ Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user || null);

      if (session?.user) {
        // ✅ Check subscription from Supabase table
        const { data: sub, error } = await supabase
          .from("user_subscriptions")
          .select("expires_at")
          .eq("user_id", session.user.id)
          .maybeSingle(); // ✅ safer than .single()

        if (error) {
          console.error("Error fetching subscription:", error.message);
        }

        if (!sub || (sub?.expires_at && new Date(sub.expires_at) < new Date())) {
          setIsExpired(true);
        } else {
          setIsExpired(false);
        }
      }

      setLoading(false);
    };

    fetchSessionAndSubscription();

    // ✅ Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  // ✅ Redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;

  // ✅ Redirect if subscription expired on premium pages
  const premiumPages = ["/builder", "/leads", "/appointments", "/integrations"];
  if (isExpired && premiumPages.includes(location.pathname)) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
}
