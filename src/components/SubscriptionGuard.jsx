import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function SubscriptionGuard({ children }) {
  const [allowed, setAllowed] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!data || new Date(data.expires_at) < new Date()) {
        navigate("/pricing");
      } else {
        setAllowed(true);
      }
    };

    check();
  }, []);

  if (!allowed) return <div className="p-10">Checking subscription...</div>;

  return children;
}