import { supabase }
  from "../lib/supabase";

/*
========================================
FETCH CHATBOTS
========================================
*/
export const fetchChatbots =
  async (userId) => {

    if (!userId)
      return {
        data: [],
        error: null,
      };

    return await supabase
      .from("chatbots")
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

/*
========================================
FETCH SINGLE CHATBOT
========================================
*/
export const fetchChatbot =
  async (
    chatbotId
  ) => {

    return await supabase
      .from("chatbots")
      .select("*")
      .eq(
        "id",
        chatbotId
      )
      .single();
  };

/*
========================================
SAVE CHATBOT
========================================
*/
export const saveChatbot =
  async (
    chatbotData
  ) => {

    return await supabase
      .from("chatbots")
      .upsert(
        chatbotData
      )
      .select()
      .single();
  };

/*
========================================
DELETE CHATBOT
========================================
*/
export const deleteChatbot =
  async (
    chatbotId
  ) => {

    return await supabase
      .from("chatbots")
      .delete()
      .eq(
        "id",
        chatbotId
      );
  };