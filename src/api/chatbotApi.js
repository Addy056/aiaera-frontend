import { supabase } from "../lib/supabase";

/*
========================================
ALLOWED CHATBOT COLUMNS
========================================
*/
const sanitizeChatbot = (chatbot = {}) => ({
  id: chatbot.id || undefined,
  user_id: chatbot.user_id,
  name: chatbot.name || "",
  bot_name: chatbot.bot_name || "AI Assistant",
  business_info: chatbot.business_info || "",
  website_url: chatbot.website_url || "",
  description: chatbot.description || "",
  scraped_data: chatbot.scraped_data || "",
  theme: chatbot.theme || {},
});

/*
========================================
FETCH CHATBOTS
========================================
*/
export const fetchChatbots = async (userId) => {
  if (!userId) {
    return {
      data: [],
      error: null,
    };
  }

  return supabase
    .from("chatbots")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });
};

/*
========================================
FETCH SINGLE CHATBOT
========================================
*/
export const fetchChatbot = async (chatbotId) => {
  return supabase
    .from("chatbots")
    .select("*")
    .eq("id", chatbotId)
    .single();
};

/*
========================================
SAVE CHATBOT
========================================
*/
export const saveChatbot = async (chatbotData) => {
  const payload = sanitizeChatbot(chatbotData);

  const { data, error } = await supabase
    .from("chatbots")
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error("SAVE CHATBOT ERROR:", error);
  }

  return {
    data,
    error,
  };
};

/*
========================================
DELETE CHATBOT
========================================
*/
export const deleteChatbot = async (chatbotId) => {
  return supabase
    .from("chatbots")
    .delete()
    .eq("id", chatbotId);
};