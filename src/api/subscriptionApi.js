import { supabase }
  from "../lib/supabase";

/*
========================================
FETCH SUBSCRIPTION
========================================
*/
export const fetchSubscription =
  async (userId) => {

    if (!userId)
      return {
        data: null,
        error: null,
      };

    return await supabase
      .from(
        "user_subscriptions"
      )
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .maybeSingle();
  };