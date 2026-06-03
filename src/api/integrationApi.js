import { supabase }
  from "../lib/supabase";

/*
========================================
FETCH INTEGRATIONS
========================================
*/
export const fetchIntegrations =
  async (userId) => {

    if (!userId)
      return {
        data: [],
        error: null,
      };

    return await supabase
      .from("user_integrations")
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .maybeSingle();
  };

/*
========================================
SAVE INTEGRATIONS
========================================
*/
export const saveIntegrations =
  async (
    integrationData
  ) => {

    return await supabase
      .from(
        "user_integrations"
      )
      .upsert(
        integrationData
      );
  };