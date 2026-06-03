import { supabase }
  from "../lib/supabase";

/*
========================================
FETCH APPOINTMENTS
========================================
*/
export const fetchAppointments =
  async (userId) => {

    if (!userId)
      return {
        data: [],
        error: null,
      };

    return await supabase
      .from("appointments")
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