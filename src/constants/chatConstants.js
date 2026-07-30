/*
========================================
CHAT CONSTANTS
========================================
*/

export const DEFAULT_BOT_NAME = "AI Assistant";

export const DEFAULT_MESSAGE = {
  role: "bot",
  text: "Hi 👋 I'm your AI assistant. How can I help you today?",
};

export const CHAT_STORAGE_PREFIX = "chat_";

export const VISITOR_STORAGE_KEY = "aiaera_visitor_id";

export const DEFAULT_THEME = {
  botName: DEFAULT_BOT_NAME,
  chatBg: "#F8FAFC",
  botBubble: "#FFFFFF",
  userBubble: "#7C3AED",
  textColor: "#0F172A",
  logo: "",
};

export const DEFAULT_INTEGRATIONS = {
  meeting_provider: "calendly",
  meeting_link: "",
  maps_link: "",
};

export const CHAT_PLACEHOLDERS = {
  default: "Type your message...",
  disabled: "Chatbot unavailable",
  loading: "Thinking...",
};

export const QUICK_ACTIONS = [
  {
    id: "book",
    label: "Book Appointment",
  },
  {
    id: "office",
    label: "Visit Office",
  },
  {
    id: "services",
    label: "Tell me more",
  },
];

export const MAX_MESSAGE_LENGTH = 2000;

export const API_ENDPOINTS = {
  PUBLIC_CHATBOT: "/api/chatbot/public",
  CHAT: "/api/chatbot/chat",
};