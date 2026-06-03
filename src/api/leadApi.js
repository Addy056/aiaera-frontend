import { supabase }
  from "../lib/supabase";

/*
========================================
FETCH LEADS
========================================
*/
export const fetchLeads =
  async (userId) => {

    if (!userId)
      return {
        data: [],
        error: null,
      };

    return await supabase
      .from("leads")
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );
  };