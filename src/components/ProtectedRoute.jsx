import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }

        const currentUser = session.user;
        setUser(currentUser);

        // 🔥 FETCH SUBSCRIPTION
        const { data: sub, error } = await supabase
          .from("user_subscriptions")
          .select("expires_at")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        if (error) {
          console.error("Subscription fetch error:", error);
        }

        // ✅ NO SUBSCRIPTION → allow (first time user)
        if (!sub || !sub.expires_at) {
          setIsExpired(false);
        } else {
          const expired = new Date(sub.expires_at) < new Date();
          setIsExpired(expired);
        }

      } catch (err) {
        console.error("Auth error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();

    // 🔥 LISTEN TO AUTH CHANGES (IMPORTANT)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  // ⏳ Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    );
  }

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ❌ Subscription expired → go to app pricing (WITH SIDEBAR)
  if (isExpired) {
    return <Navigate to="/app/pricing" />;
  }

  // ✅ Render nested routes
  return <Outlet />;
}