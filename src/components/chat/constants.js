/*
==================================================
AIAERA CHAT CONSTANTS
==================================================
*/

export const CHAT_ANIMATION = {
  MESSAGE_DURATION: 200,
  INPUT_DURATION: 180,
  TYPING_INTERVAL: 350,
};

export const CHAT_STATUS = {
  ONLINE: "Online",
  OFFLINE: "Offline",
  TYPING: "Typing...",
};

export const DEFAULT_ASSISTANT = {
  companyName: "Your Company",
  assistantName: "Business Assistant",
  subtitle: "Typically replies instantly",
  introduction:
    "I'm here to answer your questions and help you connect with our team.",
};

export const DEFAULT_ACTIONS = [
  {
    id: "appointment",
    label: "Book Appointment",
    icon: "calendar",
  },
  {
    id: "services",
    label: "Our Services",
    icon: "briefcase",
  },
  {
    id: "location",
    label: "Visit Office",
    icon: "map-pin",
  },
  {
    id: "contact",
    label: "Contact Us",
    icon: "phone",
  },
];

export const DEFAULT_SUGGESTIONS = [
  "Tell me about your services",
  "How can I book an appointment?",
  "Where is your office located?",
];

export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
  LOCATION: "location",
  APPOINTMENT: "appointment",
  CONTACT: "contact",
};