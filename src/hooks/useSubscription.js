// src/hooks/useSubscription.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

/**
 * useSubscription()
 * Clean, safe, optimized subscription checker.
 *
 * Returns:
 *  - plan: "free" | "basic" | "pro"
 *  - active: boolean (is the plan currently valid)
 *  - loading: boolean
 */
export default function useSubscription() {
  const [plan, setPlan] = useState("free");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;
        if (!session?.user) {
          setLoading(false);
          return;
        }

        const userId = session.user.id;

        // ---- FIXED: NO MORE 406 ----
        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("plan, expires_at")
          .eq("user_id", userId)
          .maybeSingle();

        if (!sub) {
          setPlan("free");
          setActive(false);
          setLoading(false);
          return;
        }

        const expired =
          !sub.expires_at || new Date(sub.expires_at) < new Date();

        setPlan(sub.plan || "free");
        setActive(!expired);
      } catch (err) {
        console.error("❌ Subscription fetch error:", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { plan, active, loading };
}
