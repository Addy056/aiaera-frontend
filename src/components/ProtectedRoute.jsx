// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // ✅ Check subscription
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("expires_at")
        .eq("user_id", session.user.id)
        .single();

      if (sub && new Date(sub.expires_at) < new Date()) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Restrict only premium pages if expired
  const premiumPages = ["/builder", "/leads", "/appointments", "/integrations"];

  if (isExpired && premiumPages.includes(location.pathname)) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
}
