// src/hooks/useSubscription.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

/**
 * Custom React hook to fetch user's current subscription status.
 * Returns { plan, active, loading }
 */
export default function useSubscription() {
  const [plan, setPlan] = useState("free");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("user_subscriptions")
          .select("plan, expires_at")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          const expired = !data.expires_at || new Date(data.expires_at) < new Date();
          setPlan(data.plan || "free");
          setActive(!expired);
        }
      } catch (err) {
        console.error("❌ Subscription fetch failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  return { plan, active, loading };
}
