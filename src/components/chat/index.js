/*
========================================
CORE
========================================
*/

export { default as ChatWidget } from "./ChatWidget";
export { default as ChatHeader } from "./ChatHeader";
export { default as ChatMessages } from "./ChatMessages";
export { default as ChatInput } from "./ChatInput";
export { default as MessageBubble } from "./MessageBubble";
export { default as TypingIndicator } from "./TypingIndicator";

/*
========================================
COMMON
========================================
*/

export { default as AssistantAvatar } from "./common/AssistantAvatar";
export { default as OnlineIndicator } from "./common/OnlineIndicator";
export { default as MessageTime } from "./common/MessageTime";
export { default as WelcomeScreen } from "./common/WelcomeScreen";

export {
  ThemeProvider,
  useTheme,
} from "./common/ThemeProvider";

/*
========================================
CARDS
========================================
*/

export { default as AppointmentCard } from "./cards/AppointmentCard";
export { default as ContactCard } from "./cards/ContactCard";
export { default as FileCard } from "./cards/FileCard";
export { default as ImageCard } from "./cards/ImageCard";
export { default as LocationCard } from "./cards/LocationCard";

/*
========================================
RENDER
========================================
*/

export { default as MessageRenderer } from "./render/MessageRenderer";

/*
========================================
HOOKS
========================================
*/

export { default as useAutoScroll } from "./hooks/useAutoScroll";
export { default as useTyping } from "./hooks/useTyping";

/*
========================================
UTILITIES
========================================
*/

export {
  buildTheme,
  hexToRGBA,
  isLightColor,
} from "./common/ThemeUtils";