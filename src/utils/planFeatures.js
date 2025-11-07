// src/utils/planFeatures.js

// Define which features each plan includes
export const PLAN_FEATURES = {
  free: [
    "website_widget",
    "lead_collection",
    "appointments",
  ],
  basic: [
    "website_widget",
    "lead_collection",
    "appointments",
    "email_support",
  ],
  pro: [
    "website_widget",
    "lead_collection",
    "appointments",
    "ai_chatbot_everywhere",
    "whatsapp_autoreplies",
    "messenger_autoreplies",
    "calendly_integration",
    "multi_language",
    "priority_support",
  ],
};

// Utility function to check feature access
export function hasFeature(plan, feature) {
  return PLAN_FEATURES[plan]?.includes(feature);
}
