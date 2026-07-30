/*
========================================
CHAT STORAGE UTILITIES
========================================
*/

import {
  CHAT_STORAGE_PREFIX,
  DEFAULT_MESSAGE,
} from "../constants/chatConstants";

/*
========================================
GET STORAGE KEY
========================================
*/
const getStorageKey = (chatbotId) =>
  `${CHAT_STORAGE_PREFIX}${chatbotId}`;

/*
========================================
LOAD CHAT
========================================
*/
export const loadChat = (chatbotId) => {
  if (!chatbotId) {
    return [DEFAULT_MESSAGE];
  }

  try {
    const saved = localStorage.getItem(
      getStorageKey(chatbotId)
    );

    if (!saved) {
      return [DEFAULT_MESSAGE];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) && parsed.length
      ? parsed
      : [DEFAULT_MESSAGE];
  } catch (error) {
    console.error(
      "CHAT STORAGE LOAD ERROR:",
      error
    );

    return [DEFAULT_MESSAGE];
  }
};

/*
========================================
SAVE CHAT
========================================
*/
export const saveChat = (
  chatbotId,
  messages
) => {
  if (!chatbotId) return;

  try {
    localStorage.setItem(
      getStorageKey(chatbotId),
      JSON.stringify(messages)
    );
  } catch (error) {
    console.error(
      "CHAT STORAGE SAVE ERROR:",
      error
    );
  }
};

/*
========================================
CLEAR CHAT
========================================
*/
export const clearChat = (
  chatbotId
) => {
  if (!chatbotId) return;

  try {
    localStorage.removeItem(
      getStorageKey(chatbotId)
    );
  } catch (error) {
    console.error(
      "CHAT STORAGE CLEAR ERROR:",
      error
    );
  }
};

/*
========================================
CLEAR ALL CHATS
========================================
*/
export const clearAllChats = () => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (
        key.startsWith(CHAT_STORAGE_PREFIX)
      ) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error(
      "CHAT STORAGE CLEAR ALL ERROR:",
      error
    );
  }
};