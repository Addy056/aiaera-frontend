// src/utils/planFeatures.js

// --------------------------------------
// PLAN → FEATURE MAPPING
// --------------------------------------
export const PLAN_FEATURES = {
  free: [
    "website_widget",
    "lead_collection",
    "appointments",
    "chatbot_preview",
  ],

  basic: [
    "website_widget",
    "lead_collection",
    "appointments",
    "email_support",
    "chatbot_preview",
  ],

  pro: [
    "website_widget",
    "lead_collection",
    "appointments",
    "ai_chatbot_everywhere",
    "whatsapp_auto_reply",
    "facebook_auto_reply",
    "instagram_auto_reply",
    "calendly_integration",
    "instagram_integration",
    "multi_language",
    "priority_support",
    "chatbot_preview",
  ],
};

// --------------------------------------
// FEATURE CHECKER
// --------------------------------------
export function hasFeature(plan, feature) {
  return PLAN_FEATURES[plan]?.includes(feature);
}
